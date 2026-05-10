import Image from "next/image";

interface ChartConfig {
  src: string;
  label: string;
  description: string;
}

export function PerformanceCharts({
  charts,
}: {
  charts: { rotation_curve?: string; temperature_curve?: string };
}) {
  const items: ChartConfig[] = [];
  if (charts.rotation_curve) {
    items.push({
      src: charts.rotation_curve,
      label: "Torque vs. Rotational Speed",
      description: "Shows how damping torque responds as rotation speed changes.",
    });
  }
  if (charts.temperature_curve) {
    items.push({
      src: charts.temperature_curve,
      label: "Torque vs. Temperature",
      description: "Shows stability across the operating temperature range.",
    });
  }

  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#111827] mb-5">
        Performance Curves
      </h2>
      <div className="grid lg:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-4"
          >
            <span className="block text-xs font-black uppercase tracking-[0.1em] text-[#9CA3AF]">
              {item.label}
            </span>
            <p className="mt-1 text-xs font-medium text-[#6B7280]">{item.description}</p>
            <div className="relative mt-3 w-full aspect-[2/1] rounded-lg bg-[#F8F9FA]">
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-contain p-3"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
