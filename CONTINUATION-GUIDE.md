# Pterodactyl Control Panel — Continuation Guide

**Created:** 2026-01  
**Status:** In Progress (Design Transformation Phase 4)  
**Live URL:** https://pterocontrol.vercel.app

---

## 🎯 Project Overview

A Pterodactyl Game Server management dashboard aggregator with:
- Multi-panel aggregation (one view for all panels)
- AES-256 encrypted API keys
- Zero-knowledge architecture
- Admin approval flow
- Real-time server monitoring

---

## ✅ Completed Work

### 1. Design Transformation (Ditto Theme)
**Status:** COMPLETE - All pages transformed

| Component | Status | Notes |
|-----------|--------|-------|
| Landing page `/` | ✅ | Full Ditto theme, organic blobs, hero section |
| Login `/login` | ✅ | Light theme, pill inputs, yellow CTA |
| Register `/register` | ✅ | Pending state + registration form |
| Dashboard `/dashboard` | ✅ | Live data aggregation, stats grid |
| Panels `/panels` | ✅ | Add/Edit/Delete panel forms |
| Admin `/admin` | ✅ | User approval management |
| Account `/akun` | ✅ | Profile/password change |
| Server detail `/server/[panelId]/[identifier]` | ✅ | Power control, console, files |
| Loading states | ✅ | Skeleton loaders in light theme |

### 2. Components Transformed
- `auth-forms.tsx` - Login/register forms
- `panel-forms.tsx` - Add/edit/delete panel
- `dashboard-table.tsx` - Server table with search/filter
- `mobile-menu.tsx` - Mobile navigation
- `toast.tsx` - Toast notifications + confirm dialogs
- `akun-form.tsx` - Account settings
- `admin-actions.tsx` - Admin approval actions
- `server/*.tsx` - 8 server control modules

### 3. CSS System
- Custom properties (colors, spacing, typography)
- Component styles (buttons, inputs, cards, nav)
- Animation keyframes (blob float, reveal, etc.)
- Responsive breakpoints

---

## 🔴 Current Issues

### Issue #1: Dashboard Crash (FIXED but needs verification)
**Symptom:** After adding panel, dashboard shows "This page couldn't load"

**Root Cause:** `syncServers()` called during render triggered `revalidatePath("/dashboard")` which is unsupported in Next.js render path → crash

**Fix Applied:**
- Removed `await syncServers()` from dashboard render
- Removed unused import
- Added comment explaining architectural decision

**Verification Needed:**
- [ ] Test live dashboard after login with approved account
- [ ] Confirm servers appear from aggregation
- [ ] Check no new errors in Vercel logs

**Files Modified:**
- `src/app/dashboard/page.tsx`

---

### Issue #2: Missing `server_links` Table (FIXED)
**Symptom:** Upsert error logged but non-fatal

```
Upsert error: { code: 'PGRST205', message: "Could not find the table 'public.server_links' in the schema cache" }
```

**Impact:** Server control cards feature was disabled.

**Fix Applied:**
- Created `server_links` table in Supabase with RLS.
- Implemented `<ServerSyncTrigger />` client component on Dashboard to safely trigger the `syncServers()` Server Action on initial load without blocking render or crashing Next.js.
- Feature is now fully active.

---

## 📋 Remaining Tasks

### High Priority
- [ ] Verify dashboard fix after user tests
- [x] Create `server_links` table in Supabase
- [ ] Test add panel → dashboard flow end-to-end
- [ ] Fix any remaining UI inconsistencies

### Medium Priority
- [ ] Add customer logo trust strip
- [ ] Add testimonial carousel
- [ ] Add FAQ accordion section
- [ ] Implement pricing page (Starter/Pro/Enterprise)
- [ ] Add privacy policy & terms pages

### Low Priority
- [ ] Optimize images/assets
- [ ] Add Google Analytics/PostHog
- [ ] Add Schema.org structured data
- [ ] A/B testing setup
- [ ] Blog integration

---

## 🔧 Development Commands

```bash
# Navigate to project
cd ~/PteroControl

# Install dependencies
npm install

# Development server
npm run dev
# Runs on http://localhost:3000

# Build
npm run build

# Deploy to Vercel
vercel --prod --yes
```

---

## 🗺️ Key Files Reference

### Core Pages
```
src/app/
├── page.tsx              # Landing page
├── layout.tsx            # Root layout
├── globals.css           # Design tokens + component styles
├── dashboard/page.tsx    # Main dashboard
├── panels/page.tsx       # Panel management
├── login/page.tsx        # Login form
├── register/page.tsx     # Registration
├── admin/page.tsx        # Admin approval
├── akun/page.tsx         # Account settings
└── server/[panelId]/[identifier]/page.tsx  # Server controls
```

### Components
```
src/components/
├── auth-forms.tsx        # LoginForm, RegisterForm
├── panel-forms.tsx       # AddPanelForm, EditPanelForm
├── dashboard-table.tsx   # Server table with search/filter
├── mobile-menu.tsx       # Mobile navigation
├── toast.tsx             # Toast notifications
├── admin-actions.tsx     # Admin approve/reject
├── akun-form.tsx         # Password change form
└── server/
    ├── power-module.tsx
    ├── console-module.tsx
    ├── files-module.tsx
    ├── databases-module.tsx
    ├── backups-module.tsx
    ├── schedules-module.tsx
    ├── settings-module.tsx
    └── allocations-module.tsx
```

### Libraries
```
src/lib/
├── auth.ts               # Auth helpers
├── encryption.ts         # AES-256 encryption
├── pterodactyl.ts        # Panel API client
├── supabase/
│   ├── client.ts         # Client-side DB
│   └── server.ts         # Server-side DB
└── actions/
    ├── auth-actions.ts   # Auth mutations
    └── server-actions.ts # Server operations
```

---

## 🎨 Design Tokens Reference

### Colors
```css
--color-deep-ink: #130e30       /* Primary text */
--color-hi-yellow: #ffe228      /* Primary action */
--color-moss-green: #59e25d     /* Decoration only */
--color-fuchsia: #e261e5        /* Decoration only */
--color-slate: #5f5c6e          /* Muted text */
--color-canvas: #f9fbf2         /* Page background */
--color-soft-meadow: #eff2e5    /* Card surfaces */
```

### Typography
- Headlines: `DM Serif Display` (weight: bold)
- Body/UI: `Inter` (weights: 400, 500, 600)
- Code: Monospace fallbacks

### Border Radius
- Buttons/Inputs/Nav: 1440px (pill)
- Cards: 24px
- Images: 24-48px

---

## 🚀 Deployment Checklist

Before deploying any changes:

- [ ] Run `npm run build` and verify no errors
- [ ] Check TypeScript compilation passes
- [ ] Verify no `revalidatePath` during render
- [ ] Test affected pages manually
- [ ] Check Vercel logs for new errors after deploy
- [ ] Update this guide with changes

---

## 📝 Git Workflow

```bash
# Check current branch
git branch

# Current branch should be main
# Make changes, test locally, then push

git add .
git commit -m "feat: description of changes"
git push origin main
```

Vercel auto-deploys on push to main.

---

## 🔐 Authentication Flow

1. User registers → status: PENDING
2. Admin approves → status: APPROVED
3. Approved users can:
   - Access dashboard
   - Add/remove panels
   - View aggregated servers
4. Admins can also:
   - Approve/reject registrations
   - View all users
   - Manage system-wide settings

---

## 💡 Architecture Notes

### Data Flow
```
User adds panel
    ↓
addPanel action → linked_panels table
    ↓
Dashboard reads linked_panels
    ↓
Decrypt API key
    ↓
aggregatePanels() → fetch from each panel's /api/client
    ↓
Flatten results → DashboardTable
```

### Server Links Feature (Currently Disabled)
- Intended: Sync server metadata for quick control
- Blocker: `server_links` table missing
- Decision: Removed render-time sync to prevent crash
- Future: Create table + implement proper sync

---

## 📞 Support & Contact

- **Author:** khamimzarr
- **Team:** voiddarkfire
- **License:** MIT

---

## 📅 Change Log

### 2026-01-XX
- Complete Ditto design transformation
- Fixed dashboard crash (removed revalidatePath during render)
- Documented missing server_links table
- All pages now light theme

### Previous
- Initial dark blueprint theme
- Basic functionality
- Auth flow implemented

---

*Guide last updated: 2026-01*
