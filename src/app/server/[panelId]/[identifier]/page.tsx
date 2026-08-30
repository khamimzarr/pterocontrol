export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireApprovedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";
import { logout } from "@/lib/actions/auth-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { PowerModule } from "@/components/server/power-module";
import { ConsoleModule } from "@/components/server/console-module";
import { FilesModule } from "@/components/server/files-module";
import { DatabasesModule } from "@/components/server/databases-module";
import { BackupsModule } from "@/components/server/backups-module";
import { SchedulesModule } from "@/components/server/schedules-module";
import { SettingsModule } from "@/components/server/settings-module";
import { AllocationsModule } from "@/components/server/allocations-module";

interface Tab { id: string; label: string; icon: string; }
const TABS: Tab[] = [
  { id: "power", label: "Power", icon: "⏻" },
  { id: "console", label: "Console", icon: "⟩_" },
  { id: "files", label: "Files", icon: "📁" },
  { id: "databases", label: "Databases", icon: "🗄" },
  { id: "backups", label: "Backups", icon: "↕" },
  { id: "schedules", label: "Schedules", icon: "⏲" },
  { id: "settings", label: "Settings", icon: "⚙" },
  { id: "allocations", label: "Allocations", icon: "◈" },
];

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  const links = [
    { href: "/dashboard", label: "Dasbor" },
    { href: "/panels", label: "Panel" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/akun", label: "Akun" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.65)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1400px] px-6 h-[52px] flex items-center justify-between gap-2">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)]"><span className="w-2.5 h-2.5 rounded-full bg-[#663af3] animate-shimmer-dot" /></span>
          <span className="font-medium text-[15px] text-[#d1e4fa]">PteroControl</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Dasbor</Link>
          <Link href="/panels" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Panel</Link>
          {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Admin</Link>}
          <Link href="/akun" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Akun</Link>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-[#9da7ba] truncate max-w-[140px]">{email}</span>
          <form action={logout} className="hidden sm:block"><button className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Keluar</button></form>
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}

export default async function ServerDetailPage({ params }: { params: Promise<{ panelId: string; identifier: string }> }) {
  const { panelId, identifier } = await params;
  const user = await requireApprovedUser();
  const supabase = await createClient();

  // Get server link with panel info
  const { data: serverRaw } = await supabase
    .from("server_links")
    .select("*, linked_panels(panel_name, panel_url, encrypted_api_key)")
    .eq("id", panelId)
    .eq("user_id", user.id)
    .single();

  if (!serverRaw || !((serverRaw as any).linked_panels)) {
    notFound();
  }

  const server = serverRaw as any;
  const panel = server.linked_panels;
  
  let apiKey: string;
  try {
    apiKey = decrypt(panel.encrypted_api_key);
  } catch {
    notFound();
  }

  // Fetch fresh server data from panel API
  let serverData: any = null;
  try {
    const res = await fetch(`${panel.panel_url}/api/client/servers/${identifier}`, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (res.ok) {
      serverData = await res.json();
    }
  } catch {
    // Continue without fresh data
  }

  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      
      {/* Header */}
      <section className="border-b border-[rgba(186,215,247,0.06)] bg-[rgba(5,6,15,0.5)]">
        <div className="mx-auto max-w-[1400px] px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-[#9da7ba] font-[var(--font-dotdigital)] tracking-[0.06em] uppercase">
                <Link href="/dashboard" className="hover:text-[#d1e4fa]">Dasbor</Link>
                <span>›</span>
                <span className="text-[#c7d3ea]">{panel.panel_name}</span>
                <span>›</span>
                <span className="text-white">{server.name}</span>
              </div>
              <h1 className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[24px] leading-none text-white flex items-center gap-3">
                {server.name}
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${server.state === "online" ? "bg-[rgba(40,200,64,0.15)] text-[#28c840] border border-[rgba(40,200,64,0.25)]" : server.state === "starting" ? "bg-[rgba(102,58,243,0.15)] text-[#a78bfa] border border-[rgba(102,58,243,0.25)]" : server.state === "stopping" ? "bg-[rgba(228,109,76,0.15)] text-[#e46d4c] border border-[rgba(228,109,76,0.25)]" : "bg-[rgba(199,211,234,0.08)] text-[#9da7ba] border border-[rgba(186,215,247,0.08)]"}`}>
                  {server.state?.toUpperCase() || "OFFLINE"}
                </span>
              </h1>
              <p className="mt-1 text-[12px] text-[#9da7ba] font-mono">ID: {identifier}</p>
            </div>
            <Link href="/dashboard" className="pill-ghost rounded-full px-4 py-2 text-[13px] font-medium text-white shrink-0">← Kembali</Link>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-[rgba(186,215,247,0.08)] bg-[rgba(5,6,15,0.4)] overflow-x-auto">
        <div className="mx-auto max-w-[1400px] px-6">
          <nav className="flex gap-1 min-w-max">
            {TABS.map((tab) => (
              <TabButton key={tab.id} tab={tab} currentTab="power" />
            ))}
          </nav>
        </div>
      </div>

      {/* Module Content */}
      <main className="flex-1 py-6 bg-[#05060f]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 space-y-6">
          <PowerModule server={server} serverData={serverData} apiKey={apiKey} panelUrl={panel.panel_url} identifier={identifier} serverLinkId={server.id} />
          <ConsoleModule server={server} identifier={identifier} panelUrl={panel.panel_url} />
          <FilesModule server={server} identifier={identifier} panelUrl={panel.panel_url} />
          <DatabasesModule server={server} identifier={identifier} />
          <BackupsModule server={server} identifier={identifier} />
          <SchedulesModule server={server} identifier={identifier} />
          <SettingsModule server={server} identifier={identifier} serverData={serverData} />
          <AllocationsModule server={server} identifier={identifier} />
        </div>
      </main>
    </div>
  );
}

function TabButton({ tab, currentTab }: { tab: Tab; currentTab: string }) {
  const isActive = tab.id === currentTab;
  return (
    <button className={`px-4 py-3 text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${isActive ? "text-white border-[#663af3]" : "text-[#9da7ba] border-transparent hover:text-[#d1e4fa]"}`}>
      <span className="mr-1.5">{tab.icon}</span>
      {tab.label}
    </button>
  );
}
