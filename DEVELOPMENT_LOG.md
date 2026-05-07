# Development Log

## 2026-05-05 — Code Review & Fixes (Round 1)

**Review against DEVELOPMENT.md v1.0**

### Issues Fixed

| # | Issue | File(s) Changed |
|---|-------|-----------------|
| 1 | `/faq` route missing — footer linked to non-existent page | Created `src/app/faq/page.tsx` |
| 2 | `metadataBase` missing — OG image URLs were relative | Added `metadataBase: new URL("https://www.teao-damper.com")` to `layout.tsx` |
| 3 | `og-image.png` referenced but file doesn't exist | Removed OG image reference until proper image created; `metadataBase` ensures future OG images resolve correctly |
| 4 | Contact form missing 4 fields (Phone, Country, Product interest, Annual volume) | Added all missing fields to `contact/page.tsx`, Product interest as `<select>` dropdown |
| 5 | `framer-motion` in deps but unused (planned for Phase 2) | Kept dependency, noted in log |
| 6 | Font stack mismatched spec | Updated `globals.css` to match spec: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| 7 | Application card "Industrial Components" used `home-appliances.png` | Changed to `/images/company/automation-equipment-3.jpg` |
| 8 | CTA social links hardcoded `#` instead of using `SITE_CONFIG` | Updated to read from `SITE_CONFIG.social` |

### Known / Deferred to Phase 2

- `robots.txt`, `sitemap.xml`, `llms.txt` not yet created
- Structured data (Organization, Product, FAQ JSON-LD) not implemented
- Images not converted to WebP
- OG image (`og-image.png`) needs to be designed
- `framer-motion` not yet used — all animations currently CSS-based
- Social media URLs in `SITE_CONFIG` are placeholders (`#`)

---
## 2026-05-05 — Homepage UI Polish (Round 2)

### Product Cards — Fix aspect ratio & responsive
- Removed `aspect-ratio: 1` from `.product-card` (caused overly tall squares in 5-col desktop grid)
- Image area now uses `aspect-ratio: 4/3` on `.product-card__media` with white background
- Moved hover scale from Tailwind `group-hover` to CSS `.product-card:hover .product-card__image`
- Removed `group` class from product card links
- Desktop: title font-size reduced to `clamp(16px, 1.1vw, 20px)`, description `12px`
- Files: `globals.css`, `product-grid.tsx`

### Manufacturing Images — Premium redesign
- Replaced irregular 3-image layout with clean 2-column grid
- Top image: full-width `aspect-[21/9]` hero shot with "Automated Assembly Line" caption
- Bottom row: two equal `aspect-[4/3]` images with "Production Workshop" / "Injection & Tooling" labels
- Added gradient overlays + figcaption labels for editorial/architectural feel
- All images have subtle hover zoom (`scale-[1.03]`)
- File: `capability-section.tsx`

### Partner Section — Reduced spacing
- Changed section padding from `section` (96px top/bottom) to `py-14 lg:py-20` (56px/80px)
- Reduced SectionHead bottom margin via `className="mb-5 lg:mb-8"`
- File: `partner-section.tsx`

---
## 2026-05-05 — About Us Page (Round 3)

### New page: `/about` — full rebuild per spec
- **10 sections**: Hero → Video → Company Overview → Why TEAO → Product Capability → Manufacturing → Quality → Industries → Mission & Vision → CTA
- **Framer Motion**: First use in the project. Scroll-triggered fade-in-up on all sections via `motion.div` + `whileInView`. Play button uses `whileHover`/`whileTap`.
- **Video section**: Lazy-loaded YouTube embed. Cover image + play button → click loads iframe. No preloaded video.
- **SEO**: Title, full meta description, keywords, OpenGraph tags.

### Files created:
| File | Purpose |
|------|---------|
| `src/components/about/about-hero.tsx` | Dark hero with brand positioning + Framer Motion entrance |
| `src/components/about/about-video.tsx` | Click-to-play YouTube embed with cover image |
| `src/components/about/about-sections.tsx` | 7 sections (Overview, Why TEAO, Product Capability, Manufacturing, Quality, Industries, Mission) |
| `src/components/about/about-cta.tsx` | Dark CTA with "Get a Quote" / "Email Us" |
| `src/app/about/page.tsx` | Rewrote metadata + composes 4 component groups |

### Design notes:
- Dark industrial aesthetic with light section alternation
- Stats: 100M capacity, 10+ lines, IATF 16949 throughout
- 6 damper families listed (broader than homepage 5 categories)
- YouTube video ID placeholder: `REPLACE_WITH_YOUR_VIDEO_ID`

---
## 2026-05-05 — About Us Page Rewrite (Round 4)

### Complete rewrite per user feedback
- **Removed**: Product Capability, Quality & Certification, Industries & Customers, Video section
  — Reason: duplicate homepage content; About should focus on the company itself
- **New style**: Clean corporate aesthetic (white/light backgrounds) — deliberately distinct from homepage dark industrial style
- **New sections**: Company Story (narrative), Patents & R&D (9 certificates), Milestones (7-point timeline)

### Final structure (5 sections):
| Section | Style |
|---------|-------|
| Hero | White bg, split layout (text + factory image), 3 key stats (2001/20+/100M) |
| Company Story | Light gray bg, narrative text — Shenzhen→Dongguan journey |
| Patents & R&D | White bg, 3-column grid of 9 patent certificate images + labels |
| Milestones | Dark bg (one accent section), vertical timeline with 7 nodes (2001–2025) |
| CTA | Light bg, clean contact prompt |

### Other fixes:
- Corrected `SITE_CONFIG.founded` from 2003 → 2001 (verified via web research)
- Updated hero trust badge and footer to say "since 2001"
- Deleted unused `about-video.tsx`

---
## 2026-05-05 — About Us Page v3 (Round 5) — Per Prototype Spec

### Complete rewrite per `TEAO_About_Us_Prototype_Claude.md`
- 9 sections, dark industrial aesthetic, consistent with homepage
- Data extracted to `src/content/about.ts`
- Uses `next/image` for all content images

### Structure (9 sections):
| Component | Description |
|-----------|-------------|
| `AboutHero` | Dark hero, L: title+CTA+4 trust badges, R: factory image + floating product |
| `CompanyTimeline` | L: factory image + orange accent, R: vertical timeline (2001–2025) |
| `BusinessHighlights` | 6 dark glass stat cards (100+, 4 Markets, RMB 50M, 6%, 20+11, 200+) |
| `CompanyVideoSection` | Click-to-play YouTube embed with cover image |
| `CoreCompetencies` | 3 cards: Assembly / **Custom Torque** (highlighted) / Plastic Injection |
| `CertificationsSection` | L: quality text, R: 4 cert cards with patent images |
| `CustomersSection` | 5 industry icon cards + 16 brand names |
| `CorporateValues` | 4 value icon cards: Innovation / Excellence / Collaboration / Integrity |
| `AboutCTA` | Dark CTA with 2 buttons + 3 feature rows |

### Key features:
- **Organization JSON-LD** structured data in page
- **Custom Torque** highlighted with orange border in CoreCompetencies
- Slogan: "Slow down the closing and keep quiet in motion"
- All sections use Framer Motion `whileInView`
- SEO: 7 keywords, full OpenGraph

---
## 2026-05-05 — SEO & Performance Optimization (Round 6)

### SEO Fixes
| # | Change | File(s) |
|---|--------|---------|
| 1 | **Homepage JSON-LD** Organization schema added | `src/app/page.tsx` |
| 2 | **robots.txt** generated via `robots.ts` | `src/app/robots.ts` |
| 3 | **sitemap.xml** generated via `sitemap.ts` (10 routes with priorities) | `src/app/sitemap.ts` |
| 4 | **Google Fonts → `next/font/google`** (self-hosted, no external CDN, `display: swap`) | `src/app/layout.tsx`, `globals.css` |
| 5 | **`metadataBase` → env variable** | `src/app/layout.tsx` |

### Performance Fixes
| # | Change | Impact |
|---|--------|--------|
| 1 | **全站 `<img>` → `next/image`** (~40处) | Auto WebP, lazy loading, responsive sizes, LCP优化 |
| | Files: `header.tsx`, `footer.tsx`, `hero-section.tsx`, `product-grid.tsx`, `capability-section.tsx`, `application-section.tsx`, `partner-section.tsx`, `products/page.tsx`, `products/[slug]/page.tsx`, `quality/page.tsx` |
| 2 | **Header logo `priority`** | LCP 元素标记优先级 |
| 3 | **`hero-section.tsx` → Server Component** | 首页 JS 从 3.44 kB → 595 B (↓83%) |

### Backend Integration Preparation
| # | Change | File(s) |
|---|--------|---------|
| 1 | **`.env.example`** — 11 environment variables | `.env.example` |
| 2 | **`src/lib/env.ts`** — typed env access | `src/lib/env.ts` |
| 3 | **`src/lib/api.ts`** — typed API client (products, categories, partners, about, news) | `src/lib/api.ts` |
| 4 | **`SITE_CONFIG.social`** → env variables | `src/lib/constants.ts` |
| 5 | **YouTube video ID** → env variable (`NEXT_PUBLIC_YOUTUBE_VIDEO_ID`) | `src/content/about.ts` |

### Build Result
- 15 routes (incl. robots.txt, sitemap.xml)
- Homepage First Load JS: 120 kB (↓2 kB)
- Homepage JS: 595 B (↓83%)
- Zero `<img>` tags remaining — all `next/image`

---
## 2026-05-05 — Contact Page Rewrite (Round 7)

### Complete redesign per user requirements
- **3 sections**: Hero → Form + Download → FAQ
- **Reference**: Original site `chinateao.com/contacts/` layout

### Structure:
| Section | Style | Content |
|---------|-------|---------|
| Hero | Dark bg (`#0a0b0d`), dot grid pattern | Title + description + email/address cards |
| Form + Sidebar | Light bg (`#F7F7F5`), 2-col grid | Enhanced form (7 fields) + PDF Download card + "What happens next" guide |
| FAQ | Dark bg (`#171717`), `<details>` accordion | 6 purchasing/inquiry FAQ (no JS needed) |

### Key features:
- **PDF Download**: `/remark/阻尼器使用注意事项.pdf` — prominent dark card with orange accent, `download` attribute
- **Native `<details>` accordion** — zero JavaScript, SEO-friendly (content is always in DOM)
- **SEO**: 5 keywords, full OpenGraph, keyword-rich title
- **Form fields**: Name, Company, Email, Phone, Country, Product Interest (select), Annual Volume, Message
- **Contact page JS**: 128 B (all server-rendered, no client hydration)

---
## 2026-05-05 — Torque Converter Tool (Round 8)

### New tool: `/torque-converter` — per development spec
- **Reference**: Original site `chinateao.com/convert/`
- **Component**: `src/components/tools/TorqueConverter.tsx` (client component, ~3 kB)

### Technical implementation:
| Feature | Detail |
|---------|--------|
| **Conversion base** | All 9 units → N·m → target unit |
| **Units** | N·m, cN·m, mN·m, kgf·cm, kgf·m, gf·cm, lbf·in, lbf·ft, ozf·in |
| **Real-time** | `useMemo` recomputes on every input/unit change — no button needed |
| **Display** | 3×3 result grid, adaptive precision (3-4 sig figs), `tabular-nums` for alignment |
| **TEAO units** | gf·cm + mN·m highlighted with orange border + "TEAO" badge |

### Coefficients (to N·m, per spec):
| Unit | Coefficient |
|------|-------------|
| N·m | 1 |
| cN·m | 0.01 |
| mN·m | 0.001 |
| kgf·cm | 0.0981 |
| kgf·m | 9.81 |
| gf·cm | 0.0000981 |
| lbf·in | 0.113 |
| lbf·ft | 1.36 |
| ozf·in | 0.00706 |

### Page structure (3 sections):
| Section | Content |
|---------|---------|
| Hero | Dark bg, title + description |
| Converter | Dark card with input/select + 9-unit result grid |
| Tips | 3-step usage guide + TEAO torque note |

### SEO: 7 keywords, OpenGraph, keyword-rich title

