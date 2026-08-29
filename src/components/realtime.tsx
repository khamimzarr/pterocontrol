"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RealtimePanels({ userId }: { userId: string }) {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel(`panels-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "linked_panels", filter: `user_id=eq.${userId}` }, () => router.refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, router]);
  return null;
}

export function RealtimeAdmin() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel("admin-profiles")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => router.refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [router]);
  return null;
}
