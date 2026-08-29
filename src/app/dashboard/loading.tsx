
export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-[16px] p-5 animate-pulse">
            <div className="h-3 w-12 rounded bg-[rgba(186,214,247,0.10)]" />
            <div className="mt-3 h-7 w-14 rounded bg-[rgba(186,214,247,0.08)]" />
            <div className="mt-2 h-3 w-16 rounded bg-[rgba(186,214,247,0.06)]" />
          </div>
        ))}
      </div>
      <div className="rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.10)] overflow-hidden">
        <div className="h-[52px] bg-[rgba(186,214,247,0.04)] border-b border-[rgba(186,215,247,0.06)] animate-pulse" />
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-[10px] bg-[rgba(186,214,247,0.04)] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col">
      <div className="h-[52px] border-b border-[rgba(186,215,247,0.08)] bg-[rgba(5,6,15,0.65)] animate-pulse" />
      <div className="max-w-[1200px] mx-auto w-full px-6 md:px-10 py-6">
        <div className="h-6 w-32 rounded bg-[rgba(186,214,247,0.10)] animate-pulse" />
        <div className="mt-4"><DashboardSkeleton /></div>
      </div>
    </div>
  );
}
