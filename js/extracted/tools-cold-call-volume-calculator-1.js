(function() {
        const fmtInt = n => Math.round(n).toLocaleString('en-US');
        const fmtMoney = n => '$' + Math.round(n).toLocaleString('en-US') + '/month';

        function recalc() {
            const targetDeals = parseInt(document.getElementById('rngDeals').value) || 1;
            const closeRate = parseFloat(document.getElementById('rngClose').value) / 100;
            const apptOfferRate = parseFloat(document.getElementById('rngApptOffer').value) / 100;
            const contactApptRate = parseFloat(document.getElementById('rngContactAppt').value) / 100;
            const contactRate = parseFloat(document.getElementById('rngContactRate').value) / 100;
            const workingDays = parseInt(document.getElementById('rngDays').value) || 20;

            // Funnel math (top-down from target)
            const contractsNeeded = targetDeals;
            const offersNeeded = contractsNeeded / closeRate;
            const apptsNeeded = offersNeeded / apptOfferRate;
            const contactsNeeded = apptsNeeded / contactApptRate;
            const monthlyDials = contactsNeeded / contactRate;
            const dailyDials = Math.ceil(monthlyDials / workingDays);
            const vasNeeded = Math.ceil(dailyDials / 250);
            const listSize = Math.ceil(monthlyDials * 1.2);
            const vaCost = vasNeeded * 1200;

            // Update outputs
            document.getElementById('outDailyDials').textContent = fmtInt(dailyDials);
            document.getElementById('outMonthlyDials').textContent = fmtInt(Math.round(monthlyDials));
            document.getElementById('outVAs').textContent = fmtInt(vasNeeded);
            document.getElementById('outListSize').textContent = fmtInt(listSize);
            document.getElementById('outVaCost').textContent = fmtMoney(vaCost);

            // Funnel breakdown
            document.getElementById('funnelDials').textContent = fmtInt(Math.round(monthlyDials));
            document.getElementById('funnelContacts').textContent = fmtInt(Math.round(contactsNeeded));
            document.getElementById('funnelAppts').textContent = fmtInt(Math.round(apptsNeeded));
            document.getElementById('funnelOffers').textContent = fmtInt(Math.round(offersNeeded));
            document.getElementById('funnelContracts').textContent = fmtInt(Math.round(contractsNeeded));

            // Update labels
            document.getElementById('lblDeals').textContent = targetDeals;
            document.getElementById('lblClose').textContent = (parseFloat(document.getElementById('rngClose').value)) + '%';
            document.getElementById('lblApptOffer').textContent = (parseFloat(document.getElementById('rngApptOffer').value)) + '%';
            document.getElementById('lblContactAppt').textContent = (parseFloat(document.getElementById('rngContactAppt').value)) + '%';
            document.getElementById('lblContactRate').textContent = (parseFloat(document.getElementById('rngContactRate').value)) + '%';
            document.getElementById('lblDays').textContent = workingDays;
        }

        // Slider listeners
        ['rngDeals','rngClose','rngApptOffer','rngContactAppt','rngContactRate','rngDays'].forEach(function(id) {
            document.getElementById(id).addEventListener('input', recalc);
        });

        // Reset
        document.getElementById('resetBtn').addEventListener('click', function() {
            document.getElementById('rngDeals').value = 2;
            document.getElementById('rngClose').value = 8;
            document.getElementById('rngApptOffer').value = 35;
            document.getElementById('rngContactAppt').value = 6;
            document.getElementById('rngContactRate').value = 8;
            document.getElementById('rngDays').value = 20;
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
