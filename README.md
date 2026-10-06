# Shubh Crockery — storefront foundation

Prompt 1 builds a static retail website for browsing products, building an enquiry cart and contacting Shubh Crockery through WhatsApp. It is a website, not a native mobile app. It has no backend, database, login, payment gateway or paid API.

**Current pricing mode:** Ask Price on WhatsApp. No catalogue MRP is used as a selling price.

**Order WhatsApp:** +91 8439961389.

## Requirements & commands

Node.js 22.12+ (Node 24 recommended) and npm. Validated with Node 24.19.0 and npm 11.9.0. React 19, TypeScript, Vite, React Router, plain CSS, Vitest and Playwright are free/open-source.

```sh
cd /workspace/shubh-crockery
npm ci --cache /workspace/.npm-cache
npm run dev
```

Local development: http://localhost:5173. Vite listens on all interfaces for development. These are local instructions, not a deployed website.

```sh
npm run test          # 24 critical-logic unit tests
npm run typecheck
npm run build        # typecheck + static output in dist/
npm run preview      # local production preview, http://localhost:4173
```

Browser checks use Chromium. This cloud machine has `/usr/bin/chromium`, so run:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

On a machine without Chromium, install the Playwright browser once, then run:

```sh
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers npx playwright install chromium
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers npm run test:browser
```

Use these workspace cache paths in the cloud environment where the default home directory is read-only. On a local machine, the cache and browser-path flags may be omitted. The browser suite starts Vite if it is not already running.

## Architecture

```text
src/
  assets/             # reserved for future bundled assets
  components/
    common/           # icons, error boundary
    layout/           # responsive header & footer
    product/          # product cards, grid, image fallback
    cart/             # quantity controls
  config/business.ts  # central business details, empty unknown fields
  data/products.ts    # clearly marked development samples only
  hooks/CartContext.tsx
  layouts/StoreLayout.tsx
  pages/              # data-driven route templates
  routes/AppRoutes.tsx
  types/product.ts    # product, variant, image provenance & cart types
  utils/              # filtering/grouping, cart storage, WhatsApp
  styles/global.css   # reusable tokens & responsive CSS
public/images/        # original representative SVG illustrations
public/favicon.svg    # original brand-mark placeholder
 tests/logic.test.ts   # critical domain logic
 tests/browser/       # functional routes & responsive smoke tests
```

### Configuration

`src/config/business.ts` is the central source for the business name, WhatsApp number, currency, enquiry pricing, phone, address, email, opening hours and social links. Unknown details remain empty and are not displayed. No API keys or other secrets are required. `whatsappNumber` is normalized to digits by `whatsappUrl`; `whatsappDisplay` is a human-readable number.

### Product data & future catalogue imports

`src/types/product.ts` supports stable IDs/slugs, optional brand/subcategory/model code, descriptions, variants, capacity/size/colours, availability, featured flags, tags, catalogue filename/page/reference and image source/license metadata. Image metadata explicitly distinguishes representative artwork from exact product imagery. New verified entries should set `dataStatus: 'verified'`, use only sourced facts and leave unknown optional fields absent. There is no selling-price field in V1.

`src/data/products.ts` contains six fictional **demo** entries across four categories and three fictional sample brands. Sample variant colours are development values, not catalogue specifications. Demo labels appear site-wide, on cards and details, and in WhatsApp messages. Original local SVG illustrations are representative artwork, not photographs or catalogue images. A sample product without an image exercises the fallback.

Prompt 2 will process only the approved Thermosteel/Thermoware sources and map verified facts into this model. Preserve source filenames and page references, use stable variant IDs, validate import records and record image permissions/provenance. Keep imports separate from UI components; category/brand groups are derived from data. **Never inspect, extract or import `usha.zip`.** No catalogues were available in the inspected workspace during Prompt 1; none were modified or bulk-imported.

### Cart & enquiries

The cart stores only product IDs, variant IDs and integer quantities in a versioned localStorage envelope (`shubh-crockery-cart-v1`). Duplicate product + variant lines merge; different variants remain separate. Quantities range from 1 to 99. Stale products, invalid variants, unavailable products and invalid stored quantities are dropped; malformed JSON recovers to an empty cart. Storage access failures do not crash the app and show a persistence warning in the cart. Multi-variant products require a selection on the detail page. Cards link to selection where necessary.

WhatsApp utilities encode standard `https://wa.me/` links, with selected variants and quantities and no prices. Customers review/send the message in WhatsApp themselves. This milestone does not collect customer details or confirm orders. Prompt 5 will harden the checkout/enquiry flow. Cart updates are local to the open tab; cross-tab synchronization is not yet included.

## Routes & static hosting

`/`, `/shop`, `/categories`, `/category/:slug`, `/brands`, `/brand/:slug`, `/product/:slug`, `/cart`, `/about`, `/contact`, and a catch-all 404. Product/group lookups also have useful missing states. Shop search and filters are encoded in URL parameters, making filtered views refreshable and shareable.

React Router uses browser history. A future static host **must rewrite non-file routes to `/index.html`**, retaining asset paths, so direct loads and refreshes work. Vite development/preview provides this fallback. An example host rule is `/* /index.html 200`; use the chosen host's equivalent. The client displays 404 content; HTTP-level 404 status requires later hosting configuration. For a subdirectory deployment, configure both Vite `base` and Router `basename`. No deployment is performed in Prompt 1.

## Design & accessibility

Forest green, warm neutral surfaces, original illustration and system/Georgia fonts. Responsive grids, filters, details and cart adapt from 320px upward. CSS tokens define colours, backgrounds, borders, spacing, radius, shadows, typography and container width. Media queries use documented thresholds of 360, 600, 800, 1100 and 1440px (CSS custom properties cannot be used directly in media-query conditions).

Semantic landmarks, labelled controls, radio variant selection, image alternatives, visible focus, skip link, quantity button names, cart status and reduced-motion handling are included. The mobile menu focuses its first link, cycles keyboard focus, closes on Escape/navigation, restores scrolling and returns focus on Escape. This is a foundation, not a complete assistive-technology audit. SEO includes language, descriptive title updates, a meta description and favicon; full SEO is planned for Prompt 7.

## ₹0-budget principle

No paid dependencies, services, fonts, APIs, database, image provider or ecommerce platform are introduced. No external images, font network calls, online payments or WhatsApp Business API are used. Future hosting must be selected within a free tier, with its limits reviewed at deployment time. No delivery, returns, dealer-status or other unsupported business claims are made.

## Milestone boundaries

Prompt 1 contains sample data only. Real product availability, specifications, images and brands are not yet verified. Gallery support is implemented but the demo entries each have at most one illustration. Empty group rendering is supported, while unknown group slugs show not-found because groups currently derive only from existing products. Full customer checkout, advanced browsing, full SEO and deployment belong to later milestones. Original catalogue files remain untouched. No live WhatsApp message is sent during automated tests.
