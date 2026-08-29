"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { AggregatedServer } from "@/lib/pterodactyl";

export function DashboardTable({ servers }: { servers: AggregatedServer[] }) {
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
    <div className="rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.10)] overflow-hidden shadow-[inset_0_1px_1px_rgba(216,236,248,0.10)]">
      <div className="px-4 sm:px-6 py-3 border-b border-[rgba(186,215,247,0.08)] bg-[rgba(186,214,247,0.03)] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <h2 className="font-medium text-[13px] text-white whitespace-nowrap">Server <span className="text-[#9da7ba] font-normal">· {filtered.length}/{servers.length}</span></h2>
        <div className="flex gap-2 flex-1 sm:justify-end">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama / ID / node…"
            className="auth-input flex-1 sm:max-w-[240px] px-3 py-2 text-[12px] placeholder:text-[rgba(199,211,234,0.45)]"
          />
          <select value={panel} onChange={(e) => setPanel(e.target.value)} className="auth-input px-3 py-2 text-[12px] min-w-[110px]">
            <option value="all">Semua panel</option>
            {panels.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="px-6 py-8 text-center text-[13px] text-[#9da7ba]">
          {servers.length === 0 ? <>Tidak ada data. <Link href="/panels" className="text-[#b6d9fc] hover:text-white">Cek panel →</Link></> : "Tidak cocok."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-[rgba(186,214,247,0.04)] text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba] border-b border-[rgba(186,215,247,0.08)]">
              <th className="px-6 py-2.5 font-normal">Server</th><th className="px-4 py-2.5 font-normal">Panel</th><th className="px-4 py-2.5 font-normal">Node</th><th className="px-4 py-2.5 font-normal">RAM</th><th className="px-4 py-2.5 font-normal">CPU</th><th className="px-6 py-2.5 font-normal">ID</th>
            </tr></thead>
            <tbody className="divide-y divide-[rgba(186,215,247,0.06)]">
              {filtered.map((s) => (
                <tr key={`${s.panelId}-${s.identifier}`} className="hover:bg-[rgba(186,214,247,0.04)] transition-colors">
                  <td className="px-6 py-3 text-[13px] font-medium text-white truncate max-w-[180px]">{s.name}</td>
                  <td className="px-4 py-3 text-[12px] text-[#c7d3ea]"><span className="px-2 py-0.5 rounded-full text-[11px] bg-[rgba(199,211,234,0.10)] border border-[rgba(186,215,247,0.06)]">{s.panelName}</span></td>
                  <td className="px-4 py-3 text-[12px] text-[#9da7ba]">{s.node ?? "—"}</td>
                  <td className="px-4 py-3 text-[12px] text-[#d1e4fa]">{s.memoryLimit != null ? `${s.memoryLimit} MB` : "—"}</td>
                  <td className="px-4 py-3 text-[12px] text-[#d1e4fa]">{s.cpuLimit != null ? `${s.cpuLimit}%` : "—"}</td>
                  <td className="px-6 py-3 font-mono text-[11px] text-[#9da7ba]">{s.identifier}</td>
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
    <div className="rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.10)] overflow-hidden">
      <div className="px-6 py-3 border-b border-[rgba(186,215,247,0.08)] bg-[rgba(186,214,247,0.03)] flex justify-between"><div className="h-4 w-20 rounded bg-[rgba(186,214,247,0.08)] animate-pulse" /><div className="h-8 w-56 rounded-[6px] bg-[rgba(186,214,247,0.06)] animate-pulse" /></div>
      <div className="p-4 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-10 rounded-[10px] bg-[rgba(186,214,247,0.04)] animate-pulse" />)}</div>
    </div>
  );
}
