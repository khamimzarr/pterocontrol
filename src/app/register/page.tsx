import Link from "next/link";
import { register } from "@/lib/actions/auth-actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const pending = sp.status === "pending";
  const err = sp.error ? decodeURIComponent(sp.error) : null;

  if (pending) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
        <nav className="h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
          <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]">◈ PteroControl</Link>
            <Link href="/login" className="text-[12px] text-[#0066cc] hover:underline">Masuk ›</Link>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="animate-up w-full max-w-[500px] rounded-[28px] bg-white p-8 border border-[#e8e8ed] text-center hover-lift">
            <p className="text-[11px] font-medium tracking-[0.04em] text-[#b64400]">Terkirim</p>
            <h1 className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[32px] leading-none text-[#1d1d1f]">Menunggu persetujuan.</h1>
            <p className="mt-3 text-[13px] leading-5 text-[#707070]">Status <b className="text-[#1d1d1f]">PENDING</b> — admin akan setujui. Coba login lagi nanti, bung.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link href="/login" className="rounded-full bg-[#0071e3] text-white text-[13px] font-medium px-5 py-2.5 hover:bg-[#0077ed]">Ke Masuk</Link>
              <Link href="/" className="rounded-full border border-[#d6d6d6] text-[13px] font-medium px-5 py-2.5 hover:bg-[#f5f5f7]">Beranda</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <nav className="h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]">◈ PteroControl</Link>
          <Link href="/login" className="text-[12px] text-[#0066cc] hover:underline">Masuk ›</Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-14">
        <div className="animate-up w-full max-w-[420px] rounded-[28px] bg-white p-7 md:p-8 border border-[#e8e8ed] hover-lift">
          <p className="text-[11px] font-medium tracking-[0.04em] text-[#b64400]">Minta akses</p>
          <h1 className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-none text-[#1d1d1f]">Buat akunmu.</h1>
          <p className="mt-2 text-[13px] tracking-[-0.12px] text-[#707070]">Daftar → <b className="text-[#1d1d1f]">PENDING</b>. <span className="font-mono text-[11px]">ADMIN_EMAIL</span> langsung APPROVED.</p>
          {err && <div className="mt-4 rounded-[18px] bg-[#fff1f0] border border-[#ffd7d5] px-4 py-2.5 text-[13px] text-[#b64400]">{err === "invalid" ? "Email/kata sandi tidak valid. Min 8 karakter." : err}</div>}
          <form action={register} className="mt-5 space-y-3.5">
            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.04em] text-[#1d1d1f]">Email</span>
              <input name="email" type="email" required autoComplete="email" placeholder="kamu@email.com" className="mt-1 w-full rounded-full border border-[#d6d6d6] px-4 py-3 text-[15px] text-[#1d1d1f] placeholder:text-[#707070] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15 outline-none" />
            </label>
            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.04em] text-[#1d1d1f]">Kata sandi</span>
              <input name="password" type="password" required autoComplete="new-password" placeholder="Min 8 karakter" className="mt-1 w-full rounded-full border border-[#d6d6d6] px-4 py-3 text-[15px] text-[#1d1d1f] placeholder:text-[#707070] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15 outline-none" />
            </label>
            <button type="submit" className="w-full mt-1 rounded-full bg-[#0071e3] text-white text-[15px] font-medium px-5 py-3 hover:bg-[#0077ed] transition-all hover:scale-[1.01]">Minta Akses</button>
          </form>
          <p className="mt-4 text-center text-[12px] text-[#707070]">Punya akun? <Link href="/login" className="text-[#0066cc] hover:underline">Masuk ›</Link></p>
        </div>
      </div>
      <p className="py-4 text-center text-[11px] text-[#707070]">© 2025 PteroControl</p>
    </div>
  );
}
