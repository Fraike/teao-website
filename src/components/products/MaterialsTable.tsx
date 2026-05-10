export function MaterialsTable({
  materials,
}: {
  materials: { part: string; material: string }[];
}) {
  return (
    <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5">
      <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#111827] mb-5">
        Materials & Components
      </h2>
      <div className="overflow-hidden rounded-lg border border-[#E5E5E5]">
        <div className="flex justify-between px-5 py-3 bg-[#F8F9FA] border-b border-[#E5E5E5] text-xs font-black uppercase tracking-[0.1em] text-[#9CA3AF]">
          <span>Part</span>
          <span>Material</span>
        </div>
        {materials.map((m, i) => (
          <div
            key={m.part}
            className={`flex justify-between px-5 py-3.5 ${
              i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
            }`}
          >
            <span className="text-sm text-[#6B7280] font-medium">{m.part}</span>
            <span className="text-sm text-[#111827] font-bold">{m.material}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
