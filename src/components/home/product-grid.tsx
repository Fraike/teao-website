import Link from "next/link";
import { Fragment } from "react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { SkeletonImage } from "@/components/ui/skeleton-image";
import type { SiteLocale } from "@/lib/i18n-ui";
import { withLocale } from "@/lib/i18n";
import { getHomeCopy } from "@/lib/home-i18n";
import { getCategoryUrl } from "@/lib/products";

export async function ProductGrid({ locale = "en" }: { locale?: SiteLocale }) {
  const rows = await db.select().from(categories).all();
  const cats = rows.sort((a, b) => a.sortOrder - b.sortOrder);
  const copy = getHomeCopy(locale).products;

  return (
    <section className="section scroll-mt-24 lg:scroll-mt-28 bg-white" id="products">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
          />
        </Reveal>

        <div className="product-card-grid">
          {cats.map((cat, i) => (
            <Fragment key={cat.slug}>
              {i === 4 && (
                <Reveal delay={1} className="product-card-intro-slot">
                  <div className="product-card-intro">
                    <span className="eyebrow !text-white/70">{copy.introEyebrow}</span>
                    <div>
                      <h3 className="text-[26px] lg:text-[clamp(22px,1.6vw,30px)] leading-[1.04] font-extrabold text-white tracking-[-0.03em]">
                        {copy.introTitle}
                      </h3>
                      <p className="mt-3 text-sm leading-5 text-white/62">
                        {copy.introBody}
                      </p>
                    </div>
                    <div className="mt-4 w-10 h-1 rounded-full bg-[#ED7606]/60" />
                  </div>
                </Reveal>
              )}

            <Reveal delay={((i % 2) + 1) as 1 | 2}>
              <Link
                href={withLocale(getCategoryUrl(cat), locale)}
                className="product-card group"
              >
                <div className="product-card__media">
                  <SkeletonImage
                    src={cat.image}
                    alt={copy.categories[cat.slug as keyof typeof copy.categories]?.name || cat.name}
                    fill
                    loading="lazy"
                    containerClassName="absolute inset-5 lg:inset-4"
                    className="product-card__image"
                    sizes="(max-width: 520px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                </div>

                <div className="product-card__copy">
                  <span className="inline-flex items-center gap-1.5 text-[#ED7606] font-black uppercase tracking-[0.14em] text-[10px] mb-1">
                    <span className="w-1 h-1 rounded-full bg-[#ED7606]" />
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="product-card__title group-hover:text-[#ED7606] transition-colors duration-300">
                    {copy.categories[cat.slug as keyof typeof copy.categories]?.name || cat.name}
                  </h3>
                  <p className="product-card__description">{copy.categories[cat.slug as keyof typeof copy.categories]?.description || cat.description}</p>
                </div>
              </Link>
            </Reveal>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
