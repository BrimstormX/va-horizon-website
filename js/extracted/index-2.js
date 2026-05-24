/* 1) Respect reduced motion (no change unless user opts out of motion) */
    (function () {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('prm');
      }
    })();

    /* 2) Make external links safer without changing appearance */
    (function () {
      for (const a of document.querySelectorAll('a[target="_blank"]')) {
        if (!a.rel || !/noopener/i.test(a.rel)) a.rel = (a.rel ? a.rel + ' ' : '') + 'noopener noreferrer';
      }
    })();

    /* 3) Lazy-load non-critical images (keeps hero images eager) */
    (function () {
      const imgs = Array.from(document.images);
      imgs.forEach((img, i) => {
        if (i > 1 && !img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
          const setSize = () => {
            if (!img.hasAttribute('width')) img.setAttribute('width', img.naturalWidth || img.width);
            if (!img.hasAttribute('height')) img.setAttribute('height', img.naturalHeight || img.height);
          };
          if (img.complete) {
            setSize();
          } else {
            img.addEventListener('load', setSize, { once: true });
          }
        }
      });
    })();

    document.querySelectorAll('.skip-link[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView();
      });
    });
