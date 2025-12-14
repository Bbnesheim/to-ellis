/** @jest-environment jsdom */

const fs = require('fs');
const path = require('path');

function readAsset(relPath) {
  return fs.readFileSync(path.join(__dirname, '..', 'assets', relPath), 'utf8');
}

function extractAllAtMediaBlocks(css, mediaQuery) {
  const blocks = [];
  let searchFrom = 0;

  while (searchFrom < css.length) {
    const idx = css.indexOf(mediaQuery, searchFrom);
    if (idx === -1) break;

    const openBraceIdx = css.indexOf('{', idx);
    if (openBraceIdx === -1) break;

    let depth = 0;
    for (let i = openBraceIdx; i < css.length; i += 1) {
      const ch = css[i];
      if (ch === '{') depth += 1;
      if (ch === '}') depth -= 1;
      if (depth === 0) {
        blocks.push(css.slice(openBraceIdx + 1, i));
        searchFrom = i + 1;
        break;
      }
    }

    // If we reached end-of-file without closing braces, stop.
    if (depth !== 0) break;
  }

  return blocks;
}

describe('blog flip layout CSS invariants', () => {
  let componentCardCss;
  let sectionMainBlogCss;

  beforeAll(() => {
    componentCardCss = readAsset('component-card.css');
    sectionMainBlogCss = readAsset('section-main-blog.css');
  });

  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = `${componentCardCss}\n${sectionMainBlogCss}`;
    document.head.appendChild(style);
  });

  test("1. .blog-flip .card-wrapper height adjusts dynamically to its content (not forced to 100%)", () => {
    const root = document.createElement('div');
    root.className = 'blog-flip';

    const cardWrapper = document.createElement('a');
    cardWrapper.className = 'card-wrapper';
    root.appendChild(cardWrapper);

    document.body.appendChild(root);

    // component-card.css sets height:100% on .card-wrapper; flip journal should override.
    const computed = window.getComputedStyle(cardWrapper);
    expect(computed.height).toBe('auto');
  });

  test('2. .blog-flip .card__content allows text to flow naturally (no internal scrollbars)', () => {
    const root = document.createElement('div');
    root.className = 'blog-flip';

    const cardWrapper = document.createElement('a');
    cardWrapper.className = 'card-wrapper';

    const content = document.createElement('div');
    content.className = 'card__content';
    content.textContent = 'Long text '.repeat(200);

    cardWrapper.appendChild(content);
    root.appendChild(cardWrapper);
    document.body.appendChild(root);

    const computed = window.getComputedStyle(content);

    // jsdom may report the default "visible" overflow as an empty string.
    // The invariant we care about is: no internal scroll container.
    expect(['', 'visible']).toContain(computed.overflowY);
    expect(['', 'visible']).toContain(computed.overflowX);
    expect(computed.overflowY).not.toBe('auto');
    expect(computed.overflowY).not.toBe('scroll');
  });

  test('3. On screens with max-width 599px, .blog-flip height adjusts dynamically to its content', () => {
    const mediaBlocks = extractAllAtMediaBlocks(sectionMainBlogCss, '@media screen and (max-width: 599px)');
    expect(mediaBlocks.length).toBeGreaterThan(0);

    const combined = mediaBlocks.join('\n');
    expect(combined).toMatch(/\.blog-flip\s*\{[^}]*--blog-flip-book-height:\s*auto\s*;[^}]*\}/m);
  });

  test('4. On screens with max-width 599px, .blog-flip__spread height adjusts dynamically to its content', () => {
    const mediaBlocks = extractAllAtMediaBlocks(sectionMainBlogCss, '@media screen and (max-width: 599px)');
    expect(mediaBlocks.length).toBeGreaterThan(0);

    const combined = mediaBlocks.join('\n');
    expect(combined).toMatch(/\.blog-flip__spread\s*\{[^}]*height:\s*auto\s*;[^}]*\}/m);
  });

  test('5. On screens with max-width 599px, .blog-flip .article-card__excerpt is fully visible (not clipped)', () => {
    const mediaBlocks = extractAllAtMediaBlocks(sectionMainBlogCss, '@media screen and (max-width: 599px)');
    expect(mediaBlocks.length).toBeGreaterThan(0);

    const combined = mediaBlocks.join('\n');

    // Ensure the excerpt isn't line-clamped and isn't hidden.
    expect(combined).toMatch(/\.blog-flip\s+\.article-card__excerpt\s*\{[^}]*-webkit-line-clamp:\s*unset\s*;[^}]*\}/m);
    expect(combined).toMatch(/\.blog-flip\s+\.article-card__excerpt\s*\{[^}]*overflow:\s*visible\s*;[^}]*\}/m);
  });
});