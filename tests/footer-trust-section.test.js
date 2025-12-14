/** @jest-environment jsdom */

const fs = require('fs');
const path = require('path');
const { Liquid } = require('liquidjs');

let engine;
let sectionTemplateSource;

beforeAll(() => {
  const templatePath = path.join(__dirname, '..', 'sections', 'footer-trust.liquid');
  const rawSource = fs.readFileSync(templatePath, 'utf8');
  sectionTemplateSource = rawSource
    // Shopify-only blocks LiquidJS doesn't understand
    .replace(/\{%-?\s*style\s*-?%\}[\s\S]*?\{%-?\s*endstyle\s*-?%\}/g, '')
    .replace(/\{%-?\s*schema\s*-?%\}[\s\S]*?\{%-?\s*endschema\s*-?%\}/g, '')
    .replace(/\{%-?\s*javascript\s*-?%\}[\s\S]*?\{%-?\s*endjavascript\s*-?%\}/g, '');

  engine = new Liquid();

  // Stub Shopify-specific filters used in the template
  engine.registerFilter('image_url', (input) => {
    if (!input) return '';
    return `url-${input}`;
  });

  engine.registerFilter('placeholder_svg_tag', () => '<svg data-placeholder="image"></svg>');
});

beforeEach(() => {
  document.body.innerHTML = '';
  document.body.style.overflow = '';
});

async function renderFooterTrustSection({
  icons = [],
  titles = [],
  popupTitles = [],
  popupTexts = [],
} = {}) {
  const blocks = Array.from({ length: 4 }, (_, index) => {
    const i = index;
    return {
      id: `block-${i + 1}`,
      type: 'trust-item',
      shopify_attributes: '',
      settings: {
        icon: icons[i] || null,
        title: titles[i] || `Column ${i + 1}`,
        popup_title: popupTitles[i] || `Popup title ${i + 1}`,
        popup_text: popupTexts[i] || `Popup content ${i + 1}`,
      },
    };
  });

  const settings = {
    color_scheme: 'scheme-1',
    text_color: '#000000',
    text_size: 16,
    content_width: 1000,
    vertical_alignment: 'center',
    horizontal_alignment: 'center',
    columns_mobile: '2',
    column_gap: 30,
    column_gap_mobile: 20,
    svg_size: 80,
    svg_size_mobile: 60,
    svg_background_color: '#f8f8f8',
    svg_padding: 10,
    svg_padding_mobile: 8,
    svg_border_radius: 8,
    svg_spacing: 16,
    svg_spacing_mobile: 12,
    popup_width: 500,
    popup_bg_color: '#ffffff',
    popup_text_color: '#000000',
    popup_border_radius: 8,
    popup_padding: 32,
    popup_padding_mobile: 24,
    min_height: 200,
    min_height_mobile: 150,
    padding_top: 40,
    padding_bottom: 40,
    padding_horizontal: 20,
    padding_top_mobile: 32,
    padding_bottom_mobile: 32,
    padding_horizontal_mobile: 16,
  };

  const ctx = {
    section: {
      id: 'test-section',
      settings,
      blocks,
      shopify_attributes: '',
    },
  };

  const html = await engine.parseAndRender(sectionTemplateSource, ctx);
  return { html, ctx };
}

async function renderSectionIntoDocument(config) {
  const { html } = await renderFooterTrustSection(config);
  document.body.innerHTML = html;
  return html;
}

function initializeFooterTrustSectionFromHtml(html) {
  if (!global.customElements) {
    const registry = {};
    global.customElements = {
      define(name, ctor) {
        registry[name] = ctor;
      },
      get(name) {
        return registry[name];
      },
    };
  }

  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    throw new Error('Could not find inline script in footer-trust section');
  }

  const scriptContent = scriptMatch[1];
  // Execute the inline script so the custom element is registered
  // eslint-disable-next-line no-eval
  eval(scriptContent);

  const FooterTrustSection = global.customElements.get('footer-trust-section');
  const el = document.querySelector('footer-trust-section');

  if (!FooterTrustSection || !el) {
    throw new Error('footer-trust-section custom element or root node not found');
  }

  // Manually upgrade the existing element instance to the custom element
  Object.setPrototypeOf(el, FooterTrustSection.prototype);
  if (typeof el.connectedCallback === 'function') {
    el.connectedCallback();
  }

  return el;
}

describe('footer-trust section', () => {
  test('1. The new footer trust section renders with four columns', async () => {
    await renderSectionIntoDocument({
      icons: ['icon-1.svg', 'icon-2.svg', 'icon-3.svg', 'icon-4.svg'],
    });

    const columns = document.querySelectorAll('.footer-trust__column-test-section');
    expect(columns).toHaveLength(4);
  });

  test('2. Each column in the footer trust section displays the correct SVG image when configured', async () => {
    const icons = ['icon-1.svg', 'icon-2.svg', 'icon-3.svg', 'icon-4.svg'];
    await renderSectionIntoDocument({ icons });

    const buttons = Array.from(
      document.querySelectorAll('.footer-trust__column-test-section .footer-trust__icon-button-test-section img'),
    );

    expect(buttons).toHaveLength(4);

    buttons.forEach((img, index) => {
      expect(img.getAttribute('src')).toBe(`url-${icons[index]}`);
      expect(img.getAttribute('alt')).toBe(`Column ${index + 1}`);
    });
  });

  test('3. Clicking an SVG image in the footer trust section opens a pop-up modal', async () => {
    const html = await renderSectionIntoDocument({
      icons: ['icon-1.svg', 'icon-2.svg', 'icon-3.svg', 'icon-4.svg'],
    });

    const footerTrustEl = initializeFooterTrustSectionFromHtml(html);

    const trigger = footerTrustEl.querySelector('[data-modal-trigger="block-1"]');
    const modal = footerTrustEl.querySelector('[data-modal="block-1"]');

    expect(trigger).not.toBeNull();
    expect(modal).not.toBeNull();
    expect(modal.classList.contains('is-active')).toBe(false);

    trigger.click();

    expect(modal.classList.contains('is-active')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('4. The pop-up modal for the footer trust section displays the correct title and content', async () => {
    const popupTitles = ['Title 1', 'Title 2', 'Title 3', 'Title 4'];
    const popupTexts = ['Content 1', 'Content 2', 'Content 3', 'Content 4'];

    await renderSectionIntoDocument({ popupTitles, popupTexts });

    popupTitles.forEach((expectedTitle, index) => {
      const modal = document.querySelector(`.footer-trust__modal-overlay-test-section[data-modal="block-${index + 1}"]`);
      expect(modal).not.toBeNull();

      const titleEl = modal.querySelector('.footer-trust__modal-title-test-section');
      const textEl = modal.querySelector('.footer-trust__modal-text-test-section');

      expect(titleEl).not.toBeNull();
      expect(textEl).not.toBeNull();

      expect(titleEl.textContent.trim()).toBe(expectedTitle);
      expect(textEl.textContent.replace(/\s+/g, ' ').trim()).toContain(popupTexts[index]);
    });
  });

  test('5. The pop-up modal in the footer trust section can be closed by clicking the close button or pressing Escape', async () => {
    const html = await renderSectionIntoDocument({
      icons: ['icon-1.svg', 'icon-2.svg', 'icon-3.svg', 'icon-4.svg'],
    });

    const footerTrustEl = initializeFooterTrustSectionFromHtml(html);

    const trigger = footerTrustEl.querySelector('[data-modal-trigger="block-1"]');
    const modal = footerTrustEl.querySelector('[data-modal="block-1"]');
    const closeButton = modal.querySelector('.footer-trust__modal-close-test-section');

    // Open the modal first
    trigger.click();
    expect(modal.classList.contains('is-active')).toBe(true);

    // Close via close button
    closeButton.click();
    expect(modal.classList.contains('is-active')).toBe(false);
    expect(document.body.style.overflow).toBe('');

    // Open again
    trigger.click();
    expect(modal.classList.contains('is-active')).toBe(true);

    // Close via Escape key
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    expect(modal.classList.contains('is-active')).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });
});
