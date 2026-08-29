export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { logout } from "@/lib/actions/auth-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { AkunForm } from "@/components/akun-form";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  const links = [
    { href: "/dashboard", label: "Dasbor" },
    { href: "/panels", label: "Panel" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/akun", label: "Akun", active: true },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.65)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between gap-2">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0"><span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)]"><span className="w-2.5 h-2.5 rounded-full bg-[#663af3] animate-shimmer-dot" /></span><span className="font-medium text-[15px] text-[#d1e4fa]">PteroControl</span><span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium text-[#c7d3ea] bg-[rgba(199,211,234,0.10)] border border-[rgba(186,215,247,0.06)]">akun</span></Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Dasbor</Link>
          <Link href="/panels" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Panel</Link>
          {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Admin</Link>}
          <Link href="/akun" className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white">Akun</Link>
        </nav>
        <div className="flex items-center gap-2"><span className="hidden sm:inline text-[11px] text-[#9da7ba] truncate max-w-[120px]">{email}</span><form action={logout} className="hidden sm:block"><button className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Keluar</button></form><MobileMenu links={links} /></div>
      </div>
    </header>
  );
}

export default async function AkunPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await requireApprovedUser();
  const sp = await searchParams;
  const success = sp.success === "1";
  let err: string | null = null;
  if (sp.error) err = sp.error === "pendek" ? "Min 8 karakter." : sp.error === "tidakcocok" ? "Tidak cocok." : decodeURIComponent(sp.error);
  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      <section className="relative overflow-hidden border-b border-[rgba(186,215,247,0.06)]">
        <div className="absolute inset-0 bg-grid opacity-[0.22] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-7">
          <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">{user.role} · {user.status}</p>
          <h1 className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[26px] leading-none text-[#d8ecf8]">Akun</h1>
          <p className="mt-2 text-[13px] text-[#9da7ba]">{user.email}</p>
        </div>
      </section>
      <section className="flex-1 py-6 bg-[#05060f]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <div className="max-w-[440px] rounded-[16px] bg-[rgba(5,6,15,0.96)] border border-[rgba(186,215,247,0.12)] p-6 shadow-[inset_0_1px_1px_rgba(216,236,248,0.20),0_24px_48px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full grid place-items-center bg-[#663af3] text-white font-medium text-[12px]">◈</span><div><h2 className="font-medium text-[15px] leading-none text-white">Ganti sandi</h2><p className="text-[11px] text-[#9da7ba] font-[var(--font-dotdigital)] tracking-[0.06em] uppercase">Min 8 karakter</p></div></div>
            {success && <div className="mt-4 rounded-[10px] bg-[rgba(40,200,64,0.10)] border border-[rgba(40,200,64,0.18)] px-4 py-2.5 text-[13px] text-[#28c840]">Berhasil ✓</div>}
            {err && <div className="mt-4 rounded-[10px] bg-[rgba(228,109,76,0.10)] border border-[rgba(228,109,76,0.20)] px-4 py-2.5 text-[13px] text-[#e46d4c]">{err}</div>}
            <AkunForm />
            <p className="mt-4 text-center text-[12px]"><Link href="/dashboard" className="text-[#b6d9fc] hover:text-white">← Dasbor</Link></p>
          </div>
          <div className="mt-4 max-w-[440px] glass-card rounded-[16px] p-4"><p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">ID</p><p className="mt-1 font-mono text-[11px] break-all text-[#c7d3ea]">{user.id}</p></div>
        </div>
      </section>
      <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)] py-4"><div className="mx-auto max-w-[1200px] px-6 md:px-10 text-[11px] text-[#9da7ba]">© 2025 PteroControl</div></footer>
    </div>
  );
}
