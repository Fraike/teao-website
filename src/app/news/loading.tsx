export default function NewsLoading() {
  return (
    <section className="section pt-32">
      <div className="shell">
        <div className="animate-pulse">
          <div className="h-4 w-16 bg-[#E5E7EB] rounded mb-4" />
          <div className="h-9 w-96 bg-[#E5E7EB] rounded mb-3" />
          <div className="h-5 w-[480px] bg-[#E5E7EB] rounded mb-8" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-h-[260px] rounded-xl border border-[#E5E7EB] bg-white p-6" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
