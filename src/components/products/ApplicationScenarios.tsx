import Image from "next/image";

const DEFAULT_SCENARIOS = [
  { image: "/images/applications/applications-gif/Center console lid.gif", label: "Center Console" },
  { image: "/images/applications/applications-gif/Glove box.gif", label: "Glove Box" },
  { image: "/images/applications/applications-gif/Door handle.gif", label: "Door Handle" },
  { image: "/images/applications/applications-gif/cup holder.gif", label: "Cup Holder" },
  { image: "/images/applications/applications-gif/glasses box.gif", label: "Glasses Box" },
  { image: "/images/applications/applications-gif/ashtray.gif", label: "Ashtray" },
  { image: "/images/applications/applications-gif/outlet cover.gif", label: "Outlet Cover" },
  { image: "/images/applications/applications-gif/safty handle.gif", label: "Safety Handle" },
  { image: "/images/applications/applications-gif/toilet lid.gif", label: "Toilet Lid" },
];

interface Props {
  scenarios?: { image: string; label: string }[];
  max?: number;
}

export function ApplicationScenarios({ scenarios, max = 3 }: Props) {
  const list = (scenarios && scenarios.length > 0 ? scenarios : DEFAULT_SCENARIOS).slice(0, max);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {list.map((item) => (
        <div
          key={item.label}
          className="group overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ED7606]/35 hover:shadow-[0_16px_42px_rgba(237,118,6,0.08)]"
        >
          <div className="relative aspect-[5/3] bg-[#F8F9FA]">
            <Image
              src={item.image}
              alt={item.label}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              unoptimized={item.image.endsWith(".gif")}
            />
          </div>
          <div className="px-3 py-2.5 text-sm font-extrabold text-[#111827]">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
