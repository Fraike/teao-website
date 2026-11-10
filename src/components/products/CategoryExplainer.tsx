import type { CategoryInfo } from "@/types";

interface ExplainerData {
  what: string;
  how: string;
  params: { parameter: string; value: string }[];
  customization: string;
  applications: string;
}

const DATA: Record<string, ExplainerData> = {
  "gear-damper": {
    what: "TEAO uses gear damper and rotary damper for the same geared product family. These components slow rotary motion in compact mechanisms such as cup holders, door handles and storage lids.",
    how: "A mating gear or rack drives the damper rotor. The viscous fluid inside the housing resists the rotation and slows the movement. Select the damping direction and torque for the motion of your mechanism.",
    params: [
      { parameter: "Torque", value: "Compare the adjustable torque range listed for each model" },
      { parameter: "Damping direction", value: "Confirm direction on the model specification or drawing" },
      { parameter: "Gear geometry", value: "Check tooth count, module and diameter against the mating part" },
      { parameter: "Mounting", value: "Compare mounting method, clearance and attachment dimensions" },
    ],
    customization: "Share your torque target, damping direction, mounting space, gear geometry and expected operating conditions. TEAO can review the drawing and recommend a suitable model or custom configuration.",
    applications: "Automotive interiors, compact lids and compartments, appliance mechanisms and office equipment.",
  },
  "axial-damper": {
    what: "An axial damper (barrel damper or linear damper) is a motion control component that provides controlled resistance along a straight linear path. Unlike rotary gear dampers that control rotational motion, axial dampers manage push-pull and sliding movements through hydraulic damping, making them essential for glove box doors, center console lids, grab handles, overhead consoles, and sliding storage compartments.",
    how: "Axial dampers use a piston moving through a cylinder filled with damping fluid (typically silicone oil). As the piston moves along its stroke, fluid is forced through calibrated orifices, creating controlled viscous resistance. The damping force is proportional to the velocity of movement — faster push or pull creates proportionally higher resistance. TEAO axial dampers support bidirectional damping and can be configured for specific stroke lengths and force profiles.",
    params: [
      { parameter: "Damping Force", value: "50 – 300 N" },
      { parameter: "Stroke Length", value: "20 – 80 mm" },
      { parameter: "Operating Temperature", value: "-30°C to +80°C" },
      { parameter: "Material", value: "Steel / POM" },
      { parameter: "Mounting Method", value: "Through-hole + slot fixing" },
      { parameter: "Damping Direction", value: "Bidirectional (push and pull)" },
      { parameter: "Durability", value: "30,000+ cycles" },
    ],
    customization: "Damping force can be adjusted by changing the orifice geometry, piston design, and fluid viscosity. Custom stroke lengths, mounting configurations, end fittings, and force profiles are available through TEAO's engineering support.",
    applications: "Automotive glove box doors, center console lids, armrest modules, grab handles, overhead consoles, cup holders, sliding storage compartments, toilet seat soft-close mechanisms, cabinet soft closers, and interior trim mechanisms requiring controlled linear motion.",
  },
  "glove-box-damper": {
    what: "A glove box damper controls how quickly the lid descends as it opens. A suitable model depends on the lid geometry, available space and target opening time.",
    how: "The TEAO catalog includes air and oil models. Air models use air resistance during travel. Oil models use fluid resistance. Compare the stroke and dimensions in the model specifications against the travel and space available in your assembly.",
    params: [
      { parameter: "Damping medium", value: "Air or oil, depending on model" },
      { parameter: "Stroke", value: "See the listed stroke for each model" },
      { parameter: "Installation", value: "Check overall length, clearance and attachment dimensions against the drawing" },
    ],
    customization: "For application review, provide the lid weight, hinge geometry, opening angle, target opening time and installation drawing. TEAO can use these details to review damping force and mounting options.",
    applications: "Vehicle glove boxes and interior storage lids that need controlled opening.",
  },
  latch: {
    what: "A latch is a mechanical fastening component that secures, releases, and re-engages moving parts through a purely mechanical heart-shaped cam track mechanism — no power source required. TEAO's push-push latches enable one-push-to-close, one-push-to-open operation with an audible click for tactile confirmation, making them ideal for automotive interior storage compartments and access panels requiring a clean, flush appearance.",
    how: "Push-push latches use a heart-shaped cam track with a spring-loaded follower pin. The first push drives the pin along the track to the locked position, engaging the mating striker. The second push releases the pin along the return path, disengaging the mechanism. The audible click sound provides user confirmation of engagement. The design is entirely mechanical, requires no electrical power, and maintains reliable operation over high cycle counts.",
    params: [
      { parameter: "Latch Force", value: "15 – 50 N" },
      { parameter: "Press Force", value: "~6 N" },
      { parameter: "Operating Temperature", value: "-30°C to +80°C" },
      { parameter: "Sound Type", value: "Audible (click feedback)" },
      { parameter: "Material", value: "POM / Steel spring" },
      { parameter: "Durability", value: "50,000 – 100,000+ cycles" },
      { parameter: "Dimensions", value: "11mm × 6.9mm × 17.6mm (compact)" },
    ],
    customization: "Latch force, press force, stroke length, and mounting configuration can be customized. Corrosion-resistant materials and specific spring rates are available for demanding environments.",
    applications: "Automotive interior panels, storage compartments, glove box lids, access doors, center console compartments, and industrial enclosures requiring tool-free push-push operation.",
  },
  other: {
    what: "Custom damper modules are application-specific motion control assemblies engineered to unique customer specifications when standard platform products do not fit the spatial, torque, or environmental requirements. TEAO's custom engineering service covers the full development cycle from concept validation through mass production.",
    how: "TEAO's engineering team follows a structured development process: requirements review and feasibility analysis → concept design and 3D modeling → prototype fabrication (rapid tooling or CNC) → DV/PV testing (durability, environmental, vibration) → production tooling → PPAP documentation → serial production with 100% inspection. Each module is designed to the customer's exact torque, mounting, damping direction, material, and environmental specifications.",
    params: [
      { parameter: "Torque / Force", value: "Custom specified per application" },
      { parameter: "Configuration", value: "Per customer drawing and requirements" },
      { parameter: "Material", value: "Per application environment" },
      { parameter: "Validation", value: "Per automotive or industry standards" },
      { parameter: "Production Volume", value: "Prototype to mass production" },
    ],
    customization: "Full custom engineering from concept to production. Capabilities include joint development, rapid prototyping, custom tooling, material selection, performance tuning, and scalable manufacturing. PPAP documentation up to Level 3 is available.",
    applications: "Specialized automotive mechanisms (custom interior dampers, exterior charge port covers), industrial equipment, medical devices, office equipment, and any motion control application not met by standard product categories.",
  },
};

export function CategoryExplainer({ category }: { category: CategoryInfo }) {
  const data = DATA[category.slug];
  if (!data) return null;

  return (
    <section className="py-8 lg:py-10">
      <div className="shell">
        <details className="border border-[#E5E7EB] rounded-xl bg-[#F8F9FA] group">
          <summary className="px-5 py-4 lg:px-6 lg:py-5 cursor-pointer font-bold text-[#111827] text-[15px] lg:text-[16px] hover:text-[#ED7606] transition-colors select-none">
            Learn more about {category.name}
          </summary>

          <div className="px-5 pb-5 lg:px-6 lg:pb-6 space-y-6 border-t border-[#E5E7EB] pt-5">
            {/* What is X? */}
            <div>
              <h3 className="text-[16px] lg:text-[18px] font-extrabold text-[#111827] mb-2">
                What is a {category.name.slice(0, -1)}?
              </h3>
              <p className="text-[#6B7280] text-[14px] lg:text-[15px] leading-relaxed">
                {data.what}
              </p>
            </div>

            {/* How X Works */}
            <div>
              <h3 className="text-[16px] lg:text-[18px] font-extrabold text-[#111827] mb-2">
                How {category.name} Work
              </h3>
              <p className="text-[#6B7280] text-[14px] lg:text-[15px] leading-relaxed">
                {data.how}
              </p>
            </div>

            {/* Selection Parameters */}
            <div>
              <h3 className="text-[16px] lg:text-[18px] font-extrabold text-[#111827] mb-3">
                Selection Parameters
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-white text-left">
                      <th className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#9CA3AF]">
                        Parameter
                      </th>
                      <th className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#9CA3AF]">
                        Specification
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {data.params.map((p) => (
                      <tr key={p.parameter} className="bg-white">
                        <td className="px-4 py-2.5 font-medium text-[#111827]">
                          {p.parameter}
                        </td>
                        <td className="px-4 py-2.5 text-[#6B7280]">
                          {p.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customization */}
            <div>
              <h3 className="text-[16px] lg:text-[18px] font-extrabold text-[#111827] mb-2">
                {category.slug === "latch"
                  ? "Force & Configuration Customization"
                  : "Torque & Performance Customization"}
              </h3>
              <p className="text-[#6B7280] text-[14px] lg:text-[15px] leading-relaxed">
                {data.customization}
              </p>
            </div>

            {/* Typical Applications */}
            <div>
              <h3 className="text-[16px] lg:text-[18px] font-extrabold text-[#111827] mb-2">
                Typical Applications
              </h3>
              <p className="text-[#6B7280] text-[14px] lg:text-[15px] leading-relaxed">
                {data.applications}
              </p>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
