"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.user && !data.user.confirmed_at) {
      setMessage("Check your email to confirm your account.");
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <main className="min-h-screen bg-white text-[#0b1014]">
      <div className="mx-auto max-w-md px-6 pt-24">
        <h1 className="font-semibold text-2xl">Create account</h1>
        <p className="mt-2 text-sm text-black/60">We’ll never share your email.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm mb-2" htmlFor="name">Name</label>
            <input id="name" type="text" required value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]"/>
          </div>
          <div>
            <label className="block text-sm mb-2" htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]"/>
          </div>
          <div>
            <label className="block text-sm mb-2" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]"/>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}
          <button disabled={loading} type="submit" className="w-full rounded-full bg-[#0b1014] text-white px-6 py-3 text-sm font-medium hover:bg-black disabled:opacity-50">
            {loading ? "Creating…" : "Sign up"}
          </button>
          <p className="text-sm text-black/60">Already have an account? <Link className="underline hover:text-[#c7a26a]" href="/login">Login</Link></p>
        </form>
      </div>
    </main>
  );
}
