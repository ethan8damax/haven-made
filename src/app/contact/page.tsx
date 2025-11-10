"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent("New Film Inquiry");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${date}\nLocation: ${location}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:hello@havenmademedia.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="min-h-screen bg-white text-[#0b1014]">
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 pt-10">
          <h1 className="text-3xl font-serif">Inquire about your film</h1>
          <p className="mt-3 text-[#0b1014]/70">Share your details and we’ll be in touch soon.</p>
          <form onSubmit={sendEmail} className="mt-10 grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm mb-2" htmlFor="name">Your Name</label>
              <input id="name" value={name} onChange={(e)=>setName(e.target.value)} required className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]" />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm mb-2" htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]" />
              </div>
              <div>
                <label className="block text-sm mb-2" htmlFor="phone">Phone (optional)</label>
                <input id="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm mb-2" htmlFor="date">Event Date</label>
                <input id="date" type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]" />
              </div>
              <div>
                <label className="block text-sm mb-2" htmlFor="location">Location</label>
                <input id="location" value={location} onChange={(e)=>setLocation(e.target.value)} className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2" htmlFor="message">Tell us about your day</label>
              <textarea id="message" rows={6} value={message} onChange={(e)=>setMessage(e.target.value)} required className="w-full rounded-lg border border-black/10 bg-[#f6f7f9] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c7a26a]"></textarea>
            </div>
            <div className="flex items-center justify-between gap-4">
              <button type="submit" className="rounded-full bg-[#0b1014] text-white px-6 py-3 text-sm font-medium hover:bg-black">Send Inquiry</button>
              <a className="text-sm hover:text-[#c7a26a]" href="mailto:hello@havenmademedia.com">Prefer email? hello@havenmademedia.com</a>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
