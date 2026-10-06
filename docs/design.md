# Prompt 1A — visual approval candidate

This refinement keeps the existing React/Vite architecture, demo dataset and shopping logic. It is ready for visual review before Prompt 2, not yet an owner-approved design freeze. No new dependencies, catalogue imports, push or deployment are part of this milestone.

## Palette and hierarchy

Tokens live in `src/styles/global.css`:

| Purpose                        | Token                             | Value                 |
| ------------------------------ | --------------------------------- | --------------------- |
| Primary brand / Add to Cart    | `--primary`                       | `#123B3A`             |
| Primary hover                  | `--primary-hover`                 | `#0D302F`             |
| Warm hero CTA / small accents  | `--accent`                        | `#D96C3D`             |
| Accent hover                   | `--accent-hover`                  | `#B95026`             |
| Accent foreground              | `--accent-ink`                    | `#281B15`             |
| Site background                | `--background`                    | `#FAF8F3`             |
| Cards                          | `--surface`                       | `#FFFFFF`             |
| Image staging / subtle surface | `--surface-subtle`                | `#F3F4F0`             |
| Light teal surface             | `--surface-teal`                  | `#EDF3F1`             |
| Text / muted                   | `--text` / `--muted`              | `#202522` / `#5C625D` |
| WhatsApp action / hover        | `--whatsapp` / `--whatsapp-hover` | `#166B3C` / `#10562F` |

The terracotta button uses dark text for readable contrast; its darker hover uses white. Avoid white text on the base orange. Default buttons are deep teal, secondary buttons outlined, WhatsApp buttons green, and lower-priority actions text/ghost. Focus outlines and restrained hover/pressed feedback remain keyboard-visible. Reduced motion removes nonessential transitions.

## Composition

- Retained wordmark/icon, compact white header, warm accent cart badge, active navigation and persistent search area. Header is not sticky.
- Development notice remains visible; sample products are not presented as verified inventory.
- Compact sans-serif hero: “Everything for your kitchen & table.” Product-shopping and WhatsApp CTAs appear together. The existing original illustration is retained with lighter staging; no product photographs are downloaded. Replace its image source/alt with owner-approved photography in a future milestone.
- Categories follow the hero directly. Category cards have consistent image regions, feedback and missing-image fallback.
- White product cards use contained imagery, readable names and full-width primary cart/variant controls. Price text stays an enquiry action; no monetary values or price sorting.
- Grid: one comfortable column at 320px, two columns on larger phones/tablets, three on smaller desktops, four on larger desktops. Images accommodate portrait, square and wide content without cropping it.
- Compact shop heading and horizontal desktop filter bar; mobile controls stack with labels. URL-backed filters and cart/WhatsApp logic are unchanged.
- Cart exposes product-line count and total quantity, not a monetary total. Detail pages retain variant selection and responsive gallery/information layout.
- Deep teal footer keeps only confirmed details and navigation.

No new product facts, categories, prices, delivery claims or business information are introduced. All product data remains demo data. Original catalogue sources remain untouched; `usha.zip` is excluded.

## Validation scope

Use existing commands in README: typecheck, 24 unit tests, production build and 16 Chromium browser tests. Browser regressions exercise shopping/navigation, variants, localStorage, WhatsApp encoding, missing states and eight widths (320, 375, 390, 430, 768, 1024, 1280, 1440). Automated axe checks cover core desktop/mobile pages. Visual inspection and reduced-motion checks complement these tests; neither is a full assistive-technology or cross-browser certification.
