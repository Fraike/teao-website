import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { mapDbProduct, getProductUrl } from "@/lib/products";
import { JsonLdScript, productSchema, breadcrumbSchema } from "@/lib/structured-data";
import { Breadcrumb } from "@/components/products/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { CharacteristicsPills } from "@/components/products/CharacteristicsPills";
import { TorqueRangeBar } from "@/components/products/TorqueRangeBar";
import { PerformanceStats } from "@/components/products/PerformanceStats";
import { TechSpecsTable } from "@/components/products/TechSpecsTable";
import { MaterialsTable } from "@/components/products/MaterialsTable";
import { PerformanceCharts } from "@/components/products/PerformanceCharts";
import { DimensionDrawing } from "@/components/products/DimensionDrawing";
import { ApplicationScenarios } from "@/components/products/ApplicationScenarios";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { InquiryCTA } from "@/components/products/InquiryCTA";
import { ShareButtons } from "@/components/products/ShareButtons";
import { DownloadPDFButton } from "@/components/products/DownloadPDFButton";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const rows = await db.select({ slug: products.slug }).from(products).all();
  return rows.map((r) => ({ slug: r.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.select().from(products).where(eq(products.slug, slug)).get();
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seoTitle ?? `${product.model} - ${product.name}`,
    description: product.seoDescription ?? product.summary,
    openGraph: {
      title: product.name,
      description: product.summary,
      images: JSON.parse(product.images || "[]")?.[0]?.url
        ? [{ url: JSON.parse(product.images || "[]")[0].url, width: 800, height: 800 }]
        : product.image
          ? [{ url: product.image, width: 800, height: 800 }]
          : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const row = await db.select().from(products).where(eq(products.slug, slug)).get();
  if (!row) notFound();

  const product = mapDbProduct(row);
  const categoryRow = await db.select().from(categories).where(eq(categories.slug, product.category)).get();

  const relatedRows = await db.select().from(products).where(eq(products.category, product.category)).all();
  const related = relatedRows
    .filter((p) => p.slug !== slug)
    .map(mapDbProduct);

  const galleryImages =
    product.images.length > 0
      ? product.images
      : [{ url: product.image, alt: product.name }];

  const productJsonLd = productSchema(product, categoryRow?.name);
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    ...(categoryRow ? [{ name: categoryRow.name, url: `/${product.category}` }] : []),
    { name: product.model, url: getProductUrl(product) },
  ];
  const breadcrumbJsonLd = breadcrumbSchema(breadcrumbItems);

  return (
    <>
      <JsonLdScript data={productJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <section className="section pt-28 !pb-6 lg:pt-32" id="product-detail-content">
        <div className="shell">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb category={product.category} productName={product.model} />
          </div>

          {/* Hero Grid */}
          <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-8 lg:gap-12 mb-12 lg:mb-14 items-start">
            {/* Left: Gallery */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery images={galleryImages} />
            </div>

            {/* Right: Info */}
            <div>
              {categoryRow && <span className="eyebrow">{categoryRow.name}</span>}

              <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-[#111827] text-white text-[10px] font-black uppercase tracking-[0.14em]">
                {product.model}
              </span>

              <h1 className="mt-3 text-[clamp(30px,3.5vw,46px)] leading-[1.04] tracking-[-0.04em] font-extrabold text-[#111827]">
                {product.name}
              </h1>

              <p className="mt-4 text-[15px] lg:text-[16px] text-[#6B7280] leading-relaxed max-w-[560px]">
                {product.description}
              </p>

              {product.characteristics && product.characteristics.length > 0 && (
                <div className="mt-6">
                  <CharacteristicsPills characteristics={product.characteristics} />
                </div>
              )}

              {product.torque && (
                <div className="mt-7">
                  <TorqueRangeBar torque={product.torque} />
                </div>
              )}

              <div className="mt-6">
                <ShareButtons title={product.seo_title ?? product.name} summary={product.summary} />
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  href={`/contact?product=${encodeURIComponent(product.model)}`}
                  variant="primary"
                  data-analytics-event="cta_click"
                  data-analytics-target-type="cta"
                  data-analytics-target-id="request_quotation"
                  data-analytics-source="product_detail"
                >
                  Request Quotation
                </Button>
                <DownloadPDFButton model={product.model} />
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="mb-12 lg:mb-14">
            <PerformanceStats product={product} />
          </div>

          {/* Dimension Drawing */}
          {product.dimension_drawing && (
            <div className="mb-12 lg:mb-14 rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-5 lg:p-6">
              <div className="grid lg:grid-cols-[260px_minmax(0,680px)] gap-5 lg:gap-8 items-start">
                <div>
                  <span className="eyebrow">Drawing</span>
                  <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-[#111827]">
                    Technical Drawing
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
                    Key mounting and gear dimensions for engineering review. Click the drawing to inspect details.
                  </p>
                </div>
                <DimensionDrawing
                  src={product.dimension_drawing}
                  alt={`${product.model} dimension drawing`}
                />
              </div>
            </div>
          )}

          {/* Specs + Materials */}
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 mb-12 lg:mb-14 items-stretch">
            <TechSpecsTable
              specifications={product.specifications}
              tech_params={product.tech_params}
            />
            {product.materials && product.materials.length > 0 && (
              <MaterialsTable materials={product.materials} />
            )}
          </div>

          {/* Performance Charts */}
          {product.performance_charts && (
            <div className="mb-12 lg:mb-14">
              <PerformanceCharts charts={product.performance_charts} />
            </div>
          )}

          {/* Application Scenarios */}
          <div className="mb-12 lg:mb-14">
            <div className="mb-5 flex items-end justify-between gap-6">
              <div>
                <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#111827]">
                  Application Scenarios
                </h2>
                <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-[#6B7280]">
                  Common use cases for this product. More applications can be reviewed from your drawing.
                </p>
              </div>
            </div>
            <ApplicationScenarios scenarios={product.application_scenarios} max={3} />
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mb-2 lg:mb-4">
              <RelatedProducts products={related} max={4} />
            </div>
          )}
        </div>
      </section>

      <InquiryCTA />
    </>
  );
}
