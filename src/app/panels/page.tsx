export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { AddPanelForm, EditPanelForm, DeletePanelButton } from "@/components/panel-forms";
import { RealtimePanels } from "@/components/realtime";

function TopNav({ email }: { email: string }) {
  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/panels", label: "Panels", active: true },
    { href: "/admin", label: "Admin" },
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
          <Link href="/panels" className="px-4 py-2 rounded-full bg-hi-yellow text-deep-ink font-semibold text-body-sm shadow-sm">Panels</Link>
          <Link href="/admin" className="nav-link">Admin</Link>
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

export default async function PanelsPage() {
  const user = await requireApprovedUser();
  const supabase = await createClient();
  const { data: panels } = await supabase.from("linked_panels").select("id, panel_name, panel_url, created_at").eq("user_id", user.id).order("created_at");
  const count = panels?.length ?? 0;
  
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col">
      <TopNav email={user.email} />
      
      <RealtimePanels userId={user.id} />
      
      {/* Page Header */}
      <section className="border-b border-deep-ink/5 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-7">
          <p className="text-caption font-semibold tracking-wide uppercase text-slate mb-2">{count} Panel{count !== 1 ? 's' : ''}</p>
          <h1 className="font-hedvig-letters-serif font-bold text-heading-lg text-deep-ink mb-3">Connected Panels</h1>
          <p className="text-slate text-body-sm">URL + API key. Encrypted with AES-256.</p>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-4">
          
          {/* Add New Panel Form */}
          <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full grid place-items-center bg-hi-yellow text-deep-ink font-bold text-lg shadow-sm">+</div>
              <div>
                <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">Add New Panel</h2>
                <p className="text-slate text-caption mt-1 tracking-wide uppercase">Client key — not Application token</p>
              </div>
            </div>
            
            <AddPanelForm />
          </div>
          
          {/* Empty State */}
          {count === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center border border-deep-ink/5">
              <p className="text-caption font-medium tracking-wide uppercase text-slate mb-2">No Panels</p>
              <p className="font-medium text-subheading text-deep-ink mb-1">还没有面板</p>
              <p className="text-slate text-body-sm mt-2">Add your first panel URL and API key above.</p>
            </div>
          ) : (
            /* Existing Panels Grid */
            <div className="grid gap-4">
              {panels?.map((p) => (
                <div key={p.id} className="rounded-xl bg-white p-5 md:p-6 border border-deep-ink/5 hover:border-deep-ink/10 transition-colors">
                  <div className="flex justify-between gap-4 items-start">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-body text-deep-ink truncate">{p.panel_name}</h3>
                      <p className="text-caption text-slate font-mono mt-1 break-all">{p.panel_url}</p>
                      <p className="text-caption text-slate mt-1">Added {new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    <DeletePanelButton id={p.id} name={p.panel_name} />
                  </div>
                  
                  <details className="mt-4 group pt-4 border-t border-deep-ink/5">
                    <summary className="text-body-sm text-hi-yellow cursor-pointer hover:text-deep-ink inline-flex items-center gap-2 list-none">
                      Edit Details <span className="transition-transform group-open:rotate-90">›</span>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-deep-ink/5">
                      <EditPanelForm id={p.id} name={p.panel_name} url={p.panel_url} />
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
          
          {/* Dashboard CTA */}
          <div className="rounded-xl bg-gradient-to-br from-hi-yellow to-[#fcd34d] p-6 flex justify-between items-center gap-4 shadow-md">
            <div>
              <p className="font-bold text-subheading text-deep-ink">View Dashboard</p>
              <p className="text-caption text-deep-ink opacity-75 mt-1">See all your connected servers</p>
            </div>
            <Link href="/dashboard" className="shrink-0 rounded-full bg-white text-deep-ink text-caption font-semibold px-6 py-3 shadow-sm hover:bg-opacity-90 transition-colors">
              Dashboard →
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-4 text-center text-caption text-slate border-t border-deep-ink/5 bg-white">
        © 2026 Pterodactyl Control Panel · Connected Panels
      </footer>
    </div>
  );
}
