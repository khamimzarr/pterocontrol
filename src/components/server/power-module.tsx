"use client";
import { useState } from "react";
import { ConfirmDialog, useToast } from "@/components/toast";

interface PowerModuleProps {
  server: any;
  identifier: string;
}

export function PowerModule({ server, identifier }: PowerModuleProps) {
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
          panelId: server.id,
          identifier,
          path: "power",
          method: "POST",
          data: { signal },
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

  const actionStyles: Record<string, string> = {
    green: "btn-primary",
    red: "rounded-full bg-[#e46d4c]/10 border border-[#e46d4c]/30 text-[#e46d4c] hover:bg-[#e46d4c]/20 transition-colors",
    yellow: "btn-secondary",
    orange: "rounded-full bg-surface-soft-meadow border border-deep-ink/10 text-slate hover:bg-surface-canvas transition-colors",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
        <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink mb-6">Power Control</h2>
        
        {/* Status */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`w-3 h-3 rounded-full ${state === "online" ? "bg-[#59e25d] animate-pulse-dot" : state === "starting" ? "bg-hi-yellow animate-pulse-dot" : state === "stopping" ? "bg-[#e46d4c]" : "bg-slate"}`} />
          <span className="text-body text-deep-ink font-medium capitalize">{state || "unknown"}</span>
          <span className="text-caption text-slate ml-2">State ID: {server.identifier}</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((act) => (
            <button
              key={act.action}
              onClick={() => sendSignal(act.action)}
              disabled={loading !== null || act.disabled}
              className={`py-3 px-4 text-body-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${actionStyles[act.color]}`}
            >
              {loading === act.action ? "..." : act.label}
            </button>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction === "start"}
        title="Start server?"
        desc="The server will be powered on."
        confirmLabel="Start"
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmSignal("start")}
      />
      <ConfirmDialog
        open={confirmAction === "stop"}
        title="Stop server?"
        desc="The server will be powered off. Running processes will be stopped."
        confirmLabel="Stop"
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmSignal("stop")}
      />
      <ConfirmDialog
        open={confirmAction === "restart"}
        title="Restart server?"
        desc="The server will be restarted. Brief downtime expected."
        confirmLabel="Restart"
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmSignal("restart")}
      />
      <ConfirmDialog
        open={confirmAction === "kill"}
        title="Kill server?"
        desc="The process will be force-stopped. Data may be lost."
        confirmLabel="Kill"
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmSignal("kill")}
      />
    </div>
  );
}