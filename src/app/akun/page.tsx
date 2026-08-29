export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { changePassword, logout } from "@/lib/actions/auth-actions";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  return (
    <nav className="sticky top-0 z-50 h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]">
          <span className="grid place-items-center w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-[11px]">◈</span>
          PteroControl
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[12px] tracking-[-0.12px] text-[#1d1d1f]">
          <Link href="/dashboard" className="hover:text-[#707070] transition-colors">
            Dasbor
          </Link>
          <Link href="/panels" className="hover:text-[#707070] transition-colors">
            Panel
          </Link>
          {isAdmin && (
            <Link href="/admin" className="hover:text-[#707070] transition-colors">
              Admin
            </Link>
          )}
          <Link href="/akun" className="font-medium text-[#0071e3]">
            Akun
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[12px] tracking-[-0.12px] text-[#707070] truncate max-w-[160px]">{email}</span>
          <form action={logout}>
            <button className="inline-flex rounded-full border border-[#d6d6d6] text-[#1d1d1f] text-[12px] font-medium px-3 py-1.5 hover:bg-[#f5f5f7] transition-colors">
              Keluar
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default async function AkunPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireApprovedUser();
  const sp = await searchParams;
  const err = sp.error;
  const success = sp.success === "1";
  let errMsg: string | null = null;
  if (err) {
    if (err === "pendek") errMsg = "Kata sandi minimal 8 karakter ya, bung.";
    else if (err === "tidakcocok") errMsg = "Konfirmasi kata sandi tidak cocok.";
    else errMsg = decodeURIComponent(err);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />

      <section className="bg-white border-b border-[#e8e8ed]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 md:py-10">
          <p className="text-[12px] font-medium tracking-[0.04em] text-[#b64400]">Akun · {user.role} · {user.status}</p>
          <h1 className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[32px] md:text-[40px] leading-[36px] md:leading-[48px] tracking-[0.128px] text-[#1d1d1f]">
            Atur
            <br />
            akunmu.
          </h1>
          <p className="mt-3 text-[14px] leading-[18px] tracking-[-0.224px] text-[#707070] max-w-[560px]">
            Masuk sebagai <span className="font-medium text-[#1d1d1f]">{user.email}</span> · Role {user.role} · Status {user.status} · Ganti kata sandimu di sini.
          </p>
        </div>
      </section>

      <section className="flex-1 py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="max-w-[520px] rounded-[28px] bg-white p-7 md:p-10 border border-[#e8e8ed]">
            <h2 className="font-[var(--font-sf-pro-display)] font-semibold text-[21px] leading-[29px] tracking-[0.011em] text-[#1d1d1f]">Ganti kata sandi</h2>
            <p className="mt-1 text-[12px] tracking-[-0.12px] text-[#707070]">Minimal 8 karakter. Perubahan langsung aktif.</p>

            {success && (
              <div className="mt-6 rounded-[18px] bg-[#f0faf0] border border-[#c8e8c8] px-4 py-3 text-[13px] leading-5 tracking-[-0.12px] text-[#1a6b1a]">
                Kata sandi berhasil diganti, bung! ✅
              </div>
            )}
            {errMsg && (
              <div className="mt-6 rounded-[18px] bg-[#fff1f0] border border-[#ffd7d5] px-4 py-3 text-[13px] leading-5 tracking-[-0.12px] text-[#b64400]">
                {errMsg}
              </div>
            )}

            <form action={changePassword} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">Kata sandi baru</span>
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-3 text-[17px] leading-none tracking-[-0.022em] text-[#1d1d1f] placeholder:text-[#707070] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">Ulangi kata sandi baru</span>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Ulangi kata sandi"
                  className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-3 text-[17px] leading-none tracking-[-0.022em] text-[#1d1d1f] placeholder:text-[#707070] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
                />
              </label>
              <button
                type="submit"
                className="w-full mt-2 inline-flex items-center justify-center rounded-full bg-[#0071e3] text-white text-[17px] font-normal tracking-[-0.022em] px-5 py-3 hover:bg-[#0077ed] active:bg-[#006edb] transition-colors"
              >
                Simpan kata sandi baru
              </button>
            </form>

            <p className="mt-6 text-center text-[12px] tracking-[-0.12px] text-[#707070]">
              <Link href="/dashboard" className="text-[#0066cc] hover:underline">
                ← Kembali ke dasbor
              </Link>
            </p>
          </div>

          <div className="mt-6 max-w-[520px] rounded-[28px] bg-[#1d1d1f] p-6 md:p-8 text-white">
            <p className="text-[12px] font-medium tracking-[0.04em] text-white/60">Info akun</p>
            <p className="mt-2 font-mono text-[12px] tracking-[-0.12px] text-white/80 break-all">{user.id}</p>
            <p className="mt-1 text-[12px] tracking-[-0.12px] text-white/60">{user.email} · {user.role} · {user.status}</p>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-[#d6d6d6] py-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-wrap gap-x-6 gap-y-2 text-[12px] tracking-[-0.12px] text-[#707070]">
          <Link href="/dashboard" className="hover:text-[#1d1d1f] hover:underline">
            Dasbor
          </Link>
          <span className="text-[#d6d6d6]">·</span>
          <span>Supabase Auth · RLS</span>
        </div>
      </footer>
    </div>
  );
}
