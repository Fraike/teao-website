import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";
import ProductListTable from "@/components/admin/ProductListTable";

export default async function AdminProductsPage() {
  const rows = await db.select().from(products).orderBy(desc(products.updatedAt)).all();

  const data = rows.map((p) => ({
    id: p.id,
    model: p.model,
    name: p.name,
    category: p.category,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#111827]">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 h-10 inline-flex items-center rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <ProductListTable data={data} />
    </div>
  );
}
