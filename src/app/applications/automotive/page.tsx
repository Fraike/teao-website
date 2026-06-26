import type { Metadata } from "next";
import { JsonLdScript, collectionPageSchema, faqPageSchema } from "@/lib/structured-data";
import { AutomotiveClient } from "./automotive-client";
import { AUTOMOTIVE_SEO_KEYWORDS } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  title: "Automotive Interior Dampers & EV Charging Port Cover Dampers",
  description:
    "Explore TEAO automotive interior damper applications for glove boxes, center console lids, grab handles, overhead consoles, door handles and EV charging port covers.",
  keywords: AUTOMOTIVE_SEO_KEYWORDS,
  alternates: {
    canonical: "/applications/automotive",
  },
  openGraph: {
    title: "Automotive Interior Dampers & EV Charging Port Dampers | TEAO",
    description:
      "TEAO dampers for automotive glove boxes, center console lids, grab handles, overhead consoles, handles and EV charging port covers.",
    images: [{ url: "/images/applications/automotive.webp", width: 800, height: 500 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automotive Interior Dampers & EV Charging Port Dampers | TEAO",
    description: "TEAO dampers for automotive interior and EV charging port cover mechanisms.",
    images: ["/images/applications/automotive.webp"],
  },
};

export default function AutomotiveApplicationsPage() {
  const applicationFaq = [
    {
      q: "Why are dampers used in modern EV interiors?",
      a: "Electric vehicles have much lower powertrain noise, so mechanical sounds from glove boxes, overhead consoles, center console lids and handles are more noticeable. Dampers slow the motion, reduce impact noise and improve the perceived quality of the interior.",
    },
    {
      q: "Which automotive interior parts commonly use dampers?",
      a: "Typical applications include roof grab handles, overhead console glasses boxes, center console lids, glove boxes, cup holders, interior door handles and storage compartments.",
    },
    {
      q: "What is the difference between a gear damper and an axial damper in vehicle interiors?",
      a: "A gear damper, also called a rotary damper, is commonly used where rotational motion can be controlled through a gear or sector. An axial damper, also called a barrel damper, fits compact linear or hinge-adjacent layouts where space is limited.",
    },
    {
      q: "What should be checked before selecting an EV charging port cover damper?",
      a: "Check the opening path, cover weight, target speed, installation angle, temperature range, sealing environment, damping direction, cycle life and impact/noise target before choosing a standard or custom damper.",
    },
  ];
  const jsonLd = collectionPageSchema(
    "Automotive Interior Damper Applications",
    "TEAO dampers for automotive interiors and EV mechanisms: glove box, center console lid, grab handle, overhead console, door handle and charging port cover applications.",
    [{ name: "Automotive Applications", url: "/applications/automotive" }],
    {
      url: "/applications/automotive",
      keywords: AUTOMOTIVE_SEO_KEYWORDS,
      about: AUTOMOTIVE_SEO_KEYWORDS,
    },
  );

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={faqPageSchema(applicationFaq)} />
      <AutomotiveClient />
    </>
  );
}
