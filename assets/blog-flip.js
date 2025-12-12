class BlogFlip {
  constructor(root) {
    this.root = root;
    this.root.classList.add('is-initialized');
    this.spreads = Array.from(root.querySelectorAll('[data-blog-flip-spread]'));

    if (!this.spreads.length) return;

    this.mobileMQ = window.matchMedia('(max-width: 749px)');
    this.isMobile = this.mobileMQ.matches;

    // We render posts oldest -> newest (Liquid reverse), but want to START on newest.
    this.index = this.spreads.length - 1;
    this.showingLeft = false;

    this.mobileMQ.addEventListener('change', (e) => {
      this.isMobile = e.matches;
      this.showingLeft = false;
      this.render();
    });

    this.root.addEventListener('click', (e) => {
      const prev = e.target.closest('[data-blog-flip-prev]');
      const next = e.target.closest('[data-blog-flip-next]');
      if (!prev && !next) return;

      e.preventDefault();

      // Semantics:
      // - "Previous" goes BACKWARDS (OLDER posts)
      // - "Next" goes FORWARDS (NEWER posts)
      if (prev) this.goOlder();
      if (next) this.goNewer();
    });

    this.render();
  }

  activeSpread() {
    return this.spreads[this.index] || null;
  }

  hasLeftPage(spread) {
    return spread?.dataset?.hasLeft === 'true';
  }

  clearSpreadClasses(spread) {
    if (!spread) return;
    spread.classList.remove('is-showing-left');
    spread.classList.remove('is-turning-next');
    spread.classList.remove('is-turning-prev');
  }

  setActive(index) {
    this.spreads.forEach((s, i) => {
      if (i === index) s.classList.add('is-active');
      else s.classList.remove('is-active');
      this.clearSpreadClasses(s);
    });
  }

  updateButtons() {
    // Disable/enable all buttons within the active spread.
    const spread = this.activeSpread();
    if (!spread) return;

    const prevButtons = spread.querySelectorAll('[data-blog-flip-prev]');
    const nextButtons = spread.querySelectorAll('[data-blog-flip-next]');

    const atNewest = this.index === this.spreads.length - 1;
    const atOldest = this.index === 0;

    // Mobile: "Previous" first flips to the LEFT page (older page within the spread).
    const canFlipWithin = this.isMobile && this.hasLeftPage(spread) && !this.showingLeft;
    // Mobile: "Next" may unflip back to the RIGHT page (newer page within the spread).
    const canUnflipWithin = this.isMobile && this.showingLeft;

    // Previous (older)
    const disablePrev = atOldest && !canFlipWithin;
    prevButtons.forEach((b) => (b.disabled = disablePrev));

    // Next (newer)
    const disableNext = atNewest && !canUnflipWithin;
    nextButtons.forEach((b) => (b.disabled = disableNext));
  }

  render() {
    this.setActive(this.index);

    const spread = this.activeSpread();
    if (this.isMobile && spread && this.showingLeft) {
      spread.classList.add('is-showing-left');
    }

    this.updateButtons();
  }

  goOlder() {
    const spread = this.activeSpread();
    if (!spread) return;

    // Mobile: "Previous" first flips within the spread (right -> left) to reveal the older page.
    if (this.isMobile && this.hasLeftPage(spread) && !this.showingLeft) {
      this.showingLeft = true;
      this.render();
      return;
    }

    if (this.index === 0) return;

    // Move to older spread.
    const from = spread;
    from.classList.add('is-turning-prev');

    window.setTimeout(() => {
      this.index -= 1;
      this.showingLeft = false; // default to right page (newer page within that spread)
      this.render();
    }, 420);
  }

  goNewer() {
    const spread = this.activeSpread();
    if (!spread) return;

    // Mobile: "Next" unflips back to the right page (newer) before moving spreads.
    if (this.isMobile && this.showingLeft) {
      this.showingLeft = false;
      this.render();
      return;
    }

    if (this.index === this.spreads.length - 1) return;

    // Move to newer spread.
    const from = spread;
    from.classList.add('is-turning-next');

    window.setTimeout(() => {
      this.index += 1;
      this.showingLeft = false;
      this.render();
    }, 420);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-blog-flip]').forEach((el) => new BlogFlip(el));
});
