import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { env } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
    "TEAO manufactures gear dampers, cylinder dampers, glove box dampers, latches and custom soft-motion components for global B2B automotive and industrial projects.",
  keywords: [
    "automotive damper",
    "gear damper",
    "cylinder damper",
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
  },
  robots: {
    index: true,
    follow: true,
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
