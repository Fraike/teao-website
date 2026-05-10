export function CharacteristicsPills({ characteristics }: { characteristics: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {characteristics.map((char) => (
        <span
          key={char}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-[#FFF1E3] border-[#FFE3C2] text-[#ED7606]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ED7606]" />
          {char}
        </span>
      ))}
    </div>
  );
}
