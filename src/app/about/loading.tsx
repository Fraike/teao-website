export default function AboutLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <section className="pt-28 lg:pt-32 pb-12 lg:pb-16">
        <div className="shell">
          <div className="h-4 w-16 bg-[#E5E7EB] rounded mb-4" />
          <div className="h-10 lg:h-14 w-full max-w-[720px] bg-[#E5E7EB] rounded-xl mb-3" />
          <div className="h-16 lg:h-20 w-full max-w-[720px] bg-[#E5E7EB] rounded-xl mb-4" />
          <div className="h-5 w-full max-w-[600px] bg-[#E5E7EB] rounded" />
        </div>
      </section>

      {/* Timeline skeleton */}
      <section className="py-12 lg:py-16 bg-[#F8F9FA]">
        <div className="shell">
          <div className="h-4 w-24 bg-[#E5E7EB] rounded mb-3 mx-auto" />
          <div className="h-10 w-80 bg-[#E5E7EB] rounded mb-8 mx-auto" />
          <div className="max-w-3xl mx-auto space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-20 h-12 bg-[#E5E7EB] rounded-lg shrink-0" />
                <div className="flex-1 h-14 bg-[#E5E7EB] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="py-12 lg:py-16">
        <div className="shell">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-[#E5E7EB] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
