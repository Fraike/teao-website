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
    what: "A gear damper (rotary damper) is a mechanical motion control component that provides controlled rotational resistance using a precision gear system immersed in high-viscosity silicone oil. When the gear rotates, it shears the silicone oil, converting kinetic energy into heat and producing smooth, quiet deceleration without external power or control systems.",
    how: "The gear damper consists of a sealed housing filled with silicone oil, a precision gear rotor with internal vanes, and an O-ring seal. As an external mating gear drives the rotor, the vanes shear the viscous silicone oil. The fluid's resistance creates a damping torque proportional to rotation speed — faster movement produces higher resistance, naturally achieving soft-close behavior. TEAO uses SOC-free (Siloxane-free) silicone oil formulations for applications near sensitive electronics to prevent outgassing and electrical contact failure.",
    params: [
      { parameter: "Torque Range", value: "20 – 3,500 gf·cm (varies by model)" },
      { parameter: "Operating Temperature", value: "-30°C to +80°C" },
      { parameter: "Damping Direction", value: "One-way (CW or CCW) or Bidirectional" },
      { parameter: "Mounting Method", value: "Screw fixing" },
      { parameter: "Gear Parameters", value: "Customizable: tooth count, module (0.8/1.2), outer diameter, pressure angle" },
      { parameter: "Oil Type", value: "Standard or SOC-free silicone oil" },
      { parameter: "Durability", value: "30,000 – 50,000+ cycles" },
    ],
    customization: "TEAO can customize gear damper torque by adjusting the silicone oil viscosity and internal vane geometry. Custom torque values, damping direction (one-way or bidirectional), gear module, tooth count, and outer diameter are all configurable. Engineering support covers torque tuning, sample review, and application matching before mass production.",
    applications: "Automotive interiors (cup holders, glove boxes, center console lids, door handles, ashtrays, charge port covers, sunshades, overhead consoles), household appliances (washer lids, refrigerator flaps, cooker covers), office equipment (printers, coffee machines), bathroom fittings (toilet seats), and industrial machinery.",
  },
  "axial-damper": {
    what: "An axial damper (linear damper) is a motion control component that provides controlled resistance along a straight linear path. Unlike rotary gear dampers that control rotational motion, axial dampers manage push-pull and sliding movements through hydraulic damping, making them essential for glove box doors, center console lids, and sliding storage compartments.",
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
    applications: "Automotive glove box doors, center console lids, armrest modules, grab handles, sliding storage compartments, and interior trim mechanisms requiring controlled linear motion.",
  },
  "glove-box-damper": {
    what: "A glove box damper is a specialized automotive motion control component designed to provide a premium soft-open experience for vehicle glove boxes and interior storage compartments. Unlike general-purpose dampers, it is engineered for the specific kinematics, packaging constraints, door weight, and durability requirements of automotive interior applications across the vehicle's lifetime.",
    how: "Glove box dampers integrate a gear or pinion mechanism with a viscous damping element in a compact housing. As the glove box door opens, the damper's gear engages a rack or sector gear on the door hinge, driving the internal rotor against silicone oil resistance. This converts the door's gravitational acceleration into controlled, premium-feeling soft-open motion. The integrated clip-in or screw-mount design simplifies assembly line installation.",
    params: [
      { parameter: "Damping Force", value: "80 – 250 N" },
      { parameter: "Operating Temperature", value: "-40°C to +85°C (automotive-grade)" },
      { parameter: "Material", value: "PA66 + GF / Steel" },
      { parameter: "Mounting Type", value: "Clip-in or screw" },
      { parameter: "Durability", value: "Validated to automotive standards" },
    ],
    customization: "TEAO glove box dampers can be tuned for specific door weights, opening angles, and desired closing times. Custom mounting brackets, gear ratios, and damping forces are engineered to match the vehicle's interior design and assembly process.",
    applications: "Automotive glove boxes, interior storage compartments, soft-close interior panels, and any vehicle interior lid requiring a premium damped opening experience.",
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
