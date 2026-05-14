export default function ProductsLoading() {
  return (
    <section className="section pt-28 lg:pt-32">
      <div className="shell">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-[#E5E7EB] rounded mb-4" />
          <div className="h-9 w-64 bg-[#E5E7EB] rounded mb-3" />
          <div className="h-5 w-96 bg-[#E5E7EB] rounded mb-8" />

          {/* Category tabs skeleton */}
          <div className="flex gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-[#E5E7EB] rounded-full" />
            ))}
          </div>

          {/* Table skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-[#E5E7EB] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
