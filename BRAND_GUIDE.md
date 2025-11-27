# BRAND_GUIDE.md – To Ellis

This document captures the brand system that is implicitly encoded in the To Ellis Dawn-based Shopify theme.
Use it when adding sections, writing copy, or adjusting visual design.

---

## 1. Brand overview

**To Ellis** is a Norwegian womenswear brand focused on a small, curated collection of dresses. The brand feeling is:

- Intimate, romantic, and personal – like reading a handwritten letter or cherished journal.
- Considered and architectural – seams, pleats, and details matter more than logos.
- Calm and minimal – lots of air, soft colour transitions, no visual noise.

Everything in the store (layout, colours, typography, copy, imagery) should reinforce this.

---

## 2. Colour system

All colours below are taken from `config/settings_data.json` (current theme settings) and key sections/blocks.

### 2.1 Core palette

**Neutrals / base**

- **Ivory / paper** – `#F7F3EE`  
  - Primary background for header and many sections.  
  - Use for most surfaces where products or copy sit directly on the background.
- **Soft paper white** – `#F9F8F7`  
  - Used in alt backgrounds (PDP areas, journal card background).  
  - Good for content blocks that need a subtle separation from the page.
- **Soft blue-grey** – `#F1F5F9`  
  - Used for footer backgrounds and trust sections.  
  - Works as a structural base for blocks and cards.

**Text / core ink**

- **Deep blue-charcoal** – `#121826`  
  - Primary text colour in the live theme (overrides Dawn’s default `#121212`).  
  - Use for all main body copy, headings, and navigation text.

### 2.2 Brand accents

Pulled from colour schemes and sections:

- **Periwinkle mist** – `#D7DFEA`  
  - Used as a background (e.g. scheme-3) and as a highlight in hero & footer.  
  - Good for soft emphasis blocks and ribbons.
- **Dusty blue** – `#8A9BB7`  
  - Primary action/brand accent colour (buttons, links, hover states).  
  - Used prominently in footer newsletter button and header hover text.
- **Ink navy** – `#1D1F25`  
  - Secondary text and link colour in some schemes; use sparingly for emphasis.
- **Warm sand / gold-beige** – `#B1A785`  
  - Used as an accent button colour in one scheme.  
  - Reserve for special CTAs or seasonal highlights so it doesn’t compete with dusty blue.
- **Wine / deep plum** – `#6F2634`  
  - Used in journal book spine colour.  
  - Use for very subtle, editorial accents (lines, rules, or small icons), not for large backgrounds.

### 2.3 Scheme guidance

From `settings_data.color_schemes` (current theme instance):

- **Scheme-1** – Base layout
  - Background: `#F7F3EE`  
  - Text: `#121826`  
  - Button: `#D7DFEA`, Button label: `#F9F8F7`
  - Use as the default base (body, header, most surfaces).

- **Scheme-2** – Light overlay / inverted
  - Background: `#F9F8F7`  
  - Text: `#F9F8F7` (used over darker elements)  
  - Button: `#F1F5F9`, Button label: `#121826`
  - Use only where text sits on a darker or photographic background.

- **Scheme-3** – Soft blue feature
  - Background: `#D7DFEA`  
  - Text: `#121826`  
  - Button: `#8A9BB7`
  - Good for feature bands (e.g. category callouts, trust sections) that still feel calm.

- **Scheme-4** – Blue highlight
  - Background: `#D7DFEA`  
  - Text: `#121826`  
  - Button: `#FFFFFF`, Button label: `#121212`
  - Used for sale or highlight badges; keep usage limited so it remains special.

- **Scheme-5** – Strong blue
  - Background: `#334FB4` (vivid blue)  
  - Text: `#FFFFFF`
  - Use very sparingly (if at all) – this is the loudest colour in the system and can easily overpower the tone.

- **Custom schemes** (IDs like `scheme-b99e…`, `scheme-2217…`, `scheme-2619…`, `scheme-f5a2…`)
  - Combine the base neutrals with accents like dusty blue, wine, and beige.  
  - When assigning them to sections, keep a consistent logic:  
    - Warm neutrals for stories and PDP content.  
    - Blues for structure (navigation blocks, informational bands).  
    - Wine/beige only for subtle editorial or campaign moments.

**General guidance**

- Prefer **single-colour backgrounds**; gradients exist but are used minimally.
- Use **dusty blue (`#8A9BB7`) for interactive states** (buttons, hovers, selected nav) rather than introducing new accent colours.
- Maintain high contrast between text and background; avoid placing light text on pale backgrounds.

---

## 3. Typography

Typography choices come from `config/settings_data.json`, `blocks/journal.liquid`, the hero banner block, and the header/footer groups.

### 3.1 Typefaces

- **Primary typeface (headings & display)**  
  - Shopify font ID: `cormorant_n*` (Cormorant).  
  - Used for:
    - Brand wordmarks (where text is used instead of logo images).
    - Hero headings, journal headings, and key section titles.

- **Body typeface**  
  - Theme-level setting: `type_body_font = cormorant_n4` in `settings_data.json`.  
  - Currently both headings and body use Cormorant to create a cohesive, editorial feel.

If you ever introduce a separate body sans-serif, keep Cormorant for H1–H3 and brand text, and ensure the new body face is quiet and neutral.

### 3.2 Type scale (approximate)

Derived from theme settings and existing sections:

- Global scales:  
  - `heading_scale`: 105%  
  - `body_scale`: 120%

**Desktop (guideline values):**

- H1 (hero, major section titles): ~40–52px  
  - Example: home hero heading uses 50px.  
  - Tight line-height (~1.1–1.2).
- H2: ~32–40px  
  - Used for section headings (e.g. “NEW ARRIVALS”).
- H3/H4: ~22–28px  
  - Used in PDP subheadings, footer column titles, journal subheads.
- Body: ~16–18px  
  - Journal body text and product descriptions.
- Captions/labels: 12–14px  
  - Use for microcopy only (badges, labels, form hints).

**Mobile:**

- Reduce headings by ~40–50% (e.g. hero H1 22–28px, journal title 24–28px).  
- Maintain generous line-height for long-form reading (journal and product copy).

### 3.3 Styling rules

- **Case**:  
  - Mixed case for most headings and body copy.  
  - Occasional uppercase for small labels (e.g. category tags) is acceptable but should be used sparingly.
- **Weight**:  
  - Stick to regular and semi-bold weights; avoid ultra-bold which feels off-brand.
- **Links**:  
  - Use dusty blue or inherit text colour with subtle underline-on-hover (as seen in the header nav).

---

## 4. Layout, spacing, and components

### 4.1 Layout frame

From `settings_schema.json` / `settings_data.json`:

- **Page width**: 1200px (`page_width`).  
  - Content sits in a centered column with comfortable side gutters.
- **Grid spacing**:  
  - Horizontal and vertical grid spacing: 8px by default.  
  - Think in multiples of 4/8px when adjusting paddings and margins.
- **Section spacing**:  
  - Global `spacing_sections` is 0, so vertical rhythm is mostly controlled per-section via `padding_top` / `padding_bottom`.

### 4.2 Surfaces and cards

- **Corners**:  
  - Cards, buttons, text boxes, and images all have **0px radius** in the current theme.  
  - This keeps the aesthetic sharp and tailored, like pressed seams.
- **Shadows**:  
  - Most shadows are set to **0 opacity**; where used (popups, drawers) they are minimal.  
  - Avoid heavy drop shadows or glows.
- **Borders**:  
  - Borders are thin (`1px`) and low opacity; used primarily to separate elements without creating harsh lines.

### 4.3 Buttons and controls

- Buttons:
  - Primary buttons often use dusty blue or periwinkle with light labels.  
  - Shape is rectangular with no radius; feel should be quiet, not pill-like.
- Variant pills:
  - Pill radius (`40px`) is used for size/variant pills; keep their look minimal and match theme colours.
- Inputs (forms, newsletter, search):
  - Simple bordered rectangles, no strong fills; maintain a clean, editorial look.

### 4.4 Motion

- Scroll-reveal animations are enabled (`animations_reveal_on_scroll = true`).  
  - Keep them subtle and avoid adding heavy or playful motion.  
- Hover animations on header/menu items use underlines and minor lifts; any additional hover effects should be consistent with this language.

---

## 5. Imagery & iconography

### 5.1 Photography

From hero sections, collage sections, and journal backgrounds, the visual language is:

- **Light and texture forward**: silk, cotton, and fabric detail should be visible; backgrounds often soft and out-of-focus.
- **Neutral or soft-coloured environments**: ivory walls, light curtains, soft shadows; avoid high-contrast props or clutter.
- **Human, but not loud**: models and scenes should feel intimate and calm, not overly posed or high-gloss.
- **Consistent colour grading**: keep whites warm (matching `#F7F3EE` / `#F9F8F7`) and shadows soft; avoid heavy saturation.

For product detail images:

- Show full-length, side, and close-up views of key details (bows, splits, ruffles, trims, waist structure).
- Keep backgrounds consistent across products to emphasise garment shape and fabric.

### 5.2 Journal imagery

Journal backgrounds often use full-bleed photography (e.g. soft environment or fabric) behind a paper-like content card.

- Choose images that can handle **blur and scaling** without becoming distracting.  
- Avoid busy patterns; the text is the hero, the background is atmosphere.

### 5.3 Iconography

- Use existing SVG icons from `assets/` and `snippets/` (arrows, social icons, trust icons).  
- Icons should be simple line or filled shapes, aligned with Shopify/Dawn defaults; avoid importing complex or stylistically different icon sets.
- Colour icons using the same text or accent colours (`#121826`, `#8A9BB7`, etc.), not new colours.

---

## 6. Voice & tone

Voice and tone are inferred from the product descriptions and journal content.

### 6.1 Personality

- **Romantic and reflective** – speaks about feelings, memories, and small details.  
- **Considered and confident** – describes cut, construction, and materials precisely.  
- **Warm but not chatty** – intimate, but never overly casual or slangy.

### 6.2 Copy guidelines

- Write primarily in **Norwegian** for customer-facing copy, matching the client’s language in product descriptions and policies.
- When describing products:
  - Always mention **fit** (e.g. "normal i størrelse") and **length/silhouette**.
  - Highlight **signature details** (bows, splits, ruffles, silk trims, waist belts, necklines).
  - Include at least one sentence about **how the garment feels** (e.g. "lett og luftig mot huden").
- Avoid:
  - Hype-y phrases and exclamation marks.  
  - Overly technical jargon that doesn’t help the customer decide.
- Prefer short paragraphs and readable line lengths, especially in the journal and PDP descriptions.

### 6.3 Policies & transactional copy

- For shipping and returns:
  - Be **clear and direct** about conditions (Bring, free shipping in Norway, 14-day returns, store credit vs refund, non-refundable costs).  
  - Use the same calm tone as the rest of the site.
- For CTA buttons:
  - Use simple verbs (e.g. "Kjøp nå", "Legg i handlekurv", "Les journalen").  
  - Avoid shouting; maintain sentence or title case.

---

## 7. How to use this guide

- When you add or style a section:
  - Pick an existing colour scheme that fits the purpose instead of inventing new colours.
  - Use Cormorant for headings and maintain the approximate type scale described above.
- When you write or edit copy:
  - Cross-check with `CLIENT_PRODUCT_INFO_AND_POLICIES.md` and the Voice & tone rules.
- When in doubt:
  - Prefer fewer colours, more whitespace, and quieter typography.  
  - The site should always feel like a carefully bound journal, not a generic ecommerce template.