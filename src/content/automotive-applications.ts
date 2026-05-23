export type AutomotiveZone = "interior" | "exterior";

export interface ApplicationHotspot {
  id: string;
  label: string;
  cn: string;
  left: string;   // percentage position on map
  top: string;     // percentage position on map
}

export interface ApplicationProduct {
  model: string;
  image: string;
  href: string;
}

export interface ApplicationProductGroup {
  title: string;
  products: ApplicationProduct[];
}

export interface ApplicationScene {
  id: string;
  no: string;
  title: string;
  cn: string;
  desc: string;
  image: string;
  groups: ApplicationProductGroup[];
}

export interface AutomotiveZoneConfig {
  mapImage: string;
  hotspots: ApplicationHotspot[];
  scenes: ApplicationScene[];
}

const IMG = "/images";

function p(model: string, path: string, href?: string): ApplicationProduct {
  return {
    model,
    image: `${IMG}/products/${path}`,
    href: href || `/products`,
  };
}

export const automotiveInterior: AutomotiveZoneConfig = {
  mapImage: `${IMG}/applications/generated/automotive-interior-map.webp`,
  hotspots: [
    { id: "grab-handle",           label: "Grab handle",           cn: "顶棚拉手",   left: "10%", top: "15%" },
    { id: "overhead-console",      label: "Overhead console",      cn: "顶棚控制台", left: "50%", top: "18%" },
    { id: "sunshade",              label: "Sunshade",              cn: "遮阳板",     left: "66%", top: "15%" },
    { id: "inner-door-handle",     label: "Inner door handle",     cn: "内门把手",   left: "84%", top: "64%" },
    { id: "glove-box",             label: "Glove box",             cn: "手套箱 / 杂物箱", left: "63%", top: "74%" },
    { id: "center-console-lid",    label: "Center console lid",    cn: "中控扶手箱盖", left: "49%", top: "84%" },
  ],
  scenes: [
    {
      id: "center-console-lid", no: "01", title: "Center Console Lid", cn: "中控扶手箱盖",
      desc: "Soft-open, soft-close and anti-slam control for center console storage lids.",
      image: `${IMG}/applications/applications-gif/Center console lid.gif`,
      groups: [
        { title: "Axial Damper", products: [p("RD-T013B", "rd-t013b/photo_1.webp", "/products/rd-t013b"), p("RD-T012C", "rd-t012c/photo_1.webp", "/products/rd-t012c")] },
      ],
    },
    {
      id: "glove-box", no: "02", title: "Glove Box", cn: "手套箱 / 杂物箱",
      desc: "Controlled descent for reduced impact and noise in passenger vehicle interior storage.",
      image: `${IMG}/applications/applications-gif/Glove box.gif`,
      groups: [
        { title: "Glove Box Damper", products: [p("RD-V109", "rd-v109/main.webp", "/products/rd-v109"), p("RD-V107", "rd-v107/main.webp", "/products/rd-v107"), p("RD-V129", "rd-v129/main.webp", "/products/rd-v129")] },
        { title: "Synchronizer", products: [p("RD-T180", "rd-t180/main.webp", "/products/rd-t180")] },
      ],
    },
    {
      id: "inner-door-handle", no: "03", title: "Inner Door Handle", cn: "内门把手",
      desc: "Damped return for quieter, more stable interior door handle operation.",
      image: `${IMG}/applications/applications-gif/Door handle.gif`,
      groups: [
        { title: "Gear Damper", products: [p("RD-T021", "rd-t021/main.webp"), p("RD-T015", "rd-t015/main.webp"), p("RD-T029", "rd-t029/main.webp")] },
        { title: "Axial Damper", products: [p("TAD-18", "axial-damper/AxialDamperSingle.webp"), p("RD-V109", "rd-v109/main.webp")] },
      ],
    },
    {
      id: "grab-handle", no: "04", title: "Grab Handle", cn: "顶棚拉手",
      desc: "Damped return buffering to eliminate snap-back impact noise on roof grab handles.",
      image: `${IMG}/applications/applications-gif/safty handle.gif`,
      groups: [
        { title: "Axial Damper", products: [p("RD-T012A", "rd-t012a/main.webp", "/products/rd-t012a"), p("RD-T012C", "rd-t012c/photo_1.webp", "/products/rd-t012c"), p("RD-T013B", "rd-t013b/photo_1.webp", "/products/rd-t013b")] },
      ],
    },
    {
      id: "overhead-console", no: "05", title: "Overhead Console", cn: "顶棚控制台 / 眼镜盒",
      desc: "Soft open/close for overhead storage bins and glasses boxes.",
      image: `${IMG}/applications/applications-gif/glasses box.gif`,
      groups: [
        { title: "Axial Damper", products: [p("RD-T013B", "rd-t013b/photo_1.webp", "/products/rd-t013b"), p("RD-T013C", "rd-t013c/main.webp", "/products/rd-t013c")] },
      ],
    },
    {
      id: "sunshade", no: "06", title: "Sunshade", cn: "遮阳板",
      desc: "Rotary damping for sunshade and flip-down mechanisms for smoother motion.",
      image: `${IMG}/applications/applications-gif/glasses box.gif`,
      groups: [
        { title: "Axial Damper", products: [p("RD-T013B", "rd-t013b/photo_1.webp", "/products/rd-t013b"), p("RD-T013C", "rd-t013c/main.webp", "/products/rd-t013c")] },
      ],
    },
  ],
};

export const automotiveExterior: AutomotiveZoneConfig = {
  mapImage: `${IMG}/applications/generated/automotive-exterior-clean.webp`,
  hotspots: [
    { id: "exterior-door-handle",  label: "Exterior door handle",  cn: "外门把手",     left: "32%", top: "48%" },
    { id: "charging-port-cover",   label: "Charging port cover",   cn: "充电口盖",     left: "68%", top: "42%" },
  ],
  scenes: [
    {
      id: "exterior-door-handle", no: "01", title: "Exterior Door Handle", cn: "外门把手",
      desc: "Deployment, return and tactile control for flush and conventional exterior handles.",
      image: `${IMG}/applications/applications-gif/Door handle.gif`,
      groups: [
        { title: "Gear / Custom Module", products: [p("RD-T015", "rd-t015/main.webp", "/products/rd-t015"), p("RD-T021", "rd-t021/main.webp", "/products/rd-t021")] },
      ],
    },
    {
      id: "charging-port-cover", no: "02", title: "Charging Port Cover", cn: "充电口盖",
      desc: "Soft open/close and anti-slam for EV charging port covers.",
      image: `${IMG}/applications/applications-gif/outlet cover.gif`,
      groups: [
        { title: "Gear Damper", products: [p("RD-T023", "rd-t023/main.webp", "/products/rd-t023")] },
        { title: "Axial Damper", products: [p("RD-T013C", "rd-t013c/main.webp", "/products/rd-t013c")] },
      ],
    },
  ],
};
