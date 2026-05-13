import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/ui/reveal";

export function ProductGrid() {
  const cats = db.select().from(categories).all().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="section scroll-mt-24 lg:scroll-mt-28" id="products">
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
                    <span className="eyebrow">Product Lines</span>
                    <div>
                      <h3 className="text-3xl leading-[1.02] font-extrabold">
                        Custom-ready platforms.
                      </h3>
                      <p className="mt-3 text-sm leading-5 text-white/68">
                        Five focused families for faster sourcing and engineering review.
                      </p>
                    </div>
                  </div>
                </Reveal>
              )}

            <Reveal delay={((i % 2) + 1) as 1 | 2}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="product-card"
              >
                <div className="product-card__media">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="product-card__image"
                    sizes="(max-width: 520px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                </div>

                <div className="product-card__copy">
                  <small className="text-[#ED7606] font-black uppercase tracking-[0.12em] text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </small>
                  <h3 className="product-card__title">
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
