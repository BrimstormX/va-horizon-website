// FAQ accordion
        document.querySelectorAll('.faq-trigger').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = this.closest('.faq-item');
                var body = item.querySelector('.faq-body');
                var isOpen = item.classList.contains('open');

                // Close all
                document.querySelectorAll('.faq-item').forEach(function (el) {
                    el.classList.remove('open');
                    el.querySelector('.faq-body').classList.remove('open');
                    el.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                });

                // Open clicked if it was closed
                if (!isOpen) {
                    item.classList.add('open');
                    body.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });
