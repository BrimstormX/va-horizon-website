(function() {
            const fmtInt = n => Math.round(n).toLocaleString('en-US');
            const fmtMoney = n => '$' + Math.round(n).toLocaleString('en-US');
            const fmtDec = (n, d=2) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

            const ids = ['List','Contact','Qualified','LeadsPerContract','Fee'];
            const standards = { VaCount: 1, List: 15000, Contact: 17.5, Qualified: 0.86, LeadsPerContract: 40, Fee: 10000 };
            const state = { ...standards };
            const dialAttemptsPerRecord = 20000 / 15000;
            const workdaysPerMonth = 20;

            function formatLabel(key, val) {
                if (key === 'Contact' || key === 'Qualified') {
                    return fmtDec(val, key === 'Qualified' ? 2 : 1).replace(/0+$/, '').replace(/\.$/, '') + '%';
                } else if (key === 'Fee') {
                    return fmtMoney(val);
                } else if (key === 'LeadsPerContract') {
                    return fmtInt(val) + ' leads';
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
                const thumbSize = 22;
                const thumbOffset = (0.5 - (pct / 100)) * thumbSize;
                mk.style.left = `calc(${pct}% + ${thumbOffset}px)`;
            }

            function sync(key, val) {
                state[key] = isFinite(val) && val >= 0 ? val : 0;
                document.getElementById('rng' + key).value = state[key];
                document.getElementById('lbl' + key).textContent = formatLabel(key, state[key]);
                recalc();
            }

            function recalc() {
                const totalList = state.List * state.VaCount;
                const dials = totalList * dialAttemptsPerRecord;
                const conn = dials * (state.Contact / 100);
                const qual = conn * (state.Qualified / 100);
                const contracts = state.LeadsPerContract > 0 ? qual / state.LeadsPerContract : 0;
                const revenue = contracts * state.Fee;
                const perVaCost = state.VaCount >= 3 ? 1000 : 1160;
                const cost = state.VaCount * perVaCost;
                const netRoi = revenue - cost;
                const roiX = cost > 0 ? revenue / cost : 0;
                const cpql = qual > 0 ? cost / qual : 0;

                document.getElementById('lblVaCount').textContent = state.VaCount === 1 ? '1 VA' : state.VaCount + ' VAs';
                document.getElementById('projectionNote').textContent = `Team totals for ${state.VaCount} ${state.VaCount === 1 ? 'VA' : 'VAs'} at ${fmtMoney(perVaCost)} each. Standard output is about 175 connections per workday and 30 qualified leads per month per VA.`;
                document.getElementById('outList').textContent = fmtInt(totalList);
                document.getElementById('outDials').textContent = fmtInt(dials);
                document.getElementById('outDailyConnections').textContent = fmtInt(conn / workdaysPerMonth);
                document.getElementById('outConnections').textContent = fmtInt(conn);
                document.getElementById('outQualified').textContent = fmtInt(qual);
                document.getElementById('outContracts').textContent = fmtDec(contracts, 2);
                document.getElementById('outCost').textContent = fmtMoney(cost);
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

            document.getElementById('selVaCount').addEventListener('change', event => {
                state.VaCount = parseInt(event.target.value, 10) || 1;
                recalc();
            });

            document.querySelectorAll('.standard-label').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.getAttribute('data-standard');
                    const val = parseFloat(btn.getAttribute('data-value'));
                    setStandard(key, val);
                });
            });

            document.getElementById('resetStandard').addEventListener('click', () => {
                state.VaCount = standards.VaCount;
                document.getElementById('selVaCount').value = standards.VaCount;
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
