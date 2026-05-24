(() => {
      const links = [...document.querySelectorAll('.nav a[href^="#"], .nav button[href^="#"]')];
      const map = new Map();
      links.forEach(l => {
        const id = l.getAttribute('href')?.slice(1);
        const target = id && document.getElementById(id);
        if (target) map.set(target, l);
      });

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          const link = map.get(e.target);
          if (!link) return;
          if (e.isIntersecting) {
            links.forEach(x => x.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        });
      }, { rootMargin: "-20% 0px -70% 0px", threshold: 0.01 });

      map.forEach((_, section) => io.observe(section));
    })();
