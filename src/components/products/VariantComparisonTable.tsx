export function VariantComparisonTable({
  variants,
}: {
  variants: { variants: string[]; rows: { param: string; values: string[] }[] };
}) {
  const { variants: headers, rows } = variants;

  return (
    <div className="mb-12 lg:mb-14">
      <div className="mb-4">
        <span className="eyebrow">Model Variants</span>
        <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-[#111827]">
          Variant Comparison
        </h2>
        <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-[#6B7280]">
          This product is available in multiple variants with different specifications. Select the one that fits your application.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-[0.1em] text-white whitespace-nowrap">
                Parameter
              </th>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-center text-xs font-black uppercase tracking-[0.1em] text-white whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              // Check if all values are the same (highlight or dim differently)
              const allSame = row.values.every((v) => v === row.values[0]);
              return (
                <tr
                  key={row.param}
                  className={`border-t border-[#E5E5E5] ${
                    i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
                  }`}
                >
                  <td className="px-5 py-3 text-[#6B7280] font-medium whitespace-nowrap text-xs tracking-wider uppercase">
                    {row.param}
                  </td>
                  {row.values.map((v, j) => (
                    <td
                      key={j}
                      className={`px-4 py-3 text-center font-bold whitespace-nowrap ${
                        allSame
                          ? "text-[#9CA3AF]"
                          : "text-[#111827]"
                      }`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
