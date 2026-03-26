export function LeaderboardSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 md:px-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl font-bold text-emerald-500">
            &gt;
          </span>
          <div className="h-8 w-56 bg-zinc-900 rounded" />
        </div>

        <div className="h-5 w-72 bg-zinc-900 rounded" />

        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-zinc-900 rounded" />
          <div className="h-4 w-4 bg-zinc-900 rounded" />
          <div className="h-4 w-20 bg-zinc-900 rounded" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-full flex flex-col border border-[#2A2A2A] bg-[#0A0A0A]"
          >
            <div className="flex items-center justify-between border-b border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 bg-zinc-900 rounded" />
                  <div className="h-4 w-8 bg-zinc-900 rounded" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-12 bg-zinc-900 rounded" />
                  <div className="h-4 w-10 bg-zinc-900 rounded" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-4 w-16 bg-zinc-900 rounded" />
                <div className="h-4 w-12 bg-zinc-900 rounded" />
              </div>
            </div>

            <div className="flex min-h-[120px] w-full overflow-hidden bg-[#111111]">
              <div className="flex w-10 flex-col items-end gap-1.5 border-r border-[#2A2A2A] bg-[#0F0F0F] py-3.5 px-2.5">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-4 w-3 bg-zinc-900 rounded" />
                ))}
              </div>

              <div className="flex-1 p-4">
                <div className="h-[100px] w-full bg-zinc-900/50 rounded-md border border-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
