# PteroControl — Panduan Edit & Deploy

Proyek ini adalah aggregator dashboard untuk Pterodactyl Panel.
Semua panel dari berbagai penyedia digabung jadi satu tabel.
API key terenkripsi AES-256-CBC, tidak pernah disimpan polos di database.

---

## Struktur Folder

```
PteroControl/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + SEO metadata
│   │   ├── page.tsx            # Landing page (beranda)
│   │   ├── dashboard/page.tsx  # Dashboard utama (etalase publik + live)
│   │   ├── login/page.tsx      # Login form
│   │   ├── register/page.tsx   # Register form
│   │   ├── panels/page.tsx     # Kelola panel (tambah/hapus/edit)
│   │   ├── admin/page.tsx      # Admin inbox (approve/reject user)
│   │   ├── akun/page.tsx       # Ganti password user
│   │   ├── api/proxy/route.ts  # Proxy endpoint ke panel Pterodactyl
│   │   └── server/[panelId]/[identifier]/page.tsx  # Detail server + 8 modul kontrol
│   ├── components/
│   │   ├── mobile-menu.tsx     # Hamburger menu untuk mobile
│   │   ├── toast.tsx           # Toast notification + confirm dialog
│   │   ├── dashboard-table.tsx # Tabel server dengan search & filter
│   │   ├── auth-forms.tsx      # Form login/register dengan validasi inline
│   │   ├── panel-forms.tsx     # Form tambah/edit/hapus panel + validasi
│   │   ├── akun-form.tsx       # Form ganti password + validasi
│   │   ├── realtime.tsx        # Realtime sync via Supabase
│   │   └── server/
│   │       ├── power-module.tsx      # Start/Stop/Restart/Kill
│   │       ├── console-module.tsx    # Terminal console (WebSocket)
│   │       ├── files-module.tsx      # File manager (CRUD)
│   │       ├── databases-module.tsx  # Database management
│   │       ├── backups-module.tsx    # Backup management
│   │       ├── schedules-module.tsx  # Schedule management
│   │       ├── settings-module.tsx   # Server settings editor
│   │       └── allocations-module.tsx # IP allocation management
│   └── lib/
│       ├── actions/
│       │   ├── auth-actions.ts     # Register/login/logout/admin decide
│       │   └── server-actions.ts   # Sync servers dari panel ke DB
│       ├── auth.ts                 # getSessionUser, requireApprovedUser, requireAdmin
│       ├── encryption.ts           # AES-256-CBC encrypt/decrypt
│       ├── pterodactyl.ts          # Fetch & aggregate panel data
│       └── supabase/
│           ├── client.ts           # Client-side Supabase
│           └── server.ts           # Server-side Supabase
├── supabase/schema.sql             # Database schema (jalankan di Supabase)
├── public/icon.svg                 # Favicon
├── public/og.svg                   # Open Graph image
├── next.config.ts
├── package.json
└── .env.local                      # SUPABASE URL + KEY, ENCRYPTION_KEY, ADMIN_EMAIL
```

---

## Cara Deploy / Nyalain Server

### Lokal Development
```bash
cd ~/PteroControl
npm run dev
# Buka: http://localhost:3000
```

### Build Production
```bash
npm run build   # Compile & optimasi
npm start       # Jalankan production server
```

### Deploy ke Vercel
```bash
vercel --prod --yes
# Atau: vercel --prod (interactive)
```

### Stop Dev Server
```bash
pkill -f "next dev"
pkill -f "next-server"
# Atau kill manual:
ps aux | grep next | grep -v grep
kill -9 <PID>
```

---

## Skema Database (Supabase)

Jalankan SQL ini di Supabase Dashboard > SQL Editor:

```sql
-- Table profiles (otomatis dibuat trigger)
-- id = auth.users.id
-- role: ADMIN | USER
-- status: PENDING | APPROVED | REJECTED

-- Table linked_panels (panel Pterodactyl milik user)
-- encrypted_api_key: format iv:ciphertext (AES-256-CBC)

-- Table server_links (server yang disinkronkan dari panel)
-- id: UUID primary
-- panel_id: FK → linked_panels.id
-- user_id: FK → profiles.id
-- identifier: string (Pterodactyl server ID)
-- name: string
-- state: 'online' | 'offline' | 'starting' | 'stopping' | 'restarting'
-- memory_limit, cpu_limit, disk_limit: integer
```

**RLS Policies aktif:**
- `profiles_select`: user hanya bisa lihat data diri sendiri atau admin
- `linked_panels_select/insert/update/delete`: user hanya akses miliknya
- `server_links_select/insert/update/delete`: user hanya akses miliknya

---

## Flow Auth

1. **Register** → `PENDING`
2. **Admin approve** di `/admin` → jadi `APPROVED`
3. **Login** → redirect ke `/dashboard` (live mode)
4. **Tambah panel** di `/panels` → auto-sync servers ke `server_links`
5. **Dashboard** → tampilkan server cards clickable
6. **Klik server** → masuk `/server/[id]/[identifier]` → kontrol 8 modul

**Admin** ditentukan oleh environment variable `ADMIN_EMAIL` di `.env.local`.
Email yang sama saat register otomatis dapat role ADMIN + status APPROVED.

---

## API Proxy

Endpoint: `POST /api/proxy`

Request body:
```json
{
  "panelId": "<server_link_id>",
  "identifier": "<pterodactyl_server_identifier>",
  "path": "<api_path>",
  "method": "GET|POST|PUT|PATCH|DELETE",
  "data": {}  // optional, untuk POST/PUT/PATCH
}
```

Contoh — Start server:
```json
{
  "panelId": "uuid-server-link",
  "identifier": "abc123",
  "path": "signals/start",
  "method": "POST"
}
```

Proxy akan:
1. Cek ownership (apakah user punya server_link ini)
2. Decrypt API key dari database
3. Forward request ke `{panel_url}/api/client/servers/{identifier}/{path}`
4. Return response ke client

---

## 8 Modul Kontrol

| Modul | Fungsi | Endpoint API |
|-------|--------|--------------|
| Power | Start/Stop/Restart/Kill | `signals/{action}` |
| Console | Terminal WebSocket | `websocket` (perlu token) |
| Files | List/Read/Edit/Upload/Delete | `files/list`, `files/content`, `files/delete` |
| Databases | List/Create/Delete | `databases` |
| Backups | Create/Download/Delete | `backups` |
| Schedules | List/Toggle/Delete | `schedules` |
| Settings | View/Edit startup | `settings` |
| Allocations | Set primary/Delete | `connections` |

Catatan: Console WebSocket memerlukan token tambahan dari panel API.
Untuk akses penuh, gunakan panel langsung atau implement WebSocket proxy.

---

## Environment Variables (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Encryption
ENCRYPTION_KEY=rahasia-kamu-panjang-min-32-karakter

# Admin
ADMIN_EMAIL=admin@email.com
```

**PENTING:**
- `ENCRYPTION_KEY` harus sama di semua environment (lokal & Vercel)
- Jika diganti, semua API key lama tidak bisa didekripsi lagi
- Generate kunci aman: `openssl rand -hex 32`

---

## Troubleshooting

### Dashboard kosong setelah tambah panel
- Pastikan `syncServers()` berjalan (cek console log)
- Pastikan `server_links` table sudah dibuat di Supabase
- Refresh halaman, tunggu beberapa detik

### Proxy return 403 Unauthorized
- User tidak punya akses ke server tersebut
- Cek apakah server sudah tersinkronisasi ke `server_links`

### Proxy return 500
- Cek console log di Vercel untuk detail error
- Pastikan API key panel valid dan memiliki izin Client API

### Server tidak muncul di dashboard
- Jalankan manual sync: panggil endpoint atau tambah panel ulang
- Cek timeout 10 detik — jika panel lambat, mungkin timeout

### Build error TypeScript
- Coba `rm -rf .next && npm run build`
- Pastikan semua import path benar

---

## Tips Edit

### Ubah warna / tema
Edit di `src/app/globals.css`:
- `--color-midnight-canvas`: background utama
- `--color-void-violet`: warna tombol CTA
- `--color-frost-glow`: warna teks utama

### Tambah modul kontrol baru
1. Buat file baru di `src/components/server/nama-modul.tsx`
2. Import & pasangkan di `src/app/server/[panelId]/[identifier]/page.tsx`
3. Tambah tab di array `TABS`

### Ubah flow approval
Edit di `src/lib/actions/auth-actions.ts`:
- Fungsi `register()` dan `decideUser()`
- Bisa ubah jadi auto-approve atau tambahkan step verifikasi

### Ganti font
Edit di `src/app/layout.tsx` — pakai Google Fonts lain atau local font.

---

## Commands Cepat

```bash
# Nyalain dev
cd ~/PteroControl && npm run dev

# Build production
npm run build

# Deploy ke Vercel
vercel --prod --yes

# Cek log production
vercel logs

# Restart deploy
vercel --prod --yes --force

# Lihat status git
git status
git log --oneline -5

# Push perubahan
git add -A
git commit -m "pesan perubahan"
git push origin main
```

---

## Links Penting

- **Production**: https://pterocontrol.vercel.app
- **Vercel Dashboard**: https://vercel.com/voiddarkfire/pterocontrol
- **Supabase Dashboard**: https://supabase.com/dashboard/project
- **GitHub**: https://github.com/khamimzarr/pterocontrol

---

Dibuat oleh PteroControl Team — Agustus 2025
