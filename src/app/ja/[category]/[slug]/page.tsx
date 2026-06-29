import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, productTranslations, products } from "@/db/schema";
import { withLocale, getAlternateUrls, LOCALE_OG } from "@/lib/i18n";
import { applyProductTranslation } from "@/lib/translation/apply";
import { getProductUrl, mapDbProduct } from "@/lib/products";
import { getCategorySeo } from "@/lib/seo-keywords";
import { getProductVideos } from "@/lib/product-videos";
import { JsonLdScript, breadcrumbSchema, productSchema } from "@/lib/structured-data";
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
import { LanguageLinks } from "@/components/layout/LanguageLinks";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await db.select({ slug: products.slug, category: products.category }).from(products).all();
  return rows.map((row) => ({ category: row.category, slug: row.slug }));
}

async function getLocalizedProduct(slug: string, locale: string) {
  const row = await db.select().from(products).where(eq(products.slug, slug)).get();
  if (!row) return { row, product: null, translation: null };

  const baseProduct = mapDbProduct(row);
  const translation = await db
    .select()
    .from(productTranslations)
    .where(and(eq(productTranslations.productId, row.id), eq(productTranslations.locale, locale)))
    .get();

  return {
    row,
    product: applyProductTranslation(baseProduct, translation),
    translation,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const locale = "ja" as "ja" | "de";
  const { row, product } = await getLocalizedProduct(slug, locale);
  if (!row || !product || row.category !== category) return { title: "Product Not Found" };

  const categoryRow = await db.select().from(categories).where(eq(categories.slug, product.category)).get();
  const categorySeo = getCategorySeo(product.category, categoryRow?.name ?? product.category, categoryRow?.description ?? product.summary);
  const description = product.seo_description ?? product.summary;
  const image = product.images?.[0]?.url || product.image;
  const title = (product.seo_title ?? `${product.model} - ${product.name}`).replace(/\s*\|\s*TEAO$/i, "");
  const canonicalPath = withLocale(getProductUrl(product), locale);
  const alternates = getAlternateUrls(getProductUrl(product));

  return {
    title,
    description,
    keywords: [
      product.model,
      product.name,
      ...(product.tags || []),
      ...categorySeo.keywords.slice(0, 8),
      ...categorySeo.aliases,
      "TEAO",
    ],
    alternates: {
      canonical: canonicalPath,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      locale: LOCALE_OG[locale],
      images: image ? [{ url: image, width: 800, height: 800 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function LocalizedProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const locale = "ja" as "ja" | "de";

  const { row, product } = await getLocalizedProduct(slug, locale);
  if (!row || !product || row.category !== category) {
    if (row && row.category !== category) redirect(withLocale(getProductUrl({ slug: row.slug, category: row.category }), locale));
    notFound();
  }

  const categoryRow = await db.select().from(categories).where(eq(categories.slug, product.category)).get();
  const categorySeo = getCategorySeo(product.category, categoryRow?.name ?? product.category, categoryRow?.description ?? product.summary);
  const relatedRows = await db.select().from(products).where(eq(products.category, product.category)).all();
  const related = relatedRows.filter((p) => p.slug !== slug).map(mapDbProduct);
  const galleryImages = product.images.length > 0 ? product.images : [{ url: product.image, alt: product.name }];
  const productVideos = getProductVideos(product);
  const canonicalPath = withLocale(getProductUrl(product), locale);

  const productJsonLd = productSchema(
    {
      ...product,
      tags: Array.from(new Set([...(product.tags || []), ...categorySeo.keywords.slice(0, 6), ...categorySeo.aliases])),
    },
    categoryRow?.name,
  );
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: withLocale("/", locale) },
    { name: "Products", url: withLocale("/products", locale) },
    ...(categoryRow ? [{ name: categoryRow.name, url: withLocale(`/${product.category}`, locale) }] : []),
    { name: product.model, url: canonicalPath },
  ]);

  return (
    <>
      <JsonLdScript data={productJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <section className="section pt-28 !pb-6 lg:pt-32" id="product-detail-content">
        <div className="shell">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Breadcrumb category={product.category} productName={product.model} />
            <LanguageLinks path={getProductUrl(product)} />
          </div>

          <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-8 lg:gap-12 mb-12 lg:mb-14 items-start">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery images={galleryImages} videos={productVideos} />
            </div>

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
                <Button href={withLocale(`/contact?product=${encodeURIComponent(product.model)}`, locale)} variant="primary">
                  Request Quotation
                </Button>
                <DownloadPDFButton model={product.model} />
              </div>
            </div>
          </div>

          <div className="mb-12 lg:mb-14">
            <PerformanceStats product={product} />
          </div>

          {product.dimension_drawing && (
            <div className="mb-12 lg:mb-14 rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-5 lg:p-6">
              <div className="grid lg:grid-cols-[260px_minmax(0,680px)] gap-5 lg:gap-8 items-start">
                <div>
                  <span className="eyebrow">Drawing</span>
                  <h2 className="mt-3 text-xl font-extrabold tracking-[-0.02em] text-[#111827]">Technical Drawing</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
                    Key mounting and gear dimensions for engineering review.
                  </p>
                </div>
                <DimensionDrawing src={product.dimension_drawing} alt={`${product.model} dimension drawing`} />
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 mb-12 lg:mb-14 items-stretch">
            <TechSpecsTable specifications={product.specifications} tech_params={product.tech_params} />
            {product.materials && product.materials.length > 0 && <MaterialsTable materials={product.materials} />}
          </div>

          {product.variants && product.variants.variants.length > 0 && <VariantComparisonTable variants={product.variants} />}
          {product.performance_charts && (
            <div className="mb-12 lg:mb-14">
              <PerformanceCharts charts={product.performance_charts} />
            </div>
          )}

          <div className="mb-12 lg:mb-14">
            <div className="mb-5">
              <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#111827]">Application Scenarios</h2>
              <p className="mt-2 max-w-[560px] text-sm leading-relaxed text-[#6B7280]">
                Common use cases for this product. More applications can be reviewed from your drawing.
              </p>
            </div>
            <ApplicationScenarios scenarios={product.application_scenarios} max={3} />
          </div>

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
