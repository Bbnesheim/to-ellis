const fs = require('fs');
const path = require('path');
const { Liquid } = require('liquidjs');

let engine;
let titleTemplate;

beforeAll(() => {
  const templatePath = path.join(__dirname, '..', 'sections', 'featured-product.liquid');
  const source = fs.readFileSync(templatePath, 'utf8');

  const match = source.match(/{%- when 'title' -%}([\s\S]*?){%- when 'price' -%}/);
  if (!match) {
    throw new Error('Could not find title block in featured-product.liquid');
  }

  const snippet = match[1];

  engine = new Liquid();
  // Minimal stub for the translation filter used in the placeholder branch
  engine.registerFilter('t', (key) => key);

  titleTemplate = engine.parse(snippet);
});

async function renderTitleSnippet({
  headingSize = 'h1',
  headingSizeMobile,
  productTitle = 'Default product title',
  placeholder = false,
} = {}) {
  const ctx = {
    block: {
      settings: {
        heading_size: headingSize,
        heading_size_mobile: headingSizeMobile,
      },
      shopify_attributes: '',
    },
    product: placeholder ? null : { title: productTitle },
    placeholder,
  };

  return engine.render(titleTemplate, ctx);
}

function extractHeading(html, predicate) {
  const regex = /<h2([^>]*)>([\s\S]*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const attrs = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    const classMatch = attrs.match(/class="([^"]*)"/);
    const classList = classMatch ? classMatch[1].split(/\s+/) : [];
    if (predicate(classList)) {
      return { classList, text };
    }
  }
  return null;
}

describe('featured-product title block', () => {
  test('1. The product title is displayed correctly on desktop devices', async () => {
    const html = await renderTitleSnippet({
      headingSize: 'h1',
      productTitle: 'Desktop Product Title',
    });

    const desktopHeading = extractHeading(html, (classes) =>
      classes.includes('product__title') && classes.includes('small-hide') && !classes.includes('product__title--mobile'),
    );

    expect(desktopHeading).not.toBeNull();
    expect(desktopHeading.text).toBe('Desktop Product Title');
    expect(desktopHeading.classList).toContain('h1');
  });

  test('2. The product title is displayed correctly on mobile devices', async () => {
    const html = await renderTitleSnippet({
      headingSize: 'h1',
      headingSizeMobile: 'h2',
      productTitle: 'Mobile Product Title',
    });

    const mobileHeading = extractHeading(html, (classes) =>
      classes.includes('product__title--mobile') && classes.includes('medium-hide') && classes.includes('large-up-hide'),
    );

    expect(mobileHeading).not.toBeNull();
    expect(mobileHeading.text).toBe('Mobile Product Title');
  });

  test("3. The mobile heading size is applied correctly when 'heading_size_mobile' is set", async () => {
    const html = await renderTitleSnippet({
      headingSize: 'h1',
      headingSizeMobile: 'h0',
      productTitle: 'Sized Mobile Title',
    });

    const mobileHeading = extractHeading(html, (classes) =>
      classes.includes('product__title--mobile'),
    );

    expect(mobileHeading).not.toBeNull();
    expect(mobileHeading.classList).toContain('h0');
  });

  test("4. The default mobile heading size is 'h2' when 'heading_size_mobile' is not set", async () => {
    const html = await renderTitleSnippet({
      headingSize: 'h2',
      headingSizeMobile: undefined,
      productTitle: 'Default Mobile Size Title',
    });

    const mobileHeading = extractHeading(html, (classes) =>
      classes.includes('product__title--mobile'),
    );

    expect(mobileHeading).not.toBeNull();
    expect(mobileHeading.classList).toContain('h2');
  });

  test("5. The product title correctly renders the product's actual title when available", async () => {
    const html = await renderTitleSnippet({
      headingSize: 'h1',
      headingSizeMobile: 'h2',
      productTitle: 'Actual Product Title',
      placeholder: false,
    });

    const desktopHeading = extractHeading(html, (classes) =>
      classes.includes('product__title') && classes.includes('small-hide') && !classes.includes('product__title--mobile'),
    );

    const mobileHeading = extractHeading(html, (classes) =>
      classes.includes('product__title--mobile'),
    );

    expect(desktopHeading).not.toBeNull();
    expect(mobileHeading).not.toBeNull();
    expect(desktopHeading.text).toBe('Actual Product Title');
    expect(mobileHeading.text).toBe('Actual Product Title');
  });
});
