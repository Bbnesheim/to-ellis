# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Getting Started (Docs to read first)

Before making changes, skim these project docs in this repo:

- `PRD.md` – what the store must do and contain.
- `PROMPT.md` – implementation priorities and acceptance tests.
- `AGENT_WORKFLOW.md` – how different agents/roles should work.
- `CLIENT_PRODUCT_INFO_AND_POLICIES.md` – client product descriptions and policy outline.

Once you understand those, use the commands below to run and validate the theme.

## Commands & Development Workflow

This repo is a standalone Shopify theme (Dawn-derived) with no custom bundler/build pipeline. Development is done via the Shopify CLI and the online theme editor.

This repo *does* include a small Node/Jest-based test harness (`tests/`) for selected Liquid, JS, and CSS behavior.

### Prerequisites
- Shopify CLI is installed (already available at `shopify` on this machine).
- You have a Shopify store and theme development access.

### Run a local dev server
From the repo root:

```bash
cd /home/ben/projects/to-ellis
shopify theme dev
```

This:
- Watches all theme files (Liquid, JSON, CSS, JS, assets) in this directory.
- Serves a preview URL and hot-reloads as you edit.

### Preview / link to a specific theme
If not already linked, run:

```bash
cd /home/ben/projects/to-ellis
shopify theme dev --store <your-store>.myshopify.com
```

Use `--theme <ID>` or `--theme-editor-sync` as needed to target a specific theme instance.

### Push theme changes to Shopify
When you are satisfied with local edits:

```bash
cd /home/ben/projects/to-ellis
shopify theme push
```

Useful flags:
- `--theme <ID>`: push to a non-live theme.
- `--unpublished`: create a new unpublished theme from this directory.

### Linting (theme-check)
There is no `.theme-check.yml` in this repo, but you can still run Shopify’s Liquid/CSS checks with default rules:

```bash
cd /home/ben/projects/to-ellis
shopify theme check
```

If you add a `.theme-check.yml`, document any custom rules or excludes here.

### Tests
This theme now includes a small Node-based unit test harness for selected Liquid logic.

From the repo root, after installing dependencies with `npm install`:

```bash
cd /home/ben/projects/to-ellis
npm test
```

This runs the Jest test suite. Current coverage includes:
- Liquid rendering invariants (e.g. `sections/featured-product.liquid`).
- Section behavior rendered in LiquidJS + JSDOM (e.g. `sections/main-footer.liquid`, `sections/footer-trust.liquid`).
- Front-end JS behavior in JSDOM (e.g. `assets/cart.js`).
- CSS invariants for the blog flip layout (e.g. `assets/section-main-blog.css`).

You should still:
- Use `shopify theme check` as the closest thing to static analysis for Liquid/CSS.
- Rely on manual QA via `shopify theme dev` and the store preview for end-to-end behavior.

## High-Level Architecture & Structure

### Overall theme structure
This is a Dawn-derived Online Store 2.0 theme with the standard Shopify structure:

- `layout/`
  - `theme.liquid` – single base layout for the storefront.
  - `password.liquid` – layout for password-protected storefront.
- `templates/` – JSON templates defining which sections appear on each route (home, collection, product, blog, article, search, customer pages, etc.).
- `sections/` – top-level, configurable page sections (`main-*` sections, header/footer groups, featured collection, contact form, etc.).
- `blocks/` – custom block-style components used inside `_blocks` sections and custom templates (currently: `custom-header.liquid`, `journal.liquid`, `hero-banner.liquid`, `logo-banner.liquid`).
- `snippets/` – reusable partials (`meta-tags`, `header-mega-menu`, `cart-drawer`, `price`, `facets`, `product-media-gallery`, etc.).
- `assets/` – JS, CSS, and images for the theme (e.g. `global.js`, `base.css`, `cart.js`, many component/section CSS files, SVG icons).
- `config/` – global theme settings and presets (`settings_schema.json`, `settings_data.json`).
- `locales/` – translation JSONs and associated schemas (e.g. `en.default.json`, `en.default.schema.json`).

There are **no** build artifacts checked in (no bundler pipeline); the files here are the source of truth for the theme.

### Layout and global styling (layout/theme.liquid)

`layout/theme.liquid` is the main entry point for every storefront page. Key responsibilities:

- Sets `<html>` language from `request.locale.iso_code` and common meta tags (viewport, canonical URL, theme color).
- Injects SEO/social tags via `render 'meta-tags'`.
- Loads core JavaScript assets:
  - `constants.js`, `pubsub.js`, `global.js`, `details-disclosure.js`, `details-modal.js`, `search-form.js`.
  - Conditionally loads `animations.js` and `predictive-search.js` based on theme settings.
- Defines typography and design tokens based on `settings`:
  - Computes `body_font_*` and header font variants and emits `@font-face` rules.
  - Iterates over `settings.color_schemes` and writes CSS custom properties on `:root` and `.color-<scheme-id>` (background, foreground, button, badges, etc.).
  - Emits a large `:root` block of CSS variables for typography scale, spacing, radii, shadows, card styles, inputs, variant pills, etc.
- Applies base layout CSS, including:
  - `body` as a grid with header, main content, and footer rows.
  - Global font size/line-height tied to `--font-body-scale`.
- Loads global CSS:
  - `base.css` (primary stylesheet).
  - Critical component CSS (e.g. `component-cart-items.css`) and cart drawer styles when `settings.cart_type == 'drawer'`.
- Renders structural sections:
  - Cart drawer (if `cart_type == 'drawer'`).
  - Header group: `{% sections 'header-group' %}`.
  - Main page content: `{{ content_for_layout }}` from the active template.
  - Footer group: `{% sections 'footer-group' %}`.
- Exposes global JS configuration on `window` (URLs for cart, predictive search, strings for error messages, accessibility messages, etc.).

When modifying global design or layout, prefer updating:
- `config/settings_schema.json` (new settings) + `theme.liquid` (consuming those settings as CSS variables),
- rather than hard-coding values deep in individual sections.

### Header system (sections/header.liquid + sections/header-group.json + blocks/custom-header.liquid)

The theme uses a **header group** pattern rather than a single static header:

- `sections/header-group.json` is a JSON group section with:
  - `announcement-bar` – standard announcement bar including text, link, color scheme, and (optionally) social icons.
  - `header` – the default Dawn header section, currently **disabled** but still present and configurable.
  - `overlay_header_*` – a custom overlay-style header (`overlay-header.liquid`) that is currently active and receives extensive design settings (logo, fonts, colors, dropdown image, etc.).

`sections/header.liquid` contains custom CSS for desktop header layout and behavior:

- Adjusts sticky behavior and padding via `section.settings.padding_*` and `margin_bottom`.
- Re-styles the main navigation:
  - Grid layout: `logo | nav | icons` on desktop.
  - Centered inline menu with custom underline-on-hover animation for top-level items.
- Customizes the header icons area (`.header__icons`):
  - Positions and scales cart, account, and other icons.
  - Aligns localization forms (country/language selectors) with icon height/spacing.
- Adds tweaks for "mega menu" (`header__submenu--with-media`) layout, ensuring media is correctly placed and submenus align with a custom panel width/height.

`blocks/custom-header.liquid` is an AI-generated **header block** referenced through `_blocks` sections / group configs:

- It defines a fully custom, block-scoped header layout and nav system with:
  - Configurable logo (image or text), logo width, text size/color.
  - Configurable header height, paddings, and background/border colors.
  - Flexible ordering of logo, nav, and icons (including a special “logo-centered” mode).
  - Nav hover animation styles (`fade`, `slide`, `lift`, `scale`, `glow`) picked via `block.settings.hover_animation`, each mapping to different CSS behaviors.
  - Configurable dropdown panels: width, background, borders, border radius, and placement of dropdown imagery (`dropdown_image_position` left/right/top/bottom).
- It heavily uses `block.settings.*` to drive CSS so that most visual behavior is controlled from the Shopify editor.

When adjusting header behavior:
- Decide whether the change belongs in `header.liquid` (standard Dawn header), `overlay-header.liquid`, or `blocks/custom-header.liquid`.
- Be mindful of duplication: some header layout/animation concerns exist in both `header.liquid` and the AI-generated block.

### Footer system (sections/footer.liquid + sections/footer-group.json + blocks/*)

The footer mirrors the header group pattern using `sections/footer-group.json`:

- `footer_trust_*` – a dedicated footer trust section (`footer-trust.liquid`) with four columns (Customer Service, Easy Returns, Safe Payments, Quick Shipping). Settings control:
  - Colors via theme color schemes, typography via global fonts, and shared text sizing.
  - Icons and per-column popup content for detailed messaging.
- `blocks_BgQYqV` – the main footer content, implemented as `sections/main-footer.liquid` (newsletter, link groups, social, and payment icons).
- `blocks_4G3Vey` – a placeholder `_blocks` section labeled "Logo Section" for future design.
- `footer` – the original Dawn `footer.liquid` section, currently **disabled** but still present.

Note: `sections/ellis-footer.liquid` also exists in the repo as an alternative footer implementation, but it is not wired into the active `footer-group.json`.

`sections/footer.liquid` is still the canonical Dawn footer implementation but is effectively wrapped/augmented by the group JSON and custom blocks when enabled.

When editing the footer:
- Prefer to adjust the active sections and their schema/settings:
  - `sections/footer-trust.liquid`
  - `sections/main-footer.liquid`
  - `sections/footer-group.json` (wiring + settings values)
- Use `sections/footer.liquid` only if you want to change the fallback/legacy footer behavior.

### Home page & sections (templates/index.json + sections/* + blocks/*)

The home page (`templates/index.json`) is built almost entirely from **configurable sections** and custom `_blocks` containers:

Key section types used on the index template:

- `_blocks` with `hero-banner` block (video hero):
  - Desktop + mobile separate videos and fallback images.
  - Content positioning (desktop and mobile), text alignment, overlay options, and gradient border animation.
  - Typography controlled via Shopify web fonts (e.g. `cormorant_n*`).
- `featured-collection` for "NEW ARRIVALS" grid.
- `featured-product` section highlighting a specific product with blocks for vendor text, title, price, variant picker, quantity, buy buttons, and share.
- `collection-list` sections used twice for curated collections (e.g. New Arrivals/Get Inspired/All Products, then Dresses/Blouses/Bottoms).
- `collage` section mixing product and image tiles.
- `image-banner` section driving a journal/news CTA.
- Disabled `image-banner` and `newsletter` sections left as potential future content.

Patterns:
- Sections usually defer brand/spacing colors to theme `color_scheme` tokens, combined with per-section `padding_top`/`padding_bottom` settings.
- The `_blocks` sections act as containers that assemble one or more custom blocks from `blocks/` (hero/video, trust/footer content, custom headers, etc.).

When adding new homepage content:
- Decide whether it should be a new **section** in `sections/` or an additional **block** inside an existing `_blocks` container.
- Prefer using existing patterns (`hero-banner`, `collection-list`, `collage`) for new marketing experiences, and extend them with new settings before creating completely new sections.

### Journal / blog experience (templates/blog.journal-to-ellis.json + blocks/journal.liquid)

The template `templates/blog.journal-to-ellis.json` defines a journal-style blog route combining:
- A standard blog feed via `sections/main-blog.liquid` (currently configured with `layout: "flip"`).
- A hero, art-directed story via an `_blocks` section mounting the `journal` block (`blocks/journal.liquid`).
- Additional optional sections like `featured-blog` and `slideshow` (currently disabled by default in the template).

`blocks/journal.liquid` implements a fully styled “journal book” reader:

- Uses two Shopify fonts (`heading_font`, `body_font`) and emits their `@font-face` definitions.
- Creates a full-viewport background layer that optionally:
  - Displays a background image with configurable size, position, attachment, opacity, blur, and scale.
  - Falls back to a subtle pattern when no image is set.
- Draws a “book” content card with:
  - Optional paper texture overlay.
  - Optional page lines drawn via `repeating-linear-gradient`.
  - Optional spine effect (border-left) to mimic a bound book.
- Supports scroll/entrance animations:
  - 3D-ish entrance transform for the book wrapper.
  - Separate fade/slide animations for header, content, and per-paragraph text blocks.
- Content fields include:
  - Blog title, date, excerpt, multiple long-form text blocks, and a signature area.
  - Signature alignment (left/center/right) and optional signature logo.
  - Decorative SVG asset (e.g. brand mark) placed at the top or bottom.

Important:
- The top-of-file comment in `blog.journal-to-ellis.json` warns that the template is auto-generated and may be overwritten by Shopify’s theme editor. Avoid hand-editing that JSON in ways that can’t be reproduced via the editor.
- Structural or styling changes to the journal experience should be made in `blocks/journal.liquid` rather than only in the template JSON.

### Product page (sections/main-product.liquid)

`sections/main-product.liquid` is a heavily customized version of Dawn’s product section:

- Wraps everything in a custom `product-info` web component (`<product-info ...>`) with a number of `data-*` attributes controlling behavior (zoom on hover, sticky info, variant images, etc.).
- Loads a set of CSS assets for product layout, accordions, price display, sliders, ratings, deferred media, variant picker, swatches, and volume pricing.
- Injects JS assets for product info, product form, show-more, price-per-item, magnify (hover zoom), theme editor, product modal, media gallery, and 3D model viewing.
- Renders a two-column layout (`product__media-wrapper` + `product__info-wrapper`) with optional sticky info.
- Iterates over `section.blocks` to render a large set of block types:
  - `text`, `title`, `price`, `inventory`, `description`, `sku`, `custom_liquid`, `collapsible_tab`, `quantity_selector`, `variant_picker`, `buy_buttons`, `share`, `rating`, `complementary`, `icon-with-text`, plus `@app` extension blocks.
- Integrates advanced features like:
  - Quantity rules and volume pricing (with price-per-item calculation and rules messaging).
  - Product recommendations (`product-recommendations` element) with slider pagination.
  - Metafield-driven reviews rating (star rating with decimal rounding) and counts.
  - Structured data (`product | structured_data`) output as JSON-LD.

When modifying the product page:
- Prefer editing/add/removing block types in the schema at the bottom of `main-product.liquid` rather than hardcoding layout inline.
- Preserve the numerous translations (`t:` strings) and accessibility labels.

### JavaScript architecture (assets/global.js and related)

The JavaScript for core behavior is split across many small files in `assets/`, with `global.js` providing utilities and base behaviors:

- Utility classes/functions:
  - `SectionId` – parses and constructs qualified section IDs (`template--<id>__<section-name>`), useful in AJAX/HTML replacement flows.
  - `HTMLUpdateUtility` – performs DOM “view transitions”:
    - Wraps new content, dedupes IDs, inserts before the old node, hides and later removes the old node.
    - Re-injects `<script>` tags to ensure scripts execute after innerHTML updates.
  - Focus handling: `trapFocus`, `removeTrapFocus`, `focusVisiblePolyfill` to ensure accessible keyboard behavior.
  - `pauseAllMedia` – pauses YouTube, Vimeo, `<video>` elements, and `product-model` viewers.
  - `onKeyUpEscape` – closes open `<details>` blocks on Escape.
- Behavior wiring:
  - Adds ARIA roles/attributes to disclosure `<summary>` elements and attaches Escape key handling.
  - Defines a `QuantityInput` custom element used by product forms and quick add components.
- Additional JS files (not fully detailed here) handle cart drawer, predictive search, product galleries, quick-add, etc.

When adding new interactive behavior:
- Consider using `HTMLUpdateUtility.setInnerHTML` or `viewTransition` when swapping large chunks of HTML.
- Reuse `trapFocus` for dialogs, modals, and drawers.
- Keep new logic in separate `assets/*.js` files following the existing pattern, and load them via `theme.liquid` or specific sections as appropriate.

### Configuration & locales (config/ + locales/)

- `config/settings_schema.json` defines theme-level settings such as:
  - Color schemes (`scheme-*` IDs referenced throughout sections and templates).
  - Typography (body and heading fonts, their scales, etc.).
  - Spacing tokens used by layout and cards.
  - Global UI options (header behavior, cart type, predictive search, localization options, etc.).
- `config/settings_data.json` contains the current configuration for this specific theme instance (which schemes are active, which sections/templates are enabled in which order, etc.).
- `locales/en.default.json` and `en.default.schema.json` store translation strings and their schema, used by `t:` lookups throughout Liquid.

When introducing new user-facing strings:
- Use the existing translation keys and add new entries under the relevant locale files rather than hardcoding text in sections.

---

If you later introduce build tooling (e.g. bundling JS/CSS, TypeScript, or tests), extend the **Commands & Development Workflow** section with the exact commands and entrypoints needed so future Warp agents can work productively without re-discovering them.
