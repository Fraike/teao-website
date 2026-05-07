export const timeline = [
  {
    year: "2001",
    title: "Company Established",
    description: "Founded in Shenzhen Dongsheng Technology Park.",
  },
  {
    year: "2009",
    title: "Entered Automotive Industry",
    description: "Started automotive applications and injection molding process.",
  },
  {
    year: "2014",
    title: "Business Expansion",
    description: "Relocated to Huangjiang Town, Dongguan City.",
  },
  {
    year: "2021",
    title: "Product Innovation",
    description:
      "Launched air dampers, unidirectional devices and added more than ten patents.",
  },
  {
    year: "2025",
    title: "New Expansion",
    description:
      "Relocated to No.2 Huangjiang North Third Street, Dongguan City.",
  },
];

export const businessStats = [
  { value: "100+", label: "Damping & Cushioning Solutions" },
  { value: "4 Markets", label: "Automotive / Bathroom / Home Appliances / Medical" },
  { value: "2 Checks", label: "Torque Inspection + Appearance Inspection" },
  { value: "6%", label: "Turnover Invested in R&D" },
  { value: "20+11", label: "Production & Automated Testing Lines" },
  { value: "200+", label: "Customers Worldwide" },
];

export const competencies = [
  {
    title: "Assembly",
    subtitle: "Flexible Production",
    description:
      "Fully automatic, semi-automatic and manual assembly lines support flexible production needs from customized projects to volume manufacturing.",
    image: "/images/company/automation-workshop.jpg",
  },
  {
    title: "Engineering & Services",
    subtitle: "Custom Torque Adjustment",
    description:
      "The torque of gear dampers can be adjusted according to customer requirements, instead of using a fixed torque solution.",
    image: "/images/company/automation-equipment-2.JPG",
    highlight: true,
  },
  {
    title: "Plastic Injection",
    subtitle: "Mold + Injection + Production",
    description:
      "TEAO provides complete solutions from mold design and production to plastic injection and assembly.",
    image: "/images/company/production-workshop.JPG",
  },
];

export const systemCertificates = [
  {
    name: "IATF 16949",
    description: "Automotive quality management system certification.",
    image: "/images/体系证书/IATF16949证书.png",
  },
  {
    name: "ISO 14001",
    description: "Environmental management system certification.",
    image: "/images/体系证书/ISO14001证书.png",
  },
];

export const patentCertificates = [
  {
    name: "Hanging-rope Damper Patent",
    description: "Patent certificate for damper mechanism innovation.",
    image: "/images/patents/RD-V109专利证书 一种挂绳阻尼器(1)_页面_1.png",
  },
  {
    name: "Air Damper Patent",
    description: "Patent certificate covering air damping structure design.",
    image: "/images/patents/RD-V108空气阻尼专利书第1页.jpg",
  },
  {
    name: "Rotary Damper Patent",
    description: "Patent certificate for rotary damping component structure.",
    image: "/images/patents/RD-T088专利证书.jpg",
  },
];

export const industries = [
  {
    name: "Automotive",
    description:
      "Glove boxes, armrests, cup holders, charge ports and interior storage.",
  },
  {
    name: "Home Appliances",
    description: "Washer lids, refrigerator flaps, cooker covers and soft-close panels.",
  },
  {
    name: "Bathroom",
    description: "Toilet seats, cabinet doors and controlled closing mechanisms.",
  },
  {
    name: "Medical",
    description: "Equipment enclosures, access panels and controlled motion modules.",
  },
  {
    name: "Industrial",
    description: "Access doors, enclosures and special motion control applications.",
  },
];

export const customerBrands = [
  "Volkswagen",
  "Geely",
  "BYD",
  "Nissan",
  "Kia",
  "GAC Trumpchi",
  "Changan",
  "Chery",
  "Great Wall",
  "BAIC",
  "Ford",
  "Comai",
  "Narwal",
  "Midea",
  "Joyoung",
  "Supor",
];

export const corporateValues = [
  {
    name: "Education Support",
    description:
      "Supporting education initiatives and technical learning helps young people build practical skills.",
  },
  {
    name: "Charity Participation",
    description:
      "TEAO encourages charitable participation and care for people who need community support.",
  },
  {
    name: "Environmental Protection",
    description: "ISO 14001 practices guide cleaner production, resource saving and responsible waste control.",
  },
  {
    name: "Community Contribution",
    description:
      "Responsible enterprise growth means contributing to the local community while serving customers globally.",
  },
];

import { env } from "@/lib/env";

export const trustBadges = [
  "IATF 16949",
  "ISO 14001",
  "20+ Patents",
  "200+ Customers",
];

export const youtubeVideoId = env.YOUTUBE_VIDEO_ID || "REPLACE_WITH_YOUTUBE_VIDEO_ID";
export const videoPoster = "/images/company/automation-workshop.jpg";

export const aboutFAQ = [
  {
    q: "What does TEAO manufacture?",
    a: "TEAO manufactures gear dampers, rotary dampers, air dampers, latches, synchronizers and customized motion control components.",
  },
  {
    q: "Can TEAO customize damper torque?",
    a: "Yes. TEAO can adjust the torque of gear dampers according to customer requirements.",
  },
  {
    q: "What industries does TEAO serve?",
    a: "TEAO serves automotive, bathroom, home appliance, medical and industrial markets.",
  },
  {
    q: "What certifications does TEAO have?",
    a: "TEAO has obtained IATF 16949, ISO 14001 and high-tech enterprise recognition.",
  },
];
