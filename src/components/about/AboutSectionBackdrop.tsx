export function AboutSectionBackdrop({
  image,
  position = "right 8% center",
  size = "clamp(240px, 34vw, 460px) auto",
  opacity = 1,
}: {
  image: string;
  position?: string;
  size?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-no-repeat"
      style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: position,
        backgroundSize: size,
        opacity,
      }}
    />
  );
}
