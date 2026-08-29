# PteroControl — Design Spec

**Tanggal:** 2025-08-29
**Status:** Draft untuk review pengguna
**Tipe:** Panel-as-a-Service / Agregator Dashboard untuk Pterodactyl Game Servers

## 1. Ringkasan

PteroControl adalah aplikasi Next.js (App Router) yang mengagregasi beberapa panel
Pterodactyl milik pengguna ke dalam satu dashboard terpadu. Pengguna mendaftar,
menunggu persetujuan admin, lalu menautkan banyak Client API Key Pterodactyl dari
berbagai host/panel. API Key dienkripsi (zero-knowledge) sebelum masuk database.

## 2. Tujuan & Kriteria Kesuksesan

- Pengguna dapat mendaftar, lalu hanya dapat mengakses dashboard setelah statusnya `APPROVED`.
- Admin (akun tetap `khamimzar@gmail.com`) dapat melihat antrian pending dan menyetujui/menolak user.
- Pengguna yang disetujui dapat menambah/mengedit/menghapus koneksi panel.
- API Key Pterodactyl tidak pernah tersimpan dalam plaintext; hanya dideskripsi dalam memori server saat fetch.
- Dashboard menyatukan data semua panel milik user dalam satu grid/table.

## 3. Keputusan Arsitektur (yang telah disepakati)

- **Auth:** Supabase Auth (email/password + sesi). Supabase menangani hashing `password`.
- **Tabel user:** `profiles` (mengacu `auth.users.id`). Satu tabel, kolom `role` & `status`.
- **Admin:** Ditentukan oleh `ADMIN_EMAIL` di env. Saat register/seed, email `khamimzar@gmail.com`
  otomatis `role=ADMIN`, `status=APPROVED`. Pengguna lain `role=USER`, `status=PENDING`.
- **Pembuatan profil:** Trigger SQL di `auth.users` sebagai jaring pengaman (auto-copy email + set role/status).
- **Enkripsi:** AES-256-CBC via Node `crypto`. Master key di `ENCRYPTION_KEY` (env).
- **Framework:** Next.js (App Router) + Tailwind CSS + Supabase JS Client (PostgREST) + Vercel.
- **Catatan Prisma:** Prisma tidak berfungsi di Termux/aarch64 (native engines x86_64 tidak tersedia
  untuk platform Android). Keputusan teknis: gunakan **Supabase JS Client** murni JavaScript untuk
  semua akses data. Skema SQL dijalankan manual di Supabase SQL Editor (file `supabase/schema.sql`).

## 4. Skema Database (SQL untuk Supabase)

Skema dijalankan manual di **Supabase SQL Editor** (file `supabase/schema.sql`).

```sql
-- Tipe enum
create type user_role   as enum ('ADMIN', 'USER');
create type user_status as enum ('PENDING', 'APPROVED', 'REJECTED');

-- Tabel profil pengguna (id = auth.users.id)
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text unique not null,
  role       user_role   not null default 'USER',
  status     user_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabel koneksi panel Pterodactyl
create table public.linked_panels (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  panel_name       text not null,
  panel_url        text not null,
  encrypted_api_key text not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_linked_panels_user on public.linked_panels(user_id);

-- Row Level Security (aktifkan)
alter table public.profiles     enable row level security;
alter table public.linked_panels enable row level security;

-- Fungsi bantu: apakah requestor adalah admin
create or replace function public.is_admin()
returns boolean
language sql security definer set search_path = public
as $$
  select coalesce(
    (select role = 'ADMIN' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Kebijakan: user hanya bisa baca/tulis miliknya sendiri
create policy "select own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "admin read profiles" on public.profiles
  for select using (public.is_admin());
create policy "admin change status" on public.profiles
  for update using (public.is_admin());

create policy "select own panels" on public.linked_panels
  for select using (auth.uid() = user_id);
create policy "insert own panels" on public.linked_panels
  for insert with check (auth.uid() = user_id);
create policy "update own panels" on public.linked_panels
  for update using (auth.uid() = user_id);
create policy "delete own panels" on public.linked_panels
  for delete using (auth.uid() = user_id);

-- Aktifkan Realtime (opsional)
alter publication supabase_realtime add table public.linked_panels;
```

### Trigger SQL (jaring pengaman pembuatan profil)

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, status)
  values (
    new.id,
    new.email,
    case
      when new.email = current_setting('app.admin_email', true) then 'ADMIN'
      else 'USER'
    end,
    case
      when new.email = current_setting('app.admin_email', true) then 'APPROVED'
      else 'PENDING'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

Catatan: `ADMIN_EMAIL` diteruskan via `current_setting('app.admin_email', true)`; pada sisi
aplikasi kita set parameter tersebut di koneksi Supabase. Apabila trigger terlalu rumit,
fallback-nya adalah pembuatan profil dari sisi aplikasi pada Server Action register.

## 5. Enkripsi Zero-Knowledge

File `lib/encryption.ts`:

- `encrypt(plaintext)` → mengembalikan string base64 `iv:ciphertext` menggunakan AES-256-CBC, kunci dari `ENCRYPTION_KEY` (harus 32 byte → di-hash via SHA-256 agar konsisten).
- `decrypt(payload)` → membalik proses.
- Hanya dipanggil di server (Server Actions / Route Handlers). Key tidak pernah dikirim ke klien.

## 6. Alur Server & Autentikasi

### Alur Register
1. `signUp` Supabase Auth (email + password).
2. Trigger membuat baris `profiles`.
3. `ADMIN_EMAIL` → langsung `APPROVED`; lainnya `PENDING`.
4. Sesi dibuat. Frontend mengecek status: jika PENDING, tampilkan layar "menunggu persetujuan".

### Alur Login
1. `signIn` Supabase Auth.
2. Ambil `profiles` dari database.
3. Jika `PENDING`/`REJECTED` → tampilkan peringatan, jangan akses dashboard.
4. Jika `APPROVED` → akses dashboard.
5. Jika `role=ADMIN` → lihat menu Admin Inbox.

### Admin Inbox
- Daftar user `PENDING`/`REJECTED`.
- Tombol "Approve" / "Reject" memanggil Server Action untuk update `status`.

### Dashboard Agregator
- Server Component mengambil semua `linked_panels` milik user.
- Untuk tiap panel: `decrypt(encryptedApiKey)` di memori server, lalu fetch
  `GET {panelUrl}/api/client` dengan header `Authorization: Bearer <key>` dan `Accept: application/json`.
- Flatten hasil `attributes` menjadi satu grid.
- Tampilkan kolom: Nama server, Node, Memory Limit, CPU Limit, dan identitas Panel asal.
- Menggunakan Promise.allSettled agar satu panel gagal tidak menggagalkan yang lain.

### Manajemen Koneksi Panel
- Add/Edit/Delete via Server Actions. API key dienkripsi sebelum insert/update.
- Form memvalidasi URL. Opsional: tes koneksi saat menyimpan.

## 7. Struktur Direktori (target)

```
PteroControl/
  prisma/schema.prisma
  lib/
    supabase/        # klien server & browser
    encryption.ts    # AES-256-CBC
    pterodactyl.ts   # fetch + flatten
  app/
    layout.tsx
    page.tsx                    # landing
    login/page.tsx
    register/page.tsx
    dashboard/page.tsx          # protected: APPROVED user (aggregator)
    panels/page.tsx             # kelola koneksi panel
    admin/page.tsx              # admin inbox (pending users)
  middleware.ts                 # guard sesi & status
```

## 8. Error Handling

- Fetch panel gagal → kartu/tabel menampilkan status error per panel, bukan merusak keseluruhan.
- Sesi invalid / status tidak sesuai → redirect ke halaman yang tepat.
- Akses Admin Inbox oleh non-admin → redirect / 404.

## 9. Testing

- Test unit fungsi `encrypt`/`decrypt` (round-trip) dengan Node test runner.
- Test unit `pterodactyl.flattenServers` untuk hasil fetch Pterodactyl → struktur agregat.
- Uji manual alur auth (register pending → approve → login → dashboard).

## 10. Batasan Lingkup (YAGNI)

- Tidak ada billing/payment.
- Tidak ada manajemen tipe-kontrol server (start/stop) — hanya agregasi data baca.
- Tidak ada multi-super-admin; cukup satu admin via `ADMIN_EMAIL`.
- Tidak ada OAuth sosial.

## 11. Deployment

- Vercel CLI. Env: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ENCRYPTION_KEY`, `ADMIN_EMAIL`.
- Prisma migrate diterapkan sebelum deploy. Supabase project harus dibuat terlebih dahulu (oleh pengguna, karena butuh login akun).