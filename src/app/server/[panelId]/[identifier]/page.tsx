export const dynamic = "force-dynamic";
import { requireApprovedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/lib/actions/auth-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { PowerModule } from "@/components/server/power-module";
import { ConsoleModule } from "@/components/server/console-module";
import { FileModule } from "@/components/server/file-module";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/panels", label: "Panels" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/akun", label: "Account" },
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

export default async function ServerDetailPage({ params }: { params: Promise<{ panelId: string; identifier: string }> }) {
  const resolvedParams = await params;
  const user = await requireApprovedUser();
  const supabase = await createClient();
  
  const { data: sl } = await supabase
    .from("server_links")
    .select("*")
    .eq("id", resolvedParams.panelId)
    .eq("user_id", user.id)
    .single();
  
  if (!sl) {
    redirect("/dashboard?error=server-not-found");
  }
  
  // Determine status badge styling
  const isOnline = sl.state === "online";
  const isStarting = sl.state === "starting";
  const isStopping = sl.state === "stopping";
  
  let statusBadgeClass = "bg-white text-gray-500 border border-gray-200";
  if (isOnline) statusBadgeClass = "bg-[#59e25d]/10 text-[#59e25d] border border-[#59e25d]";
  if (isStarting) statusBadgeClass = "bg-hi-yellow/10 text-deep-ink border border-hi-yellow";
  if (isStopping) statusBadgeClass = "bg-[#e46d4c]/10 text-[#e46d4c] border border-[#e46d4c]";
  
  const statusText = isOnline ? "ONLINE" : isStarting ? "STARTING" : isStopping ? "STOPPING" : "OFFLINE";
  
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      
      {/* Page Header */}
      <section className="border-b border-deep-ink/5 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-caption font-medium tracking-wide uppercase text-slate mb-2">Server Control</p>
              <h1 className="font-hedvig-letters-serif font-bold text-heading-lg text-deep-ink mb-3">{sl.name}</h1>
              <p className="text-slate text-body-sm">ID: <span className="font-mono text-deep-ink">{sl.identifier}</span></p>
            </div>
            
            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-full border font-semibold text-caption ${statusBadgeClass}`}>
              {statusText}
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="rounded-lg bg-surface-soft-meadow p-4 border border-deep-ink/5">
              <p className="text-caption font-medium tracking-wide uppercase text-slate">RAM Limit</p>
              <p className="font-medium text-subheading text-deep-ink mt-1">{sl.memory_limit || "--"} MB</p>
            </div>
            
            <div className="rounded-lg bg-surface-soft-meadow p-4 border border-deep-ink/5">
              <p className="text-caption font-medium tracking-wide uppercase text-slate">CPU Limit</p>
              <p className="font-medium text-subheading text-deep-ink mt-1">{sl.cpu_limit || "--"}%</p>
            </div>
            
            <div className="rounded-lg bg-surface-soft-meadow p-4 border border-deep-ink/5">
              <p className="text-caption font-medium tracking-wide uppercase text-slate">Disk Limit</p>
              <p className="font-medium text-subheading text-deep-ink mt-1">{sl.disk_limit ? `${sl.disk_limit / 1024 / 1024 / 1024} GB` : "--"}</p>
            </div>
            
            <div className="rounded-lg bg-surface-soft-meadow p-4 border border-deep-ink/5">
              <p className="text-caption font-medium tracking-wide uppercase text-slate">Created</p>
              <p className="font-medium text-subheading text-deep-ink mt-1">{new Date(sl.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="max-w-[800px] mx-auto px-6 md:px-10 space-y-6">
          
          <div className="animate-slide-up">
            <PowerModule server={sl} identifier={sl.identifier} />
          </div>

          {/* Console Module */}
          <div className="animate-slide-up animate-delay-100">
            <ConsoleModule server={sl} identifier={sl.identifier} panelUrl={sl.linked_panels?.panel_url} />
          </div>

          {/* File Module */}
          <div className="animate-slide-up animate-delay-150">
            <FileModule server={sl} identifier={sl.identifier} />
          </div>
          
          {/* Connection Info */}
          <div className="rounded-xl bg-white p-6 md:p-8 border border-deep-ink/5 animate-slide-up animate-delay-200 hover-lift">
            <h3 className="font-medium text-subheading text-deep-ink mb-4">Connection Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-soft-meadow border border-deep-ink/5">
                <div>
                  <p className="text-caption font-medium tracking-wide uppercase text-slate">Panel Name</p>
                  <p className="font-medium text-body text-deep-ink">{sl.linked_panels?.panel_name || "N/A"}</p>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#59e25d" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-soft-meadow border border-deep-ink/5">
                <div>
                  <p className="text-caption font-medium tracking-wide uppercase text-slate">Status</p>
                  <p className="font-medium text-body text-deep-ink">{sl.state || "unknown"}</p>
                </div>
                <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-[#59e25d] animate-pulse-dot" : isStarting ? "bg-hi-yellow" : "bg-gray-400"}`}></span>
              </div>
            </div>
          </div>
          
          {/* Back Button */}
          <div className="flex justify-between items-center">
            <Link 
              href="/dashboard" 
              className="btn-secondary inline-flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-4 text-center text-caption text-slate border-t border-deep-ink/5 bg-white">
        © 2026 Pterodactyl Control Panel · Server Control
      </footer>
    </div>
  );
}
