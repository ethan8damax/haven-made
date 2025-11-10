"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAILS = [
  "ethandouglasmaxey@gmail.com",
  "carolinejoy.mose@gmail.com",
];

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");

  const [clients, setClients] = useState<Array<{ user_id: string; name: string; email: string }>>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/login");
        return;
      }
      const email = session.user.email || "";
      const token = session.access_token;
      setUserEmail(email);
      setAccessToken(token);
      const admin = ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
      if (!admin) {
        router.replace("/");
        return;
      }
      setIsAdmin(true);
      // Load existing clients (from API - service role joins auth.users)
      try {
        const res = await fetch("/api/admin/clients", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = (await res.json()) as { clients: Array<{ user_id: string; name: string; email: string }> };
          setClients(data.clients);
        }
      } catch (e) {
        // ignore
      }
      setLoading(false);
    })();
  }, [router]);

  const canSubmit = useMemo(() => !!file && (!!selectedUserId || !!clientEmail), [file, selectedUserId, clientEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    if (!file) {
      setSubmitting(false);
      return;
    }

    // Post multipart data to R2 upload + assign endpoint
    const form = new FormData();
    form.append("file", file);
    if (selectedUserId) form.append("userId", selectedUserId);
    if (clientEmail) form.append("clientEmail", clientEmail);
    if (clientName) form.append("clientName", clientName);
    if (title) form.append("title", title);
    if (date) form.append("wedding_date", date);

    const res = await fetch("/api/admin/r2-assign", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body?.error || "Failed to assign video.");
      setSubmitting(false);
      return;
    }

    setMessage("Video uploaded and client record created.");
    setSubmitting(false);
    setFile(null);
    setTitle("");
    setDate("");
    setSelectedUserId("");
    setClientEmail("");
  }

  if (loading || !isAdmin) {
    return (
      <main className="min-h-screen bg-white text-[#0b1014]">
        <div className="mx-auto max-w-2xl px-6 pt-24">
          <p className="text-sm text-black/60">Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#0b1014]">
      <div className="mx-auto max-w-3xl px-6 pt-24">
        <h1 className="font-serif text-3xl">Admin</h1>
        <p className="mt-2 text-black/60">Upload a client video and assign it to a user.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm mb-2">Select existing client</label>
            <select
              className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">— None —</option>
              {clients.map((c) => (
                <option key={c.user_id} value={c.user_id}>
                  {c.name || c.email} ({c.user_id.slice(0, 8)}…)
                </option>
              ))}
            </select>
            <p className="text-xs text-black/50 mt-1">Or enter a new client email below.</p>
          </div>

          <h3 className="mt-6 font-medium">New client</h3>
          <div>
            <label className="block text-sm mb-2">Client name</label>
            <input
              type="text"
              placeholder="Caroline Maxey"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Client email (for new client)</label>
            <input
              type="email"
              placeholder="client@example.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm mb-2">Title (ex. Ethan & Caroline - The Orlo House)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Wedding date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Video file</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-[#0b1014] file:text-white file:px-4 file:py-2 file:hover:bg-black cursor-pointer"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="rounded-full bg-[#0b1014] text-white px-6 py-3 text-sm font-medium hover:bg-black disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Upload & Assign"}
          </button>
        </form>
      </div>
    </main>
  );
}
