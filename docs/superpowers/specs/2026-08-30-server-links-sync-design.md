# Design Spec: Supabase Server Links & Background Sync

**Date:** 2026-08-30
**Topic:** server-links-sync
**Status:** Approved

## 1. Overview
The PteroControl dashboard requires a `server_links` table in Supabase to maintain server metadata. Currently, this is missing, leading to the server control cards feature being disabled. This design outlines the schema creation and a reliable synchronization mechanism that avoids Next.js Server Component render crashes (Issue #1).

## 2. Architecture

### 2.1 Database Schema (Supabase)
We will run a SQL migration script in Supabase to create the `server_links` table with the following properties:
- **Columns:** `id`, `panel_id`, `user_id`, `identifier`, `name`, `state`, `memory_limit`, `cpu_limit`, `disk_limit`, `created_at`, `updated_at`.
- **Relations:** 
  - `panel_id` references `linked_panels(id)`
  - `user_id` references `auth.users(id)`
- **Constraints:** `UNIQUE(panel_id, identifier)` to prevent duplicates during upserts.
- **RLS Policies:** Standard CRUD policies restricted by `user_id = auth.uid()`.

### 2.2 Server Action (Sync Logic)
A Server Action named `syncServers()` will be created or modified (likely in `src/lib/actions/server-actions.ts`). 
It will:
1. Fetch all `linked_panels` for the authenticated user.
2. Decrypt API keys and query the Pterodactyl API for each panel.
3. Transform the Pterodactyl server data into the `server_links` schema format.
4. Execute a Supabase `.upsert()` call on the `server_links` table.
5. Call `revalidatePath('/dashboard')` upon completion to update the UI.

### 2.3 Dashboard UI Integration (Client-Side Trigger)
To prevent the dashboard crash associated with calling `revalidatePath` during a Server Component render, we will implement a client-side trigger:
1. Create a `<ServerSyncTrigger />` client component (e.g., in `src/components/server-sync-trigger.tsx`).
2. Include a `useEffect` hook that fires exactly once when the component mounts.
3. The hook will invoke the `syncServers()` Server Action asynchronously.
4. Embed `<ServerSyncTrigger />` inside `src/app/dashboard/page.tsx`.

## 3. Benefits & Trade-offs
- **Benefits:** Prevents blocking the initial dashboard load, eliminates the Next.js render crash issue, and ensures data is relatively fresh every time the user visits the dashboard.
- **Trade-offs:** There is a brief window (a few seconds) on initial load where the user might see stale data before the background sync completes and `revalidatePath` updates the UI.

## 4. Implementation Plan (Next Steps)
1. Provide the SQL script to the user so they can execute it in their Supabase project.
2. Develop the `<ServerSyncTrigger />` client component.
3. Update/Implement `syncServers()` Server Action with proper error handling and `revalidatePath`.
4. Inject `<ServerSyncTrigger />` into the dashboard page layout.
