"use client";
import { useState } from "react";
import { useToast } from "@/components/toast";

interface DatabasesModuleProps {
  server: any;
  identifier: string;
}

export function DatabasesModule({ server, identifier }: DatabasesModuleProps) {
  const { push } = useToast();
  const [dbs, setDbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newDb, setNewDb] = useState({ name: "", host: "localhost", maxConnections: 0 });

  const fetchDbs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: "databases", method: "GET" }),
      });
      if (res.ok) {
        const data = await res.json();
        setDbs(data.data ?? []);
      }
    } catch {
      push("Failed to fetch databases", "err");
    } finally {
      setLoading(false);
    }
  };

  const createDb = async () => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.panel_id,
          identifier,
          path: "databases",
          method: "POST",
          data: newDb,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Database created", "ok");
      setShowCreate(false);
      fetchDbs();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  const deleteDb = async (dbId: number) => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: `databases/${dbId}`, method: "DELETE" }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Database deleted", "ok");
      fetchDbs();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  return (
    <div className="glass-card rounded-[16px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-[16px] text-white">Databases</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="flash-violet rounded-full px-4 py-2 text-[13px] font-medium text-white">+ New Database</button>
      </div>

      {showCreate && (
        <div className="mb-4 p-4 bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.12)] rounded-[12px] space-y-3">
          <input value={newDb.name} onChange={(e) => setNewDb({ ...newDb, name: e.target.value })} placeholder="Database name" className="auth-input w-full px-3 py-2 text-[13px]" />
          <input value={newDb.host} onChange={(e) => setNewDb({ ...newDb, host: e.target.value })} placeholder="Host (default: localhost)" className="auth-input w-full px-3 py-2 text-[13px]" />
          <input type="number" value={newDb.maxConnections} onChange={(e) => setNewDb({ ...newDb, maxConnections: parseInt(e.target.value) })} placeholder="Max connections" className="auth-input w-full px-3 py-2 text-[13px]" />
          <div className="flex gap-2">
            <button onClick={createDb} className="flash-violet rounded-full px-4 py-2 text-[12px] font-medium text-white">Create</button>
            <button onClick={() => setShowCreate(false)} className="pill-ghost rounded-full px-4 py-2 text-[12px] font-medium text-white">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div className="text-[#9da7ba] text-[13px] py-8 text-center">Loading...</div> : (
        <div className="space-y-2">
          {dbs.length === 0 ? (
            <div className="text-[#9da7ba] text-[13px] py-8 text-center">No databases found</div>
          ) : dbs.map((db: any) => (
            <div key={db.id} className="flex items-center justify-between p-3 bg-[rgba(199,211,234,0.04)] border border-[rgba(186,215,247,0.08)] rounded-[10px]">
              <div>
                <div className="text-[13px] text-white font-medium">{db.database}</div>
                <div className="text-[11px] text-[#9da7ba]">Host: {db.username}@{db.host} · Max: {db.max_connections}</div>
              </div>
              <button onClick={() => deleteDb(db.id)} className="text-[#e46d4c] hover:text-[#ff7d6a] text-[12px]">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
