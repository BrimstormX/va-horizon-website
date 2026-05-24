function openLightbox(src) {
      const lightbox = document.getElementById('lightbox');
      const img = document.getElementById('lightbox-img');

      img.src = src;
      lightbox.classList.remove('hidden');
      // Small delay to allow display:flex to apply before opacity transition
      requestAnimationFrame(() => {
        lightbox.classList.remove('opacity-0');
        img.classList.remove('scale-95');
        img.classList.add('scale-100');
      });
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
      const lightbox = document.getElementById('lightbox');
      const img = document.getElementById('lightbox-img');

      lightbox.classList.add('opacity-0');
      img.classList.remove('scale-100');
      img.classList.add('scale-95');

      setTimeout(() => {
        lightbox.classList.add('hidden');
        img.src = '';
        document.body.style.overflow = ''; // Restore scrolling
      }, 300);
    }

    document.addEventListener('click', function (event) {
      const trigger = event.target.closest('[data-lightbox-src]');
      if (trigger) {
        openLightbox(trigger.getAttribute('data-lightbox-src'));
        return;
      }

      if (event.target.closest('[data-lightbox-image]')) {
        event.stopPropagation();
        return;
      }

      if (event.target.closest('[data-lightbox-close]')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (event) {
      const trigger = event.target.closest('[data-lightbox-src]');
      if (!trigger || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      openLightbox(trigger.getAttribute('data-lightbox-src'));
    });

    // Close on Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });

    // Hide navbar smoothly on scroll past hero
    var mainNav = document.getElementById('main-nav');
    function checkNavScroll() {
      if (!mainNav) return;
      var hero = document.querySelector('.hero-home');
      // Threshold is the total height of the hero section
      var threshold = hero ? (hero.offsetTop + hero.offsetHeight - 50) : 600;

      if (window.scrollY > threshold) {
        mainNav.classList.add('nav-hidden');
      } else {
        mainNav.classList.remove('nav-hidden');
      }
    }
    window.addEventListener('scroll', checkNavScroll, { passive: true });
    checkNavScroll();
