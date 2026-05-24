(function() {
        const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
        const fmtDec = n => (Math.round(n * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

        function recalc() {
            const marketing = parseFloat(document.getElementById('rngMarketing').value) || 0;
            const listSoftware = parseFloat(document.querySelector('input[name="list"]:checked')?.value || 0);
            const dialer = parseFloat(document.querySelector('input[name="dialer"]:checked')?.value || 0);
            const crm = parseFloat(document.querySelector('input[name="crm"]:checked')?.value || 0);
            const vaCount = parseInt(document.getElementById('rngVaCount').value) || 0;
            const vaCost = parseFloat(document.getElementById('rngVaCost').value) || 0;
            const skipTrace = parseFloat(document.getElementById('rngSkipTrace').value) || 0;
            const misc = parseFloat(document.getElementById('rngMisc').value) || 0;

            const software = listSoftware + dialer + crm;
            const vaTotal = vaCount * vaCost;
            const total = marketing + software + vaTotal + skipTrace + misc;
            const runway = total * 3;
            const breakeven = total > 0 ? Math.round((total / 8000) * 10) / 10 : 0;

            document.getElementById('outTotal').textContent = fmt(total);
            document.getElementById('outRunway').textContent = fmt(runway);
            document.getElementById('outMarketing').textContent = fmt(marketing);
            document.getElementById('outSoftware').textContent = fmt(software);
            document.getElementById('outVAs').textContent = fmt(vaTotal);
            document.getElementById('outSkipTrace').textContent = fmt(skipTrace);
            document.getElementById('outMisc').textContent = fmt(misc);
            const breakevenOutput = document.getElementById('outBreakeven');
            const breakevenValue = document.createElement('strong');
            breakevenValue.textContent = fmtDec(breakeven);
            breakevenOutput.replaceChildren('You need ', breakevenValue, ' deal(s)/month to break even');

            document.getElementById('lblMarketing').textContent = fmt(marketing);
            document.getElementById('lblVaCount').textContent = vaCount;
            document.getElementById('lblVaCost').textContent = fmt(vaCost);
            document.getElementById('lblSkipTrace').textContent = fmt(skipTrace);
            document.getElementById('lblMisc').textContent = fmt(misc);
        }

        // Slider listeners
        ['rngMarketing','rngVaCount','rngVaCost','rngSkipTrace','rngMisc'].forEach(function(id) {
            document.getElementById(id).addEventListener('input', recalc);
        });

        // Radio listeners
        document.querySelectorAll('input[type=radio]').forEach(function(r) {
            r.addEventListener('change', recalc);
        });

        // Reset
        document.getElementById('resetBtn').addEventListener('click', function() {
            document.getElementById('rngMarketing').value = 500;
            document.getElementById('rngVaCount').value = 1;
            document.getElementById('rngVaCost').value = 1200;
            document.getElementById('rngSkipTrace').value = 100;
            document.getElementById('rngMisc').value = 150;
            document.getElementById('listPropstream').checked = true;
            document.getElementById('dialerMojo').checked = true;
            document.getElementById('crmHighlevel').checked = true;
            recalc();
        });

        recalc();

        // FAQ accordion
        document.querySelectorAll('.faq-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const item = this.closest('.faq-item');
                const body = item.querySelector('.faq-body');
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item').forEach(function(el) {
                    el.classList.remove('open');
                    el.querySelector('.faq-body').classList.remove('open');
                    el.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                });
                if (!isOpen) {
                    item.classList.add('open');
                    body.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });
    })();
