"use client";
import { useState } from "react";
import { useToast } from "@/components/toast";

interface SchedulesModuleProps {
  server: any;
  identifier: string;
}

export function SchedulesModule({ server, identifier }: SchedulesModuleProps) {
  const { push } = useToast();
  const [schedules, setSchedules] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ name: "", minute: "*" as string, hour: "*" as string, day_of_month: "*" as string, month: "*" as string, day_of_week: "*" as string, is_active: true });

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.id, identifier, path: "schedules", method: "GET" }),
      });
      if (res.ok) {
        const data = await res.json();
        setSchedules(data.data ?? []);
      }
    } catch {
      push("Failed to fetch schedules", "err");
    }
  };

  const toggleSchedule = async (scheduleId: number, active: boolean) => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.id, identifier, path: `schedules/${scheduleId}`, method: "PATCH", data: { is_active: active } }),
      });
      if (!res.ok) throw new Error("Failed");
      push(active ? "Schedule enabled" : "Schedule disabled", "ok");
      fetchSchedules();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  const deleteSchedule = async (scheduleId: number) => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelId: server.id, identifier, path: `schedules/${scheduleId}`, method: "DELETE" }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Schedule deleted", "ok");
      fetchSchedules();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  return (
    <div className="rounded-xl bg-surface-soft-meadow p-6 md:p-8 border border-deep-ink/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">Schedules</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary py-2 text-body-sm">+ New Schedule</button>
      </div>

      {showCreate && (
        <div className="mb-4 p-4 bg-white border border-deep-ink/5 rounded-lg space-y-3">
          <input value={newSchedule.name} onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })} placeholder="Schedule name" className="input-pill w-full py-3" />
          <div className="grid grid-cols-5 gap-2">
            {["minute", "hour", "day_of_month", "month", "day_of_week"].map((field) => (
              <input key={field} value={String(newSchedule[field as keyof typeof newSchedule])} onChange={(e) => setNewSchedule({ ...newSchedule, [field]: e.target.value })} placeholder={field.replace("_", " ")} className="input-pill px-3 py-3 text-caption" />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => push("Schedule creation requires full API implementation", "err")} className="btn-primary py-2 text-body-sm">Create</button>
            <button onClick={() => setShowCreate(false)} className="btn-secondary py-2 text-body-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {schedules.length === 0 ? (
          <div className="text-slate text-body-sm py-8 text-center">No schedules configured</div>
        ) : schedules.map((schedule: any) => (
          <div key={schedule.id} className={`flex items-center justify-between p-4 border rounded-lg ${schedule.is_active ? "bg-[#59e25d]/5 border-[#59e25d]/20" : "bg-white border-deep-ink/5"}`}>
            <div>
              <div className={`text-body font-medium ${schedule.is_active ? "text-[#59e25d]" : "text-slate"}`}>{schedule.name}</div>
              <div className="text-caption text-slate">{schedule.minute} {schedule.hour} {schedule.day_of_month} {schedule.month} {schedule.day_of_week} · {schedule.is_active ? "Active" : "Inactive"}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleSchedule(schedule.id, !schedule.is_active)} className={`px-4 py-1.5 rounded-full text-body-sm font-medium ${schedule.is_active ? "btn-ghost text-[#e46d4c]" : "btn-primary py-1.5"}`}>
                {schedule.is_active ? "Disable" : "Enable"}
              </button>
              <button onClick={() => deleteSchedule(schedule.id)} className="text-[#e46d4c] hover:text-[#d33] text-body-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}