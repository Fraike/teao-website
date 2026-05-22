import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import ProductForm from "@/components/admin/ProductForm";
import { serializeProduct } from "@/lib/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.select().from(products).where(eq(products.id, Number(id))).get();
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-6">Edit Product</h1>
      <ProductForm initial={serializeProduct(product)} />
    </div>
  );
}
