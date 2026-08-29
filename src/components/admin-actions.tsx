"use client";
import { useState } from "react";
import { decideUser } from "@/lib/actions/auth-actions";
import { ConfirmDialog, useToast } from "@/components/toast";

export function AdminActions({ userId, email }: { userId: string; email: string; status: string }) {
  const [open, setOpen] = useState<null | "APPROVE" | "REJECT">(null);
  const { push } = useToast();
  const onConfirm = async (action: "APPROVE" | "REJECT") => {
    const fd = new FormData();
    fd.set("userId", userId);
    fd.set("action", action);
    await decideUser(fd);
    push(action === "APPROVE" ? `Approved ${email}` : `Rejected ${email}`, action === "APPROVE" ? "ok" : "err");
  };
  return (
    <>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => setOpen("APPROVE")} className="flash-violet rounded-full px-4 py-2 text-[12px] font-medium text-white">Setujui</button>
        <button onClick={() => setOpen("REJECT")} className="pill-ghost rounded-full px-4 py-2 text-[12px] font-medium text-white">Tolak</button>
      </div>
      <ConfirmDialog
        open={open === "APPROVE"}
        title={`Setujui ${email}?`}
        desc="User bisa langsung buka dasbor & panels."
        confirmLabel="Setujui"
        onClose={() => setOpen(null)}
        onConfirm={() => onConfirm("APPROVE")}
      />
      <ConfirmDialog
        open={open === "REJECT"}
        title={`Tolak ${email}?`}
        desc="User akan dialihkan ke login dengan pesan ditolak."
        confirmLabel="Tolak"
        onClose={() => setOpen(null)}
        onConfirm={() => onConfirm("REJECT")}
      />
    </>
  );
}
