import Link from "next/link";

function GlobalNav({ cta }: { cta?: "login" | "dashboard" }) {
  return (
    <nav
      aria-label="Global"
      className="sticky top-0 z-50 h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]"
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          aria-label="PteroControl"
          className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]"
        >
          <span className="grid place-items-center w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-[11px]">◈</span>
          PteroControl
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[12px] font-normal tracking-[-0.12px] text-[#1d1d1f]">
          <a href="#agregator" className="hover:text-[#707070] transition-colors">Agregator</a>
          <a href="#enkripsi" className="hover:text-[#707070] transition-colors">Enkripsi</a>
          <a href="#panel" className="hover:text-[#707070] transition-colors">Panel</a>
        </div>
        <div className="flex items-center gap-2">
          {cta === "dashboard" ? (
            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-[#0071e3] text-white text-[12px] font-medium px-4 py-1.5 hover:bg-[#0077ed] transition-colors">
              Dasbor
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-flex text-[12px] tracking-[-0.12px] text-[#1d1d1f] hover:text-[#0066cc]">Masuk</Link>
              <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-[#0071e3] text-white text-[12px] font-medium px-4 py-1.5 hover:bg-[#0077ed] transition-colors">
                Buat Akun
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function PromoRibbon() {
  return (
    <div className="animate-in bg-white text-center py-3 px-6 text-[12px] leading-4 tracking-[-0.12px] text-[#707070] border-b border-[#e8e8ed]">
      API key terenkripsi · Akses butuh persetujuan —{" "}
      <Link href="/register" className="text-[#0066cc] hover:underline">Minta akses ›</Link>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-10 md:pt-14 pb-8 text-center">
        <p className="animate-up text-[12px] font-medium tracking-[0.04em] text-[#b64400]">Baru · PteroControl</p>
        <p className="animate-up-1 mt-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f] font-[var(--font-sf-pro-display)]">PteroControl</p>
        <h1 className="animate-up-2 mt-2 font-[var(--font-sf-pro-display)] font-bold text-[40px] md:text-[56px] lg:text-[80px] xl:text-[96px] leading-[1.04] tracking-[-0.28px] lg:tracking-[-1.2px] xl:tracking-[-1.44px] text-[#1d1d1f]">
          Semua
          <br />
          panel-mu.
          <br />
          <span className="text-[#707070]">Satu kendali.</span>
        </h1>
        <p className="animate-up-3 mt-4 max-w-[480px] mx-auto text-[17px] leading-[1.47] tracking-[-0.022em] text-[#707070] font-[var(--font-sf-pro-text)]">
          Hubungkan semua panel Pterodactyl. Satu dasbor, semua server. Zero-knowledge.
        </p>
        <div className="animate-up-3 mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-[#0071e3] text-white text-[17px] font-normal px-6 py-[11px] min-h-[36px] hover:bg-[#0077ed] active:bg-[#006edb] transition-all hover:scale-[1.02]">
            Minta Akses
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-[#1d1d1f]/80 text-[#1d1d1f] text-[17px] font-normal px-6 py-[11px] min-h-[36px] hover:bg-[#1d1d1f] hover:text-white transition-all">
            Masuk
          </Link>
        </div>

        <div className="animate-up-3 mt-10 md:mt-12">
          <div className="animate-float mx-auto max-w-[980px] rounded-[28px] overflow-hidden border border-[#e8e8ed] bg-[#f5f5f7] p-4 md:p-6 hover-lift">
            <div className="rounded-[28px] bg-white border border-[#e8e8ed] overflow-hidden">
              <div className="h-9 flex items-center gap-1.5 px-4 border-b border-[#e8e8ed] bg-[#fafafc]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-[12px] tracking-[-0.12px] text-[#707070]">dasbor · pterocontrol</span>
                <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-[12px] tracking-[-0.12px] text-[#707070]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-pulse-dot" /> 3 panel · 12 server · live
                </span>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "eu-1", servers: 5, ok: true },
                  { label: "us-2", servers: 4, ok: true },
                  { label: "asia", servers: 3, ok: false },
                  { label: "Total", servers: 12, ok: true },
                ].map((c) => (
                  <div key={c.label} className="rounded-[18px] bg-[#f5f5f7] p-4 text-left hover:bg-white hover:border-[#e8e8ed] border border-transparent transition-colors">
                    <p className="text-[11px] tracking-[0.04em] font-medium text-[#707070]">{c.label}</p>
                    <p className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-none tracking-[0.196px] text-[#1d1d1f]">
                      {c.servers}
                      <span className="text-[12px] font-normal text-[#707070]"> srv</span>
                    </p>
                    <p className={`mt-1.5 inline-flex items-center gap-1.5 text-[11px] ${c.ok ? "text-[#1d1d1f]" : "text-[#b64400]"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.ok ? "bg-[#0071e3] animate-pulse-dot" : "bg-[#b64400]"}`} /> {c.ok ? "Online" : "Error"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 md:px-6 pb-4 md:pb-6">
                <div className="rounded-[18px] border border-[#e8e8ed] overflow-hidden">
                  <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-0 text-[11px] tracking-[0.04em] bg-[#fafafc] px-4 py-2.5 text-[#707070] border-b border-[#e8e8ed]">
                    <span>Server</span>
                    <span>Panel</span>
                    <span>RAM</span>
                    <span>CPU</span>
                  </div>
                  {[
                    ["survival-id-01", "eu-1", "2 GB", "120%"],
                    ["lobby-us-02", "us-2", "4 GB", "200%"],
                    ["modpack-asia", "asia", "8 GB", "—"],
                  ].map((r) => (
                    <div key={r[0]} className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] px-4 py-3 text-[13px] tracking-[-0.12px] text-[#1d1d1f] border-b last:border-0 border-[#f5f5f7]">
                      <span className="font-medium truncate">{r[0]}</span>
                      <span className="text-[#707070]">{r[1]}</span>
                      <span>{r[2]}</span>
                      <span>{r[3]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBand() {
  return (
    <section id="agregator" className="bg-[#f5f5f7] py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <h2 className="font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-none tracking-[0.007em] text-[#1d1d1f]">Yang utama.</h2>
        <p className="mt-2 text-[14px] tracking-[-0.12px] text-[#707070]">Satu tampilan untuk semua host-mu.</p>

        <div className="mt-6 grid md:grid-cols-12 gap-4">
          <div className="md:col-span-7 rounded-[28px] bg-white p-7 md:p-8 hover-lift">
            <h3 className="font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-none tracking-[0.128px] text-[#1d1d1f]">
              Agregator yang anteng.
            </h3>
            <p className="mt-3 text-[14px] leading-5 tracking-[-0.12px] text-[#474747]">
              Tambah panel sebanyak mau. Fetch paralel — timeout 10 dtk. Satu down, lainnya tetap jalan.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: "Timeout", v: "10 dtk" },
                { k: "Fetch", v: "Paralel" },
                { k: "Tampilan", v: "Satu" },
              ].map((s) => (
                <div key={s.v} className="rounded-[18px] bg-[#f5f5f7] p-4 text-center border border-[#e8e8ed]">
                  <p className="text-[11px] tracking-[0.04em] font-medium text-[#707070]">{s.k}</p>
                  <p className="font-[var(--font-sf-pro-display)] font-semibold text-[18px] text-[#1d1d1f]">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="enkripsi" className="md:col-span-5 rounded-[28px] bg-[#1d1d1f] p-7 md:p-8 text-white flex flex-col justify-between min-h-[280px] hover-lift">
            <div>
              <p className="text-[11px] font-medium tracking-[0.04em] text-white/60">Zero-knowledge</p>
              <h3 className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[24px] leading-none text-white">
                Selalu terenkripsi.
              </h3>
              <p className="mt-2 text-[13px] leading-5 tracking-[-0.12px] text-white/60">AES-256-CBC · IV acak · Dekripsi cuma di server.</p>
            </div>
            <div className="mt-6 rounded-[18px] bg-white/10 border border-white/10 p-4">
              <p className="font-mono text-[11px] tracking-[-0.12px] text-white/50">iv:ciphertext</p>
              <p className="font-mono text-[11px] text-white/90 break-all">a8f3…:7bKp…mN4vLq ==</p>
            </div>
          </div>
        </div>

        <div id="panel" className="mt-4 grid md:grid-cols-3 gap-4 stagger">
          {[
            { title: "Persetujuan manual", body: "PENDING sampai admin setujui. Anti bot." },
            { title: "Multi-panel", body: "Panel tanpa batas. Tiap panel terenkripsi." },
            { title: "Tahan banting", body: "Error per panel, bukan per halaman." },
          ].map((c) => (
            <div key={c.title} className="rounded-[28px] bg-white p-6 border border-[#e8e8ed] hover-lift">
              <h4 className="font-[var(--font-sf-pro-display)] font-semibold text-[17px] text-[#1d1d1f]">{c.title}</h4>
              <p className="mt-1.5 text-[13px] leading-5 tracking-[-0.12px] text-[#707070]">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <h2 className="font-[var(--font-sf-pro-display)] font-semibold text-[24px] text-[#1d1d1f]">Cara kerja.</h2>
        <div className="mt-5 grid md:grid-cols-3 gap-4 stagger">
          {[
            { n: "01", t: "Daftar", d: "Email + kata sandi. Auto PENDING." },
            { n: "02", t: "Disetujui", d: "Admin tinjau. Tanpa approve, no dasbor." },
            { n: "03", t: "Hubungkan", d: "URL + API key. Langsung agregat." },
          ].map((s) => (
            <div key={s.n} className="rounded-[28px] bg-[#f5f5f7] p-6 hover-lift">
              <p className="text-[11px] font-medium tracking-[0.04em] text-[#b64400]">{s.n}</p>
              <h3 className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[17px] text-[#1d1d1f]">{s.t}</h3>
              <p className="mt-1 text-[13px] tracking-[-0.12px] text-[#707070]">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[28px] bg-[#f5f5f7] p-6 md:px-8 border border-[#e8e8ed] flex flex-col md:flex-row md:items-center justify-between gap-4 hover-lift">
          <p className="font-[var(--font-sf-pro-display)] font-semibold text-[17px] text-[#1d1d1f]">Siap satukan panel-mu?</p>
          <div className="flex gap-2">
            <Link href="/register" className="inline-flex rounded-full bg-[#0071e3] text-white text-[13px] font-medium px-5 py-2.5 hover:bg-[#0077ed] transition-all hover:scale-[1.02]">
              Buat Akun
            </Link>
            <Link href="/login" className="inline-flex rounded-full border border-[#d6d6d6] text-[#1d1d1f] text-[13px] font-medium px-5 py-2.5 hover:bg-white transition-colors">
              Masuk ›
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#f5f5f7] border-t border-[#d6d6d6] py-6">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-wrap gap-x-6 gap-y-1 text-[11px] tracking-[-0.12px] text-[#707070]">
        <span>© 2025 PteroControl</span>
        <Link href="/login" className="hover:text-[#1d1d1f]">Masuk</Link>
        <Link href="/register" className="hover:text-[#1d1d1f]">Daftar</Link>
        <span className="hidden sm:inline">· AES-256-CBC · Supabase RLS</span>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <GlobalNav />
      <PromoRibbon />
      <main className="flex-1">
        <Hero />
        <FeatureBand />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
