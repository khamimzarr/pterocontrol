export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { decideUser } from "@/lib/actions/auth-actions";
import { logout } from "@/lib/actions/auth-actions";

function TopNav({ email }: { email: string }) {
  return (
    <nav className="sticky top-0 z-50 h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]">
          <span className="grid place-items-center w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-[11px]">◈</span>
          PteroControl <span className="rounded-full bg-[#b64400] text-white px-2 py-0.5 text-[10px] tracking-[0.04em]">ADMIN</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[12px] tracking-[-0.12px] text-[#1d1d1f]">
          <Link href="/dashboard" className="hover:text-[#707070] transition-colors">
            Dasbor
          </Link>
          <Link href="/panels" className="hover:text-[#707070] transition-colors">
            Panel
          </Link>
          <Link href="/akun" className="hover:text-[#707070] transition-colors">
            Akun
          </Link>
          <Link href="/admin" className="font-medium text-[#0071e3]">
            Admin
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

export default async function AdminPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from("profiles")
    .select("id, email, role, status, created_at")
    .in("status", ["PENDING", "REJECTED"])
    .order("created_at", { ascending: true });

  const pendingCount = pending?.filter((u) => u.status === "PENDING").length ?? 0;
  const rejectedCount = pending?.filter((u) => u.status === "REJECTED").length ?? 0;

  const { data: approved } = await supabase.from("profiles").select("id").eq("status", "APPROVED");
  const approvedCount = approved?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <TopNav email={admin.email} />

      <section className="bg-white border-b border-[#e8e8ed]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 md:py-10">
          <p className="text-[12px] font-medium tracking-[0.04em] text-[#b64400]">Admin · Kotak masuk permintaan</p>
          <h1 className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[32px] md:text-[40px] leading-[36px] md:leading-[48px] tracking-[0.128px] text-[#1d1d1f]">
            Permintaan
            <br />
            menunggu.
          </h1>
          <p className="mt-3 text-[14px] leading-[18px] tracking-[-0.224px] text-[#707070] max-w-[560px]">
            Setujui atau tolak user di sini, bung. Cuma <span className="font-mono text-[12px] text-[#1d1d1f]">ADMIN_EMAIL</span> yang bisa akses. Yang disetujui bisa masuk dasbor, yang ditolak balik ke halaman masuk.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1f0] border border-[#ffd7d5] px-4 py-2 text-[12px] font-medium tracking-[-0.12px] text-[#b64400]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b64400]" /> {pendingCount} menunggu
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#e8e8ed] px-4 py-2 text-[12px] tracking-[-0.12px] text-[#707070]">
              {approvedCount} disetujui
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#e8e8ed] px-4 py-2 text-[12px] tracking-[-0.12px] text-[#707070]">
              {rejectedCount} ditolak
            </span>
          </div>
        </div>
      </section>

      <section className="flex-1 py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-6">
          {(!pending || pending.length === 0) ? (
            <div className="rounded-[28px] bg-white p-10 border border-[#e8e8ed] text-center">
              <p className="text-[12px] font-medium tracking-[0.04em] text-[#707070]">Nggak ada permintaan</p>
              <p className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[21px] tracking-[0.011em] text-[#1d1d1f]">
                Kotak masuk kosong.
              </p>
              <p className="mt-2 text-[14px] tracking-[-0.224px] text-[#707070]">Belum ada user menunggu atau ditolak saat ini, bung.</p>
              <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-[#1d1d1f] text-white text-[14px] font-medium px-5 py-2.5 hover:bg-black transition-colors">
                Ke dasbor
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {pending!.map((u) => (
                <div key={u.id} className="rounded-[28px] bg-white p-6 md:p-7 border border-[#e8e8ed] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-[14px] tracking-[-0.224px] text-[#1d1d1f] truncate">{u.email}</p>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-[0.04em] border ${
                          u.status === "PENDING"
                            ? "bg-[#fff1f0] text-[#b64400] border-[#ffd7d5]"
                            : "bg-[#f5f5f7] text-[#707070] border-[#e8e8ed]"
                        }`}
                      >
                        {u.status === "PENDING" ? "MENUNGGU" : "DITOLAK"}
                      </span>
                      <span className="inline-flex rounded-full bg-[#f5f5f7] border border-[#e8e8ed] px-2.5 py-0.5 text-[11px] tracking-[-0.12px] text-[#707070]">
                        {u.role}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[12px] tracking-[-0.12px] text-[#707070] truncate">{u.id}</p>
                    <p className="text-[12px] tracking-[-0.12px] text-[#707070]">{new Date(u.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <form action={decideUser}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="action" value="APPROVE" />
                      <button className="inline-flex rounded-full bg-[#0071e3] text-white text-[13px] font-medium px-5 py-2.5 hover:bg-[#0077ed] active:bg-[#006edb] transition-colors">
                        Setujui
                      </button>
                    </form>
                    <form action={decideUser}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="action" value="REJECT" />
                      <button className="inline-flex rounded-full border border-[#d6d6d6] bg-white text-[#1d1d1f] text-[13px] font-medium px-5 py-2.5 hover:bg-[#f5f5f7] transition-colors">
                        Tolak
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-[28px] bg-[#1d1d1f] p-6 md:p-8 text-white flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div>
              <p className="text-[12px] font-medium tracking-[0.04em] text-white/60">Selanjutnya</p>
              <p className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[17px] tracking-[-0.022em] text-white">
                Setelah disetujui, user bisa masuk dasbor dan hubungkan panel-nya.
              </p>
            </div>
            <Link href="/dashboard" className="shrink-0 inline-flex justify-center rounded-full bg-white text-[#1d1d1f] text-[14px] font-medium px-5 py-2.5 hover:bg-[#f5f5f7] transition-colors">
              Lihat dasborku
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-[#d6d6d6] py-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-wrap gap-x-6 gap-y-2 text-[12px] tracking-[-0.12px] text-[#707070]">
          <span>Admin: {admin.email}</span>
          <span className="text-[#d6d6d6]">·</span>
          <Link href="/dashboard" className="hover:text-[#1d1d1f] hover:underline">
            Dasbor
          </Link>
        </div>
      </footer>
    </div>
  );
}
