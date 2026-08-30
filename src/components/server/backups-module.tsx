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
    <div className="glass-card rounded-[16px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-[16px] text-white">Backups</h2>
        <button onClick={createBackup} disabled={creating} className="flash-violet rounded-full px-4 py-2 text-[13px] font-medium text-white disabled:opacity-50">
          {creating ? "Creating..." : "+ Create Backup"}
        </button>
      </div>

      <div className="space-y-2">
        {backups.length === 0 ? (
          <div className="text-[#9da7ba] text-[13px] py-8 text-center">No backups yet</div>
        ) : backups.map((backup: any) => (
          <div key={backup.id} className="flex items-center justify-between p-3 bg-[rgba(199,211,234,0.04)] border border-[rgba(186,215,247,0.08)] rounded-[10px]">
            <div>
              <div className="text-[13px] text-white font-medium">{backup.name || `Backup #${backup.id}`}</div>
              <div className="text-[11px] text-[#9da7ba]">
                {backup.completed_at ? new Date(backup.completed_at).toLocaleString() : "Creating..."}
              </div>
            </div>
            <div className="flex gap-2">
              {backup.download_url && <button onClick={() => downloadBackup(backup.id)} className="pill-ghost rounded-full px-3 py-1.5 text-[12px] text-white">Download</button>}
              <button onClick={() => deleteBackup(backup.id)} className="text-[#e46d4c] hover:text-[#ff7d6a] text-[12px]">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
