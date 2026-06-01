import type { Metadata } from "next";
import { JsonLdScript, collectionPageSchema } from "@/lib/structured-data";
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
      <AutomotiveClient />
    </>
  );
}
