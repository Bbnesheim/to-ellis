# Client product info & policies

This document summarizes product information and policy details from the client email, for use when finalizing copy and configuration for the To Ellis storefront.

## Products

### Martha Dress

- **Name:** Martha Dress / MARTHA BLACK DRESS  
- **Material:** 75% acetate, 25% polyester  
- **Fit:** Normal i størrelse (true to size)  
- **Production:** Made in China, designed in Norway  
- **Color & price (incl. mva, subject to final confirmation):**  
  - MARTHA BLACK DRESS – 2700 NOK

**Technical & visual description (client wording):**

> Oppdag vår elegante A-formede midi-kjole, designet med lekne detaljer som skaper et balansert og allsidig uttrykk. Kjolen har to justerbare sløyfebånd festet i midjen, som kan knytes til en stilfull sløyfe på ryggen. Den unike splitten på høyre side, kombinert med en dyp firkantet hals, gir kjolen et moderne preg. Kjolen sitter perfekt og gir en følelse av god støtte i overdelen, mens skjørtet er både lett og luftig. Martha-kjolen er for deg som ønsker å kombinere komfort med tidløs eleganse. En allsidig kjole som passer utmerket for den moderne, allsidige kvinnen.

### Ellis Dress

- **Name:** Ellis Dress / ELLIS PURE WHITE DRESS / ELLIS DARK BLUE DRESS  
- **Material:** Exact composition to be confirmed ("Får denne nøyaktige prosentene iløpet av neste uke.")  
- **Fit:** Normal i størrelse (true to size)  
- **Production:** Made in China, designed in Norway  
- **Color & prices (incl. mva, subject to final confirmation):**  
  - ELLIS PURE WHITE DRESS – 2900 NOK  
  - ELLIS DARK BLUE DRESS – 2900 NOK

**Technical & visual description (client wording):**

> Oppdag en eventyrlig og romantisk knekort kjole som virkelig setter fokus på de eksklusive detaljene. Denne kjolen prydes av nydelige silkedetaljer, inkludert en elegant V-hals med delikate rysjer, silke sløyfebånd på ermene, samt et silkebelte i livet med stretch for optimal komfort. Skjørtet er kantet med silke som gir en raffinert finish. Kjolen har en praktisk glidelås i siden som gjør den enkel å ta av og på. Med sitt unike romantiske uttrykk føles kjolen lett, luftig og behagelig mot huden. Dette er en drøm av en kjole som passer perfekt for alle drømmende kvinner som ønsker å skinne.

### Sizing & measurements

- Client notes: "Tilgjengelige størrelser og mål i cm: sendt som vedlegg" (sizes and measurements in cm are provided in a separate attachment, not yet captured in this repo).  
- Fit guidance for both dresses: **Normal i størrelse** (true to size).

## Product copy guidelines from client

The client explicitly calls out the following elements to include for each product:

- Short description of **fit and cut** (e.g. A-line, fitted, midi length, knee length, etc.).
- Key **details / signatures** (e.g. ties, ruffles, buttons, splits, fabric texture, silk trims, waist bow, etc.).
- A couple of sentences describing **how the dress feels** on the body (e.g. "lett og luftig mot huden", "glatt med subtil glans").

These points should be reflected consistently in the final on-site product descriptions to keep the To Ellis brand language coherent and luxurious.

## Shipping, returns & policy (client outline)

### Shipping

- Carrier: **Bring** (if this is still the active carrier).
- **Standard shipping:** **199 NOK** (domestic and international).

### Returns

- **Return window:**  
  - **30 days**.

- **Item condition requirements:**  
  - Items must be unused.  
  - All original tags and security ribbons intact.  
  - Returned in original packaging.

- **Return options:**
  - Customer can choose **store credit** or **refund**.  
  - The difference between these options is important in how costs are handled.

#### Store credit (recommended in client text)

- Customer receives **full item value** as store credit (gift card).  
- Return shipping is **free within Norway**.  
- No deductions or fees.  
- Store credit is issued within **10 business days** after the return is received.

#### Refunds

- Return shipping is **not covered** and is deducted from the refund if the prepaid label is used.  
- Example rates mentioned:
  - Norway: **200 NOK** (deducted from refund amount).  
- Original shipping costs are **non-refundable**.  
- Refunds are **final** once issued and cannot later be converted into store credit.  
- Refund processing time: up to **30 business days** after the return is received (actual timing may vary depending on Shopify and the customer’s bank).

#### Sale items

- Sale items are eligible for return within the same **30-day** return window (unless you later define a separate sale-item exception).

#### Non‑refundable costs

- Original shipping, international duties, and taxes are **non‑refundable**.

> NOTE: The text in the client email references another brand name (Murlong Cres) in the refund/credit section. When turning this into site copy, ensure all brand references are updated to **To Ellis** and that shipping fee amounts and timelines are re‑confirmed with the client.

## Payment methods

### Currently (do not claim what’s not enabled)

At this time, the store does **not** take:

- Vipps
- Klarna

Ensure all on-site copy and icons reflect only the payment methods that are actually enabled in Shopify.

### In progress / planned

- Vipps (in the works)
- Klarna (in the works)

## Current repo/theme configuration notes (needs alignment)

These notes describe what is *currently* configured in this repo (mostly in auto-generated JSON), and where it conflicts with the client outline above.

### Footer trust popups (copy mismatch)

In `sections/footer-group.json`, the trust-section popup copy currently contains placeholder/legacy text that should be reviewed against the *current* policies:

- **Easy Returns** popup currently says **30 days** (this is OK).
- **Safe Payments** popup currently mentions Klarna (and other methods). Since Vipps/Klarna are **not enabled yet**, ensure this copy does **not** claim Vipps/Klarna.
- **Quick Shipping** popup currently uses generic “ROUND SHIPPING / EXPRESS 2ND DAY SHIPPING” language; update to reflect the current standard shipping price (**199 NOK**, domestic and international) and whatever delivery-time wording you want to commit to.

### Footer payment icons (visual mismatch)

In `sections/footer-group.json` → `main-footer` → `payments_row`, the footer currently displays icons including Visa, Mastercard, Apple Pay, PayPal, and Stripe, and is configured with `use_dynamic_icons: true`.

Ensure the icon row matches *actual enabled payment types*.
- Do **not** add Vipps/Klarna icons until those gateways are actually enabled.

### Contact/company details

`templates/page.contact.json` currently includes:
- Email: `elisabeth@toellis.com`
- Org. nr: `935 950 740`
- Address: `Sjoarbakken 6 C, 5411 Stord, Norway`

If any of these change, update the contact page sections (`sections/contact-info.liquid` + `sections/contact-form-support.liquid`) via the theme editor so the JSON stays in sync.

## QR codes & Shopify setup

- Client wants to **delay QR-code implementation** until they have had time to get comfortable with Shopify and the overall systems.
- Action: treat QR codes as a **later-phase enhancement**, not a launch blocker.

## Assets & timeline notes

- Client hopes to send **final product photos** by **Monday 17. November** (year not specified in the email).  
- This impacts when final product pages and marketing assets can be fully polished.

## Contact & company info

From the client email:

- **Contact email:** elisabeth@toellis.com  
- **Company name:** To Ellis  
- **Org. nr:** 935 950 740  
- **Address:** Sjoarbakken 6 C, 5411 Stord, Norway
