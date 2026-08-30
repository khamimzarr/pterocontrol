export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col">
      {/* Loading Navbar */}
      <nav className="navbar border-b border-deep-ink/5 bg-white animate-pulse">
        <div className="max-w-[1200px] mx-auto px-6 h-[60px]">
          <div className="flex items-center justify-between gap-4">
            <div className="w-32 h-8 rounded-lg bg-surface-soft-meadow"></div>
            <div className="hidden md:flex items-center gap-32">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-24 rounded-full bg-surface-soft-meadow"></div>
              ))}
            </div>
            <div className="w-24 h-8 rounded-full bg-surface-soft-meadow"></div>
          </div>
        </div>
      </nav>
      
      {/* Loading Content */}
      <main className="flex-1 py-8">
        <div className="max-w-[1200px] mx-auto px-6 space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-surface-soft-meadow"></div>
            <div className="h-8 w-64 rounded bg-surface-soft-meadow"></div>
            <div className="h-4 w-96 rounded bg-surface-soft-meadow"></div>
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-surface-soft-meadow animate-pulse"></div>
            ))}
          </div>
          
          {/* Panel Cards Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-surface-soft-meadow animate-pulse"></div>
            ))}
          </div>
          
          {/* Table Skeleton */}
          <div className="rounded-xl bg-surface-soft-meadow p-6 animate-pulse">
            <div className="h-4 w-1/3 rounded bg-surface-canvas mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 rounded bg-surface-canvas"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
