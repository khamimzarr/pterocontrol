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
          <span className="grid place-items-center w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-[11px]">
            ◈
          </span>
          PteroControl
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[12px] font-normal tracking-[-0.12px] text-[#1d1d1f]">
          <a href="#agregator" className="hover:text-[#707070] transition-colors">
            Agregator
          </a>
          <a href="#enkripsi" className="hover:text-[#707070] transition-colors">
            Enkripsi
          </a>
          <a href="#panel" className="hover:text-[#707070] transition-colors">
            Panel
          </a>
        </div>
        <div className="flex items-center gap-2">
          {cta === "dashboard" ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-[#0071e3] text-white text-[12px] font-medium px-4 py-1.5 hover:bg-[#0077ed] transition-colors"
            >
              Dasbor
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-[12px] tracking-[-0.12px] text-[#1d1d1f] hover:text-[#0066cc]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-[#0071e3] text-white text-[12px] font-medium px-4 py-1.5 hover:bg-[#0077ed] transition-colors"
              >
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
    <div className="bg-white text-center py-3 px-6 text-[12px] leading-4 tracking-[-0.12px] text-[#1d1d1f] border-b border-[#e8e8ed]">
      Akses butuh persetujuan admin. API key-mu dienkripsi AES-256-CBC sebelum disimpan.{" "}
      <Link href="/register" className="text-[#0066cc] hover:underline">
        Minta akses <span aria-hidden>›</span>
      </Link>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-8 text-center">
        <p className="text-[12px] font-medium tracking-[0.04em] text-[#b64400]">Baru · PteroControl</p>
        <p className="mt-2 text-[21px] leading-[1.38] tracking-[0.011em] font-semibold text-[#1d1d1f] font-[var(--font-sf-pro-display)]">
          PteroControl
        </p>
        <h1 className="mt-3 font-[var(--font-sf-pro-display)] font-bold text-[40px] md:text-[56px] lg:text-[80px] xl:text-[96px] leading-[1.04] tracking-[-0.28px] lg:tracking-[-1.2px] xl:tracking-[-1.44px] text-[#1d1d1f]">
          Semua
          <br />
          panel-mu.
          <br />
          <span className="text-[#707070]">Satu kendali.</span>
        </h1>
        <p className="mt-4 max-w-[560px] mx-auto text-[17px] md:text-[21px] leading-[1.47] md:leading-[1.38] tracking-[-0.022em] md:tracking-[0.011em] text-[#707070] font-[var(--font-sf-pro-text)]">
          Hubungkan banyak panel Pterodactyl. Lihat semua server dalam satu dasbor. Kuncimu tidak pernah disimpan dalam bentuk teks biasa.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-[#0071e3] text-white text-[17px] font-normal leading-none tracking-[-0.022em] px-6 py-[11px] min-h-[36px] hover:bg-[#0077ed] active:bg-[#006edb] transition-colors"
          >
            Minta Akses
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-[#1d1d1f]/80 text-[#1d1d1f] text-[17px] font-normal leading-none tracking-[-0.022em] px-6 py-[11px] min-h-[36px] hover:bg-[#1d1d1f] hover:text-white transition-colors"
          >
            Masuk
          </Link>
        </div>
        <p className="mt-4 text-[12px] leading-[16px] tracking-[-0.12px] text-[#707070]">Persetujuan manual oleh admin · Tanpa kartu kredit</p>

        <div className="mt-10 md:mt-14">
          <div className="mx-auto max-w-[980px] rounded-[28px] overflow-hidden border border-[#e8e8ed] bg-[#f5f5f7] p-4 md:p-6">
            <div className="rounded-[28px] bg-white border border-[#e8e8ed] overflow-hidden">
              <div className="h-9 flex items-center gap-1.5 px-4 border-b border-[#e8e8ed] bg-[#fafafc]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-[12px] tracking-[-0.12px] text-[#707070]">dasbor · pterocontrol</span>
                <span className="ml-auto hidden sm:inline text-[12px] tracking-[-0.12px] text-[#707070]">3 panel · 12 server · live</span>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Panel A · eu-1", servers: 5, ok: true },
                  { label: "Panel B · us-2", servers: 4, ok: true },
                  { label: "Panel C · asia", servers: 3, ok: false },
                  { label: "Total agregat", servers: 12, ok: true },
                ].map((c) => (
                  <div key={c.label} className="rounded-[18px] bg-[#f5f5f7] p-4 text-left border border-transparent">
                    <p className="text-[12px] tracking-[-0.12px] text-[#707070]">{c.label}</p>
                    <p className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-none tracking-[0.196px] text-[#1d1d1f]">
                      {c.servers}
                      <span className="text-[14px] font-normal text-[#707070]"> srv</span>
                    </p>
                    <p className={`mt-2 inline-flex items-center gap-1.5 text-[12px] ${c.ok ? "text-[#1d1d1f]" : "text-[#b64400]"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.ok ? "bg-[#0071e3]" : "bg-[#b64400]"}`} /> {c.ok ? "Online" : "Error 520"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 md:px-6 pb-4 md:pb-6">
                <div className="rounded-[18px] border border-[#e8e8ed] overflow-hidden">
                  <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-0 text-[12px] tracking-[-0.12px] bg-[#fafafc] px-4 py-2.5 text-[#707070] border-b border-[#e8e8ed]">
                    <span>Server</span>
                    <span>Panel</span>
                    <span>Memori</span>
                    <span>CPU</span>
                  </div>
                  {[
                    ["survival-id-01", "eu-1", "2 GB", "120 %"],
                    ["lobby-us-02", "us-2", "4 GB", "200 %"],
                    ["modpack-asia-03", "asia", "8 GB", "—"],
                  ].map((r) => (
                    <div
                      key={r[0]}
                      className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] px-4 py-3 text-[13px] tracking-[-0.12px] text-[#1d1d1f] border-b last:border-0 border-[#f5f5f7]"
                    >
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
          <p className="mt-6 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1d1d1f]" aria-hidden />
            <span className="w-2 h-2 rounded-full bg-[#777779]" aria-hidden />
            <span className="w-2 h-2 rounded-full bg-[#777779]" aria-hidden />
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureBand() {
  return (
    <section id="agregator" className="bg-[#f5f5f7] py-[60px] md:py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <h2 className="font-[var(--font-sf-pro-display)] font-semibold text-[28px] md:text-[32px] leading-[1.14] tracking-[0.007em] text-[#1d1d1f]">
          Yang utama.
        </h2>
        <p className="mt-3 max-w-[640px] text-[17px] leading-[25px] tracking-[-0.374px] text-[#707070]">
          Berhenti lompat-lompat antar panel. Satu tampilan untuk semua host, node, dan limit-mu.
        </p>
        <div className="mt-6 grid md:grid-cols-12 gap-5">
          <div className="md:col-span-7 rounded-[28px] bg-white p-7 md:p-10">
            <h3 className="font-[var(--font-sf-pro-display)] font-semibold text-[32px] md:text-[40px] leading-[36px] md:leading-[48px] tracking-[0.128px] text-[#1d1d1f]">
              Agregator
              <br />
              yang anteng.
            </h3>
            <p className="mt-4 max-w-[520px] text-[17px] leading-[25px] tracking-[-0.374px] text-[#474747]">
              Tambah panel Pterodactyl sebanyak mau. Dasbor akan <code className="px-1.5 py-0.5 rounded bg-[#f5f5f7] text-[13px]">GET /api/client</code>{" "}
              secara paralel dengan timeout 10 detik. Satu panel down, yang lain tetap tampil.
            </p>
            <Link href="/register" className="mt-6 inline-flex items-center gap-1 text-[17px] leading-[25px] tracking-[-0.374px] text-[#0066cc] hover:underline">
              Mulai sekarang <span aria-hidden>›</span>
            </Link>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { k: "Timeout", v: "10 dtk", l: "per panel" },
                { k: "Fetch", v: "Paralel", l: "allSettled" },
                { k: "Tampilan", v: "Satu", l: "tabel gabungan" },
              ].map((s) => (
                <div key={s.v} className="rounded-[18px] bg-[#f5f5f7] p-4 border border-[#e8e8ed]">
                  <p className="text-[12px] tracking-[-0.12px] text-[#707070]">{s.k}</p>
                  <p className="font-[var(--font-sf-pro-display)] font-semibold text-[21px] leading-none tracking-[0.011em] text-[#1d1d1f]">{s.v}</p>
                  <p className="text-[12px] tracking-[-0.12px] text-[#707070]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div id="enkripsi" className="md:col-span-5 rounded-[28px] bg-[#1d1d1f] p-7 md:p-10 text-white flex flex-col justify-between min-h-[360px]">
            <div>
              <p className="text-[12px] font-medium tracking-[0.04em] text-white/60">Zero-knowledge</p>
              <h3 className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-[32px] tracking-[0.196px]">
                Kuncimu,
                <br />
                selalu terenkripsi.
              </h3>
              <p className="mt-3 text-[14px] leading-[18px] tracking-[-0.224px] text-white/70">
                AES-256-CBC dengan IV acak per kunci. Hanya didekripsi di memori server saat fetch. Tidak pernah di sisi client.
              </p>
            </div>
            <div className="mt-8 rounded-[18px] bg-white/10 border border-white/10 p-4 overflow-hidden">
              <p className="text-[12px] tracking-[-0.12px] text-white/60 font-mono">iv:ciphertext (base64)</p>
              <p className="mt-2 font-mono text-[12px] leading-4 tracking-[-0.5px] text-white/90 break-all">
                a8f3…9c1e:7bKp2xQ9…mN4vLq== <br />
                <span className="text-white/50">ENCRYPTION_KEY via SHA-256 → 32 bytes</span>
              </p>
              <div className="mt-4 h-[56px] rounded-xl bg-gradient-to-br from-[#c8d8e0] via-white to-[#dddc8c] flex items-center justify-center">
                <span className="text-[12px] tracking-[-0.12px] text-[#1d1d1f]/70">crypto.createCipheriv · Node.js</span>
              </div>
            </div>
          </div>
        </div>

        <div id="panel" className="mt-5 grid md:grid-cols-3 gap-5">
          {[
            { title: "Persetujuan manual", body: "Setiap pendaftaran statusnya PENDING sampai admin setujui. Tanpa bot, tanpa spam." },
            { title: "Multi-panel beneran", body: "Panel tanpa batas per user. Masing-masing dengan nama, URL, dan API key terenkripsi." },
            { title: "Tahan banting", body: "Satu panel error tidak bikin dasbor ikut error. Gagal per panel, bukan per halaman." },
          ].map((c) => (
            <div key={c.title} className="rounded-[28px] bg-white p-7 border border-[#e8e8ed]">
              <h4 className="font-[var(--font-sf-pro-display)] font-semibold text-[21px] leading-[29px] tracking-[0.011em] text-[#1d1d1f]">{c.title}</h4>
              <p className="mt-2 text-[14px] leading-[18px] tracking-[-0.224px] text-[#707070]">{c.body}</p>
              <Link href="/login" className="mt-4 inline-flex text-[14px] tracking-[-0.224px] text-[#0066cc] hover:underline">
                Masuk <span aria-hidden>›</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-white py-[60px] md:py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <h2 className="font-[var(--font-sf-pro-display)] font-semibold text-[28px] md:text-[32px] leading-[1.14] tracking-[0.007em] text-[#1d1d1f]">Cara kerjanya.</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {[
            { n: "01", t: "Daftar", d: "Pakai email dan kata sandi. Profilmu otomatis masuk status PENDING." },
            { n: "02", t: "Tunggu persetujuan", d: "Admin akan tinjau dan setujui. Tanpa persetujuan, belum bisa buka dasbor." },
            { n: "03", t: "Hubungkan & lihat", d: "Tambah panel_url + api_key. Dasbor gabungkan GET /api/client dari semua panel sekaligus." },
          ].map((s) => (
            <div key={s.n} className="rounded-[28px] bg-[#f5f5f7] p-7">
              <p className="text-[12px] font-medium tracking-[0.04em] text-[#b64400]">{s.n}</p>
              <h3 className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[21px] leading-[29px] tracking-[0.011em] text-[#1d1d1f]">{s.t}</h3>
              <p className="mt-2 text-[14px] leading-[18px] tracking-[-0.224px] text-[#707070]">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[28px] bg-[#f5f5f7] p-6 md:p-8 border border-[#e8e8ed] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-[var(--font-sf-pro-display)] font-semibold text-[21px] tracking-[0.011em] text-[#1d1d1f]">Siap satukan semua panel-mu?</p>
            <p className="text-[14px] tracking-[-0.224px] text-[#707070]">Supabase Auth + RLS + enkripsi AES-256-CBC. Deploy di Vercel.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/register" className="inline-flex rounded-full bg-[#0071e3] text-white text-[14px] font-medium px-5 py-2.5 hover:bg-[#0077ed] transition-colors">
              Buat Akun
            </Link>
            <Link href="/login" className="inline-flex rounded-full border border-[#d6d6d6] text-[#1d1d1f] text-[14px] font-medium px-5 py-2.5 hover:bg-white transition-colors">
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
    <footer className="bg-[#f5f5f7] border-t border-[#d6d6d6]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8">
        <p className="text-[12px] leading-[16px] tracking-[-0.12px] text-[#707070] max-w-[900px]">
          PteroControl adalah agregator read-only untuk Pterodactyl Client API. Tidak mengurus billing, start/stop, atau izin server. API key dienkripsi AES-256-CBC (IV acak) pakai ENCRYPTION_KEY di server.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[12px] tracking-[-0.12px] text-[#474747] border-t border-[#d6d6d6] pt-6">
          <span>© 2025 PteroControl</span>
          <Link href="/login" className="hover:underline hover:text-[#1d1d1f]">Masuk</Link>
          <Link href="/register" className="hover:underline hover:text-[#1d1d1f]">Buat Akun</Link>
          <Link href="/dashboard" className="hover:underline hover:text-[#1d1d1f]">Dasbor</Link>
          <Link href="/admin" className="hover:underline hover:text-[#1d1d1f]">Admin</Link>
        </div>
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
