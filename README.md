# TEAO Website

TEAO (Dongguan TEAO Precision Technology Co., Ltd.) — automotive damper & latch manufacturer website. B2B platform for product discovery, engineering inquiry, and company information.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript 5.8 (strict mode) |
| Styling | Tailwind CSS v4 (PostCSS) |
| Database ORM | Drizzle ORM + @libsql/client |
| Database | SQLite (local dev) / Turso (production) |
| Auth | JWT via `jose` + bcryptjs (httpOnly cookie) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Package Manager | npm |

## Project Structure

```
src/
  app/                          # Next.js App Router
    layout.tsx                  # Root layout (metadata, fonts, AnalyticsProvider)
    page.tsx                    # Homepage
    api/                        # API route handlers
      analytics/event/          # POST - track analytics events
      auth/login/ logout/ me/   # Auth endpoints (JWT cookie-based)
      contact/                  # POST - contact form submission
      media/                    # GET/POST/DELETE - file upload management
      news/ news/[id]/          # CRUD - news articles
      products/ products/[id]/  # CRUD - product catalog
      upload/                   # POST - single file upload
      categories/               # GET - category list
    admin/                      # Admin panel (auth-guarded)
      (dashboard)/              # Layout shell with nav bar
        analytics/              # Analytics dashboard page
        products/ products/new/ products/[id]/
        news/ news/new/ news/[id]/
        media/
    products/ products/[slug]/  # Public product listing & detail
    applications/automotive/    # Automotive interactive scene map
    about/ contact/ faq/ news/ quality/ torque-converter/ privacy-policy/
    llms.txt/ llms-full.txt/    # AI-readable site content
    robots.ts                   # robots.txt (blocks /admin, /api)
    sitemap.ts                  # Dynamic XML sitemap
  components/
    analytics/                  # AnalyticsProvider (client tracking)
    home/                       # Homepage sections
    about/                      # About page sections
    products/                   # Product display components
    contact/                    # ContactForm
    layout/                     # Header, Footer, PublicChrome
    admin/                      # ProductForm, NewsForm, list tables
    ui/                         # Button, Reveal, SectionHead, SkeletonImage
    tools/                      # TorqueConverter
  db/
    index.ts                    # DB client (Turso remote / local file auto-switch)
    schema.ts                   # Drizzle schema (6 tables)
    seed.ts                     # Seed script
  lib/
    auth.ts                     # JWT sign/verify, session management
    env.ts                      # Typed environment variable access
    products.ts                 # mapDbProduct (DB row → typed product)
    structured-data.tsx         # JSON-LD schema generators
    constants.ts                # Fallback product data
    utils.ts                    # Shared utilities
  content/
    about.ts                    # About page static content
    faq.ts                      # FAQ items
    automotive-applications.ts  # Automotive scene/product mapping
  types/                        # TypeScript type definitions
```

## Database

### Architecture

Dual-environment setup in `src/db/index.ts`:
- **Local**: SQLite file at `data/teao.db` (auto-created if absent)
- **Production**: Turso (libsql) cloud database
- Switch is automatic based on `TURSO_DATABASE_URL` env var

### Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `categories` | Product categories (5 rows) | slug, name, description, image, sort_order |
| `products` | Product catalog | slug, model, name, category, specifications (JSON), images (JSON), torque (JSON), materials (JSON), is_active |
| `news` | News/articles | slug, title, summary, content, category, is_published, published_at |
| `admins` | Admin accounts | username, password_hash (bcrypt) |
| `analytics_events` | Event tracking log | event, page, target_type, target_id, source, session_id |
| `contact_inquiries` | Contact form submissions | name, email, company, product_interest, message |

### Image Storage

All product/company images are **local static files** under `public/images/`. Images ARE committed to Git. The database stores paths (e.g., `/images/products/gear-damper/RD-T015-product-01.webp`), never binary blobs.

### Seeding

```bash
npm run db:seed   # Seeds: 5 categories, 12 products, 3 news, admin (admin / teao123)
```

## Environment Variables

Copy `.env.example` to `.env`:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://www.teao-damper.com` | Canonical URL |
| `TURSO_DATABASE_URL` | Production | — | Turso DB URL (unset = use local SQLite) |
| `TURSO_AUTH_TOKEN` | Production | — | Turso auth token |
| `AUTH_SECRET` | Production | `dev-secret` | JWT signing secret |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | — | Enable Plausible analytics |
| `GOOGLE_SITE_VERIFICATION` | Optional | — | Google Search Console |
| `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` | Optional | — | About page video embed |
| `NEXT_PUBLIC_LINKEDIN_URL` | Optional | `#` | Social link (empty or `#` = hidden) |
| `NEXT_PUBLIC_YOUTUBE_URL` | Optional | `#` | Social link |
| `NEXT_PUBLIC_FACEBOOK_URL` | Optional | `#` | Social link |
| `NEXT_PUBLIC_ALIBABA_URL` | Optional | `#` | Social link |

## Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (GUI)
npm run db:seed      # Seed database
```

## Analytics System

### How it works

1. `AnalyticsProvider` wraps all public pages (mounted in root layout)
2. Generates anonymous `sessionId` via `crypto.randomUUID()`, stored in `sessionStorage`
3. Tracks events via two mechanisms:
   - **Click delegation**: Any element with `data-analytics-event` attribute
   - **Programmatic**: `window.dispatchEvent(new CustomEvent("teao:track", { detail }))`
4. Events sent via `navigator.sendBeacon()` (with `fetch` fallback)
5. Automatic `page_view` on route changes

### Tracked events

| Event | Trigger | Attributes |
|-------|---------|------------|
| `page_view` | Route change | page |
| `product_click` | Product card/link click | targetId, source |
| `cta_click` | CTA button click | targetId, source |
| `scene_click` | Automotive hotspot click | targetId (scene name) |
| `category_click` | Category card click | targetId |
| `search` | Search input | targetId (query) |
| `form_submit` | Contact form success | targetId (product interest) |

### Admin Dashboard

`/admin/analytics` — Overview cards, Top Products, Top Pages, Event Distribution, Traffic Sources, Conversion Funnel (7-day).

## Key Patterns

- **Auth**: Admin routes call `getSession()` → `redirect("/admin/login")` if unauthenticated. API routes check `getSession()` and return 401.
- **Product data**: DB is source of truth; `src/lib/constants.ts` provides build-time fallback. `mapDbProduct()` in `src/lib/products.ts` normalizes DB rows into typed objects.
- **Static content**: `/app/about`, `/app/faq` etc. pull static data from `src/content/` TypeScript files, not the database.
- **Security headers**: `next.config.ts` sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`. Images get 1-year cache, uploads get 7-day cache.
- **Contact form**: Math CAPTCHA + honeypot field (`website`) + privacy consent checkbox. Server-side validation in `POST /api/contact`.
- **SEO**: JSON-LD structured data on all pages, dynamic sitemap, AI-readable text endpoints (`/llms.txt`, `/llms-full.txt`), robots.txt blocks admin/api.

## Deployment Notes

1. Set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` in production (or data persists in `data/teao.db` which is NOT in Git)
2. Set `AUTH_SECRET` to a strong random value
3. Run `npm run db:seed` once to initialize data on a fresh database
4. `public/uploads/` is for admin media uploads — ensure write permissions
5. Build output is standard Next.js: `npm run build && npm run start`
