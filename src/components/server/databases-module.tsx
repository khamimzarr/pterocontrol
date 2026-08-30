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
        body: JSON.stringify({ panelId: server.id, identifier, path: "databases", method: "GET" }),
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
          panelId: server.id,
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
        body: JSON.stringify({ panelId: server.id, identifier, path: `databases/${dbId}`, method: "DELETE" }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Database deleted", "ok");
      fetchDbs();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  return (
    <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">Databases</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary py-2 text-body-sm">+ New Database</button>
      </div>

      {showCreate && (
        <div className="mb-4 p-4 bg-white border border-deep-ink/5 rounded-lg space-y-3">
          <input value={newDb.name} onChange={(e) => setNewDb({ ...newDb, name: e.target.value })} placeholder="Database name" className="input-pill w-full py-3" />
          <input value={newDb.host} onChange={(e) => setNewDb({ ...newDb, host: e.target.value })} placeholder="Host (default: localhost)" className="input-pill w-full py-3" />
          <input type="number" value={newDb.maxConnections} onChange={(e) => setNewDb({ ...newDb, maxConnections: parseInt(e.target.value) })} placeholder="Max connections" className="input-pill w-full py-3" />
          <div className="flex gap-3">
            <button onClick={createDb} className="btn-primary py-2 text-body-sm">Create</button>
            <button onClick={() => setShowCreate(false)} className="btn-secondary py-2 text-body-sm">Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div className="text-slate text-body-sm py-8 text-center">Loading...</div> : (
        <div className="space-y-2">
          {dbs.length === 0 ? (
            <div className="text-slate text-body-sm py-8 text-center">No databases found</div>
          ) : dbs.map((db: any) => (
            <div key={db.id} className="flex items-center justify-between p-4 bg-white border border-deep-ink/5 rounded-lg">
              <div>
                <div className="text-body text-deep-ink font-medium">{db.database}</div>
                <div className="text-caption text-slate">Host: {db.username}@{db.host} · Max: {db.max_connections}</div>
              </div>
              <button onClick={() => deleteDb(db.id)} className="text-[#e46d4c] hover:text-[#d33] text-body-sm font-medium">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}