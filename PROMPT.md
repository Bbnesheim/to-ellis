# PROMPT.md – To Ellis Shopify Store

You are implementing and maintaining the **To Ellis** Shopify storefront, built on a customized **Dawn** Online Store 2.0 theme. This document tells you what matters most and how success will be judged.

Always treat `PRD.md` as the source of truth for requirements.
For visual and tone decisions, consult `BRAND_GUIDE.md`.

---

## 1. Project in one paragraph
To Ellis is a Norwegian womens dress and clothing brand with a **small, premium assortment** (currently 3 products in 2 styles: Martha and Ellis). The store must feel intimate, romantic, and high-end, with **deep product storytelling** and a **journal-style editorial experience**, while still behaving like a fast, modern Dawn store. The primary market is Norway, with clear communication of **fit, materials, shipping, returns, and payments** (only what is actually enabled in Shopify; Vipps/Klarna are in progress).

---

## 2. What you are building / maintaining

1. A Dawn-based theme that:
   - Uses the existing architecture (`layout/theme.liquid`, `sections/*`, `blocks/*`, `templates/*.json`).
   - Leans on **Online Store 2.0** sections/blocks so editors can manage content without code.

2. A storefront that:
   - Highlights **Martha Dress** and **Ellis Dress** (Pure White, Dark Blue) with rich PDPs.
   - Uses the **home hero video banner** and supporting sections for discovery.
   - Implements a **journal** experience using `templates/blog.journal-to-ellis.json`:
     - A blog feed rendered by `sections/main-blog.liquid` in `layout: "flip"` mode.
     - A hero, art-directed story rendered by `blocks/journal.liquid` mounted via an `_blocks` section.
   - Surfaces **shipping & returns** and **legal** information clearly.

Do **not** redesign everything from scratch. Extend and refine what is already in this theme.

---

## 3. Non‑negotiables

When you change or add code:

1. **Respect PRD.md**
   - If anything in this prompt conflicts with `PRD.md`, assume `PRD.md` wins and update this prompt instead.

2. **Do not hardcode data that belongs in Shopify admin**
   - Product titles, prices, materials, and inventory must come from Shopify products where possible.
   - Policy text (shipping, returns, privacy, terms) should live in pages or theme settings, not deeply embedded Liquid unless there is a clear reason.

3. **Preserve theme editor configurability**
   - New designs should be implemented as sections/blocks with schemas, not one-off hardcoded templates.
   - When you add settings, give them clear labels and helpful defaults.

4. **Don’t break Dawn conventions**
   - Keep translation strings (`t:` keys), accessibility attributes, and standard section patterns intact unless you have a compelling reason to change them.

5. **Journal template safety**
   - `templates/blog.journal-to-ellis.json` is auto-generated and can be overwritten by Shopify.
   - Structural changes to the journal experience belong in `blocks/journal.liquid`, not in hand-edited JSON that the editor may replace.

---

## 4. Key implementation priorities

### 4.1 Home page
- Use the existing `_blocks` hero video banner as the **visual anchor**.
- Ensure the home page:
  - Introduces To Ellis and its style.
  - Surfaces Martha and Ellis products via featured collection/product, collage, or collection-list sections.
  - Links into the Journal and any key static pages (About/Story, Help & Contacts, Policies).

### 4.2 Product detail pages (PDPs)
- Build on `sections/main-product.liquid`.
- For Martha and Ellis:
  - Show clear pricing, material composition (Ellis updated once exact % is known), fit guidance (“normal i størrelse”), and production info (Made in China, Designed in Norway).
  - Include copy that explicitly covers **fit and cut**, **signature details**, and **how the dress feels** (see `CLIENT_PRODUCT_INFO_AND_POLICIES.md`).
  - Use existing blocks (collapsible tabs, custom liquid, complementary products) where helpful.

### 4.3 Journal page
- Use `templates/blog.journal-to-ellis.json` + `blocks/journal.liquid` to present a **hero, art-directed story** with:
  - Title, date, excerpt.
  - Several long-form paragraphs.
  - Signature area (text + optional logo).
  - Background image, paper texture, subtle animation configured via block settings.
- The Journal route also includes a standard blog feed rendered by `sections/main-blog.liquid` in `layout: "flip"` mode; changes to the *feed* belong in `sections/main-blog.liquid` / CSS, while changes to the *hero story* belong in `blocks/journal.liquid`.
- Ensure that a non-technical editor can adjust copy, fonts, spacing, and decorative elements via the theme editor.

### 4.4 Shipping, returns, and policies
- Implement pages/sections that reflect `CLIENT_PRODUCT_INFO_AND_POLICIES.md` and `PRD.md`:
  - Shipping via **Bring** (if active), standard shipping **199 NOK** (domestic and international).
  - Clearly distinguish:
    - Statutory **14-day right of withdrawal (Angrerett)** for online purchases (where applicable).
    - Voluntary **30-day** return window with clear conditions.
  - If you offer store credit vs refund, keep the distinction clear (within statutory withdrawal, customers must be able to choose a **refund**).
  - Do not claim “shipping is non-refundable” in a way that conflicts with statutory withdrawal rights (standard outbound delivery cost is typically refundable on statutory withdrawal).
  - International duties/taxes/import fees (if applicable) are generally non-refundable.
- Replace any legacy brand name in policy source text with **To Ellis**.

### 4.5 Payment methods
- The front-end (footer icons, copy) must match actual gateways configured in Shopify.
- Vipps and Klarna are **not enabled yet** (in progress) — do not display or claim them until they’re enabled.

---

## 5. Acceptance tests

Use these tests to decide if work is complete. They are **observable behaviors**, not implementation details.

### AT-1: Home discovery
- On both mobile and desktop:
  - Landing on `/` shows a hero section with To Ellis messaging and a clear CTA.
  - Martha and Ellis products can be reached from the home page in **≤ 3 clicks** (e.g., via featured section, collection list, or direct featured product block).

### AT-2: PDP completeness for Martha & Ellis
- For **Martha Dress** and each **Ellis Dress** variant:
  - PDP shows correct title and price.
  - PDP contains structured description covering:
    - Fit & cut (e.g., A-line, midi/knee length).
    - Key design details (bows, splits, silk trims, ruffles, neckline, belt, etc.).
    - Material composition (Martha fixed; Ellis updated when available).
    - Production info (Made in China, Designed in Norway).
    - A short “feel” description (e.g., light/airy, soft against skin).
  - PDP renders correctly on mobile and desktop (no layout breakage, media and text readable).

### AT-3: Collections and search
- A user can:
  - Visit at least one collection (e.g., New Arrivals or Dresses) and see dress products in a grid with price and image.
  - Use search to find Martha or Ellis by name.

### AT-4: Journal experience
- Visiting the Journal template (`blog.journal-to-ellis`) shows:
  - The custom journal layout (background, “book” card, decorative SVG, signature area).
  - Content matching the structure of `blocks/journal.liquid` (title, date, excerpt, multiple paragraphs, signature).
- Theme editor allows changing at least: title, main body text, background image, and signature text/logo **without code edits**.

### AT-5: Policies & footer
- There is a visible route (nav, footer, or both) to:
  - A shipping/returns page (or combined policy page) summarizing Bring (if active), standard shipping 199 NOK (domestic/international), 30-day returns, store-credit vs refund differences (if offered), and non-refundable items.
  - Legal pages (Terms, Privacy, Cookie/Policy) as required by Shopify.
- Footer displays:
  - Social links configured in `footer-group.json`.
  - Payment icons that match *actual enabled* methods (do not show/claim Vipps or Klarna until enabled).

### AT-6: Technical quality
- Core templates (home, collection, PDPs, journal) are:
  - Responsive on common viewport sizes (mobile portrait up to desktop).
  - Accessible enough to allow keyboard navigation of menus and dialogs.
  - Free from obvious console errors in a typical browser session.

---

## 6. How to work

When starting a new change:

1. **Read**
   - `PRD.md`
   - `WARP.md`
   - `BRAND_GUIDE.md`
   - `CLIENT_PRODUCT_INFO_AND_POLICIES.md`

2. **Decide where the change belongs**
   - Global layout / tokens → `layout/theme.liquid`, `config/settings_schema.json`, `config/settings_data.json`.
   - Page structure → relevant `templates/*.json` and `sections/*`.
   - Reusable UI → `blocks/*` and `snippets/*`.

3. **Prefer configuration over duplication**
   - Add settings to existing sections/blocks before creating new near-duplicates.

4. **Test against acceptance tests**
   - After any feature or refactor, mentally walk through AT-1 … AT-6 and confirm nothing regressed.

Keep this file and `PRD.md` updated when requirements change, so future work stays aligned with the brand and the existing theme architecture. 