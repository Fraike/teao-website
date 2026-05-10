const TECH_PARAM_LABELS: Record<string, string> = {
  teeth_count: "Teeth Count",
  module: "Module",
  outer_diameter: "Outer Diameter",
  pressure_angle: "Pressure Angle",
  total_length: "Total Length",
  total_width: "Total Width",
  total_height: "Total Height",
};

export function TechSpecsTable({
  specifications,
  tech_params,
}: {
  specifications: Record<string, string>;
  tech_params?: Record<string, string | number>;
}) {
  return (
    <div className="h-full rounded-xl border border-[#E5E7EB] bg-white p-5">
      <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#111827] mb-5">
        Technical Specifications
      </h2>
      <div className="overflow-hidden rounded-lg border border-[#E5E5E5]">
        {Object.entries(specifications).map(([key, value], i) => (
          <div
            key={key}
            className={`flex justify-between px-5 py-3.5 ${
              i % 2 === 0 ? "bg-[#F8F9FA]" : "bg-white"
            }`}
          >
            <span className="text-sm text-[#6B7280] font-medium">{key}</span>
            <span className="text-sm text-[#111827] font-bold tabular-nums">{value}</span>
          </div>
        ))}
      </div>

      {tech_params && Object.keys(tech_params).length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-extrabold uppercase tracking-[0.1em] text-[#9CA3AF] mb-3">
            Gear Parameters
          </h3>
          <div className="overflow-hidden rounded-lg border border-[#E5E5E5]">
            {Object.entries(tech_params).map(([key, value], i) => (
              <div
                key={key}
                className={`flex justify-between px-5 py-3.5 ${
                  i % 2 === 0 ? "bg-[#F8F9FA]" : "bg-white"
                }`}
              >
                <span className="text-sm text-[#6B7280] font-medium">
                  {TECH_PARAM_LABELS[key] ?? key}
                </span>
                <span className="text-sm text-[#111827] font-bold tabular-nums">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
