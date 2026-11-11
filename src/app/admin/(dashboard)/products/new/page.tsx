import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-[#111827] mb-6">新增产品 / New Product</h1>
      <ProductForm isNew />
    </div>
  );
}
