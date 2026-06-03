// ---- Navbar scroll ----
        var aiNav = document.getElementById('ai-nav');
        function checkScroll() {
            if (window.scrollY > 40) {
                aiNav.classList.add('scrolled');
            } else {
                aiNav.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();

        // ---- Mobile menu ----
        var menuBtn = document.getElementById('ai-menu-btn');
        var menuClose = document.getElementById('ai-menu-close');
        var mobileMenu = document.getElementById('ai-mobile-menu');

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', function () {
                mobileMenu.classList.add('open');
                menuBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            });
        }
        if (menuClose && mobileMenu) {
            menuClose.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        }
        if (mobileMenu) {
            mobileMenu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    mobileMenu.classList.remove('open');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
        }

        // ---- Reveal on scroll ----
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.10 });
        document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

        // ---- Number counters ----
        function animateCount(el) {
            var target = parseFloat(el.dataset.countTo);
            var suffix = el.dataset.countSuffix || '';
            var decimals = parseInt(el.dataset.countDecimals || '0');
            var duration = 2000;
            var start = performance.now();
            function step(now) {
                var progress = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = target * eased;
                el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString()) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && entry.target.dataset.countTo) {
                    animateCount(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('[data-count-to]').forEach(function (el) { counterObserver.observe(el); });

        // ---- Section nav active state ----
        var sections = document.querySelectorAll('#sms, #voice');
        var tabs = document.querySelectorAll('.section-nav__tab');
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    tabs.forEach(function (t) { t.classList.remove('active'); });
                    var activeTab = document.querySelector('.section-nav__tab[data-tab="' + entry.target.id + '"]');
                    if (activeTab) activeTab.classList.add('active');
                }
            });
        }, { threshold: 0.15 });
        sections.forEach(function (s) { navObserver.observe(s); });
