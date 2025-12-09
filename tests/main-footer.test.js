/** @jest-environment jsdom */

const fs = require('fs');
const path = require('path');
const { Liquid } = require('liquidjs');

let engine;
let templateSource;

beforeAll(() => {
  const templatePath = path.join(__dirname, '..', 'sections', 'main-footer.liquid');
  const rawSource = fs.readFileSync(templatePath, 'utf8');

  // Replace Shopify's `form` block tag with a plain HTML <form> so LiquidJS can render it
  templateSource = rawSource
    .replace(
      /\{%[\s-]*form\s+'customer'[^%]*id:\s*'FooterNewsletter'[^%]*class:\s*'to-footer-newsletter__form-{{ footer_id }}'[^%]*%}/,
      '<form id="FooterNewsletter" class="to-footer-newsletter__form-{{ footer_id }}">',
    )
    .replace(/\{%[\s-]*endform[\s-]*%}/g, '</form>');

  engine = new Liquid({
    root: [
      path.join(__dirname, '..', 'sections'),
      path.join(__dirname, '..', 'snippets'),
    ],
    extname: '.liquid',
  });

  // Stub Shopify-specific filters used in the template
  engine.registerFilter('image_url', (input) => {
    if (!input) return '';
    return `url-${input}`;
  });

  engine.registerFilter('payment_type_svg_tag', (input) => {
    return `<svg data-payment="${input}"></svg>`;
  });
});

beforeEach(() => {
  document.body.innerHTML = '';
});

function baseSectionSettings(overrides = {}) {
  return {
    background_color: '#ffffff',
    text_color: '#000000',
    newsletter_background: '#f1f5f9',
    input_border_color: '#cccccc',
    button_background_color: '#000000',
    button_text_color: '#ffffff',
    button_hover_color: '#333333',
    success_color: '#008060',
    error_color: '#d82c0d',
    payment_icon_background: '#eeeeee',
    newsletter_logo_width: 200,
    padding_top: 40,
    padding_bottom: 40,
    ...overrides,
  };
}

async function renderMainFooter({
  sectionSettings = {},
  blocks = [],
  form = {},
  linklists = {},
  collections = [],
  shop = {},
} = {}) {
  const sectionId = 'test_footer';
  const section = {
    id: sectionId,
    settings: baseSectionSettings(sectionSettings),
    blocks,
  };

  const ctx = {
    section,
    linklists,
    collections,
    shop,
    form: {
      email: '',
      errors: null,
      'posted_successfully?': false,
      ...form,
    },
  };

  const html = await engine.parseAndRender(templateSource, ctx);
  document.body.innerHTML = html;

  const footerId = sectionId.replace(/_/g, '').toLowerCase();
  return { html, ctx, footerId };
}

describe('main-footer section', () => {
  test('1. The newsletter form submits correctly and displays a success message', async () => {
    const newsletterBlock = {
      id: 'newsletter',
      type: 'newsletter',
      shopify_attributes: '',
      settings: {
        logo: null,
        logo_alt: 'Newsletter',
        heading: 'The Club To Ellis',
        body: '<p>Stay updated.</p>',
        email_placeholder: 'Your email address',
        button_text: 'Sign up',
        success_message: 'Thank you for subscribing!',
      },
    };

    const { footerId } = await renderMainFooter({
      blocks: [newsletterBlock],
      form: {
        email: 'valid@example.com',
        errors: null,
        'posted_successfully?': true,
      },
    });

    const successMessage = document.getElementById(`FooterNewsletter-success-${footerId}`);
    expect(successMessage).not.toBeNull();
    expect(successMessage.textContent.trim()).toBe('Thank you for subscribing!');

    const errorMessage = document.getElementById(`FooterNewsletter-error-${footerId}`);
    expect(errorMessage).toBeNull();
  });

  test('2. The newsletter form displays an error message for invalid email input', async () => {
    const newsletterBlock = {
      id: 'newsletter',
      type: 'newsletter',
      shopify_attributes: '',
      settings: {
        logo: null,
        logo_alt: 'Newsletter',
        heading: 'The Club To Ellis',
        body: '<p>Stay updated.</p>',
        email_placeholder: 'Your email address',
        button_text: 'Sign up',
        success_message: 'Thank you for subscribing!',
      },
    };

    const formErrors = {
      translated_fields: { email: 'email' },
      messages: { email: 'is invalid' },
    };

    const { footerId } = await renderMainFooter({
      blocks: [newsletterBlock],
      form: {
        email: 'not-an-email',
        errors: formErrors,
        'posted_successfully?': false,
      },
    });

    const errorMessage = document.getElementById(`FooterNewsletter-error-${footerId}`);
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent.replace(/\s+/g, ' ').trim()).toBe('Email is invalid');

    const input = document.getElementById(`FooterNewsletter-email-${footerId}`);
    expect(input).not.toBeNull();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(`FooterNewsletter-error-${footerId}`);
  });

  test('3. The link groups render correctly with provided menu links', async () => {
    const linkGroupBlock = {
      id: 'links-about',
      type: 'link_group',
      shopify_attributes: '',
      settings: {
        heading: 'About To Ellis',
        menu: 'footer-menu',
        show_all_collections: false,
        collection_limit: 6,
      },
    };

    const linklists = {
      'footer-menu': {
        links: [
          { url: '/about', title: 'About us' },
          { url: '/contact', title: 'Contact' },
        ],
      },
    };

    const { footerId } = await renderMainFooter({
      blocks: [linkGroupBlock],
      linklists,
    });

    const heading = document.querySelector(`.to-footer-link-group__title-${footerId}`);
    expect(heading).not.toBeNull();
    expect(heading.textContent.trim()).toBe('About To Ellis');

    const links = Array.from(
      document.querySelectorAll(`.to-footer-link-list-${footerId} li a`),
    ).map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim() }));

    expect(links).toEqual([
      { href: '/about', text: 'About us' },
      { href: '/contact', text: 'Contact' },
    ]);
  });

  test('4. The link groups display collections correctly when no menu is selected and show_all_collections is true', async () => {
    const linkGroupBlock = {
      id: 'links-categories',
      type: 'link_group',
      shopify_attributes: '',
      settings: {
        heading: 'Categories',
        menu: '',
        show_all_collections: true,
        collection_limit: 2,
      },
    };

    const collections = [
      { title: 'Dresses', url: '/collections/dresses', all_products_count: 10 },
      { title: 'Empty collection', url: '/collections/empty', all_products_count: 0 },
      { title: 'Tops', url: '/collections/tops', all_products_count: 5 },
    ];

    const { footerId } = await renderMainFooter({
      blocks: [linkGroupBlock],
      collections,
    });

    const heading = document.querySelector(`.to-footer-link-group__title-${footerId}`);
    expect(heading).not.toBeNull();
    expect(heading.textContent.trim()).toBe('Categories');

    const links = Array.from(
      document.querySelectorAll(`.to-footer-link-list-${footerId} li a`),
    ).map((a) => a.textContent.trim());

    expect(links).toEqual(['Dresses', 'Tops']);
  });

  test('5. Social media icons are displayed correctly with the provided URLs', async () => {
    const socialBlock = {
      id: 'social',
      type: 'social',
      shopify_attributes: '',
      settings: {
        heading: 'Follow us',
        instagram_url: 'https://fallback.example/instagram',
        facebook_url: 'https://fallback.example/facebook',
        tiktok_url: 'https://fallback.example/tiktok',
        tise_url: 'https://fallback.example/tise',
        youtube_url: 'https://fallback.example/youtube',
      },
    };

    const socialIconBlocks = [
      {
        id: 'instagram-icon',
        type: 'social_icon',
        shopify_attributes: '',
        settings: {
          platform: 'instagram',
          link: 'https://example.com/instagram',
          icon: null,
          label: '',
        },
      },
      {
        id: 'facebook-icon',
        type: 'social_icon',
        shopify_attributes: '',
        settings: {
          platform: 'facebook',
          link: 'https://example.com/facebook',
          icon: null,
          label: '',
        },
      },
      {
        id: 'tiktok-icon',
        type: 'social_icon',
        shopify_attributes: '',
        settings: {
          platform: 'tiktok',
          link: 'https://example.com/tiktok',
          icon: null,
          label: '',
        },
      },
      {
        id: 'tise-icon',
        type: 'social_icon',
        shopify_attributes: '',
        settings: {
          platform: 'tise',
          link: 'https://example.com/tise',
          icon: null,
          label: '',
        },
      },
      {
        id: 'youtube-icon',
        type: 'social_icon',
        shopify_attributes: '',
        settings: {
          platform: 'youtube',
          link: 'https://example.com/youtube',
          icon: null,
          label: '',
        },
      },
    ];

    const { footerId } = await renderMainFooter({
      blocks: [socialBlock, ...socialIconBlocks],
    });

    const links = Array.from(
      document.querySelectorAll(`.to-footer-social__link-${footerId}`),
    );

    const byLabel = (label) => links.find((a) => a.textContent.includes(label));

    const instagramLink = byLabel('Instagram');
    const facebookLink = byLabel('Facebook');
    const tiktokLink = byLabel('TikTok');
    const tiseLink = byLabel('Tise');
    const youtubeLink = byLabel('YouTube');

    expect(instagramLink.getAttribute('href')).toBe('https://example.com/instagram');
    expect(facebookLink.getAttribute('href')).toBe('https://example.com/facebook');
    expect(tiktokLink.getAttribute('href')).toBe('https://example.com/tiktok');
    expect(tiseLink.getAttribute('href')).toBe('https://example.com/tise');
    expect(youtubeLink.getAttribute('href')).toBe('https://example.com/youtube');

    const tiseIconImg = tiseLink.querySelector('img');
    expect(tiseIconImg).not.toBeNull();
    expect(tiseIconImg.getAttribute('src')).toContain('Tise.svg');
  });
});