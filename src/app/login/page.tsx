import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const errMsg = sp.error ? (decodeURIComponent(sp.error) === "rejected" ? "Akun ditolak. Hubungi admin." : decodeURIComponent(sp.error)) : null;
  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.45] pointer-events-none" aria-hidden />
      <div className="absolute inset-0 halo opacity-[0.55] pointer-events-none" aria-hidden />
      <div className="absolute left-1/2 top-[-40px] -translate-x-1/2 w-[760px] h-[420px] rounded-full blur-[80px] opacity-[0.12] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, #b6d9fc 0%, #663af3 28%, transparent 70%)" }} aria-hidden />
      <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.55)] border-b border-[rgba(186,215,247,0.08)]">
        <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)]"><span className="w-2.5 h-2.5 rounded-full bg-[#663af3] shadow-[0_0_10px_rgba(102,58,243,0.8)] animate-shimmer-dot" /></span><span className="font-medium text-[15px] text-[#d1e4fa]">PteroControl</span></Link>
          <Link href="/register" className="pill-ghost rounded-full px-4 py-1.5 text-[13px] font-medium text-white">Daftar</Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-6 py-10 md:py-14 relative">
        <div className="w-full max-w-[420px] rounded-[16px] bg-[rgba(5,6,15,0.96)] border border-[rgba(186,215,247,0.12)] p-6 md:p-7 shadow-[inset_0_1px_1px_rgba(216,236,248,0.20),0_24px_48px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full grid place-items-center bg-[#663af3] text-white font-medium text-[13px] shadow-[0_0_16px_rgba(102,58,243,0.45)]">◈</span><span className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Masuk</span></div>
          <h1 className="mt-3 font-[var(--font-aeonikpro)] font-medium text-[22px] leading-none text-white">Masuk.</h1>
          <p className="mt-2 text-[13px] text-[#9da7ba]">Butuh status <span className="text-[#d1e4fa] font-medium">APPROVED</span>.</p>
          <LoginForm errMsg={errMsg} />
          <p className="mt-4 text-center text-[12px] text-[#9da7ba]">Belum punya akun? <Link href="/register" className="text-[#d1e4fa] hover:text-white hover:underline">Daftar →</Link></p>
        </div>
      </div>
      <p className="relative py-4 text-center text-[11px] text-[#9da7ba]">© 2025 PteroControl</p>
    </div>
  );
}
