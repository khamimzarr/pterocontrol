"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { encrypt } from "@/lib/encryption";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- Auth ----------

export async function register(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_REGEX.test(email) || password.length < 8) {
    redirect("/register?error=invalid");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`);

  const userId = data.user?.id;
  if (userId) {
    // Admin is decided by ADMIN_EMAIL (env). Everything else is a normal user.
    const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
    const isAdmin = adminEmail.length > 0 && email === adminEmail;
    await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          role: isAdmin ? "ADMIN" : "USER",
          status: isAdmin ? "APPROVED" : "PENDING",
        },
        { onConflict: "id" }
      )
      .select();

    redirect(isAdmin ? "/dashboard" : "/register?status=pending");
  }

  redirect("/register?status=pending");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);

  // Determine status to decide where to land.
  const user = await supabase.auth.getUser();
  if (user.data.user?.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.data.user.id)
      .maybeSingle();
    if (profile?.status === "PENDING") redirect("/register?status=pending");
    if (profile?.status === "REJECTED") redirect("/login?error=rejected");
    if (profile?.role === "ADMIN") redirect("/admin");
  }
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function changePassword(formData: FormData) {
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) redirect("/akun?error=pendek");
  if (newPassword !== confirmPassword) redirect("/akun?error=tidakcocok");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) redirect(`/akun?error=${encodeURIComponent(error.message)}`);

  redirect("/akun?success=1");
}

// ---------- Admin ----------

const decisionSchema = z.object({ userId: z.string().uuid(), action: z.enum(["APPROVE", "REJECT"]) });

export async function decideUser(formData: FormData) {
  const parsed = decisionSchema.safeParse({
    userId: formData.get("userId"),
    action: formData.get("action"),
  });
  if (!parsed.success) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Verify requestor is admin server-side.
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (me?.role !== "ADMIN") return;

  const status = parsed.data.action === "APPROVE" ? "APPROVED" : "REJECTED";
  await supabase.from("profiles").update({ status }).eq("id", parsed.data.userId);

  revalidatePath("/admin");
}

// ---------- Panels ----------

const panelSchema = z.object({
  panelName: z.string().min(1).max(100),
  panelUrl: z.string().url(),
  apiKey: z.string().min(5),
});

export async function addPanel(formData: FormData) {
  const parsed = panelSchema.safeParse({
    panelName: formData.get("panelName"),
    panelUrl: formData.get("panelUrl"),
    apiKey: formData.get("apiKey"),
  });
  if (!parsed.success) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const encryptedApiKey = encrypt(parsed.data.apiKey);
  await supabase
    .from("linked_panels")
    .insert({
      user_id: user.id,
      panel_name: parsed.data.panelName.trim(),
      panel_url: parsed.data.panelUrl.trim().replace(/\/+$/, ""),
      encrypted_api_key: encryptedApiKey,
    });

  revalidatePath("/dashboard");
  revalidatePath("/panels");
}

export async function deletePanel(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("linked_panels")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/panels");
}

export async function editPanel(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const parsed = panelSchema.safeParse({
    panelName: formData.get("panelName"),
    panelUrl: formData.get("panelUrl"),
    apiKey: formData.get("apiKey"),
  });
  if (!id || !parsed.success) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const encryptedApiKey = encrypt(parsed.data.apiKey);
  await supabase
    .from("linked_panels")
    .update({
      panel_name: parsed.data.panelName.trim(),
      panel_url: parsed.data.panelUrl.trim().replace(/\/+$/, ""),
      encrypted_api_key: encryptedApiKey,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/panels");
}
// (no trailing helper needed)