"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white text-[#0b1014] antialiased">
      <header className="fixed inset-x-0 top-0 z-30 bg-white/50 backdrop-blur-lg border-b border-black/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="#" className="flex items-baseline gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c7a26a]"></span>
              <span className="font-serif text-xl tracking-wide">Haven Made Media</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <a href="#about" className="hover:text-[#c7a26a] transition-colors">About</a>
              <a href="#films" className="hover:text-[#c7a26a] transition-colors">Wedding Films</a>
              <Link href="/contact" className="rounded-full bg-[#0b1014] text-white px-4 py-2 hover:bg-black transition-colors">Inquire</Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 z-0 overflow-hidden bg-black bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop)",
          }}
        >
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" poster="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop">
            <source src="https://cdn.coverr.co/videos/coverr-wedding-couple-6238/1080p.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0b1014]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1014]/60 via-transparent"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white pt-24">
          <p className="uppercase tracking-[0.2em] text-xs/relaxed text-white/80">Lifestyle & Wedding Films</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-tight">
            On the lookout for beautiful things because we were made for more.
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/85">
            Timeless stories, artfully told. Based wherever love takes us.
          </p>
          <div className="mt-10">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white/95 text-[#0b1014] px-6 py-3 text-sm font-medium hover:bg-white shadow-sm">
              Inquire about your film
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06L17.69 11H4.5a.75.75 0 010-1.5h13.19l-4.72-4.72a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="relative py-24 md:py-28 bg-[#f6f7f9]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-3xl md:text-4xl">Ethan & Caroline</h2>
              <p className="mt-5 text-[#0b1014]/80 leading-relaxed">
                We’re a husband-and-wife team crafting honest, artful films that feel like you. Our approach is gentle and observant—quiet enough to let real moments breathe, yet thoughtful in how they’re woven together. We believe beauty has purpose, and the ordinary deserves to be held with wonder.
              </p>
              <p className="mt-4 text-[#0b1014]/80 leading-relaxed">
                Wedding days are sacred—family, vows, laughter, and those fleeting in-betweens. We’re there for all of it, so you can return to what matters, again and again.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-sm h-80 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop"
                  alt="Ethan & Caroline"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 ring-1 ring-white/40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="films" className="py-24 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl md:text-4xl">Wedding Films</h2>
            <Link href="/contact" className="hidden md:inline-flex text-sm hover:text-[#c7a26a]">Inquire about your film →</Link>
          </div>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group">
              <div className="relative overflow-hidden rounded-xl bg-[#0b1014]/5">
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe className="absolute inset-0 h-full w-full" src="https://player.vimeo.com/video/76979871?h=8272103f6e" title="Vimeo video" frameBorder={0} allow="autoplay; fullscreen; picture-in-picture" loading="lazy" allowFullScreen></iframe>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#0b1014]/70">Lauren & Noah — Carmel Valley</p>
            </div>
            <div className="group">
              <div className="relative overflow-hidden rounded-xl bg-[#0b1014]/5">
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe className="absolute inset-0 h-full w-full" src="https://www.youtube.com/embed/Scxs7L0vhZ4" title="YouTube video" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy" allowFullScreen></iframe>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#0b1014]/70">Micah & Elise — Garden Ceremony</p>
            </div>
            <div className="group">
              <div className="relative overflow-hidden rounded-xl bg-[#0b1014]/5">
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe className="absolute inset-0 h-full w-full" src="https://player.vimeo.com/video/22439234" title="Vimeo video" frameBorder={0} allow="autoplay; fullscreen; picture-in-picture" loading="lazy" allowFullScreen></iframe>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#0b1014]/70">Sam & Alina — Coastal Vows</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0b1014] text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h3 className="font-serif text-3xl">Let’s craft a film that feels like you.</h3>
          <p className="mt-4 text-white/80">Share your date and details—we’ll be in touch soon.</p>
          <Link href="/contact" className="mt-8 inline-flex rounded-full bg-white text-[#0b1014] px-6 py-3 text-sm font-medium hover:bg-[#f6f7f9]">
            Inquire about your film
          </Link>
        </div>
      </section>

      <footer className="py-10 border-t border-black/5">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-[#0b1014]/60">© {new Date().getFullYear()} Haven Made Media. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="https://instagram.com/havenmademedia" target="_blank" rel="noopener" className="hover:text-[#c7a26a]">Instagram</a>
            <a href="mailto:hello@havenmademedia.com" className="hover:text-[#c7a26a]">Email</a>
            <Link href="/login" className="hover:text-[#c7a26a]">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
