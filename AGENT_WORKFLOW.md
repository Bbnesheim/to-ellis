# AGENT_WORKFLOW.md – To Ellis Shopify Store

This document describes how agents should work in this repository, using `PRD.md`, `PROMPT.md`, and `WARP.md` to implement and maintain the To Ellis Shopify Dawn theme.

---

## 1. Core artefacts

Always align your work with these documents:

- `PRD.md` – Product Requirements Document (source of truth for what the store must do).
- `PROMPT.md` – Implementation prompt and acceptance tests (how success is judged).
- `WARP.md` – Repo-specific guidance for using Warp and developing this theme.
- `CLIENT_PRODUCT_INFO_AND_POLICIES.md` – Client-supplied product descriptions and policy outline.

If `PROMPT.md` or this file conflict with `PRD.md`, update these auxiliary docs to match `PRD.md`.

---

## 2. Roles

In practice a single person or agent may play several roles. Use these as mental “hats” rather than strict job titles.

### 2.1 Content & Brand Agent

Responsible for:

- Translating client product info into on-site copy:
  - Martha Dress and Ellis Dress descriptions (fit, details, feel).
  - Size/fit guidance and care instructions.
- Drafting and maintaining policy pages:
  - Shipping & returns (Bring, free shipping in Norway, 14-day window, store-credit vs refund).
  - Legal pages (Terms, Privacy, Cookies/Policy) in line with Shopify’s standard structure.
- Writing journal content using the `journal` block schema.

Workflow:

1. Read `PRD.md` sections on products, policies, journal.
2. Use `CLIENT_PRODUCT_INFO_AND_POLICIES.md` as the starting point for copy.
3. Draft text in markdown or separate docs first if helpful; then migrate into Shopify pages and section settings via the theme editor.
4. Coordinate with the Theme Agent to ensure sections/blocks expose the fields you need (no copy hardcoded in Liquid unless unavoidable).

### 2.2 Theme & Layout Agent

Responsible for:

- Implementing and updating Liquid templates, sections, blocks, and snippets.
- Connecting theme settings (`config/settings_schema.json`) to layout and components.
- Ensuring editors can manage content via sections/blocks instead of code.

Workflow:

1. Before coding, read:
   - `PRD.md` – especially architecture and functional requirements.
   - `PROMPT.md` – key priorities and acceptance tests.
   - `WARP.md` – how to run and check the theme.
2. Decide where the change belongs:
   - Global layout or tokens → `layout/theme.liquid`, `config/settings_schema.json`, `config/settings_data.json`.
   - Page structure → relevant `templates/*.json` and `sections/*`.
   - Reusable UI → `blocks/*` and `snippets/*`.
3. Extend existing sections/blocks before adding new ones:
   - Add schema settings for colors, copy, toggles, and layout options rather than forking near-identical components.
4. For the journal experience:
   - Treat `templates/blog.journal-to-ellis.json` as auto-generated.
   - Put structural and styling changes in `blocks/journal.liquid`.
5. After coding, verify against `PROMPT.md` acceptance tests (AT-1 … AT-6).

### 2.3 Integration & Settings Agent

Responsible for:

- Shopify admin configuration that must match theme expectations:
  - Navigation menus (main menu, footer menus) aligning with visible links.
  - Payment methods: Klarna, Vipps, Visa, PayPal.
  - Shipping profiles and rates (Bring, free shipping in Norway).
  - Legal pages (Terms, Privacy, etc.) and linking them in the footer.
- Coordinating theme settings with admin configuration (e.g., correct color schemes, typography, cart type).

Workflow:

1. From `PRD.md` and `PROMPT.md`, list required:
   - Menus, pages, payment options, shipping/returns behavior.
2. Adjust Shopify admin to match, then:
   - Update footer payment icons and links in the theme so UI matches actual configuration.
   - Ensure any policy links in header/footer point to real pages.
3. Whenever payment or shipping configuration changes, re-check AT-5 (Policies & footer) to ensure the UI is still accurate.

### 2.4 QA & Review Agent

Responsible for:

- Verifying that changes satisfy acceptance tests.
- Guarding against regressions in layout, performance, and accessibility.

Workflow:

1. For every significant change, walk through `PROMPT.md` acceptance tests:
   - AT-1: Home discovery.
   - AT-2: PDP completeness.
   - AT-3: Collections and search.
   - AT-4: Journal experience.
   - AT-5: Policies & footer.
   - AT-6: Technical quality.
2. Test on at least one mobile and one desktop viewport.
3. Check keyboard navigation for header menus, cart drawer, and journal where applicable.
4. Flag issues back to the Theme or Content Agent with concrete observations (URL, viewport, steps to reproduce).

---

## 3. Typical workflows

### 3.1 Adding or updating a product (Martha or Ellis)

1. Content Agent:
   - Update product data in Shopify admin (title, materials, pricing, images, variants).
   - Refine description based on `CLIENT_PRODUCT_INFO_AND_POLICIES.md` and `PRD.md`.
2. Theme Agent:
   - Confirm `main-product.liquid` surfaces needed blocks (fit/cut, details, feel, care, size guide).
   - Wire any new metafields or settings into the PDP template if required.
3. Integration Agent:
   - Ensure the product appears in correct collections (New Arrivals, Dresses, etc.).
4. QA Agent:
   - Run AT-2 for the updated product and AT-1/AT-3 for discoverability.

### 3.2 Updating shipping and returns policy

1. Content Agent:
   - Update the policy page text to reflect the latest client rules (Bring, free shipping, 14-day returns, store credit vs refund, non-refundable items) using `CLIENT_PRODUCT_INFO_AND_POLICIES.md`.
2. Integration Agent:
   - Ensure the updated policy page is linked from the footer and any PDP snippets or tabs referencing shipping/returns.
3. Theme Agent:
   - If shipping/returns snippets exist in PDPs or sections, update them to reference the policy page rather than duplicating long text.
4. QA Agent:
   - Verify AT-5 (Policies & footer) still passes.

### 3.3 Adjusting the journal layout or content

1. Content Agent:
   - Draft or update journal copy (title, date, paragraphs, signature) in the theme editor using the `journal` block.
2. Theme Agent (if layout change is needed):
   - Modify `blocks/journal.liquid` for styling or structural changes.
   - Avoid hand-editing `blog.journal-to-ellis.json` beyond what the editor can safely reproduce.
3. QA Agent:
   - Verify AT-4 (Journal experience) on mobile and desktop.

---

## 4. Updating artefacts

Whenever requirements, brand direction, or client policies change:

1. Update `PRD.md` first to reflect the new source-of-truth requirements.
2. Update `PROMPT.md` to keep priorities and acceptance tests in sync with `PRD.md`.
3. Update this `AGENT_WORKFLOW.md` only if workflows or responsibilities need to change.

Keep these documents short, concrete, and tied closely to what exists in the theme. Avoid duplicating Shopify’s generic documentation here.