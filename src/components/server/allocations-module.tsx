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
        body: JSON.stringify({ panelId: server.id, identifier, path: "connections", method: "GET" }),
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
        body: JSON.stringify({ panelId: server.id, identifier, path: `connections/${id}/primary`, method: "PATCH" }),
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
        body: JSON.stringify({ panelId: server.id, identifier, path: `connections/${id}`, method: "DELETE" }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Allocation removed", "ok");
      fetchAllocations();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  return (
    <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">Allocations</h2>
        <button onClick={fetchAllocations} className="btn-secondary py-2 text-body-sm">Refresh</button>
      </div>

      {loading ? (
        <div className="text-slate text-body-sm py-8 text-center">Loading...</div>
      ) : (
        <div className="space-y-2">
          {allocations.length === 0 ? (
            <div className="text-slate text-body-sm py-8 text-center">No allocations found</div>
          ) : (
            allocations.map((alloc: any) => (
              <div key={alloc.id} className={`flex items-center justify-between p-4 border rounded-lg ${alloc.is_default ? "bg-hi-yellow/10 border-hi-yellow/30" : "bg-white border-deep-ink/5"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-body text-deep-ink font-mono">{alloc.ip}:{alloc.port}</span>
                  {alloc.is_default && <span className="px-2.5 py-0.5 rounded-full text-caption font-semibold bg-hi-yellow text-deep-ink">PRIMARY</span>}
                </div>
                <div className="flex gap-2">
                  {!alloc.is_default && <button onClick={() => setPrimary(alloc.id)} className="btn-secondary py-1.5 text-body-sm">Set Primary</button>}
                  <button onClick={() => deleteAllocation(alloc.id)} className="text-[#e46d4c] hover:text-[#d33] text-body-sm font-medium">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}