export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <section className="min-h-[760px] lg:min-h-svh bg-[#F8F9FA] pt-28 lg:pt-[150px] pb-6 lg:pb-9">
        <div className="shell">
          <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.55fr)] gap-12 items-end">
            <div className="pb-0 lg:pb-[72px]">
              <div className="h-8 w-64 bg-[#E5E7EB] rounded-full" />
              <div className="mt-4 mb-4 space-y-3">
                <div className="h-16 lg:h-20 w-full max-w-[860px] bg-[#E5E7EB] rounded-xl" />
                <div className="h-16 lg:h-20 w-3/4 max-w-[860px] bg-[#E5E7EB] rounded-xl" />
              </div>
              <div className="space-y-2.5 max-w-[610px]">
                <div className="h-5 bg-[#E5E7EB] rounded w-full" />
                <div className="h-5 bg-[#E5E7EB] rounded w-5/6" />
              </div>
              <div className="flex gap-3 mt-8">
                <div className="h-12 w-44 bg-[#E5E7EB] rounded-full" />
                <div className="h-12 w-40 bg-[#E5E7EB] rounded-full" />
              </div>
            </div>
            <div className="hidden lg:block relative min-h-[530px] self-stretch">
              <div className="absolute inset-[84px_10px_auto_auto] w-[390px] h-[390px] bg-[#E5E7EB] rounded-2xl" />
              <div className="absolute left-0 bottom-[86px] w-[190px] h-[190px] bg-[#E5E7EB] rounded-2xl" />
              <div className="absolute right-[20px] bottom-[18px] w-[230px] h-[158px] bg-[#E5E7EB] rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Product grid skeleton */}
      <section className="section">
        <div className="shell">
          <div className="h-4 w-32 bg-[#E5E7EB] rounded mb-3" />
          <div className="h-10 w-96 bg-[#E5E7EB] rounded mb-2" />
          <div className="h-5 w-[480px] bg-[#E5E7EB] rounded mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-3.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
                <div className="aspect-[4/3] bg-[#E5E7EB]" />
                <div className="p-4">
                  <div className="h-3 w-6 bg-[#E5E7EB] rounded mb-2" />
                  <div className="h-5 w-24 bg-[#E5E7EB] rounded mb-1.5" />
                  <div className="h-3 w-full bg-[#E5E7EB] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
