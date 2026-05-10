import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-6">New Product</h1>
      <ProductForm isNew />
    </div>
  );
}
