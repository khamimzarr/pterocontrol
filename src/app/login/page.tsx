import Link from "next/link";
import { login } from "@/lib/actions/auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const errMsg = sp.error
    ? decodeURIComponent(sp.error) === "rejected"
      ? "Akun ditolak. Hubungi admin."
      : decodeURIComponent(sp.error)
    : null;

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <nav className="h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]">◈ PteroControl</Link>
          <Link href="/register" className="text-[12px] text-[#0066cc] hover:underline">Buat Akun ›</Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-14">
        <div className="animate-up w-full max-w-[420px] rounded-[28px] bg-white p-7 md:p-8 border border-[#e8e8ed] hover-lift">
          <p className="text-[11px] font-medium tracking-[0.04em] text-[#b64400]">Masuk</p>
          <h1 className="animate-up-1 mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-none text-[#1d1d1f]">Selamat datang kembali.</h1>
          <p className="animate-up-2 mt-2 text-[13px] tracking-[-0.12px] text-[#707070]">Hanya user <b className="text-[#1d1d1f]">APPROVED</b> bisa buka dasbor.</p>

          {errMsg && <div className="mt-5 rounded-[18px] bg-[#fff1f0] border border-[#ffd7d5] px-4 py-2.5 text-[13px] text-[#b64400]">{errMsg}</div>}

          <form action={login} className="animate-up-2 mt-6 space-y-3.5">
            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.04em] text-[#1d1d1f]">Email</span>
              <input name="email" type="email" required autoComplete="email" placeholder="kamu@email.com" className="mt-1 w-full rounded-full border border-[#d6d6d6] px-4 py-3 text-[15px] text-[#1d1d1f] placeholder:text-[#707070] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15 outline-none" />
            </label>
            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.04em] text-[#1d1d1f]">Kata sandi</span>
              <input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" className="mt-1 w-full rounded-full border border-[#d6d6d6] px-4 py-3 text-[15px] text-[#1d1d1f] placeholder:text-[#707070] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15 outline-none" />
            </label>
            <button type="submit" className="w-full mt-1 inline-flex justify-center rounded-full bg-[#0071e3] text-white text-[15px] font-medium px-5 py-3 hover:bg-[#0077ed] active:bg-[#006edb] transition-all hover:scale-[1.01]">Masuk</button>
          </form>

          <p className="mt-5 text-center text-[12px] text-[#707070]">Belum punya akun? <Link href="/register" className="text-[#0066cc] hover:underline">Minta akses ›</Link></p>
        </div>
      </div>
      <p className="py-4 text-center text-[11px] text-[#707070]">© 2025 PteroControl</p>
    </div>
  );
}
