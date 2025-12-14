(() => {
  const getMediaEl = (container) => container.querySelector(':scope > video, :scope > iframe');

  const pauseMedia = (container) => {
    const media = getMediaEl(container);
    if (!media) return;

    if (media.nodeName === 'VIDEO') {
      media.pause();
      return;
    }

    // IFRAME (YouTube/Vimeo)
    try {
      if (media.classList.contains('js-youtube')) {
        media.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
          '*'
        );
      } else if (media.classList.contains('js-vimeo')) {
        media.contentWindow?.postMessage({ method: 'pause' }, '*');
      }
    } catch (_) {
      // ignore
    }
  };

  const playMedia = async (container) => {
    // Load the embedded element the first time.
    if (!container.hasAttribute('loaded')) {
      container.loadContent(false);
    }

    // DeferredMedia injects the media synchronously, but do a microtask tick to be safe.
    await Promise.resolve();

    const media = getMediaEl(container);
    if (!media) return;

    if (media.nodeName === 'VIDEO') {
      // Autoplay policies typically require muted.
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
      // Keep controls off for the collage autoplay experience.
      media.controls = false;

      try {
        await media.play();
      } catch (_) {
        // ignore (browser may block autoplay in some edge cases)
      }
      return;
    }

    // IFRAME (YouTube/Vimeo)
    try {
      if (media.classList.contains('js-youtube')) {
        media.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
          '*'
        );
      } else if (media.classList.contains('js-vimeo')) {
        media.contentWindow?.postMessage({ method: 'play' }, '*');
      }
    } catch (_) {
      // ignore
    }
  };

  const init = () => {
    const containers = Array.from(document.querySelectorAll('deferred-media[data-autoplay-on-reveal]'));
    if (!containers.length) return;

    // Track visibility ratios so we can pick the most-visible video as the active one.
    const visible = new Map();
    let active = null;

    const updateActive = () => {
      let best = null;
      let bestRatio = 0;

      for (const [el, ratio] of visible.entries()) {
        if (ratio > bestRatio) {
          best = el;
          bestRatio = ratio;
        }
      }

      if (best === active) return;

      if (active) pauseMedia(active);
      active = best;
      if (active) playMedia(active);
    };

    if (!('IntersectionObserver' in window)) {
      // Fallback: load and play the first one.
      playMedia(containers[0]);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Only count it as visible when a decent portion is on screen.
          const ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
          if (ratio >= 0.35) {
            visible.set(entry.target, ratio);
          } else {
            visible.delete(entry.target);
            // If the active one is now mostly offscreen, pause it.
            if (active === entry.target) {
              pauseMedia(active);
              active = null;
            }
          }
        }

        updateActive();
      },
      {
        threshold: [0, 0.1, 0.25, 0.35, 0.5, 0.75, 1],
      }
    );

    containers.forEach((el) => observer.observe(el));
  };

  // Ensure the custom element class (and its loadContent method) exists.
  if (window.customElements?.whenDefined) {
    customElements.whenDefined('deferred-media').then(init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
