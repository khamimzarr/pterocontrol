import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface SessionUser {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "PENDING" | "APPROVED" | "REJECTED";
}

/**
 * Returns the authenticated user's profile row, or null if not signed in.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role as SessionUser["role"],
    status: profile.status as SessionUser["status"],
  };
}

/**
 * Require an authenticated, APPROVED user. Redirects to /login otherwise.
 * Throws if there is no valid profile (treated as not approved).
 */
export async function requireApprovedUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.status !== "APPROVED") {
    if (user.status === "REJECTED") redirect("/login?error=rejected");
    redirect("/register?status=pending");
  }
  return user;
}

/**
 * Require an authenticated ADMIN user. Redirects to /dashboard otherwise.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireApprovedUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}