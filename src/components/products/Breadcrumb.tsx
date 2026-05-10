import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export function Breadcrumb({
  category,
}: {
  category?: string;
}) {
  const cat = CATEGORIES.find((c) => c.slug === category);

  return (
    <nav className="flex items-center gap-1.5 text-sm text-[#666666]">
      <Link href="/" className="hover:text-[#ED7606] transition-colors">
        Home
      </Link>
      <span className="text-[#D1D5DB]">/</span>
      <Link href="/products" className="hover:text-[#ED7606] transition-colors">
        Products
      </Link>
      {cat && (
        <>
          <span className="text-[#D1D5DB]">/</span>
          <span className="text-[#171717] font-medium">{cat.name}</span>
        </>
      )}
    </nav>
  );
}
