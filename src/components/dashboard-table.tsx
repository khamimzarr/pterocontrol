"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AggregatedServer } from "@/lib/pterodactyl";

export function DashboardTable({ servers }: { servers: AggregatedServer[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [panel, setPanel] = useState<string>("all");
  const panels = useMemo(() => [...new Set(servers.map((s) => s.panelName))], [servers]);
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return servers.filter((s) => {
      if (panel !== "all" && s.panelName !== panel) return false;
      if (!qq) return true;
      return (
        s.name.toLowerCase().includes(qq) ||
        s.identifier.toLowerCase().includes(qq) ||
        (s.node ?? "").toLowerCase().includes(qq)
      );
    });
  }, [servers, q, panel]);

  return (
    <div className="rounded-[24px] bg-surface-soft-meadow border border-deep-ink/5 overflow-hidden shadow-sm">
      {/* Header with search & filters */}
      <div className="px-6 py-4 border-b border-deep-ink/6 bg-white flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink whitespace-nowrap">
          Server Status 
          <span className="text-slate text-caption ml-2">· {filtered.length}/{servers.length}</span>
        </h2>
        
        <div className="flex gap-3 flex-1 sm:justify-end items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name / ID / node..."
            className="input-pill flex-1 sm:max-w-[280px] px-4 py-2.5 text-body-sm"
          />
          
          <select 
            value={panel} 
            onChange={(e) => setPanel(e.target.value)} 
            className="input-pill px-4 py-2.5 text-body-sm min-w-[140px]"
          >
            <option value="all">All panels</option>
            {panels.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="px-6 py-12 text-center text-body-sm text-slate">
          {servers.length === 0 ? (
            <>No servers found.{" "}
              <Link href="/panels" className="text-hi-yellow hover:text-deep-ink font-medium">
                Add panel →
              </Link>
            </>
          ) : (
            "No matching results."
          )}
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-caption tracking-wide uppercase font-semibold text-slate border-b border-deep-ink/6">
                <th className="px-6 py-3 font-medium">Server</th>
                <th className="px-4 py-3 font-medium">Panel</th>
                <th className="px-4 py-3 font-medium">Node</th>
                <th className="px-4 py-3 font-medium">RAM</th>
                <th className="px-4 py-3 font-medium">CPU</th>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-deep-ink/5">
              {filtered.map((s) => (
                <tr 
                  key={`${s.panelId}-${s.identifier}`} 
                  onClick={() => router.push(`/server/${s.panelId}/${s.identifier}`)}
                  className="hover:bg-white/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-3.5 text-body-sm font-medium text-deep-ink truncate max-w-[180px]">{s.name}</td>
                  
                  <td className="px-4 py-3.5">
                    <span className="px-3 py-1 rounded-full text-caption font-medium bg-surface-canvas border border-deep-ink/6 text-slate group-hover:border-deep-ink/10 transition-colors">
                      {s.panelName}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3.5 text-body-sm text-slate">
                    {s.node || <span className="text-gray-400">—</span>}
                  </td>
                  
                  <td className="px-4 py-3.5 text-body-sm text-deep-ink">
                    {s.memoryLimit != null ? `${s.memoryLimit} MB` : <span className="text-gray-400">—</span>}
                  </td>
                  
                  <td className="px-4 py-3.5 text-body-sm text-deep-ink">
                    {s.cpuLimit != null ? `${s.cpuLimit}%` : <span className="text-gray-400">—</span>}
                  </td>
                  
                  <td className="px-4 py-3.5 font-mono text-caption text-slate">{s.identifier}</td>
                  
                  <td className="px-6 py-3.5 text-right">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-soft-meadow text-slate group-hover:bg-hi-yellow group-hover:text-deep-ink transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-[24px] bg-surface-soft-meadow border border-deep-ink/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-deep-ink/6 bg-white flex justify-between">
        <div className="h-5 w-24 rounded bg-surface-canvas animate-pulse" />
        <div className="h-10 w-64 rounded-lg bg-surface-canvas animate-pulse" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-surface-canvas animate-pulse" />
        ))}
      </div>
    </div>
  );
}
