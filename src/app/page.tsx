import Link from "next/link";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 justify-center">
      <span className="eyebrow-line flex-1 max-w-[72px]" />
      <span className="font-[var(--font-dotdigital)] text-[11px] sm:text-[13px] font-normal tracking-[0.10em] uppercase text-[#c7d3ea] whitespace-nowrap">{children}</span>
      <span className="eyebrow-line flex-1 max-w-[72px]" />
    </div>
  );
}

function GlobalNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.55)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)]"><span className="w-2.5 h-2.5 rounded-full bg-[#663af3] shadow-[0_0_10px_rgba(102,58,243,0.8)] animate-shimmer-dot" /></span>
          <span className="font-medium text-[15px] tracking-[-0.02em] text-[#d1e4fa]">PteroControl</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <a href="#agregator" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Agregator</a>
          <a href="#enkripsi" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Enkripsi</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-[13px] font-medium text-[#c7d3ea] hover:text-white">Masuk</Link>
          <Link href="/register" className="inline-flex flash-violet rounded-full px-4 py-1.5 text-[13px] font-medium text-white">Daftar</Link>
        </div>
      </div>
    </header>
  );
}

function Ico({ d }: { d: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1e4fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>;
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#05060f]" aria-hidden />
      <div className="absolute inset-0 bg-grid animate-grid opacity-[0.45]" aria-hidden />
      <div className="absolute inset-0 halo animate-halo pointer-events-none" aria-hidden />
      <div className="absolute left-1/2 top-[72px] -translate-x-1/2 w-[760px] h-[420px] rounded-full blur-[80px] opacity-[0.16] pointer-events-none animate-glow" style={{ background: "radial-gradient(ellipse at center, #b6d9fc 0%, #663af3 28%, transparent 70%)" }} aria-hidden />
      <div className="relative mx-auto max-w-[1200px] px-6 pt-12 sm:pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#d1e4fa] bg-[rgba(199,211,234,0.10)] border border-[rgba(186,215,247,0.14)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#663af3] animate-shimmer-dot" /> Terenkripsi · Perlu approval
        </div>
        <h1 className="mt-6 font-[var(--font-aeonikpro)] font-medium leading-[0.9] tracking-[-0.04em]"><span className="block text-[38px] sm:text-[56px] lg:text-[72px] xl:text-[96px] wordmark pb-2">PteroControl</span></h1>
        <p className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[20px] sm:text-[24px] tracking-[-0.02em] text-[#d1e4fa]">Satu dasbor. Semua panel.</p>
        <p className="mx-auto mt-3 max-w-[520px] text-[14px] sm:text-[15px] leading-[1.5] text-[#9da7ba]">Gabung semua panel Pterodactyl jadi satu tabel. API key AES-256.</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="flash-violet inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-white">Daftar <span aria-hidden>→</span></Link>
          <Link href="/login" className="pill-ghost inline-flex rounded-full px-6 py-3 text-[14px] font-medium text-white">Masuk</Link>
        </div>
        <div className="relative mt-10 sm:mt-12 h-[380px] sm:h-[400px] flex items-center justify-center select-none">
          <div className="animate-float hidden lg:flex absolute left-[2%] top-[14%] w-[300px] rounded-[16px] deep-glass p-5 text-left" style={{ ["--r" as never]: "-2.5deg", transform: "rotate(-2.5deg)" } as React.CSSProperties}>
            <div className="flex items-center justify-between"><span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">panels</span><span className="px-2 py-0.5 rounded-full text-[11px] bg-[rgba(199,211,234,0.12)] text-[#d1e4fa]">3</span></div>
            <div className="mt-3 space-y-2">
              {[{ n: "eu-1", ok: true }, { n: "us-2", ok: true }, { n: "asia", ok: false }].map((p) => (
                <div key={p.n} className="flex items-center justify-between rounded-[10px] bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.08)] px-3 py-2">
                  <span className="text-[13px] font-medium text-white">{p.n}</span><span className={`w-2 h-2 rounded-full ${p.ok ? "bg-[#28c840] animate-pulse-dot" : "bg-[#b64400]"}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="animate-float-delayed absolute left-1/2 -translate-x-1/2 top-[4%] w-[min(380px,94vw)] sm:w-[400px] rounded-[16px] bg-[rgba(5,6,15,0.96)] border border-[rgba(186,215,247,0.14)] overflow-hidden text-left shadow-[inset_0_1px_1px_rgba(216,236,248,0.20),0_24px_48px_rgba(0,0,0,0.45)]">
            <div className="h-8 flex items-center gap-1.5 px-4 border-b border-[rgba(186,215,247,0.08)] bg-[rgba(186,214,247,0.03)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[11px] text-[#9da7ba] font-mono">dasbor</span><span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#9da7ba]"><span className="w-1.5 h-1.5 rounded-full bg-[#663af3] animate-shimmer-dot" /> 12 server</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2">
              {[{ k: "Panel", v: "3" }, { k: "Server", v: "12" }, { k: "AES", v: "256" }].map((c) => (
                <div key={c.k} className="rounded-[12px] bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.08)] p-3 text-center">
                  <div className="text-[11px] text-[#9da7ba]">{c.k}</div><div className="font-[var(--font-aeonikpro)] font-medium text-[18px] text-white">{c.v}</div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="rounded-[12px] border border-[rgba(186,215,247,0.08)] overflow-hidden">
                <div className="grid grid-cols-3 gap-0 text-[11px] tracking-[0.04em] bg-[rgba(186,214,247,0.04)] px-3 py-2 text-[#9da7ba] border-b border-[rgba(186,215,247,0.06)]"><span>Server</span><span>Panel</span><span>RAM</span></div>
                {[["survival-01", "eu-1", "2G"], ["lobby-02", "us-2", "4G"], ["modpack", "asia", "8G"]].map((r) => (
                  <div key={r[0]} className="grid grid-cols-3 px-3 py-2.5 text-[12px] border-b last:border-0 border-[rgba(186,215,247,0.04)]"><span className="font-medium text-white truncate">{r[0]}</span><span className="text-[#9da7ba]">{r[1]}</span><span className="text-[#c7d3ea]">{r[2]}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="animate-float-delayed-2 hidden lg:flex absolute right-[2%] top-[16%] w-[300px] rounded-[16px] deep-glass p-5 text-left" style={{ ["--r" as never]: "2.5deg", transform: "rotate(2.5deg)" } as React.CSSProperties}>
            <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.10)]"><Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></span><div><div className="text-[13px] font-medium text-white">Terenkripsi</div><div className="text-[11px] text-[#9da7ba]">AES-256-CBC</div></div></div>
            <div className="mt-4 rounded-[10px] bg-[#05060f] border border-[rgba(186,215,247,0.10)] p-3 font-mono text-[11px]"><div className="text-[#9da7ba]">iv:ciphertext</div><div className="text-[#c7d3ea] break-all">a8f3…:7bKp…==</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBand() {
  return (
    <section id="agregator" className="relative border-y border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)]">
      <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
        <Eyebrow>Fitur</Eyebrow>
        <h2 className="mt-6 text-center font-[var(--font-aeonikpro)] font-medium text-[28px] sm:text-[34px] leading-none tracking-[-0.02em] text-[#d8ecf8]">Satu tampilan.</h2>
        <p className="mx-auto mt-2 max-w-[520px] text-center text-[14px] leading-[1.5] text-[#9da7ba]">Paralel. Satu down, lainnya jalan.</p>
        <div className="mt-8 grid md:grid-cols-12 gap-4">
          <div className="md:col-span-7 glass-card rounded-[16px] p-7 md:p-8">
            <h3 className="font-[var(--font-aeonikpro)] font-medium text-[20px] leading-none text-white">Agregator</h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-[#9da7ba]">Panel tak terbatas. Satu tabel: nama, node, RAM & CPU.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[{ k: "Timeout", v: "10s" }, { k: "Fetch", v: "Paralel" }, { k: "View", v: "Satu" }].map((s) => (
                <div key={s.k} className="rounded-[12px] bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.08)] p-4 text-center">
                  <p className="text-[11px] font-medium tracking-[0.04em] text-[#9da7ba]">{s.k}</p><p className="font-[var(--font-aeonikpro)] font-medium text-[18px] text-white">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div id="enkripsi" className="md:col-span-5 rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.10)] p-7 flex flex-col justify-between min-h-[220px] shadow-[inset_0_1px_1px_rgba(216,236,248,0.14),0_24px_48px_rgba(0,0,0,0.45)]">
            <div><p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Zero-knowledge</p><h3 className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[20px] leading-none text-white">Terenkripsi.</h3><p className="mt-2 text-[13px] text-[#9da7ba]">Dekripsi di server saja.</p></div>
            <div className="mt-6 rounded-[12px] bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.08)] p-4 font-mono text-[11px]"><span className="text-[#9da7ba]">iv:ciphertext</span><span className="text-[#d1e4fa]"> a8f3…:7bKp…==</span></div>
          </div>
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {[
            { title: "Approval", body: "PENDING → admin setujui.", d: "M16 8l-8 8-4-4M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z" },
            { title: "Multi-panel", body: "Tiap key terenkripsi terpisah.", d: "M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" },
            { title: "Tahan error", body: "Timeout 10s. Tidak nge-hang.", d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10ZM9 12l2 2 4-4" },
          ].map((c) => (
            <div key={c.title} className="glass-card rounded-[16px] p-6">
              <div className="w-10 h-10 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.10)]"><Ico d={c.d} /></div>
              <h4 className="mt-4 font-medium text-[15px] text-white">{c.title}</h4><p className="mt-1 text-[13px] text-[#9da7ba]">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-grid opacity-[0.18] pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-[1200px] px-6 py-12 md:py-16">
        <Eyebrow>Cara kerja</Eyebrow>
        <h2 className="mt-6 text-center font-[var(--font-aeonikpro)] font-medium text-[26px] text-[#d8ecf8]">3 langkah</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[{ n: "01", t: "Daftar", d: "Auto PENDING." }, { n: "02", t: "Approval", d: "Admin setujui." }, { n: "03", t: "Hubungkan", d: "URL + API key." }].map((s) => (
            <div key={s.n} className="glass-card rounded-[16px] p-6">
              <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#663af3]">{s.n}</p><h3 className="mt-1 font-medium text-[16px] text-white">{s.t}</h3><p className="mt-1 text-[13px] text-[#9da7ba]">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 glass-card rounded-[16px] p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="font-medium text-[16px] text-white">Mulai?</p>
          <div className="flex gap-2"><Link href="/register" className="flash-violet rounded-full px-5 py-2.5 text-[13px] font-medium text-white">Daftar</Link><Link href="/login" className="pill-ghost rounded-full px-5 py-2.5 text-[13px] font-medium text-white">Masuk →</Link></div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)]">
      <div className="mx-auto max-w-[1200px] px-6 py-5 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[#9da7ba]">
        <span>© 2025 PteroControl</span><Link href="/login" className="hover:text-white">Masuk</Link><Link href="/register" className="hover:text-white">Daftar</Link><span className="hidden sm:inline">· AES-256 · RLS</span>
      </div>
    </footer>
  );
}

export default function Home() {
  return <div className="flex min-h-screen flex-col bg-[#05060f]"><GlobalNav /><main className="flex-1"><Hero /><FeatureBand /><HowItWorks /></main><Footer /></div>;
}
