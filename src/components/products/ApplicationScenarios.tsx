const APPLICATION_GIFS = [
  { src: "/images/applications/applications-gif/Center console lid.gif", label: "Center Console" },
  { src: "/images/applications/applications-gif/Glove box.gif", label: "Glove Box" },
  { src: "/images/applications/applications-gif/Door handle.gif", label: "Door Handle" },
  { src: "/images/applications/applications-gif/cup holder.gif", label: "Cup Holder" },
  { src: "/images/applications/applications-gif/glasses box.gif", label: "Glasses Box" },
  { src: "/images/applications/applications-gif/ashtray.gif", label: "Ashtray" },
  { src: "/images/applications/applications-gif/outlet cover.gif", label: "Outlet Cover" },
  { src: "/images/applications/applications-gif/safty handle.gif", label: "Safety Handle" },
  { src: "/images/applications/applications-gif/toilet lid.gif", label: "Toilet Lid" },
];

export function ApplicationScenarios({ max = 2 }: { max?: number }) {
  const display = APPLICATION_GIFS.slice(0, max);

  return (
    <div className="grid max-w-[760px] sm:grid-cols-2 gap-4">
      {display.map((item) => (
        <div
          key={item.label}
          className="group overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ED7606]/35 hover:shadow-[0_16px_42px_rgba(237,118,6,0.08)]"
        >
          <div className="relative aspect-[5/3] bg-[#F8F9FA]">
            <img
              src={item.src}
              alt={item.label}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
