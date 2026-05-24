(function() {
            var ids = ['i-salary','i-benefits','i-workspace','i-training','i-turnover','i-replace','i-va'];
            var inputs = {};
            ids.forEach(function(id){ inputs[id] = document.getElementById(id); });
            function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
            function recalc() {
                var salary = +inputs['i-salary'].value || 0;
                var benefits = (+inputs['i-benefits'].value || 0) / 100;
                var workspace = +inputs['i-workspace'].value || 0;
                var training = +inputs['i-training'].value || 0;
                var turnover = (+inputs['i-turnover'].value || 0) / 100;
                var replace = +inputs['i-replace'].value || 0;
                var vaMonthly = +inputs['i-va'].value || 0;

                var inhouseY1 = salary * (1 + benefits) + workspace + training + (turnover * replace);
                var vahY1 = vaMonthly * 12;
                var saveY1 = inhouseY1 - vahY1;
                var saveY3 = saveY1 * 3;
                var equiv = inhouseY1 > 0 && vahY1 > 0 ? (inhouseY1 / vahY1) : 0;

                document.getElementById('o-inh-y1').textContent = fmt(inhouseY1);
                document.getElementById('o-vah-y1').textContent = fmt(vahY1);
                document.getElementById('o-save-y1').textContent = fmt(saveY1);
                document.getElementById('o-save-y3').textContent = fmt(saveY3);
                document.getElementById('o-equiv').textContent = equiv.toFixed(1) + ' VAs';
            }
            ids.forEach(function(id){ inputs[id].addEventListener('input', recalc); });
            recalc();

            document.querySelectorAll('.faq-item').forEach(function(item){
                item.querySelector('.faq-q').addEventListener('click', function(){ item.classList.toggle('open'); });
            });
        })();
