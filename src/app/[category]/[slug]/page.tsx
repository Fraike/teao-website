import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import type { Product } from "@/types";
import { mapDbProduct, getProductUrl, formatTorque } from "@/lib/products";
import { JsonLdScript, productSchema, breadcrumbSchema, faqPageSchema } from "@/lib/structured-data";
import { Breadcrumb } from "@/components/products/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { CharacteristicsPills } from "@/components/products/CharacteristicsPills";
import { TorqueRangeBar } from "@/components/products/TorqueRangeBar";
import { PerformanceStats } from "@/components/products/PerformanceStats";
import { TechSpecsTable } from "@/components/products/TechSpecsTable";
import { MaterialsTable } from "@/components/products/MaterialsTable";
import { PerformanceCharts } from "@/components/products/PerformanceCharts";
import { VariantComparisonTable } from "@/components/products/VariantComparisonTable";
import { DimensionDrawing } from "@/components/products/DimensionDrawing";
import { ApplicationScenarios } from "@/components/products/ApplicationScenarios";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { InquiryCTA } from "@/components/products/InquiryCTA";
import { ShareButtons } from "@/components/products/ShareButtons";
import { DownloadPDFButton } from "@/components/products/DownloadPDFButton";
import { Button } from "@/components/ui/button";
import { getCategorySeo } from "@/lib/seo-keywords";
import { getProductVideos } from "@/lib/product-videos";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export const revalidate = 60;

function getProductTypeLabel(product: Product, categoryName?: string) {
  if (product.category === "gear-damper") return "gear damper / rotary damper";
  if (product.category === "axial-damper") return "axial damper / barrel damper";
  return (categoryName || product.category).toLowerCase();
}

function buildProductFaq(product: Product, categoryName?: string) {
  const typeLabel = getProductTypeLabel(product, categoryName);
  const torque = formatTorque(product);
  const applications = product.applications.length > 0
    ? product.applications.slice(0, 4).join(", ")
    : "custom automotive and industrial mechanisms";
  const direction = product.buffer_direction || "the required damping direction";

  return [
    {
      q: `What is ${product.model} used for?`,
      a: `${product.model} is a ${typeLabel} for controlled soft motion in ${applications}. It helps reduce impact, slow down movement and improve perceived mechanism quality.`,
    },
    {
      q: `What torque or force range does ${product.model} support?`,
      a: torque
        ? `${product.model} is specified with a nominal damping range of ${torque}. Final selection should still be checked against the motion path, lid weight, opening angle, target speed and installation ratio.`
        : `${product.model} should be selected by matching the target damping force, motion path, opening angle, target speed and available installation space.`,
    },
    {
      q: `What should be confirmed before choosing ${product.model}?`,
      a: `Confirm the application position, ${direction}, available mounting space, operating temperature, required cycle life, noise target and expected annual volume before quotation or sample validation.`,
    },
  ];
}

function isWeakSeoDescription(description?: string | null) {
  if (!description) return true;
  const trimmed = description.trim();
  return trimmed.length < 90 || /^(Torque|Operating Force):/i.test(trimmed);
}

function buildFallbackSeoTitle(model: string, category: string, name: string) {
  if (category === "gear-damper") return `${model} Rotary Gear Damper for Soft-Motion Mechanisms`;
  if (category === "axial-damper") return `${model} Axial Barrel Damper for Compact Motion Control`;
  if (category === "glove-box-damper") return `${model} Glove Box Damper for Controlled Descent`;
  if (category === "latch") return `${model} Latch Mechanism for Automotive and Industrial Assemblies`;
  return `${model} ${name}`;
}

function isGenericSeoTitle(title: string | null | undefined, model: string, category: string) {
  if (!title) return true;
  const normalized = title.replace(/\s*\|\s*TEAO$/i, "").trim().toLowerCase();
  return normalized === `${model} - ${category.replace(/-/g, " ")}`.toLowerCase();
}

function buildFallbackSeoDescription(model: string, category: string, summary: string, seoDescription?: string | null) {
  const spec = seoDescription?.trim() && /^(Torque|Operating Force):/i.test(seoDescription.trim())
    ? ` ${seoDescription.trim()}`
    : "";

  if (category === "gear-damper") {
    return `${model} is a rotary damper / gear damper for quiet soft-motion control in automotive interiors, lids, covers and industrial mechanisms.${spec}`;
  }
  if (category === "axial-damper") {
    return `${model} is an axial damper / barrel damper for compact hinge, handle and storage mechanisms requiring stable soft opening or return control.${spec}`;
  }
  if (category === "glove-box-damper") {
    return `${model} is a glove box damper for controlled descent, reduced impact noise and smoother automotive interior storage movement.${spec}`;
  }
  if (category === "latch") {
    return `${model} is a latch mechanism for controlled locking, release feel and repeatable assembly performance in automotive and industrial applications.${spec}`;
  }
  return `${model} is a TEAO motion control component for custom damping, synchronizing or assisted movement in compact mechanisms. ${summary}`.trim();
}

export async function generateStaticParams() {
  const rows = await db.select({ slug: products.slug, category: products.category }).from(products).all();
  return rows.map((row) => ({ category: row.category, slug: row.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await db.select().from(products).where(eq(products.slug, slug)).get();
  if (!product || product.category !== category) return { title: "Product Not Found" };

  const categoryRow = await db.select().from(categories).where(eq(categories.slug, product.category)).get();
  const categorySeo = getCategorySeo(product.category, categoryRow?.name ?? product.category, categoryRow?.description ?? product.summary);
  const productTags = JSON.parse(product.tags || "[]") as string[];
  const description = isWeakSeoDescription(product.seoDescription)
    ? buildFallbackSeoDescription(product.model, product.category, product.summary, product.seoDescription)
    : product.seoDescription ?? product.summary;
  const image = JSON.parse(product.images || "[]")?.[0]?.url || product.image;
  const title = (
    !isGenericSeoTitle(product.seoTitle, product.model, product.category) && product.seoTitle?.trim()
      ? product.seoTitle
      : buildFallbackSeoTitle(product.model, product.category, product.name)
  ).replace(/\s*\|\s*TEAO$/i, "");

  return {
    title,
    description,
    keywords: [
      product.model,
      product.name,
      ...productTags,
      ...categorySeo.keywords.slice(0, 12),
      ...categorySeo.aliases,
      "TEAO",
    ],
    alternates: {
      canonical: getProductUrl(product),
    },
    openGraph: {
      title: product.name,
      description,
      images: image ? [{ url: image, width: 800, height: 800 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function CategoryProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const row = await db.select().from(products).where(eq(products.slug, slug)).get();
  if (!row || row.category !== category) {
    if (row && row.category !== category) {
      // Wrong category in URL — redirect to correct canonical URL
      redirect(getProductUrl({ slug: row.slug, category: row.category }));
    }
    notFound();
  }

  const product = mapDbProduct(row);
  const categoryRow = await db.select().from(categories).where(eq(categories.slug, product.category)).get();
  const categorySeo = getCategorySeo(product.category, categoryRow?.name ?? product.category, categoryRow?.description ?? product.summary);

  const relatedRows = await db.select().from(products).where(eq(products.category, product.category)).all();
  const related = relatedRows
    .filter((p) => p.slug !== slug)
    .map(mapDbProduct);

  const galleryImages =
    product.images.length > 0
      ? product.images
      : [{ url: product.image, alt: product.name }];
  const productVideos = getProductVideos(product);

  const productJsonLd = productSchema(
    {
      ...product,
      tags: Array.from(new Set([...(product.tags || []), ...categorySeo.keywords.slice(0, 8), ...categorySeo.aliases])),
    },
    categoryRow?.name,
  );
  const productFaq = buildProductFaq(product, categoryRow?.name);
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
      <JsonLdScript data={faqPageSchema(productFaq)} />
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
              <ProductGallery images={galleryImages} videos={productVideos} />
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

          {/* Variant Comparison Table */}
          {product.variants && product.variants.variants.length > 0 && (
            <VariantComparisonTable variants={product.variants} />
          )}

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

          {/* Product FAQ */}
          <section className="mb-12 lg:mb-14 rounded-xl border border-[#E5E7EB] bg-white p-5 lg:p-6">
            <div className="mb-5">
              <span className="eyebrow">Selection FAQ</span>
              <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-[#111827]">
                Engineering notes for {product.model}
              </h2>
            </div>
            <div className="grid gap-3">
              {productFaq.map((item) => (
                <div key={item.q} className="rounded-lg border border-[#EEF1F4] bg-[#F8F9FA] p-4">
                  <h3 className="text-sm font-black text-[#111827]">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

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
