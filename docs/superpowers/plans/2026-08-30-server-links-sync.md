# Server Links Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a background synchronization mechanism to fetch server data from Pterodactyl and upsert it into the Supabase `server_links` table on dashboard load.

**Architecture:** A client-side trigger (`<ServerSyncTrigger>`) will mount on the dashboard and call a Next.js Server Action (`syncServers()`). This server action fetches user panels, pulls server data from Pterodactyl, and performs a bulk upsert into Supabase before calling `revalidatePath`.

**Tech Stack:** Next.js (App Router), Supabase JS Client, React Server Actions.

## Global Constraints

- Must not use `revalidatePath` inside the server component render phase.
- Use `auth.uid()` for all RLS and Supabase insertions.
- All files must be written in TypeScript.

---

### Task 1: Create Supabase Migration for server_links

**Files:**
- Create: `supabase/migrations/20260830_create_server_links.sql`

**Interfaces:**
- Consumes: `auth.users`, `public.linked_panels`
- Produces: `public.server_links` table

- [ ] **Step 1: Write the SQL migration**

```sql
CREATE TABLE public.server_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id UUID NOT NULL REFERENCES public.linked_panels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  identifier TEXT NOT NULL,
  name TEXT,
  state TEXT DEFAULT 'offline',
  memory_limit INTEGER,
  cpu_limit INTEGER,
  disk_limit INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(panel_id, identifier)
);

ALTER TABLE public.server_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own servers" ON public.server_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own servers" ON public.server_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own servers" ON public.server_links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own servers" ON public.server_links
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_server_links_user_id ON public.server_links(user_id);
CREATE INDEX idx_server_links_panel_id ON public.server_links(panel_id);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/20260830_create_server_links.sql
git commit -m "chore(db): add server_links table migration"
```

---

### Task 2: Implement syncServers Server Action

**Files:**
- Modify: `src/lib/actions/server-actions.ts`

**Interfaces:**
- Consumes: Supabase database, Pterodactyl API client (`aggregatePanels`)
- Produces: `export async function syncServers(): Promise<void>`

- [ ] **Step 1: Write the implementation**

Add this to the end of `src/lib/actions/server-actions.ts` (importing what is needed like `createClient` and `revalidatePath` if not already there):

```typescript
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { aggregatePanels } from '@/lib/pterodactyl'; // Ensure this matches actual pterodactyl fetcher

export async function syncServers() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  // Assuming aggregatePanels() fetches from all panels and returns flattened servers
  // with a panel_id property and attributes
  try {
    const servers = await aggregatePanels();
    
    if (servers && servers.length > 0) {
      const upsertData = servers.map((s: any) => ({
        panel_id: s.panel_id,
        user_id: user.id,
        identifier: s.attributes.identifier,
        name: s.attributes.name,
        state: 'offline', // Default, real-time status requires separate ping
        memory_limit: s.attributes.limits?.memory || 0,
        cpu_limit: s.attributes.limits?.cpu || 0,
        disk_limit: s.attributes.limits?.disk || 0,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('server_links')
        .upsert(upsertData, { onConflict: 'panel_id, identifier' });

      if (error) {
        console.error('Error upserting server_links:', error);
      }
    }
  } catch (err) {
    console.error('Failed to sync servers:', err);
  }

  revalidatePath('/dashboard');
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Passes without errors related to `syncServers`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/actions/server-actions.ts
git commit -m "feat(actions): implement syncServers logic"
```

---

### Task 3: Create ServerSyncTrigger Component

**Files:**
- Create: `src/components/server-sync-trigger.tsx`

**Interfaces:**
- Consumes: `syncServers` from `server-actions.ts`
- Produces: `export function ServerSyncTrigger()`

- [ ] **Step 1: Write the implementation**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { syncServers } from '@/lib/actions/server-actions';

export function ServerSyncTrigger() {
  const synced = useRef(false);

  useEffect(() => {
    if (!synced.current) {
      synced.current = true;
      syncServers().catch(console.error);
    }
  }, []);

  return null;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Passes without errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/server-sync-trigger.tsx
git commit -m "feat(components): create ServerSyncTrigger component"
```

---

### Task 4: Integrate ServerSyncTrigger into Dashboard

**Files:**
- Modify: `src/app/dashboard/page.tsx`

**Interfaces:**
- Consumes: `ServerSyncTrigger`

- [ ] **Step 1: Write the implementation**

Import `ServerSyncTrigger` and add it at the top level of the Dashboard component return statement (or inside the main wrapping `div`):

```tsx
import { ServerSyncTrigger } from '@/components/server-sync-trigger';

// ... inside the default export function Dashboard():
return (
  <main className="min-h-screen bg-[var(--color-canvas)] pb-12">
    <ServerSyncTrigger />
    {/* existing dashboard content */}
  </main>
);
```
*(Note: Match the actual DOM structure of `page.tsx`, simply placing `<ServerSyncTrigger />` at the root of the rendered tree).*

- [ ] **Step 2: Build project to test**

Run: `npm run build`
Expected: Build completes successfully.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -m "feat(dashboard): integrate ServerSyncTrigger to sync data on load"
```
