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
        body: JSON.stringify({ panelId: server.id, identifier, path: "settings", method: "GET" }),
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
        body: JSON.stringify({ panelId: server.id, identifier, path: "settings", method: "PUT", data: editedData }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Settings saved", "ok");
      setEditMode(false);
      fetchSettings();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  if (loading) return <div className="text-slate text-body-sm py-8 text-center">Loading...</div>;
  if (!settings) return <div className="text-[#e46d4c] text-body-sm py-8 text-center">Failed to load</div>;

  return (
    <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">Settings</h2>
        <button onClick={() => editMode ? saveSettings() : setEditMode(true)} className={editMode ? "btn-primary py-2 text-body-sm" : "btn-secondary py-2 text-body-sm"}>
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-deep-ink/5 last:border-0">
            <span className="text-body-sm text-slate capitalize">{key.replace(/_/g, " ")}</span>
            {editMode ? (
              <input
                value={editedData[key] ?? ""}
                onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
                className="input-pill px-4 py-2.5 text-body-sm w-full sm:w-[300px]"
              />
            ) : (
              <span className="text-body-sm text-deep-ink font-mono">{String(value)}</span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-caption text-slate">Some settings may require server restart to take effect.</p>
    </div>
  );
}