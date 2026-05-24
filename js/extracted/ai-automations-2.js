// ---- Particle canvas ----
        (function () {
            var canvas = document.getElementById('particle-canvas');
            if (!canvas) return;
            var ctx = canvas.getContext('2d');
            var particles = [];
            var count = 60;
            var maxDist = 140;

            function resize() {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    r: Math.random() * 1.5 + 0.5
                });
            }

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < particles.length; i++) {
                    var p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(212, 160, 47, 0.25)';
                    ctx.fill();

                    for (var j = i + 1; j < particles.length; j++) {
                        var p2 = particles[j];
                        var dx = p.x - p2.x;
                        var dy = p.y - p2.y;
                        var dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < maxDist) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = 'rgba(212, 160, 47, ' + (0.06 * (1 - dist / maxDist)) + ')';
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
                requestAnimationFrame(draw);
            }
            draw();
        })();

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
