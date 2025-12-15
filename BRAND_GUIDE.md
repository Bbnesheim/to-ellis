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

- **Ink (deep blue-charcoal)** – `#121826`
  - Used in key areas via explicit section settings (e.g. the custom overlay header and main footer section settings).
  - Use for primary headings and body copy when you control text color directly.

- **Dusty blue (accent + sometimes “scheme text”)** – `#8A9BB7`
  - This color is used heavily as the `text` value in multiple Shopify color schemes in `settings_data.json`.
  - Treat it as an accent/secondary ink (links, subtle headings, UI accents) unless the section design explicitly intends for the whole section to be “dusty-blue ink on ivory”.

### 2.2 Brand accents

Pulled from colour schemes and sections:

- **Periwinkle mist** – `#D7DFEA`
  - Used primarily for soft UI accents (notably as button backgrounds in multiple schemes) and as a gentle highlight in the hero banner gradient.
  - Good for subtle emphasis without introducing a loud accent color.
- **Dusty blue** – `#8A9BB7`  
  - Primary action/brand accent colour (buttons, links, hover states).  
  - Used prominently in footer newsletter button and header hover text.
- **Ink navy** – `#1D1F25`  
  - Secondary text and link colour in some schemes; use sparingly for emphasis.
- **Warm sand / gold-beige** – `#B1A785`  
  - Used as an accent button colour in one scheme.  
  - Reserve for special CTAs or seasonal highlights so it doesn’t compete with dusty blue.
- **Wine / deep plum** – `#6F2634`
  - Present as a full background in one of the custom color schemes (`scheme-221766d3-…`).
  - Use for editorial/campaign moments sparingly (it’s the heaviest color in the palette).

### 2.3 Scheme guidance

From `settings_data.color_schemes` (current theme instance):

- **Scheme-1**
  - Background: `#f7f3ee`
  - Text: `#8a9bb7`
  - Button: `#d7dfea`, Button label: `#f9f8f7`
  - Use as the default neutral base. If you need darker primary text, set it via section settings (e.g. `#121826`).

- **Scheme-2**
  - Background: `#f9f8f7`
  - Text: `#8a9bb7`
  - Button: `#f1f5f9`, Button label: `#8a9bb7`
  - Use for light, airy sections (home bands, product grids) where dusty-blue text is acceptable.

- **Scheme-3**
  - Background: `#f7f3ee`
  - Text: `#8a9bb7`
  - Button: `#8a9bb7`, Button label: `#f9f8f7`
  - Strong “dusty blue” CTA scheme; good for CTAs that should still feel calm.

- **Scheme-4**
  - Background: `#f1f5f9`
  - Text: `#8a9bb7`
  - Button: `#f1f5f9`, Button label: `#8a9bb7`
  - Use for structured bands (collages, collections) and light UI surfaces.

- **Scheme-5**
  - Background: `#f1f5f9`
  - Text: `#1d1f25`
  - Button: `#ffffff`, Button label: `#334fb4`
  - Use sparingly for “higher contrast” sections (e.g. footer trust), while keeping the palette restrained.

- **Custom schemes (UUID suffixes)**
  - `scheme-221766d3-…`: plum/wine background (`#6f2634`) with light text (`#f9f8f7`) and periwinkle button (`#d7dfea`).
  - `scheme-26194e4e-…`: dusty blue background (`#8a9bb7`) with ink text (`#121826`) and sand button (`#b1a785`).
  - `scheme-b99e0aef-…`: very close to scheme-1 but with stronger CTA (button `#8a9bb7`).
  - `scheme-f5a20548-…`: inverse/novelty variant where background + text are both light (`#f7f3ee`) and buttons are also light.

**General guidance**

- Prefer **single-colour backgrounds**; gradients exist but are used minimally.
- Keep the palette tight: neutrals (`#f7f3ee`, `#f9f8f7`, `#f1f5f9`) + dusty blue (`#8a9bb7`) + ink (`#121826`) + occasional sand (`#b1a785`) / plum (`#6f2634`).
- Maintain high contrast between text and background; don’t rely solely on dusty blue for long-form body text.


---

## 3. Typography

Typography choices come from `config/settings_data.json`, `sections/journal-article.liquid`, the hero banner block, and the header/footer groups.

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

- Global scales (from `config/settings_data.json`):
  - `heading_scale`: 135
  - `body_scale`: 120

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
  - The theme is currently configured with **8px radius** for most UI surfaces (buttons, cards, media, inputs) via `config/settings_data.json`.
  - This keeps the look soft and premium (not overly rounded), and matches the existing hero button + journal card styling.
- **Shadows**:  
  - Most shadows are set to **0 opacity**; where used (popups, drawers) they are minimal.  
  - Avoid heavy drop shadows or glows.
- **Borders**:  
  - Borders are thin (`1px`) and low opacity; used primarily to separate elements without creating harsh lines.

### 4.3 Buttons and controls

- Buttons:
  - Primary buttons often use dusty blue or periwinkle with light labels.
  - Default button radius is **8px**; keep it consistent unless a section explicitly needs a different treatment.
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
  - Be **clear and direct** about conditions (Bring, 199 NOK standard shipping, 30-day returns, store credit vs refund, non-refundable costs).  
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