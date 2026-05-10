import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import ProductForm from "@/components/admin/ProductForm";

function serializeProduct(p: typeof products.$inferSelect) {
  return {
    ...p,
    features: JSON.parse(p.features || "[]"),
    images: JSON.parse(p.images || "[]"),
    techParams: p.techParams ? JSON.parse(p.techParams) : undefined,
    specifications: JSON.parse(p.specifications || "{}"),
    torque: p.torque ? JSON.parse(p.torque) : undefined,
    durability: p.durability ? JSON.parse(p.durability) : undefined,
    materials: JSON.parse(p.materials || "[]"),
    characteristics: JSON.parse(p.characteristics || "[]"),
    performanceCharts: p.performanceCharts ? JSON.parse(p.performanceCharts) : undefined,
    applications: JSON.parse(p.applications || "[]"),
    tags: JSON.parse(p.tags || "[]"),
    isActive: Boolean(p.isActive),
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = db.select().from(products).where(eq(products.id, Number(id))).get();
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-6">Edit Product</h1>
      <ProductForm initial={serializeProduct(product)} />
    </div>
  );
}
