"use client";
import { useState } from "react";
import { useToast } from "@/components/toast";

interface BackupsModuleProps {
  server: any;
  identifier: string;
}

export function BackupsModule({ server, identifier }: BackupsModuleProps) {
  const { push } = useToast();
  const [backups, setBackups] = useState([]);
  const [creating, setCreating] = useState(false);

  const fetchBackups = async () => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.id, identifier, path: "backups", method: "GET" }),
      });
      if (res.ok) {
        const data = await res.json();
        setBackups(data.data ?? []);
      }
    } catch {
      push("Failed to fetch backups", "err");
    }
  };

  const createBackup = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.id, identifier, path: "backups", method: "POST", data: {} }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Backup created", "ok");
      fetchBackups();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    } finally {
      setCreating(false);
    }
  };

  const downloadBackup = async (backupId: number) => {
    window.open(`/api/proxy?panelId=${server.id}&identifier=${identifier}&path=backups/${backupId}/download`, "_blank");
  };

  const deleteBackup = async (backupId: number) => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.id, identifier, path: `backups/${backupId}`, method: "DELETE" }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Backup deleted", "ok");
      fetchBackups();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  return (
    <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">Backups</h2>
        <button onClick={createBackup} disabled={creating} className="btn-primary py-2 text-body-sm disabled:opacity-50">
          {creating ? "Creating..." : "+ Create Backup"}
        </button>
      </div>

      <div className="space-y-2">
        {backups.length === 0 ? (
          <div className="text-slate text-body-sm py-8 text-center">No backups yet</div>
        ) : backups.map((backup: any) => (
          <div key={backup.id} className="flex items-center justify-between p-4 bg-white border border-deep-ink/5 rounded-lg">
            <div>
              <div className="text-body text-deep-ink font-medium">{backup.name || `Backup #${backup.id}`}</div>
              <div className="text-caption text-slate">
                {backup.completed_at ? new Date(backup.completed_at).toLocaleString() : "Creating..."}
              </div>
            </div>
            <div className="flex gap-2">
              {backup.download_url && <button onClick={() => downloadBackup(backup.id)} className="btn-secondary py-1.5 text-body-sm">Download</button>}
              <button onClick={() => deleteBackup(backup.id)} className="text-[#e46d4c] hover:text-[#d33] text-body-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}