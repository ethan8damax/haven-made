"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");
  const [videos, setVideos] = useState<Array<{ title: string; wedding_date: string | null; signedUrl: string | null }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Your Films");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/login");
        return;
      }
      const user = session.user;
      const name = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || user.email || "Friend";
      setDisplayName(name);
      // Fetch signed URLs for this user's videos from server
      const token = (await supabase.auth.getSession()).data.session?.access_token || "";
      const res = await fetch("/api/videos", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error || "Failed to load videos");
        setLoading(false);
        return;
      }
      const payload = (await res.json()) as { videos: Array<{ title: string; wedding_date: string | null; signedUrl: string | null }> };
      setVideos(payload.videos || []);
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
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
      <div className="mx-auto max-w-5xl px-6 pt-24">
        <h1 className="font-serif text-3xl">Welcome, {displayName}</h1>
        <p className="mt-2 text-black/60">Here is your dashboard.</p>

        <div className="mt-10">
          <h2 className="text-lg font-medium">{title}</h2>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {videos.length === 0 ? (
            <div className="mt-3 aspect-video w-full rounded-xl bg-[#0b1014]/5 border border-black/10 grid place-items-center text-black/50">
              <span>No videos assigned yet.</span>
            </div>
          ) : (
            <div className="mt-6 space-y-8">
              {videos.map((v, idx) => (
                <div key={idx}>
                  <p className="font-medium">{v.title}</p>
                  {v.wedding_date && (
                    <p className="text-sm text-black/60">Wedding date: {new Date(v.wedding_date).toLocaleDateString()}</p>
                  )}
                  {v.signedUrl ? (
                    <>
                      <video
                        controls
                        autoPlay
                        className="mt-2 w-full aspect-video rounded-xl border border-black/10 bg-black"
                        src={v.signedUrl}
                      />
                      <div className="mt-3">
                        <a
                          href={v.signedUrl}
                          download
                          className="inline-flex items-center rounded-full bg-[#0b1014] text-white px-5 py-2 text-sm hover:bg-black"
                        >
                          Download Video
                        </a>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-red-600">Unable to load this video.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
