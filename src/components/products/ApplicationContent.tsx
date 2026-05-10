import type { CategoryInfo } from "@/types";

const CONTENT: Record<string, { howUsed: string; whyChoose: string; applications: string }> = {
  "gear-damper": {
    howUsed:
      "Gear dampers are widely used in cup holders, storage boxes, glove compartments, hinges, covers, coffee machines, printers, and other mechanisms that require controlled deceleration and quiet movement. The precise gear system combined with damping oil ensures consistent performance across the product lifetime.",
    whyChoose:
      "TEAO gear dampers are manufactured under IATF 16949 quality standards with 100% torque testing on every unit. Custom torque values are available within standard ranges, and our engineering team supports joint development from prototype to mass production.",
    applications:
      "Automotive interiors, household appliances, office equipment, coffee machines, printers, industrial machinery, and bathroom fittings.",
  },
  "axial-damper": {
    howUsed:
      "Axial dampers provide controlled linear motion for push-pull and sliding applications. They are commonly used in glove box doors, center console lids, sliding storage compartments, and mechanisms requiring smooth linear deceleration.",
    whyChoose:
      "TEAO axial dampers offer adjustable damping force with stable performance across a wide temperature range. Available in push and pull configurations with customizable stroke lengths.",
    applications:
      "Glove box doors, center console lids, sliding mechanisms, armrest modules, and interior storage compartments.",
  },
  "glove-box-damper": {
    howUsed:
      "Glove box dampers provide a premium soft-open feel for automotive glove boxes and interior storage compartments. The integrated design ensures reliable performance across the vehicle's lifetime with quick clip-in installation.",
    whyChoose:
      "TEAO glove box dampers are validated to automotive durability standards with temperature-stable performance from -40°C to +85°C. Clip-in and screw mounting options available.",
    applications:
      "Automotive glove boxes, interior storage compartments, and soft-close interior panels.",
  },
  latch: {
    howUsed:
      "Latches provide reliable lock, release and engagement mechanisms for interior storage, access panels, and compartments. Push-push operation enables tool-free access with a clean, flush appearance.",
    whyChoose:
      "TEAO latches are designed for high-cycle durability with corrosion-resistant components. Compact form factor fits space-constrained interior designs.",
    applications:
      "Automotive interior panels, storage compartments, access doors, and industrial enclosures.",
  },
  other: {
    howUsed:
      "Custom damper modules address application-specific requirements that fall outside standard product categories. Each module is designed to customer specifications including torque, mounting configuration, damping direction, and environmental requirements.",
    whyChoose:
      "TEAO offers full custom engineering support from concept through mass production. Joint development with rapid prototyping and scalable manufacturing.",
    applications:
      "Specialized automotive mechanisms, industrial equipment, medical devices, and custom motion control applications.",
  },
};

export function ApplicationContent({ category }: { category?: CategoryInfo }) {
  const data = category ? CONTENT[category.slug] : null;
  if (!data) return null;

  const name = category!.name;

  return (
    <section className="py-12 lg:py-16 bg-[#F8F9FA] border-y border-[#E5E7EB]/60">
      <div className="shell max-w-[900px]">
        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-extrabold text-[#111827] mb-3">
              How {name} Are Used
            </h2>
            <p className="text-[#666666] text-[15px] leading-relaxed">{data.howUsed}</p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#111827] mb-3">
              Why Choose TEAO {name}
            </h2>
            <p className="text-[#666666] text-[15px] leading-relaxed">{data.whyChoose}</p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#111827] mb-3">Typical Applications</h2>
            <p className="text-[#666666] text-[15px] leading-relaxed">{data.applications}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
