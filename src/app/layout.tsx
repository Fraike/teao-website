import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PublicChrome } from "@/components/layout/public-chrome";
import { env } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: "TEAO | Automotive Damper & Latch Manufacturer",
    template: "%s | TEAO",
  },
  description:
    "TEAO manufactures gear dampers, axial dampers, glove box dampers, latches and custom soft-motion components for global B2B automotive and industrial projects.",
  keywords: [
    "automotive damper",
    "gear damper",
    "axial damper",
    "glove box damper",
    "rotary damper",
    "latch mechanism",
    "motion control",
    "TEAO",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TEAO",
    title: "TEAO | Automotive Damper & Latch Manufacturer",
    description:
      "Precision dampers for automotive programs. 20+ years of damper expertise.",
    images: [{ url: "/images/logo-color.webp", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TEAO | Automotive Damper & Latch Manufacturer",
    description:
      "Precision dampers for automotive programs. 20+ years of damper expertise.",
    images: ["/images/logo-color.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
      </head>
      <body>
        <PublicChrome>{children}</PublicChrome>
        {env.PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={env.PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  );
}
