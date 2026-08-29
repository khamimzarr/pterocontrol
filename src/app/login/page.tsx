import Link from "next/link";
import { login } from "@/lib/actions/auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const error = sp.error;
  const errMsg = error
    ? decodeURIComponent(error) === "rejected"
      ? "Akunmu ditolak. Hubungi admin."
      : decodeURIComponent(error)
    : null;

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <nav className="h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]">
            <span className="grid place-items-center w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-[11px]">◈</span>
            PteroControl
          </Link>
          <Link href="/register" className="text-[12px] tracking-[-0.12px] text-[#0066cc] hover:underline">
            Buat Akun ›
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-[440px] rounded-[28px] bg-white p-7 md:p-10 border border-[#e8e8ed]">
          <p className="text-[12px] font-medium tracking-[0.04em] text-[#b64400]">Masuk</p>
          <h1 className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[32px] leading-[36px] tracking-[0.128px] text-[#1d1d1f]">
            Selamat
            <br />
            datang kembali.
          </h1>
          <p className="mt-3 text-[14px] leading-[18px] tracking-[-0.224px] text-[#707070]">
            Masuk pakai email dan kata sandi. Hanya user dengan status{" "}
            <span className="text-[#1d1d1f] font-medium">APPROVED</span> yang bisa buka dasbor.
          </p>

          {errMsg && (
            <div className="mt-6 rounded-[18px] bg-[#fff1f0] border border-[#ffd7d5] px-4 py-3 text-[13px] leading-5 tracking-[-0.12px] text-[#b64400]">
              {errMsg}
            </div>
          )}

          <form action={login} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="kamu@email.com"
                className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-3 text-[17px] leading-none tracking-[-0.022em] text-[#1d1d1f] placeholder:text-[#707070] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">Kata sandi</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-3 text-[17px] leading-none tracking-[-0.022em] text-[#1d1d1f] placeholder:text-[#707070] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
              />
            </label>
            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center rounded-full bg-[#0071e3] text-white text-[17px] font-normal tracking-[-0.022em] px-5 py-3 hover:bg-[#0077ed] active:bg-[#006edb] transition-colors"
            >
              Masuk
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] tracking-[-0.12px] text-[#707070]">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#0066cc] hover:underline">
              Minta akses ›
            </Link>
          </p>
          <p className="mt-3 text-center text-[12px] tracking-[-0.12px] text-[#707070]">
            <Link href="/" className="hover:underline hover:text-[#1d1d1f]">
              ← Kembali ke beranda
            </Link>
          </p>
        </div>
      </div>

      <footer className="py-6 text-center text-[12px] tracking-[-0.12px] text-[#707070]">© 2025 PteroControl · Akses butuh persetujuan</footer>
    </div>
  );
}
