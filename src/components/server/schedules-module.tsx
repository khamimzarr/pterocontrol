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
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: "schedules", method: "GET" }),
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
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: `schedules/${scheduleId}`, method: "PATCH", data: { is_active: active } }),
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
        body: JSON.stringify({ panelId: server.panel_id, identifier, path: `schedules/${scheduleId}`, method: "DELETE" }),
      });
      if (!res.ok) throw new Error("Failed");
      push("Schedule deleted", "ok");
      fetchSchedules();
    } catch (error) {
      push(error instanceof Error ? error.message : "Failed", "err");
    }
  };

  return (
    <div className="glass-card rounded-[16px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-[16px] text-white">Schedules</h2>
        <button onClick={() => setShowCreate(!showCreate)} className="flash-violet rounded-full px-4 py-2 text-[13px] font-medium text-white">+ New Schedule</button>
      </div>

      {showCreate && (
        <div className="mb-4 p-4 bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.12)] rounded-[12px] space-y-3">
          <input value={newSchedule.name} onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })} placeholder="Schedule name" className="auth-input w-full px-3 py-2 text-[13px]" />
          <div className="grid grid-cols-5 gap-2">
            {["minute", "hour", "day_of_month", "month", "day_of_week"].map((field) => (
              <input key={field} value={String(newSchedule[field as keyof typeof newSchedule])} onChange={(e) => setNewSchedule({ ...newSchedule, [field]: e.target.value })} placeholder={field.replace("_", " ")} className="auth-input px-3 py-2 text-[12px]" />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => push("Schedule creation requires full API implementation", "err")} className="flash-violet rounded-full px-4 py-2 text-[12px] font-medium text-white">Create</button>
            <button onClick={() => setShowCreate(false)} className="pill-ghost rounded-full px-4 py-2 text-[12px] font-medium text-white">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {schedules.length === 0 ? (
          <div className="text-[#9da7ba] text-[13px] py-8 text-center">No schedules configured</div>
        ) : schedules.map((schedule: any) => (
          <div key={schedule.id} className={`flex items-center justify-between p-3 border rounded-[10px] ${schedule.is_active ? "bg-[rgba(40,200,64,0.06)] border-[rgba(40,200,64,0.15)]" : "bg-[rgba(199,211,234,0.04)] border-[rgba(186,215,247,0.08)]"}`}>
            <div>
              <div className={`text-[13px] font-medium ${schedule.is_active ? "text-[#28c840]" : "text-[#9da7ba]"}`}>{schedule.name}</div>
              <div className="text-[11px] text-[#9da7ba]">{schedule.minute} {schedule.hour} {schedule.day_of_month} {schedule.month} {schedule.day_of_week} · {schedule.is_active ? "Active" : "Inactive"}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleSchedule(schedule.id, !schedule.is_active)} className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${schedule.is_active ? "pill-ghost text-[#e46d4c]" : "flash-violet text-white"}`}>
                {schedule.is_active ? "Disable" : "Enable"}
              </button>
              <button onClick={() => deleteSchedule(schedule.id)} className="text-[#e46d4c] hover:text-[#ff7d6a] text-[12px]">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
