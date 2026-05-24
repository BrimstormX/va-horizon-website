// Blog topic filter
        document.querySelectorAll('.topic-filter').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var topic = this.dataset.topic;
                // Update active state
                document.querySelectorAll('.topic-filter').forEach(function (b) {
                    b.className = 'topic-filter px-4 py-2 bg-white border border-va-divider rounded-full text-va-navy text-sm font-medium hover:border-va-gold cursor-pointer transition-colors';
                });
                this.className = 'topic-filter px-4 py-2 bg-va-navy text-white rounded-full text-sm font-semibold cursor-pointer';
                // Show/hide cards
                document.querySelectorAll('#blog-grid > [data-topic]').forEach(function (card) {
                    card.style.display = (topic === 'all' || card.dataset.topic === topic) ? '' : 'none';
                });
            });
        });
