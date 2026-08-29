import Link from "next/link";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 justify-center">
      <span className="eyebrow-line flex-1 max-w-[72px]" />
      <span className="font-[var(--font-dotdigital)] text-[13px] sm:text-[15px] font-normal tracking-[0.10em] uppercase text-[#c7d3ea] whitespace-nowrap">{children}</span>
      <span className="eyebrow-line flex-1 max-w-[72px]" />
    </div>
  );
}

function GlobalNav({ cta }: { cta?: "login" | "dashboard" }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.55)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)] shadow-[inset_0_1px_1px_rgba(216,236,248,0.2)] group-hover:border-[rgba(186,215,247,0.18)] transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-[#663af3] shadow-[0_0_10px_rgba(102,58,243,0.8)] animate-shimmer-dot" />
          </span>
          <span className="font-[var(--font-untitled-sans)] font-medium text-[15px] tracking-[-0.02em] text-[#d1e4fa]">PteroControl</span>
          <span className="hidden sm:inline-flex ml-1 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide text-[#c7d3ea] bg-[rgba(199,211,234,0.12)] border border-[rgba(186,215,247,0.08)]">aggregator</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <a href="#agregator" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Agregator</a>
          <a href="#enkripsi" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Enkripsi</a>
          <a href="#panel" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Panel</a>
        </nav>
        <div className="flex items-center gap-2">
          {cta === "dashboard" ? (
            <Link href="/dashboard" className="inline-flex flash-violet rounded-full px-4 py-1.5 text-[13px] font-medium text-white">Dasbor</Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-[13px] font-medium text-[#c7d3ea] hover:text-white transition-colors">Masuk</Link>
              <Link href="/register" className="inline-flex flash-violet rounded-full px-4 py-1.5 text-[13px] font-medium text-white">Buat Akun</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Ico({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1e4fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#05060f]" aria-hidden />
      <div className="absolute inset-0 bg-grid animate-grid opacity-[0.45]" aria-hidden />
      <div className="absolute inset-0 halo animate-halo pointer-events-none" aria-hidden />
      <div className="absolute left-1/2 top-[72px] -translate-x-1/2 w-[760px] h-[420px] rounded-full blur-[80px] opacity-[0.16] pointer-events-none animate-glow" style={{ background: "radial-gradient(ellipse at center, #b6d9fc 0%, #663af3 28%, transparent 70%)" }} aria-hidden />

      <div className="relative mx-auto max-w-[1200px] px-6 pt-12 sm:pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium tracking-[-0.01em] text-[#d1e4fa] bg-[rgba(199,211,234,0.10)] border border-[rgba(186,215,247,0.14)] shadow-[inset_0_1px_1px_rgba(216,236,248,0.18)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#663af3] animate-shimmer-dot" />
          API key terenkripsi · Butuh persetujuan admin
          <span className="hidden sm:inline text-[#9da7ba]">·</span>
          <span className="hidden sm:inline text-[#9da7ba]">AES-256-CBC · RLS</span>
        </div>

        <h1 className="mt-6 font-[var(--font-aeonikpro)] font-medium leading-[0.9] tracking-[-0.04em] select-none">
          <span className="block text-[38px] sm:text-[56px] lg:text-[72px] xl:text-[96px] wordmark pb-2">PteroControl</span>
        </h1>
        <p className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[20px] sm:text-[24px] tracking-[-0.02em] text-[#d1e4fa]">Semua panel-mu. Satu kendali.</p>
        <p className="mx-auto mt-3 max-w-[560px] text-[15px] sm:text-[16px] leading-[1.6] text-[#c7d3ea]">
          Hubungkan banyak panel Pterodactyl. Satu dasbor untuk semua server. API key tidak pernah disimpan polos.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="flash-violet inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-white">
            Buat Akun <span aria-hidden>→</span>
          </Link>
          <Link href="/login" className="pill-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-white">
            Masuk
          </Link>
        </div>

        {/* floating glass dashboard mock */}
        <div className="relative mt-10 sm:mt-12 h-[380px] sm:h-[400px] flex items-center justify-center select-none">
          {/* left — panels */}
          <div className="animate-float hidden lg:flex absolute left-[2%] top-[14%] w-[300px] rounded-[16px] deep-glass p-5 text-left" style={{ ["--r" as never]: "-2.5deg", transform: "rotate(-2.5deg)" } as React.CSSProperties}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">panels</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-[rgba(199,211,234,0.12)] text-[#d1e4fa]">3 terhubung</span>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { n: "eu-1", u: "panel.eu.example", ok: true },
                { n: "us-2", u: "panel.us.example", ok: true },
                { n: "asia", u: "panel.asia.example", ok: false },
              ].map((p) => (
                <div key={p.n} className="flex items-center justify-between rounded-[10px] bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.08)] px-3 py-2">
                  <div><div className="text-[13px] font-medium text-white">{p.n}</div><div className="text-[11px] text-[#9da7ba] truncate max-w-[140px]">{p.u}</div></div>
                  <span className={`w-2 h-2 rounded-full ${p.ok ? "bg-[#28c840] animate-pulse-dot" : "bg-[#b64400]"}`} />
                </div>
              ))}
            </div>
          </div>

          {/* center — aggregator */}
          <div className="animate-float-delayed absolute left-1/2 -translate-x-1/2 top-[4%] w-[min(380px,94vw)] sm:w-[400px] rounded-[16px] bg-[rgba(5,6,15,0.96)] border border-[rgba(186,215,247,0.14)] p-0 overflow-hidden text-left shadow-[inset_0_1px_1px_rgba(216,236,248,0.20),inset_0_24px_48px_rgba(168,216,245,0.06),0_24px_48px_rgba(0,0,0,0.45)]">
            <div className="h-8 flex items-center gap-1.5 px-4 border-b border-[rgba(186,215,247,0.08)] bg-[rgba(186,214,247,0.03)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[11px] text-[#9da7ba] font-mono">dasbor · aggregator</span>
              <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#9da7ba]"><span className="w-1.5 h-1.5 rounded-full bg-[#663af3] animate-shimmer-dot" /> 12 server · live</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2">
              {[
                { k: "Panel", v: "3", s: "2 online" },
                { k: "Server", v: "12", s: "tergabung" },
                { k: "Enkripsi", v: "AES", s: "zero-know" },
              ].map((c) => (
                <div key={c.k} className="rounded-[12px] bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.08)] p-3 text-center">
                  <div className="text-[11px] tracking-[0.04em] text-[#9da7ba]">{c.k}</div>
                  <div className="font-[var(--font-aeonikpro)] font-medium text-[18px] text-white">{c.v}</div>
                  <div className="text-[11px] text-[#9da7ba]">{c.s}</div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="rounded-[12px] border border-[rgba(186,215,247,0.08)] overflow-hidden">
                <div className="grid grid-cols-[1.4fr_0.7fr_0.6fr] gap-0 text-[11px] tracking-[0.04em] bg-[rgba(186,214,247,0.04)] px-3 py-2 text-[#9da7ba] border-b border-[rgba(186,215,247,0.06)]">
                  <span>Server</span><span>Panel</span><span>RAM</span>
                </div>
                {[
                  ["survival-id-01", "eu-1", "2 GB"],
                  ["lobby-us-02", "us-2", "4 GB"],
                  ["modpack-asia", "asia", "8 GB"],
                ].map((r) => (
                  <div key={r[0]} className="grid grid-cols-[1.4fr_0.7fr_0.6fr] px-3 py-2.5 text-[12px] border-b last:border-0 border-[rgba(186,215,247,0.04)]">
                    <span className="font-medium text-white truncate">{r[0]}</span><span className="text-[#9da7ba]">{r[1]}</span><span className="text-[#c7d3ea]">{r[2]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* right — encryption */}
          <div className="animate-float-delayed-2 hidden lg:flex absolute right-[2%] top-[16%] w-[300px] rounded-[16px] deep-glass p-5 text-left" style={{ ["--r" as never]: "2.5deg", transform: "rotate(2.5deg)" } as React.CSSProperties}>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.10)]"><Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></span>
              <div><div className="text-[13px] font-medium text-white">Terenkripsi</div><div className="text-[11px] text-[#9da7ba]">AES-256-CBC · IV acak</div></div>
            </div>
            <div className="mt-4 rounded-[10px] bg-[#05060f] border border-[rgba(186,215,247,0.10)] p-3 font-mono text-[11px] leading-4">
              <div className="text-[#9da7ba]">iv:ciphertext</div>
              <div className="text-[#c7d3ea] break-all">a8f3…:7bKp…mN4vLq==</div>
              <div className="mt-2 text-[#9da7ba]">Dekripsi hanya di server memory</div>
            </div>
            <div className="mt-3 flex gap-1.5">
              <span className="px-2 py-1 rounded-full text-[11px] bg-[rgba(199,211,234,0.12)] text-[#d1e4fa]">RLS</span>
              <span className="px-2 py-1 rounded-full text-[11px] bg-[rgba(199,211,234,0.08)] text-[#9da7ba]">Zero-knowledge</span>
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-center">
          <div className="inline-flex items-center p-1 rounded-full bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)]">
            <span className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white text-[12px] font-medium">Aggregator</span>
            <span className="px-3 py-1.5 text-[12px] font-medium text-[#9da7ba]">Enkripsi</span>
            <span className="px-3 py-1.5 text-[12px] font-medium text-[#9da7ba]">Approval</span>
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
        <Eyebrow>Yang utama</Eyebrow>
        <h2 className="mt-6 text-center font-[var(--font-aeonikpro)] font-medium text-[30px] sm:text-[36px] leading-none tracking-[-0.02em] text-[#d8ecf8]">Satu tampilan untuk semua host.</h2>
        <p className="mx-auto mt-2 max-w-[640px] text-center text-[15px] leading-[1.6] text-[#c7d3ea]">Fetch paralel 10 detik. Satu panel down, lainnya tetap jalan.</p>

        <div className="mt-8 grid md:grid-cols-12 gap-4">
          <div className="md:col-span-7 glass-card rounded-[16px] p-7 md:p-8">
            <h3 className="font-[var(--font-aeonikpro)] font-medium text-[22px] leading-none tracking-[-0.02em] text-white">Agregator yang anteng.</h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-[#9da7ba]">Tambah panel sebanyak mau. Data di-flatten ke satu tabel — nama, node, limit memory & CPU, plus badge panel asal.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: "Timeout", v: "10 dtk" },
                { k: "Fetch", v: "Paralel" },
                { k: "Tampilan", v: "Satu" },
              ].map((s) => (
                <div key={s.k} className="rounded-[12px] bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.08)] p-4 text-center">
                  <p className="text-[11px] tracking-[0.04em] font-medium text-[#9da7ba]">{s.k}</p>
                  <p className="font-[var(--font-aeonikpro)] font-medium text-[18px] text-white">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="enkripsi" className="md:col-span-5 rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.10)] p-7 md:p-8 flex flex-col justify-between min-h-[260px] shadow-[inset_0_1px_1px_rgba(216,236,248,0.14),0_24px_48px_rgba(0,0,0,0.45)]">
            <div>
              <p className="text-[11px] font-medium tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Zero-knowledge</p>
              <h3 className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[22px] leading-none text-white">Selalu terenkripsi.</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#9da7ba]">AES-256-CBC · IV acak · Dekripsi cuma di server memory sebelum fetch.</p>
            </div>
            <div className="mt-6 rounded-[12px] bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.08)] p-4">
              <p className="font-mono text-[11px] text-[#9da7ba]">iv:ciphertext</p>
              <p className="font-mono text-[11px] text-[#d1e4fa] break-all">a8f3...:7bKp...mN4vLq ==</p>
            </div>
          </div>
        </div>

        <div id="panel" className="mt-4 grid md:grid-cols-3 gap-4">
          {[
            { title: "Persetujuan manual", body: "PENDING sampai admin setujui. Anti bot & abuse.", d: "M16 8l-8 8-4-4M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Z" },
            { title: "Multi-panel", body: "Panel tanpa batas. Tiap API key terenkripsi terpisah.", d: "M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" },
            { title: "Tahan banting", body: "Error per panel, bukan per halaman. Timeout tidak nge-hang.", d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10ZM9 12l2 2 4-4" },
          ].map((c) => (
            <div key={c.title} className="glass-card rounded-[16px] p-6">
              <div className="w-10 h-10 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.10)]">
                <Ico d={c.d} />
              </div>
              <h4 className="mt-4 font-[var(--font-aeonikpro)] font-medium text-[16px] text-white">{c.title}</h4>
              <p className="mt-1.5 text-[13px] leading-5 text-[#9da7ba]">{c.body}</p>
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
        <h2 className="mt-6 text-center font-[var(--font-aeonikpro)] font-medium text-[28px] text-[#d8ecf8]">Tiga langkah.</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { n: "01", t: "Daftar", d: "Email + kata sandi. Auto PENDING." },
            { n: "02", t: "Disetujui", d: "Admin tinjau. Tanpa approve, tidak bisa buka dasbor." },
            { n: "03", t: "Hubungkan", d: "URL + Client API key. Langsung agregat." },
          ].map((s) => (
            <div key={s.n} className="glass-card rounded-[16px] p-6">
              <p className="text-[11px] font-medium tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#663af3]">{s.n}</p>
              <h3 className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[17px] text-white">{s.t}</h3>
              <p className="mt-1 text-[13px] text-[#9da7ba]">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 glass-card rounded-[16px] p-6 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="font-[var(--font-aeonikpro)] font-medium text-[17px] text-white">Siap satukan panel-mu?</p>
          <div className="flex gap-2">
            <Link href="/register" className="inline-flex flash-violet rounded-full px-5 py-2.5 text-[13px] font-medium text-white">Buat Akun</Link>
            <Link href="/login" className="inline-flex pill-ghost rounded-full px-5 py-2.5 text-[13px] font-medium text-white">Masuk →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)]">
      <div className="mx-auto max-w-[1200px] px-6 py-6 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[#9da7ba]">
        <span>© 2025 PteroControl</span>
        <Link href="/login" className="hover:text-white transition-colors">Masuk</Link>
        <Link href="/register" className="hover:text-white transition-colors">Daftar</Link>
        <span className="hidden sm:inline">· AES-256-CBC · Supabase RLS · Zero-knowledge</span>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#05060f]">
      <GlobalNav />
      <main className="flex-1">
        <Hero />
        <FeatureBand />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
