import Link from "next/link";
import { Fragment } from "react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";
import { SkeletonImage } from "@/components/ui/skeleton-image";

export async function ProductGrid() {
  const rows = await db.select().from(categories).all();
  const cats = rows.sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="section scroll-mt-24 lg:scroll-mt-28 bg-white" id="products">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow="Core Products"
            title="Five damper families for controlled motion."
            description="Select a standard platform or start from an application requirement. Each family can be tuned for torque, damping direction, angle and mounting."
          />
        </Reveal>

        <div className="product-card-grid">
          {cats.map((cat, i) => (
            <Fragment key={cat.slug}>
              {i === 4 && (
                <Reveal delay={1} className="product-card-intro-slot">
                  <div className="product-card-intro">
                    <span className="eyebrow !text-white/70">Product Lines</span>
                    <div>
                      <h3 className="text-[26px] lg:text-[clamp(22px,1.6vw,30px)] leading-[1.04] font-extrabold text-white tracking-[-0.03em]">
                        Custom-ready platforms.
                      </h3>
                      <p className="mt-3 text-sm leading-5 text-white/62">
                        Five focused families for faster sourcing and engineering review.
                      </p>
                    </div>
                    <div className="mt-4 w-10 h-1 rounded-full bg-[#ED7606]/60" />
                  </div>
                </Reveal>
              )}

            <Reveal delay={((i % 2) + 1) as 1 | 2}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="product-card group"
              >
                <div className="product-card__media">
                  <SkeletonImage
                    src={cat.image}
                    alt={cat.name}
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
                    {cat.name}
                  </h3>
                  <p className="product-card__description">{cat.description}</p>
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
