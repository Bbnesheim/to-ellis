/** @jest-environment jsdom */

let originalFetch;

beforeAll(() => {
  // Preserve any existing fetch implementation
  originalFetch = global.fetch;

  // Minimal global stubs used by cart.js
  global.debounce = (fn) => fn;
  global.ON_CHANGE_DEBOUNCE_TIMER = 0;
  global.subscribe = jest.fn(() => jest.fn());
  global.fetchConfig = () => ({ headers: {} });
  global.routes = {
    cart_change_url: '/cart/change',
    cart_url: '/cart',
  };

  global.CartPerformance = {
    measure: jest.fn((label, cb) => (typeof cb === 'function' ? cb() : undefined)),
    measureFromEvent: jest.fn(),
    createStartingMarker: jest.fn(() => ({})),
    measureFromMarker: jest.fn(),
  };

  global.PUB_SUB_EVENTS = {
    cartUpdate: 'cart-update',
  };

  global.publish = jest.fn(() => Promise.resolve());

  // cart Strings used in the happy path for live-region updates
  global.window.cartStrings = {
    error: 'Error',
    quantityError: 'Quantity error [quantity]',
  };

  // Ensure custom elements API exists (provided by jsdom, but guard just in case)
  if (!global.customElements) {
    const registry = {};
    global.customElements = {
      define: (name, ctor) => {
        registry[name] = ctor;
      },
      get: (name) => registry[name],
    };
  }

  // Register <cart-items> and related elements
  // eslint-disable-next-line global-require
  require('../assets/cart.js');
});

afterAll(() => {
  global.fetch = originalFetch;
});

beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

function setupBaseDom() {
  // Live region container used by CartItems.updateLiveRegions
  const liveRegion = document.createElement('p');
  liveRegion.id = 'cart-live-region-text';
  liveRegion.className = 'shopify-section';
  liveRegion.setAttribute('aria-hidden', 'true');
  document.body.appendChild(liveRegion);

  // Line-item status element used during loading
  const lineStatus = document.createElement('p');
  lineStatus.id = 'shopping-cart-line-item-status';
  lineStatus.setAttribute('aria-hidden', 'true');
  document.body.appendChild(lineStatus);
}

function createCartItemsElement({ withFooter = true, withCartIconBubble = true } = {}) {
  setupBaseDom();

  if (withCartIconBubble) {
    const bubbleHost = document.createElement('div');
    bubbleHost.id = 'cart-icon-bubble';
    const bubbleInner = document.createElement('div');
    bubbleInner.className = 'shopify-section';
    bubbleInner.textContent = 'OLD BUBBLE';
    bubbleHost.appendChild(bubbleInner);
    document.body.appendChild(bubbleHost);
  }

  const cartItemsEl = document.createElement('cart-items');

  const itemsHost = document.createElement('div');
  itemsHost.id = 'main-cart-items';
  itemsHost.dataset.id = 'section-main-cart-items';
  const itemsContents = document.createElement('div');
  itemsContents.className = 'js-contents';
  itemsContents.textContent = 'OLD ITEMS';

  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  cartItem.id = 'CartItem-1';
  const qtyInput = document.createElement('input');
  qtyInput.id = 'Quantity-1';
  qtyInput.name = 'quantity';
  qtyInput.value = '1';
  cartItem.appendChild(qtyInput);

  itemsContents.appendChild(cartItem);
  itemsHost.appendChild(itemsContents);
  cartItemsEl.appendChild(itemsHost);

  if (withFooter) {
    const footerHost = document.createElement('div');
    footerHost.id = 'main-cart-footer';
    footerHost.dataset.id = 'section-main-cart-footer';
    const footerContents = document.createElement('div');
    footerContents.className = 'js-contents';
    const totalsWrapper = document.createElement('div');
    totalsWrapper.className = 'totals';
    const totalValue = document.createElement('p');
    totalValue.className = 'totals__total-value';
    totalValue.textContent = 'OLD TOTAL';
    totalsWrapper.appendChild(totalValue);
    footerContents.appendChild(totalsWrapper);
    footerHost.appendChild(footerContents);
    cartItemsEl.appendChild(footerHost);
  }

  document.body.appendChild(cartItemsEl);
  return cartItemsEl;
}

function mockCartChangeFetch({
  itemsText = 'NEW ITEMS',
  totalText = 'NEW TOTAL',
  includeFooterSection = true,
} = {}) {
  const state = {
    item_count: 1,
    errors: null,
    sections: {
      'section-main-cart-items': `<div class="js-contents">${itemsText}</div>`,
      'cart-icon-bubble': '<div class="shopify-section">NEW BUBBLE</div>',
      'cart-live-region-text': '<div class="shopify-section">Cart updated</div>',
    },
    items: [{ quantity: 1 }],
  };

  if (includeFooterSection) {
    state.sections['section-main-cart-footer'] = `
      <div class="js-contents">
        <div class="totals">
          <p class="totals__total-value">${totalText}</p>
        </div>
      </div>`;
  }

  global.fetch = jest.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve(JSON.stringify(state)),
    }),
  );
}

async function waitForCartUpdate() {
  // Allow pending microtasks (the fetch + .text() + .then chain) to run
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('CartItems section rendering and footer total updates', () => {
  test('1. renderContents updates both main-cart-items and main-cart-footer when footer is present', async () => {
    const cartItemsEl = createCartItemsElement({ withFooter: true, withCartIconBubble: true });
    mockCartChangeFetch({ itemsText: 'UPDATED ITEMS', totalText: 'UPDATED TOTAL', includeFooterSection: true });

    const event = { currentTarget: {}, target: {} };

    cartItemsEl.updateQuantity(1, 1, event, 'quantity');
    await waitForCartUpdate();

    expect(document.querySelector('#main-cart-items .js-contents').textContent).toContain('UPDATED ITEMS');
    expect(document.querySelector('#main-cart-footer .totals__total-value').textContent).toBe('UPDATED TOTAL');
  });

  test('2. renderContents updates only main-cart-items when main-cart-footer is not present in the DOM', async () => {
    const cartItemsEl = createCartItemsElement({ withFooter: false, withCartIconBubble: true });

    // Override getSectionsToRender so that it does not reference a non-existent main-cart-footer element
    cartItemsEl.getSectionsToRender = () => [
      {
        id: 'main-cart-items',
        section: 'section-main-cart-items',
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section',
      },
    ];

    mockCartChangeFetch({ itemsText: 'UPDATED ITEMS ONLY', includeFooterSection: false });

    const event = { currentTarget: {}, target: {} };

    cartItemsEl.updateQuantity(1, 1, event, 'quantity');
    await waitForCartUpdate();

    expect(document.querySelector('#main-cart-items .js-contents').textContent).toContain('UPDATED ITEMS ONLY');
    // Still no footer element created or updated
    expect(document.getElementById('main-cart-footer')).toBeNull();
  });

  test('3. The estimated total value in the cart footer is updated from the server response after an update', async () => {
    const cartItemsEl = createCartItemsElement({ withFooter: true, withCartIconBubble: true });

    const NEW_TOTAL = '1 000,00 NOK';
    mockCartChangeFetch({ itemsText: 'IRRELEVANT', totalText: NEW_TOTAL, includeFooterSection: true });

    const event = { currentTarget: {}, target: {} };

    cartItemsEl.updateQuantity(1, 1, event, 'quantity');
    await waitForCartUpdate();

    const totalValueEl = document.querySelector('#main-cart-footer .totals__total-value');
    expect(totalValueEl).not.toBeNull();
    expect(totalValueEl.textContent).toBe(NEW_TOTAL);
  });

  test('4. The null check for section host elements prevents errors when a section host is missing', async () => {
    // Intentionally do NOT create the cart-icon-bubble host element so it is missing in the DOM
    const cartItemsEl = createCartItemsElement({ withFooter: true, withCartIconBubble: false });

    mockCartChangeFetch({ itemsText: 'UPDATED ITEMS', totalText: 'UPDATED TOTAL', includeFooterSection: true });

    const event = { currentTarget: {}, target: {} };

    // This should not throw even though cart-icon-bubble host is missing,
    // because the implementation checks `if (!host) return;` before updating.
    cartItemsEl.updateQuantity(1, 1, event, 'quantity');
    await waitForCartUpdate();

    expect(document.querySelector('#main-cart-items .js-contents').textContent).toContain('UPDATED ITEMS');
    expect(document.querySelector('#main-cart-footer .totals__total-value').textContent).toBe('UPDATED TOTAL');
  });
});
