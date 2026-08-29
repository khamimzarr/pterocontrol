export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { changePassword, logout } from "@/lib/actions/auth-actions";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.65)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)]"><span className="w-2.5 h-2.5 rounded-full bg-[#663af3] shadow-[0_0_10px_rgba(102,58,243,0.8)] animate-shimmer-dot" /></span>
          <span className="font-medium text-[15px] tracking-[-0.02em] text-[#d1e4fa]">PteroControl</span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium text-[#c7d3ea] bg-[rgba(199,211,234,0.10)] border border-[rgba(186,215,247,0.06)]">akun</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Dasbor</Link>
          <Link href="/panels" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Panel</Link>
          {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Admin</Link>}
          <Link href="/akun" className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white">Akun</Link>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-[#9da7ba] truncate max-w-[120px]">{email}</span>
          <form action={logout}><button className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Keluar</button></form>
        </div>
      </div>
    </header>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="eyebrow-line flex-1 max-w-[48px]" />
      <span className="font-[var(--font-dotdigital)] text-[11px] sm:text-[12px] tracking-[0.10em] uppercase text-[#9da7ba] whitespace-nowrap">{children}</span>
      <span className="eyebrow-line flex-1 max-w-[48px]" />
    </div>
  );
}

export default async function AkunPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await requireApprovedUser();
  const sp = await searchParams;
  const success = sp.success === "1";
  let err: string | null = null;
  if (sp.error) err = sp.error === "pendek" ? "Kata sandi minimal 8 karakter." : sp.error === "tidakcocok" ? "Konfirmasi tidak cocok." : decodeURIComponent(sp.error);

  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />

      <section className="relative overflow-hidden border-b border-[rgba(186,215,247,0.06)]">
        <div className="absolute inset-0 bg-grid opacity-[0.22] pointer-events-none" aria-hidden />
        <div className="absolute inset-0 halo opacity-[0.30] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-8">
          <Eyebrow>{user.role} · {user.status}</Eyebrow>
          <h1 className="mt-3 font-[var(--font-aeonikpro)] font-medium text-[28px] leading-none tracking-[-0.02em] text-[#d8ecf8]">Akunmu.</h1>
          <p className="mt-2 text-[13px] leading-[1.5] text-[#9da7ba]">{user.email} · Ganti kata sandi di bawah.</p>
        </div>
      </section>

      <section className="flex-1 py-6 bg-[#05060f]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <div className="max-w-[440px] rounded-[16px] bg-[rgba(5,6,15,0.96)] border border-[rgba(186,215,247,0.12)] p-6 shadow-[inset_0_1px_1px_rgba(216,236,248,0.20),inset_0_24px_48px_rgba(168,216,245,0.06),0_24px_48px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full grid place-items-center bg-[#663af3] text-white font-medium text-[12px] shadow-[0_0_16px_rgba(102,58,243,0.45)]">◈</span>
              <div>
                <h2 className="font-[var(--font-aeonikpro)] font-medium text-[16px] leading-none text-white">Ganti kata sandi</h2>
                <p className="text-[11px] text-[#9da7ba] font-[var(--font-dotdigital)] tracking-[0.06em] uppercase">Min 8 karakter · Langsung aktif</p>
              </div>
            </div>

            {success && <div className="mt-4 rounded-[10px] bg-[rgba(40,200,64,0.10)] border border-[rgba(40,200,64,0.18)] px-4 py-2.5 text-[13px] text-[#28c840]">Berhasil diperbarui ✓</div>}
            {err && <div className="mt-4 rounded-[10px] bg-[rgba(228,109,76,0.10)] border border-[rgba(228,109,76,0.20)] px-4 py-2.5 text-[13px] text-[#e46d4c]">{err}</div>}

            <form action={changePassword} className="mt-5 space-y-3">
              <label className="block">
                <span className="text-[11px] font-medium tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Kata sandi baru</span>
                <input name="newPassword" type="password" required minLength={8} placeholder="Min 8 karakter" className="auth-input mt-1.5 w-full px-3 py-2.5 text-[14px]" />
              </label>
              <label className="block">
                <span className="text-[11px] font-medium tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Ulangi</span>
                <input name="confirmPassword" type="password" required minLength={8} placeholder="Ulangi kata sandi" className="auth-input mt-1.5 w-full px-3 py-2.5 text-[14px]" />
              </label>
              <button type="submit" className="w-full flash-violet rounded-[6px] py-2.5 text-[14px] font-medium text-white">Continue</button>
            </form>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(186,215,247,0.12),transparent)]" />
              <span className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">atau</span>
              <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(186,215,247,0.12),transparent)]" />
            </div>
            <p className="mt-4 text-center text-[12px]"><Link href="/dashboard" className="text-[#b6d9fc] hover:text-white">← Kembali ke dasbor</Link></p>
          </div>

          <div className="mt-4 max-w-[440px] glass-card rounded-[16px] p-5">
            <p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">User ID</p>
            <p className="mt-1 font-mono text-[12px] break-all text-[#c7d3ea]">{user.id}</p>
            <p className="mt-2 text-[11px] text-[#9da7ba]">RLS aktif · Hanya kamu dan admin yang bisa lihat data ini.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)] py-4">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 flex items-center justify-between text-[11px] text-[#9da7ba]">
          <span><Link href="/dashboard" className="text-[#b6d9fc] hover:text-white">Dasbor</Link> · RLS · AES-256-CBC</span>
          <span className="font-[var(--font-dotdigital)] tracking-[0.06em] uppercase hidden sm:inline">PteroControl · #05060f</span>
        </div>
      </footer>
    </div>
  );
}
