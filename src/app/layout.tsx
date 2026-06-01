import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PublicChrome } from "@/components/layout/public-chrome";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { env } from "@/lib/env";
import { organizationSchema, JsonLdScript } from "@/lib/structured-data";
import { AUTOMOTIVE_SEO_KEYWORDS, GLOBAL_SEO_KEYWORDS } from "@/lib/seo-keywords";
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
    "rotary damper",
    "axial damper",
    "barrel damper",
    "glove box damper",
    "latch mechanism",
    "motion control",
    ...GLOBAL_SEO_KEYWORDS,
    ...AUTOMOTIVE_SEO_KEYWORDS,
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <JsonLdScript data={organizationSchema()} />
      </head>
      <body>
        <AnalyticsProvider>
          <PublicChrome>{children}</PublicChrome>
        </AnalyticsProvider>
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
