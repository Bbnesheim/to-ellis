# PRD – To Ellis Shopify Store

## 1. Overview

### 1.1 Product summary
To Ellis is a Norwegian womens dress and clothing brand selling a small, curated collection of premium dresses online. The Shopify store runs on a customized Dawn-based Online Store 2.0 theme (this repo), with a strong focus on storytelling, a journal-style blog, and high-end product presentation.

Current assortment (at time of writing):
- 2 core styles, 3 products total:
  - Martha Dress (Martha Black Dress)
  - Ellis Dress (Ellis Pure White Dress, Ellis Dark Blue Dress)

### 1.2 Objectives
- Launch and maintain a premium Shopify storefront that:
  - Expresses the To Ellis brand: romantic, refined, Norwegian, detail-focused.
  - Presents a small curated set of dresses with deep storytelling (fit, details, feel).
  - Serves primarily Norwegian customers with clear information on fit, materials, shipping, and returns.
  - Provides a frictionless purchase flow with the payment methods that are actually enabled in Shopify (do not claim Vipps/Klarna until they are enabled).

### 1.3 Success criteria (high level)
- Customers can discover and purchase any To Ellis dress on mobile or desktop within a few steps.
- Product pages clearly answer: What is this dress like, how does it fit, what does it cost, how does it feel, and how do shipping/returns work.
- Brand storytelling is supported via a dedicated journal layout and curated homepage sections.

## 2. Scope

### 2.1 In scope
- Customization of a Dawn-derived Shopify theme for To Ellis, including:
  - Home page storytelling and product discovery.
  - Collection listing and product detail templates for Martha and Ellis styles.
  - A custom journal/blog experience based on the journal templates and the `journal-article` section.
  - Header and footer systems, including trust elements, navigation, localization toggles, and social links.
  - Content and theme configuration for shipping, returns, policies, and payment information.
- Configuration of basic Shopify settings to align with To Ellis requirements (navigation, payment methods, shipping profiles, legal pages).

### 2.2 Out of scope (for this PRD)
- Wholesale/stockist portal or B2B functionality.
- Multi-language content beyond what Dawn and Shopify already support by default.
- Advanced marketing automation, subscriptions, or loyalty programmes.
- QR-code journeys (explicitly deferred by client until later).

## 3. Users and key journeys

### 3.1 Primary users
- Fashion-conscious women (and gift buyers) primarily in Norway, looking for premium, romantic dresses with a strong emphasis on quality, fit, and feel.

### 3.2 Core journeys
- J1: Land on home page → understand the brand → browse featured collections → open a product page → add to cart → checkout.
- J2: Arrive from social media or campaign → land directly on a product page → read detailed description, materials, fit, feel → view photos → purchase.
- J3: Explore Journal → read Ellis story and editorial content → navigate to featured products or collections.
- J4: Before purchasing → read shipping and returns policies → confirm that standard shipping (199 NOK) and 30-day returns meet expectations → proceed to checkout.

## 4. Current theme architecture (audit summary)

Based on the Dawn-derived theme in this repository, key architectural elements are:

- Layout
  - `layout/theme.liquid` is the single base layout.
  - Handles meta tags, fonts, global CSS (`base.css`), and JS (`global.js`, `cart.js`, `cart-notification.js`, `cart-drawer.js`, `predictive-search.js`, etc.).
  - Defines global CSS variables from `settings_schema.json` + `settings_data.json` (typography, colors, spacing, cards, inputs, variant pills).
  - Renders header and footer via `sections/header-group.json` and `sections/footer-group.json`.

- Sections
  - Main content sections: `sections/main-product.liquid`, `main-collection-product-grid.liquid`, `main-page.liquid`, `main-blog.liquid`, `main-article.liquid`, `main-search.liquid`, etc.
  - Home sections configured in `templates/index.json`: multiple rich-text + featured-product sections, collages, collection lists, plus a custom hero video banner implemented as an `_blocks` section mounting the `hero-banner` block.
  - Header and footer group sections (`header-group.json`, `footer-group.json`) orchestrate multiple underlying sections.
  - Contact/support sections exist in-repo and are wired in `templates/page.contact.json`:
    - `sections/contact-info.liquid`
    - `sections/contact-form-support.liquid`

- Blocks (custom components)
  - `blocks/hero-banner.liquid`: custom hero video banner block mounted via `_blocks` sections.
  - `blocks/custom-header.liquid`: AI-generated header block (present in repo; currently the live header is implemented via `sections/overlay-header.liquid` inside `sections/header-group.json`).
  - `blocks/logo-banner.liquid`: simple logo/brand banner block.

- Journal article section
  - `sections/journal-article.liquid`: the journal “book” article experience (used by `templates/article.journal.json`).

- Footer implementation
  - The active footer group (`sections/footer-group.json`) currently uses:
    - `sections/footer-trust.liquid` (trust columns with popups)
    - `sections/main-footer.liquid` (newsletter, link columns, social, and payments)
  - `sections/footer.liquid` (Dawn footer) is present but disabled in the group.
  - `sections/ellis-footer.liquid` exists as an alternative footer implementation (present in repo; not used by the current footer group).

- Templates
  - `templates/index.json`: strongly customized home page using standard sections plus an `_blocks` hero with the `hero-banner` block.
  - `templates/blog.journal-to-ellis.json`: auto-generated template for the Journal blog route; uses `sections/main-blog.liquid` with `layout: "flip"`.
  - `templates/article.journal.json`: auto-generated template for journal article pages; uses `sections/journal-article.liquid`.
  - Additional custom page templates exist in repo (e.g. `templates/page.about.json`, `templates/page.contact.json`, `templates/page.faq.json`).
  - Standard Dawn templates for products, collections, pages, blog, articles, search, and customer pages.

This PRD builds on these existing structures rather than replacing them.

## 5. Functional requirements

Functional requirements are grouped by area and numbered FR-x.

### 5.1 Navigation and global layout

- FR-1: Header
  - Provide a sticky, brand-aligned header with:
    - Logo (image or text) with adjustable size and placement (left, centered, or other options as supported by current header/overlay-header/custom-header implementations).
    - Primary navigation based on the main-menu in Shopify, with hover/tap states matching the brand (underline/hover animations already present in theme).
    - Icons for search, account, and cart; visible and usable on desktop and mobile.
    - Correct behavior on scroll (e.g., sticky or shrinking logo) as configured in header settings.
    - Mobile navigation (burger menu) with configurable position and colors.

- FR-2: Footer
  - Provide a rich footer that includes:
    - Trust / service section (4 columns) for customer service, returns, secure payment, and shipping.
    - Newsletter subscription block with brand-aligned copy and To Ellis logo.
    - Two or more link columns for About/Story, Help & Contacts, and policy links.
    - Social links (Instagram, Facebook, TikTok, Tise, YouTube as applicable).
    - Payment icons reflecting the payment methods that are actually enabled (do not claim Vipps/Klarna until enabled).

- FR-3: Localization and currency language selectors
  - Use Dawn’s built-in country and language selectors in the header/footer where enabled.
  - Ensure selectors are styled to align with custom header design (dropdown pills alongside icons).

### 5.2 Home page

- FR-4: Hero video banner
  - Hero section at the top of the home page with:
    - Separate desktop and mobile videos plus fallback images.
    - Configurable heading, subheading, and primary CTA button (e.g., pre-order, sign-up).
    - Content position, alignment, and overlay/gradient border animation controlled via section settings.

- FR-5: Featured collection and product
  - Display a featured collection (e.g., New Arrivals) in a grid with:
    - Product images, titles, prices, and ratings (if available).
    - Optional quick view/quick add, using Dawn’s existing patterns.
  - Display a featured product (Martha or Ellis) with:
    - Vendor text, title, price, variant picker, quantity selector, buy buttons, and share action.

- FR-6: Additional storytelling sections
  - Provide sections for:
    - Curated collection lists (e.g., New Arrivals, Get Inspired, All Products; Dresses, Blouses, Bottoms) via collection-list sections.
    - Collage section mixing products and lifestyle imagery.
    - Image banner driving to the Journal or other editorial content.

### 5.3 Product browsing and discovery

- FR-7: Collections
  - Collection pages must use the customized `main-collection-product-grid` and `main-collection-banner` sections to:
    - Show a hero/banner with optional imagery and copy.
    - Show products in a grid with filters/facets, sorting, and pagination (following Dawn patterns).

- FR-8: Search
  - Implement search results using Dawn’s `main-search` section and optional predictive search:
    - Users can search by product name, style, color.
    - Predictive search may suggest products as the user types when enabled in theme settings.

### 5.4 Product detail pages (PDPs)

- FR-9: PDP core content
  - Use `sections/main-product.liquid` to present each dress, including:
    - Media gallery with images and optional video/3D (if provided), with zoom-on-hover where configured.
    - Title, price, variant selection (if any), quantity selector, and add-to-cart/buy buttons.
    - SKU, inventory messaging (in stock, low stock, out of stock) and any volume pricing rules (if used in future).

- FR-10: Rich product descriptions
  - For each dress (Martha, Ellis), include structured content that covers:
    - Fit and cut (e.g., A-line, midi length, knee length, silhouette).
    - Signature details (e.g., waist bow, split, silk trims, ruffles, neckline, belt, sleeve details).
    - Material composition (e.g., Martha: 75% acetate / 25% polyester; Ellis: to be updated once exact composition is confirmed).
    - Production info: Made in China, designed in Norway.
    - How the dress feels on the body (light/airy, soft against skin, supportive bodice, etc.), consistent with client-supplied copy.

- FR-11: Additional PDP blocks
  - Support togglable blocks such as:
    - Collapsible tabs for care instructions, shipping & returns highlights, or size/fit notes.
    - Custom Liquid blocks for additional brand copy if needed.
    - Complementary products / recommendations using `product-recommendations`.

### 5.5 Journal and editorial content

- FR-12: Journal templates
  - Blog feed: `templates/blog.journal-to-ellis.json` renders a standard blog feed via `sections/main-blog.liquid` (`layout: "flip"`).
  - Journal articles: `templates/article.journal.json` renders the journal article experience via `sections/journal-article.liquid`, supporting background images, paper-like textures, spine effect, and subtle animations.

- FR-13: Journal content editing
  - Ensure that the content fields in `sections/journal-article.liquid` are exposed and editable in the theme editor so non-technical editors can maintain the story.
  - Templates in `templates/` may be overwritten by Shopify; structural changes must be done via the section, not direct JSON edits.

### 5.6 Policies, shipping, returns, and payments

- FR-14: Shipping information
  - Provide a dedicated shipping or shipping-and-returns page (or section in FAQ/policy pages) that clearly states:
    - Shipping provider: Bring (if active).
    - Standard shipping: **199 NOK** (domestic and international).

- FR-15: Returns policy
  - Provide a returns policy page reflecting the current store policy and mandatory consumer rights:
    - Statutory **14-day right of withdrawal (Angrerett)** for online purchases (where applicable) in addition to any voluntary return policy.
    - Voluntary **30-day** return window from the date the order is received.
    - Conditions: items unused, all original tags and security ribbons intact, returned in original packaging.
    - Return options: store credit or refund, with clear explanation of differences.
      - Within the statutory withdrawal period, customers must be able to choose a **refund** (store credit optional).
    - Store credit: full item value, free return shipping in Norway, issued within 10 business days of receiving the return.
    - Refunds: issued to the original payment method; processed within statutory timelines (typically within 14 days of notice, with the ability to wait until goods are returned / proof of shipment); return shipping cost may be deducted when using a prepaid label outside “free return” flows (e.g. 200 NOK within Norway — confirm final amount).
    - Shipping cost refunds: for statutory withdrawal, refund the **standard outbound delivery cost** (not any extra cost for upgraded shipping).
    - Sale items eligible for return within the same 30-day return window (unless you later define a separate sale-item exception).
    - Non-refundable costs: international duties/taxes/import fees (if applicable).
    - All references should use the To Ellis brand name (not any legacy brand from source text).

- FR-16: Legal pages
  - Implement standard Shopify legal pages for:
    - Terms and conditions.
    - Privacy policy.
    - Cookies (if separate).
  - Link these clearly in the footer.

- FR-17: Payment methods
  - Ensure the storefront only shows and claims payment methods that are actually enabled in Shopify.
  - Vipps and Klarna are planned/in progress; do not show them until they are enabled.
  - Payment icons in the footer must match the actual configured gateways.

### 5.7 Customer account and transactional flows

- FR-18: Customer accounts
  - Support Shopify’s standard customer account flows:
    - Login, registration, password reset.
    - Access to order history, addresses.

- FR-19: Cart and checkout
  - Use Dawn’s standard cart and cart feedback UI (cart page and/or cart notification, based on theme settings) to show selected dresses, quantities, and totals.
  - Ensure taxes and shipping are displayed in accordance with Shopify and Norwegian law.

### 5.8 Content management and editing

- FR-20: Theme editor usability
  - All key homepage, header/footer, PDP, and journal content should be editable via sections/blocks in the Shopify theme editor without code changes.
  - Custom blocks/sections used for major experiences (hero-banner, journal, footer-trust, main-footer, overlay-header) must have sensible defaults and help text.

### 5.9 Contact and support

- FR-21: Contact information section
  - Provide a dedicated `contact-info` section that can be used on the contact page (and optionally other pages) to present key To Ellis contact and support information in a set of simple cards.
  - Cards should cover, at minimum: customer service scope and typical response time, direct contact details (email and optional other channels), and company details (name, org. number, registered address).
  - All card content (titles, text, email address, etc.) must be editable via the theme editor, with sensible To Ellis defaults.

## 6. Non-functional requirements

- NFR-1: Performance
  - Follow Dawn best practices for performance; avoid unnecessary blocking scripts and oversized images.
  - Use Shopify-hosted videos and responsive images with appropriate sizes and lazy loading.

- NFR-2: Responsiveness
  - All templates and sections must be mobile-first and work correctly from small screens through large desktops.

- NFR-3: Accessibility
  - Maintain or improve Dawn’s default accessibility level:
    - Keyboard navigable menus and modals.
    - Proper focus states and ARIA attributes for disclosures and dialogs.
    - Sufficient color contrast for text and interactive elements.

- NFR-4: SEO basics
  - Ensure unique and descriptive page titles and meta descriptions.
  - Structured, semantic headings on home, collections, PDPs, and journal pages.

## 7. Content and data

- Product data
  - Martha Dress: material, fit, price, and descriptive copy as per client document; exact text to be refined for on-site use.
  - Ellis Dress: colors, fit, pricing; material composition to be updated once confirmed by client.
  - Sizing charts: client has provided sizes and measurements in cm via external attachment; this should be transcribed into a size guide page or collapsible section on PDPs.

- Brand voice and style
  - Product descriptions must align with the client’s guidelines:
    - Describe fit and cut.
    - Call out signature details.
    - Emphasize how the dress feels on the body.
  - Journal content should feel like a personal, intimate letter.

## 8. Dependencies and risks

- Dependencies
  - Accurate, up-to-date product data and photos from client (e.g., promised product imagery by a specific Monday 17 November).
  - Confirmation of exact fabric composition for Ellis Dress.
  - Final decisions on return shipping cost (e.g., 200 NOK) and whether this should be dynamic.
  - Actual configuration of payment methods in the Shopify admin; do not claim Vipps/Klarna until they are enabled.

- Risks
  - Manual edits to auto-generated JSON templates (e.g., `blog.journal-to-ellis.json`) may be overwritten by Shopify; structural changes should be made via sections/blocks.
  - Misalignment between payment icons in theme and gateways actually available at checkout could confuse customers.

## 9. Acceptance criteria (summary)

The implementation is considered acceptable when:

- AC-1: A customer can land on the home page, see the To Ellis hero, discover Martha and Ellis dresses via featured sections or collections, and reach a PDP on both mobile and desktop.
- AC-2: PDPs for Martha and Ellis show correct pricing, fit, material (for Martha; Ellis when available), and rich descriptions matching the client’s guidelines.
- AC-3: A shipping and returns page (or equivalent section) clearly documents standard shipping (199 NOK domestic/international), statutory 14-day right of withdrawal (where applicable), 30-day voluntary returns, conditions, store-credit vs refund options (if offered), and non-refundable costs.
- AC-4: Footer shows accurate payment icons and links to legal and policy pages.
- AC-5: Journal article pages render correctly using `sections/journal-article.liquid` and can be edited via the theme editor.
- AC-6: Storefront works across common modern browsers on mobile and desktop without layout breakage.

This PRD should be updated as the product line grows beyond 3 products and as To Ellis expands into additional categories or markets.