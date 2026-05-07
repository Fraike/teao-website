# TEAO Website Development Guide v1.0

## 1. Project Overview

**Company:** Dongguan TEAO Electronic Technology Co., Ltd.
**Brand:** TEAO
**Domain:** www.teao-damper.com
**Industry:** Automotive components — dampers, latches & motion control
**Positioning:** B2B (OEM, Tier-1, industrial customers)

### Core Products
- Gear Dampers (rotary control)
- Cylinder Dampers (axial/linear)
- Glove Box Dampers (soft-open)
- Latches (push-push, lock/release)
- Custom Damper Modules

### Core Capabilities
- 20+ years damping expertise
- Custom torque, angle, direction, mounting
- In-house mold, injection, assembly, testing
- IATF 16949-oriented quality system
- ISO 14001 certified
- -40°C to +90°C stable performance
- 80M annual capacity

---

## 2. Project Goals

### Brand Upgrade
- High-end, professional, international
- Clearly superior to existing website
- Matches automotive supplier positioning

### Customer Acquisition
- Optimized for overseas clients (Google traffic)
- Targets procurement managers, engineers, decision-makers
- Maximizes inquiry conversion rate

### AI-Era Ready
- Structured for AI crawlers: ChatGPT, Perplexity, Google AI Overview, Bing Copilot
- Semantic HTML, complete text content, clear page structure

---

## 3. Target Users

| Role | Concerns |
|------|----------|
| **Procurement** | Price, lead time, supply stability, capacity |
| **Engineers** | Torque, structure, mounting, materials, performance data |
| **Decision Makers** | Reliability, experience, client cases, long-term partnership |

---

## 4. Design System

### Color Palette
| Role | Value | Usage |
|------|-------|-------|
| **Brand Accent** | `#ED7606` | Buttons, links, emphasis, active states |
| **Accent Hover** | `#D46900` | Button hover states |
| **Accent Light** | `#FFF1E3` | Tag backgrounds, selected states |
| **Accent Subtle** | `#FFFAF5` | Feature card backgrounds |
| **Dark** | `#171717` | Headings, dark sections |
| **Dark Secondary** | `#2D2D2D` | Footer background |
| **Body Text** | `#333333` | Main text |
| **Muted** | `#666666` | Secondary text, labels |
| **Border** | `#E5E5E5` | Card borders, dividers |
| **Light Bg** | `#F5F5F5` | Light gray backgrounds |
| **Off White** | `#FAFAFA` | Alternating section backgrounds |
| **White** | `#FFFFFF` | Primary background |

**Rule:** Orange used sparingly — <5% of total area. Heavy white space (~85%).

### Typography
- **Font:** Inter (Google Fonts, plan self-host subset)
- **Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| H1 Hero | 3.5rem (56px) | 900 Black | Homepage main title |
| H2 Section | 2.75rem (44px) | 800 Extra Bold | Section headings |
| H3 Card | 1.125rem (18px) | 700 Bold | Card titles |
| Body Large | 1.125rem (18px) | 400 | Hero description |
| Body | 1rem (16px) | 400 | Body text |
| Body Small | 0.875rem (14px) | 400 | Secondary text |
| Caption | 0.8125rem (13px) | 500/600 | Labels, trust text |
| Label | 0.75rem (12px) | 700 | Section labels (uppercase) |

- Headings: `letter-spacing: -0.02em`
- Section labels: `letter-spacing: 0.12em`, uppercase
- Line height: headings 1.1–1.15, body 1.6–1.7

### Design Keywords
Precision · Engineering · Automotive · Reliable · Motion Control · Quiet

**Style:** High-end industrial, dark-leaning, clean hierarchy, subtle motion.
**Forbidden:** Template look, e-commerce feel, excessive gradients, low-end UI.

---

## 5. Page Structure & Routes

| Route | Page | Type |
|-------|------|------|
| `/` | Homepage | Static |
| `/products` | Product listing (with category filter) | Static |
| `/products/[slug]` | Product detail | Dynamic |
| `/applications` | Application scenarios | Static |
| `/solutions` | Custom solutions | Static |
| `/about` | About TEAO | Static |
| `/quality` | Quality control & manufacturing | Static |
| `/news` | News listing | Static |
| `/news/[slug]` | News detail | Dynamic |
| `/contact` | Contact form + info | Static |
| `/torque-converter` | Torque converter tool + FAQ | Static |

### Homepage Sections (in order)
1. **Header** — Fixed, sticky, mega-menu
2. **Hero** — Dark background, trust badge, H1, CTAs, metrics
3. **Core Products** — 5-column product card grid
4. **Manufacturing** — Dark section, capability checklist + factory images
5. **Applications** — 4-column industry cards
6. **Partners** — 12 automotive brand logos
7. **Project Flow** — 4-step process
8. **News** — 3-column news cards
9. **CTA** — Contact panel + inquiry prompt
10. **Footer** — Links, contact info, copyright

### Homepage Content Rules
```
Who you are
What you sell
What you've done
What problems you solve
Why choose you
How to contact you
```

---

## 6. Animation Guidelines

### Approved
| Element | Effect | Duration |
|---------|--------|----------|
| Hero title | Fade in up | 600ms |
| Product cards hover | Lift 4px + shadow + image scale 1.06x | 300ms |
| Scroll entrance | Fade in up via Intersection Observer | 600ms |
| Header sticky | Background blur + border | 300ms |
| CTA button hover | Deepen + lift 1px | 150ms |

### Rejected
- Parallax scrolling
- Full-screen video hero
- WebGL / Three.js
- Heavy animation libraries (AOS, ScrollMagic)
- Mouse-follow / cursor effects
- Page transition animations

**Principle:** Animations serve quality perception only — no performance burden, no SEO impact.

---

## 7. Performance & SEO

### Performance Targets
- Lighthouse Score > 90
- SEO Score > 95
- First Contentful Paint < 1.5s

### Measures
- Images: WebP preferred, compress to <100KB
- Lazy loading: `loading="lazy"` for below-fold images
- Font: `font-display: swap`, self-host subset
- No large video on homepage
- Minimal JavaScript
- Mobile-first responsive

### SEO Checklist
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- H1 → H2 → H3 hierarchy correct
- Meta descriptions on all pages
- Open Graph tags
- Image alt text on all product images
- Structured data: `Organization`, `Product`, `FAQ`

### Required Files
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`

### AI Crawler Rules
- Every product page must answer: what, where used, features, customization options
- Text must be complete — not reliant on images
- FAQ section required (used by AI & SEO)

---

## 8. Technical Architecture

### Frontend
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4 (custom theme)
- Framer Motion (for refined animations)
- shadcn/ui + lucide-react

### Backend (Phase 1)
- Next.js API Routes
- No database (static data)
- Contact form → email

### Future Phases
- PostgreSQL + Prisma ORM
- CMS (Payload / Strapi / Sanity)
- CRM / ERP integration
- AI chatbot / product recommendation

### Deployment
- Vercel (recommended)
- Cloudflare Pages (global CDN)
- Overseas VPS (Singapore / Japan / US)

---

## 9. Project Structure

```
teao-website/
├── src/
│   ├── app/                         # App Router pages
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Tailwind + theme + animations
│   │   ├── page.tsx                 # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx             # Product listing
│   │   │   └── [slug]/page.tsx      # Product detail
│   │   ├── applications/page.tsx
│   │   ├── solutions/page.tsx
│   │   ├── about/page.tsx
│   │   ├── quality/page.tsx
│   │   ├── news/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── torque-converter/page.tsx
│   │   └── api/                     # API routes (future)
│   ├── components/
│   │   ├── layout/ (header, footer)
│   │   ├── home/ (hero, product-grid, capability, partner, application, process, news, cta)
│   │   ├── product/ (product-card)
│   │   ├── faq/ (faq-section)
│   │   └── ui/ (button, section-head, reveal)
│   ├── lib/ (constants, utils, api)
│   └── types/ (index.ts)
├── public/images/
│   ├── company/                     # Factory & equipment photos
│   ├── products/                    # Product images (5 categories)
│   ├── partners/                    # Partner brand logos
│   ├── applications/                # Application scene images
│   ├── logo-white.png
│   ├── logo-color.png
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## 10. Image Naming Convention

```
Product images:    gear-damper.png, cylinder-damper.png
Company images:    factory-entrance.jpg, automation-workshop.jpg
Partner logos:     BYD.png, Geely.png, NIO.png
Application:       automotive.png, bathroom.png
Logos:             logo-white.png, logo-color.png
```

All lowercase, hyphens for spaces, English only.

---

## 11. Development Phases

### Phase 1 (Current) — Complete
- Homepage with all sections
- Product listing & detail pages
- All supporting pages (about, quality, applications, solutions, contact, news, torque-converter)
- Static product data
- Responsive layout
- Basic SEO (metadata, semantic HTML)
- All images organized with English naming

### Phase 2 (Next)
- Structured data (Organization, Product, FAQ schemas)
- robots.txt / sitemap.xml / llms.txt
- Refined animations (Framer Motion)
- Contact form functionality
- Performance optimization (WebP conversion)

### Phase 3
- Inquiry system
- Blog / engineering articles
- SEO content pages
- Image optimization (WebP, compression)

### Phase 4 (AI)
- AI chatbot
- AI product recommendation
- AI quotation system

---

## 12. Inquiry Form Fields

```
Name (required)
Company
Email (required)
Phone
Country
Product interest
Annual volume
Message
```

---

## 13. Development Rules

- Component-based architecture
- No template-like UI
- SEO-first, performance-first, mobile-first
- All content readable by AI crawlers
- English-only naming (files, directories, code)
- Keep it simple — avoid premature abstraction
- No comments unless the WHY is non-obvious
