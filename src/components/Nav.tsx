"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAILS = [
  "ethandouglasmaxey@gmail.com",
  "carolinejoy.mose@gmail.com",
];

export default function Nav() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const sess = data.session;
      if (!mounted) return;
      setIsAuthed(!!sess);
      if (sess?.user?.email) {
        const email = sess.user.email.toLowerCase();
        setIsAdmin(ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email));
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      if (session?.user?.email) {
        const email = session.user.email.toLowerCase();
        setIsAdmin(ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email));
      } else {
        setIsAdmin(false);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center justify-between h-16">
      <Link href="#" className="flex items-baseline gap-2">
        <span className="h-2 w-2 rounded-full bg-[#c7a26a]"></span>
        <span className="font-serif text-xl tracking-wide">Haven Made Media</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-sm">
        <a href="#about" className="hover:text-[#c7a26a] transition-colors">About</a>
        <a href="#films" className="hover:text-[#c7a26a] transition-colors">Wedding Films</a>
        {isAdmin && (
          <Link href="/admin" className="hover:text-[#c7a26a] transition-colors">Admin</Link>
        )}
        {isAuthed ? (
          <Link href="/dashboard" className="hover:text-[#c7a26a] transition-colors">Dashboard</Link>
        ) : (
          <Link href="/login" className="hover:text-[#c7a26a] transition-colors">Login</Link>
        )}
        <Link href="/contact" className="rounded-full bg-[#0b1014] text-white px-4 py-2 hover:bg-black transition-colors">Inquire</Link>
      </nav>
      <div className="md:hidden">
        {isAdmin && (
          <Link href="/admin" className="text-sm hover:text-[#c7a26a] mr-4">Admin</Link>
        )}
        {isAuthed ? (
          <Link href="/dashboard" className="text-sm hover:text-[#c7a26a]">Dashboard</Link>
        ) : (
          <Link href="/login" className="text-sm hover:text-[#c7a26a]">Login</Link>
        )}
      </div>
    </div>
  );
}
