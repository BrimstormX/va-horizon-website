function copyText(id) {
            var text = document.getElementById(id).textContent.replace(/[\u201C\u201D]/g, '"');
            navigator.clipboard.writeText(text).then(function () {
                var el = document.getElementById('copied');
                if (el) { el.textContent = "Copied!"; setTimeout(function () { el.textContent = ""; }, 1500); }
            });
        }
        function copyBoth() {
            var t1 = document.getElementById('q1').textContent.replace(/[\u201C\u201D]/g, '"');
            var t2 = document.getElementById('q2').textContent.replace(/[\u201C\u201D]/g, '"');
            var both = t1 + "\n" + t2;
            navigator.clipboard.writeText(both).then(function () {
                var el = document.getElementById('copied');
                if (el) { el.textContent = "Copied both lines!"; setTimeout(function () { el.textContent = ""; }, 1500); }
            });
        }

        document.addEventListener('click', function (event) {
            var target = event.target.closest('[data-copy-target], [data-copy-both]');
            if (!target) return;
            if (target.hasAttribute('data-copy-both')) {
                copyBoth();
            } else {
                copyText(target.getAttribute('data-copy-target'));
            }
        });
