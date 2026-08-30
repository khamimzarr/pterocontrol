"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/toast";

interface SettingsModuleProps {
  server: any;
  identifier: string;
  serverData: any;
}

export function SettingsModule({ server, identifier, serverData }: SettingsModuleProps) {
  const { push } = useToast();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<any>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: "settings", method: "GET" }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.data);
        setEditedData(data.data);
      }
    } catch {
      push("Failed to fetch settings", "err");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: "settings", method: "PUT", data: editedData }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Settings saved", "ok");
      setEditMode(false);
      fetchSettings();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  if (loading) return <div className="text-[#9da7ba] text-[13px] py-8 text-center">Loading...</div>;
  if (!settings) return <div className="text-[#e46d4c] text-[13px] py-8 text-center">Failed to load</div>;

  return (
    <div className="glass-card rounded-[16px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-[16px] text-white">Settings</h2>
        <button onClick={() => editMode ? saveSettings() : setEditMode(true)} className={editMode ? "flash-violet rounded-full px-4 py-2 text-[13px] font-medium text-white" : "pill-ghost rounded-full px-4 py-2 text-[13px] font-medium text-white"}>
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-[rgba(186,215,247,0.06)] last:border-0">
            <span className="text-[13px] text-[#9da7ba] capitalize">{key.replace(/_/g, " ")}</span>
            {editMode ? (
              <input
                value={editedData[key] ?? ""}
                onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
                className="auth-input px-3 py-1.5 text-[13px] w-full sm:w-[300px]"
              />
            ) : (
              <span className="text-[13px] text-white font-mono">{String(value)}</span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-[#9da7ba]">Some settings may require server restart to take effect.</p>
    </div>
  );
}
