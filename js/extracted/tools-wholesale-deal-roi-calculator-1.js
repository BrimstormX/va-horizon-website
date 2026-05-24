(function() {
            const fmtInt = n => Math.round(n).toLocaleString('en-US');
            const fmtMoney = n => '$' + Math.round(n).toLocaleString('en-US');
            const fmtDec = (n, d=2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

            const ids = ['List','Contact','Qualified','Contract','Fee','Cost'];
            const standards = { List: 5000, Contact: 8, Qualified: 5, Contract: 5, Fee: 10000, Cost: 1160 };
            const state = { List: 5000, Contact: 8, Qualified: 5, Contract: 5, Fee: 10000, Cost: 1160 };

            function formatLabel(key, val) {
                if (key === 'Contact' || key === 'Qualified' || key === 'Contract') {
                    return fmtDec(val, 1).replace(/\.0$/, '') + '%';
                } else if (key === 'Fee' || key === 'Cost') {
                    return fmtMoney(val);
                }
                return fmtInt(val);
            }

            function positionMarker(key) {
                const rng = document.getElementById('rng' + key);
                const mk = document.getElementById('mk' + key);
                const min = parseFloat(rng.min);
                const max = parseFloat(rng.max);
                const std = standards[key];
                const pct = Math.max(0, Math.min(100, ((std - min) / (max - min)) * 100));
                mk.style.left = pct + '%';
            }

            function sync(key, val) {
                state[key] = isFinite(val) && val >= 0 ? val : 0;
                document.getElementById('rng' + key).value = state[key];
                document.getElementById('lbl' + key).textContent = formatLabel(key, state[key]);
                recalc();
            }

            function recalc() {
                const conn = state.List * (state.Contact / 100);
                const qual = conn * (state.Qualified / 100);
                const contracts = qual * (state.Contract / 100);
                const revenue = contracts * state.Fee;
                const netRoi = revenue - state.Cost;
                const roiX = state.Cost > 0 ? revenue / state.Cost : 0;
                const cpql = qual > 0 ? state.Cost / qual : 0;

                document.getElementById('outConnections').textContent = fmtInt(conn);
                document.getElementById('outQualified').textContent = fmtInt(qual);
                document.getElementById('outContracts').textContent = fmtDec(contracts, 2);
                document.getElementById('outRevenue').textContent = fmtMoney(revenue);
                document.getElementById('outNetRoi').textContent = fmtMoney(netRoi);
                document.getElementById('outRoiX').textContent = fmtDec(roiX, 1) + 'x';
                document.getElementById('outCpql').textContent = qual > 0 ? fmtMoney(cpql) : '—';
            }

            function setStandard(fieldId, value) {
                sync(fieldId, value);
            }

            ids.forEach(key => {
                const rng = document.getElementById('rng' + key);
                rng.addEventListener('input', () => sync(key, parseFloat(rng.value)));
                positionMarker(key);
            });

            document.querySelectorAll('.standard-label').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.getAttribute('data-standard');
                    const val = parseFloat(btn.getAttribute('data-value'));
                    setStandard(key, val);
                });
            });

            document.getElementById('resetStandard').addEventListener('click', () => {
                ids.forEach(key => sync(key, standards[key]));
            });

            window.setStandard = setStandard;

            recalc();

            // FAQ
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
