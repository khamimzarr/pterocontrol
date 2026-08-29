export default function Loading() {
  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col">
      <div className="h-[52px] border-b border-[rgba(186,215,247,0.08)] bg-[rgba(5,6,15,0.65)] animate-pulse" />
      <div className="max-w-[1200px] mx-auto w-full px-6 md:px-10 py-6 space-y-3">
        {[1, 2].map((i) => <div key={i} className="h-[72px] rounded-[16px] bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.06)] animate-pulse" />)}
      </div>
    </div>
  );
}
