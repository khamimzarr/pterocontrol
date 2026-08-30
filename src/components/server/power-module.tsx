"use client";
import { useState } from "react";
import { ConfirmDialog, useToast } from "@/components/toast";

interface PowerModuleProps {
  server: any;
  serverData: any;
  apiKey: string;
  panelUrl: string;
  identifier: string;
}

export function PowerModule({ server, serverData, apiKey, panelUrl, identifier }: PowerModuleProps) {
  const { push } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [state, setState] = useState(server.state);

  const sendSignal = async (signal: string) => {
    setConfirmAction(signal);
  };

  const confirmSignal = async (signal: string) => {
    setLoading(signal);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelId: server.panel_id,
          identifier,
          path: `signals/${signal}`,
          method: "POST",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }

      push(`Server ${signal.toLowerCase()}`, "ok");
      setState(signal === "restart" ? "restarting" : signal.toLowerCase());
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    } finally {
      setLoading(null);
      setConfirmAction(null);
    }
  };

  const actions = [
    { label: "Start", action: "start", color: "green" as const, disabled: state === "online" || state === "starting" },
    { label: "Stop", action: "stop", color: "red" as const, disabled: state === "offline" || state === "stopping" },
    { label: "Restart", action: "restart", color: "yellow" as const, disabled: !state },
    { label: "Kill", action: "kill", color: "orange" as const, disabled: !state },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-[16px] p-6">
        <h2 className="font-medium text-[16px] text-white mb-4">Power Control</h2>
        
        {/* Status */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`w-3 h-3 rounded-full ${state === "online" ? "bg-[#28c840] animate-pulse-dot" : state === "starting" ? "bg-[#663af3] animate-pulse-dot" : state === "stopping" ? "bg-[#e46d4c]" : "bg-[#707070]"}`} />
          <span className="text-[14px] text-[#c7d3ea] capitalize">{state || "unknown"}</span>
          <span className="text-[12px] text-[#9da7ba] ml-2">State ID: {server.identifier}</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((act) => (
            <button
              key={act.action}
              onClick={() => sendSignal(act.action)}
              disabled={loading !== null || act.disabled}
              className={`rounded-[10px] py-3 px-4 text-[13px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                act.color === "green" ? "flash-violet" :
                act.color === "red" ? "bg-[rgba(228,109,76,0.12)] border border-[rgba(228,109,76,0.22)] text-[#e46d4c] hover:bg-[rgba(228,109,76,0.18)]" :
                act.color === "yellow" ? "bg-[rgba(199,211,234,0.08)] border border-[rgba(186,215,247,0.12)] text-[#d1e4fa] hover:bg-[rgba(199,211,234,0.12)]" :
                "bg-[rgba(228,109,76,0.08)] border border-[rgba(228,109,76,0.15)] text-[#e46d4c] hover:bg-[rgba(228,109,76,0.14)]"
              }`}
            >
              {loading === act.action ? "..." : act.label}
            </button>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction === "start"}
        title="Start server?"
        desc="Server akan dinyalakan."
        confirmLabel="Start"
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmSignal("start")}
      />
      <ConfirmDialog
        open={confirmAction === "stop"}
        title="Stop server?"
        desc="Server akan dimatikan. Process berjalan akan dihentikan."
        confirmLabel="Stop"
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmSignal("stop")}
      />
      <ConfirmDialog
        open={confirmAction === "restart"}
        title="Restart server?"
        desc="Server akan di-restart. Akan downtime sebentar."
        confirmLabel="Restart"
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmSignal("restart")}
      />
      <ConfirmDialog
        open={confirmAction === "kill"}
        title="Kill server?"
        desc="Process akan dihentikan paksa. Data mungkin hilang."
        confirmLabel="Kill"
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmSignal("kill")}
      />
    </div>
  );
}
