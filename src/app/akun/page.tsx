export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { logout } from "@/lib/actions/auth-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { AkunForm } from "@/components/akun-form";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/panels", label: "Panels" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/akun", label: "Account", active: true },
  ];
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/dashboard" className="nav-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" stroke="#ffe228" strokeWidth="3"/>
            <path d="M16 8l8 4-8 4-8-4 8-4z" fill="#130e30"/>
          </svg>
          Pterodactyl
        </Link>
        
        <nav className="hidden md:flex items-center gap-32">
          <Link href="/dashboard" className="px-4 py-2 rounded-full bg-surface-canvas text-deep-ink font-medium text-body-sm">Dashboard</Link>
          <Link href="/panels" className="nav-link">Panels</Link>
          {isAdmin && <Link href="/admin" className="nav-link">Admin</Link>}
          <Link href="/akun" className="px-4 py-2 rounded-full bg-hi-yellow text-deep-ink font-semibold text-body-sm shadow-sm">Account</Link>
        </nav>
        
        <div className="nav-actions">
          <span className="text-caption text-slate hidden sm:inline truncate max-w-[120px]">{email}</span>
          <form action={logout} className="hidden sm:block">
            <button className="btn-ghost text-body-sm">Log Out</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default async function AkunPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await requireApprovedUser();
  const sp = await searchParams;
  const success = sp.success === "1";
  let err: string | null = null;
  if (sp.error) err = sp.error === "pendek" ? "Min 8 karakter." : sp.error === "tidakcocok" ? "Tidak cocok." : decodeURIComponent(sp.error);
  
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      
      {/* Page Header */}
      <section className="border-b border-deep-ink/5 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-7">
          <p className="text-caption font-semibold tracking-wide uppercase text-slate mb-2">{user.role} · {user.status}</p>
          <h1 className="font-hedvig-letters-serif font-bold text-heading-lg text-deep-ink mb-3">Your Account</h1>
          <p className="text-slate text-body-sm">Manage your personal information and security settings.</p>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="max-w-[600px] mx-auto px-6 md:px-10">
          {/* Profile Form Card */}
          <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
            <div className="mb-6 pb-6 border-b border-deep-ink/5">
              <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">Profile Information</h2>
              <p className="text-slate text-body-sm mt-1">Update your account details below</p>
            </div>
            
            <AkunForm user={user} success={success} error={err} />
            
            <div className="mt-6 pt-6 border-t border-deep-ink/5">
              <p className="text-caption text-slate">
                All changes are encrypted with AES-256. Your data is secure.
              </p>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 rounded-xl bg-white p-6 border border-deep-ink/5">
            <h3 className="font-medium text-subheading text-deep-ink mb-3">Account Security</h3>
            <ul className="space-y-2 text-body-sm text-slate">
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#59e25d" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Password encryption enabled
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#59e25d" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Two-factor authentication ready
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#59e25d" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Activity logging enabled
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-4 text-center text-caption text-slate border-t border-deep-ink/5 bg-white">
        © 2026 Pterodactyl Control Panel · Account Settings
      </footer>
    </div>
  );
}
