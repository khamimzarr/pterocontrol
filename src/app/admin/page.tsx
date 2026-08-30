export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { AdminActions } from "@/components/admin-actions";
import { RealtimeAdmin } from "@/components/realtime";

function TopNav({ email }: { email: string }) {
  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/panels", label: "Panels" },
    { href: "/admin", label: "Admin", active: true },
    { href: "/akun", label: "Account" },
  ];
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/admin" className="nav-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" stroke="#ffe228" strokeWidth="3"/>
            <path d="M16 8l8 4-8 4-8-4 8-4z" fill="#130e30"/>
          </svg>
          Pterodactyl
        </Link>
        
        <nav className="hidden md:flex items-center gap-32">
          <Link href="/dashboard" className="px-4 py-2 rounded-full bg-surface-canvas text-deep-ink font-medium text-body-sm">Dashboard</Link>
          <Link href="/panels" className="nav-link">Panels</Link>
          <Link href="/admin" className="px-4 py-2 rounded-full bg-hi-yellow text-deep-ink font-semibold text-body-sm shadow-sm">Admin</Link>
          <Link href="/akun" className="nav-link">Account</Link>
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

export default async function AdminPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data: pending } = await supabase.from("profiles").select("id, email, role, status, created_at").in("status", ["PENDING", "REJECTED"]).order("created_at");
  const pend = pending?.filter((u) => u.status === "PENDING").length ?? 0;
  const rej = pending?.filter((u) => u.status === "REJECTED").length ?? 0;
  const { data: app } = await supabase.from("profiles").select("id").eq("status", "APPROVED");
  const approvedCount = app?.length ?? 0;
  
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col">
      <TopNav email={admin.email} />
      
      <RealtimeAdmin />
      
      {/* Page Header */}
      <section className="border-b border-deep-ink/5 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-7">
          <p className="text-caption font-semibold tracking-wide uppercase text-slate mb-2">Admin Inbox</p>
          <h1 className="font-hedvig-letters-serif font-bold text-heading-lg text-deep-ink mb-3">User Management</h1>
          <p className="text-slate text-body-sm mb-6">Manage user approvals and access levels.</p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-surface-soft-meadow p-5 border border-deep-ink/5">
              <p className="text-caption font-medium tracking-wide uppercase text-slate">Pending</p>
              <p className="font-hedvig-letters-serif font-bold text-display text-hi-yellow mt-2">{pend}</p>
              <p className="text-caption text-slate mt-1">awaiting approval</p>
            </div>
            
            <div className="rounded-xl bg-surface-soft-meadow p-5 border border-deep-ink/5">
              <p className="text-caption font-medium tracking-wide uppercase text-slate">Rejected</p>
              <p className="font-hedvig-letters-serif font-bold text-display text-[#e46d4c] mt-2">{rej}</p>
              <p className="text-caption text-slate mt-1">manual review needed</p>
            </div>
            
            <div className="rounded-xl bg-surface-soft-meadow p-5 border border-deep-ink/5">
              <p className="text-caption font-medium tracking-wide uppercase text-slate">Approved</p>
              <p className="font-hedvig-letters-serif font-bold text-display text-[#59e25d] mt-2">{approvedCount}</p>
              <p className="text-caption text-slate mt-1">active users</p>
            </div>
            
            <div className="rounded-xl bg-gradient-to-br from-hi-yellow to-[#fcd34d] p-5 text-deep-ink shadow-sm">
              <p className="text-caption font-bold tracking-wide uppercase opacity-75">Status</p>
              <p className="font-bold text-xl mt-2">Admin Panel</p>
              <p className="text-caption opacity-75">role-based access</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pending Requests */}
      <section className="flex-1 py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <h2 className="font-hedvig-letters-serif font-bold text-heading text-deep-ink mb-6">User Requests</h2>
          
          <AdminActions requests={pending || []} />
          
          <div className="mt-8 rounded-xl bg-surface-soft-meadow p-6 border border-deep-ink/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-subheading text-deep-ink">Quick Actions</h3>
              <span className="text-caption text-slate">All changes are logged</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary py-2.5">Approve All Pending</button>
              <button className="btn-secondary py-2.5">Reject Rejected</button>
              <button className="btn-ghost py-2.5">Export CSV</button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-4 text-center text-caption text-slate border-t border-deep-ink/5 bg-white">
        © 2026 Pterodactyl Control Panel · Admin Mode
      </footer>
    </div>
  );
}
