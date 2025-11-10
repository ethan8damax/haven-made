"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAILS = [
  "ethandouglasmaxey@gmail.com",
  "carolinejoy.mose@gmail.com",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const sessEmail = sess.session?.user?.email?.toLowerCase() || "";
    const isAdmin = ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(sessEmail);
    router.replace(isAdmin ? "/admin" : "/dashboard");
  }

  return (
    <main className="min-h-screen bg-white text-[#0b1014]">
      <div className="mx-auto max-w-md px-6 pt-24">
        <h1 className="font-semibold text-2xl">Login</h1>
        <p className="mt-2 text-sm text-black/60">Welcome back. Enter your credentials.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm mb-2" htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]"/>
          </div>
          <div>
            <label className="block text-sm mb-2" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]"/>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} type="submit" className="w-full rounded-full bg-[#0b1014] text-white px-6 py-3 text-sm font-medium hover:bg-black disabled:opacity-50">
            {loading ? "Logging in…" : "Login"}
          </button>
          <p className="text-sm text-black/60">No account? <Link className="underline hover:text-[#c7a26a]" href="/signup">Create one</Link></p>
        </form>
      </div>
    </main>
  );
}
