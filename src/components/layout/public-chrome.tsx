"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import { MediaProtection } from "./MediaProtection";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <MediaProtection />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
