"use client";
import { useState } from "react";
import { decideUser } from "@/lib/actions/auth-actions";
import { ConfirmDialog, useToast } from "@/components/toast";

interface RequestUser {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export function AdminActions({ requests }: { requests: RequestUser[] }) {
  const [open, setOpen] = useState<null | { userId: string; action: "APPROVE" | "REJECT"; email: string }>(null);
  const { push } = useToast();
  
  const onConfirm = async (userId: string, action: "APPROVE" | "REJECT", email: string) => {
    const fd = new FormData();
    fd.set("userId", userId);
    fd.set("action", action);
    await decideUser(fd);
    push(action === "APPROVE" ? `Approved ${email}` : `Rejected ${email}`, action === "APPROVE" ? "ok" : "err");
  };
  
  if (!requests || requests.length === 0) {
    return <div className="text-center text-slate py-8">No pending requests</div>;
  }
  
  return (
    <div className="space-y-3">
      {requests.map((req) => (
        req.status === "PENDING" && (
          <div key={req.id} className="rounded-xl bg-white p-5 border border-deep-ink/5 flex justify-between items-center gap-4">
            <div>
              <p className="font-medium text-body text-deep-ink">{req.email}</p>
              <p className="text-caption text-slate mt-1">
                Joined {new Date(req.created_at).toLocaleDateString()} · Role: {req.role}
              </p>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => setOpen({ userId: req.id, action: "APPROVE", email: req.email })}
                className="btn-primary py-2 px-4 text-sm font-medium"
              >
                Approve
              </button>
              <button 
                onClick={() => setOpen({ userId: req.id, action: "REJECT", email: req.email })}
                className="btn-secondary py-2 px-4 text-sm font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        )
      ))}
      
      {open && (
        <ConfirmDialog
          open={true}
          title={open.action === "APPROVE" ? `Approve ${open.email}?` : `Reject ${open.email}?`}
          desc={open.action === "APPROVE" 
            ? "User can immediately access dashboard and panels." 
            : "User will be redirected to login with rejected message."
          }
          confirmLabel={open.action === "APPROVE" ? "Approve" : "Reject"}
          onClose={() => setOpen(null)}
          onConfirm={() => onConfirm(open.userId, open.action, open.email)}
        />
      )}
    </div>
  );
}
