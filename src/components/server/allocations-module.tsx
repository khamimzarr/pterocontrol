"use client";
import { useState } from "react";
import { useToast } from "@/components/toast";

interface AllocationsModuleProps {
  server: any;
  identifier: string;
}

export function AllocationsModule({ server, identifier }: AllocationsModuleProps) {
  const { push } = useToast();
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetchAllocations();
  });

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: "connections", method: "GET" }),
      });
      if (res.ok) {
        const data = await res.json();
        setAllocations(data.data ?? []);
      }
    } catch {
      push("Failed to fetch allocations", "err");
    } finally {
      setLoading(false);
    }
  };

  const setPrimary = async (id: number) => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: `connections/${id}/primary`, method: "PATCH" }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Primary allocation updated", "ok");
      fetchAllocations();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  const deleteAllocation = async (id: number) => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: `connections/${id}`, method: "DELETE" }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Allocation removed", "ok");
      fetchAllocations();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  return (
    <div className="glass-card rounded-[16px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-[16px] text-white">Allocations</h2>
        <button onClick={fetchAllocations} className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Refresh</button>
      </div>

      {loading ? (
        <div className="text-[#9da7ba] text-[13px] py-8 text-center">Loading...</div>
      ) : (
        <div className="space-y-2">
          {allocations.length === 0 ? (
            <div className="text-[#9da7ba] text-[13px] py-8 text-center">No allocations found</div>
          ) : (
            allocations.map((alloc: any) => (
              <div key={alloc.id} className={`flex items-center justify-between p-3 border rounded-[10px] ${alloc.is_default ? "bg-[rgba(102,58,243,0.08)] border-[rgba(102,58,243,0.2)]" : "bg-[rgba(199,211,234,0.04)] border-[rgba(186,215,247,0.08)]"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-white font-mono">{alloc.ip}:{alloc.port}</span>
                  {alloc.is_default && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#663af3] text-white">PRIMARY</span>}
                </div>
                <div className="flex gap-2">
                  {!alloc.is_default && <button onClick={() => setPrimary(alloc.id)} className="pill-ghost rounded-full px-3 py-1 text-[11px] text-white">Set Primary</button>}
                  <button onClick={() => deleteAllocation(alloc.id)} className="text-[#e46d4c] hover:text-[#ff7d6a] text-[12px]">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
