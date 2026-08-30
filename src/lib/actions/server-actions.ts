"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/auth";

export async function syncServers() {
  const user = await requireApprovedUser();
  const supabase = await createClient();
  
  // Get user's panels
  const { data: panels } = await supabase
    .from("linked_panels")
    .select("id, panel_name, panel_url, encrypted_api_key")
    .eq("user_id", user.id);

  if (!panels || panels.length === 0) {
    return { success: true, synced: 0 };
  }

  let synced = 0;
  
  for (const panel of panels) {
    try {
      // Decrypt API key
      const { decrypt } = await import("@/lib/encryption");
      const apiKey = decrypt(panel.encrypted_api_key);
      
      // Fetch servers from panel
      const res = await fetch(`${panel.panel_url}/api/client`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      });

      if (!res.ok) continue;
      
      const json: any = await res.json();
      
      // Upsert each server
      for (const item of json.data ?? []) {
        const attr = item.attributes;
        await supabase
          .from("server_links")
          .upsert({
            panel_id: panel.id,
            user_id: user.id,
            identifier: attr.identifier,
            name: attr.name,
            state: attr.state ?? "offline",
            memory_limit: attr.limits?.memory ?? null,
            cpu_limit: attr.limits?.cpu ?? null,
            disk_limit: attr.limits?.disk ?? null,
          }, {
            onConflict: "panel_id,identifier",
          })
          .then(({ error }) => {
            if (error) console.error("Upsert error:", error);
          });
        
        synced++;
      }
    } catch (error) {
      console.error(`Failed to sync panel ${panel.id}:`, error);
    }
  }

  revalidatePath("/dashboard");
  return { success: true, synced };
}

export async function deleteServerLink(formData: FormData) {
  const user = await requireApprovedUser();
  const supabase = await createClient();
  
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase
    .from("server_links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

export async function updateServerState(serverId: string, state: string) {
  const user = await requireApprovedUser();
  const supabase = await createClient();
  
  await supabase
    .from("server_links")
    .update({ state, updated_at: new Date().toISOString() })
    .eq("id", serverId)
    .eq("user_id", user.id);
  
  revalidatePath("/dashboard");
}
