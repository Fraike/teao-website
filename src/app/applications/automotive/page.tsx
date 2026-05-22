import type { Metadata } from "next";
import { JsonLdScript, collectionPageSchema } from "@/lib/structured-data";
import { AutomotiveClient } from "./automotive-client";

export const metadata: Metadata = {
  title: "Automotive Damper Applications | Interior & Exterior Motion Control",
  description:
    "Explore TEAO automotive damper applications for glove boxes, center console lids, cup holders, inner door handles, grab handles, charging port covers and exterior handles.",
  keywords: [
    "automotive damper", "glove box damper", "console lid damper",
    "door handle damper", "grab handle damper", "charging port cover damper",
    "automotive interior damper", "automotive exterior damper", "custom damper module",
  ],
  openGraph: {
    title: "Automotive Damper Applications | TEAO",
    description:
      "TEAO dampers for automotive glove boxes, consoles, handles, cup holders and exterior mechanisms.",
    images: [{ url: "/images/applications/automotive.webp", width: 800, height: 500 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automotive Damper Applications | TEAO",
    description: "TEAO dampers for automotive interior and exterior mechanisms.",
    images: ["/images/applications/automotive.webp"],
  },
};

export default function AutomotiveApplicationsPage() {
  const jsonLd = collectionPageSchema(
    "Automotive Damper Applications",
    "TEAO dampers for automotive interiors and exteriors: glove box, console, handle, grab handle and charging port cover mechanisms.",
    [{ name: "Automotive Applications", url: "/applications/automotive" }],
  );

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <AutomotiveClient />
    </>
  );
}
