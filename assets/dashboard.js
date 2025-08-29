/**
 * Lightweight single-card VA dashboard.
 * Edit VAs in assets/dashboard-data.js. Metrics update every 30s.
 */
import { VAs, startLiveSimulation } from './dashboard-data.js';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function countUp(el, value) {
  const start = Number(el.textContent) || 0;
  const diff = value - start;
  if (!diff) return;
  const begin = performance.now();
  function step(now) {
    const t = Math.min((now - begin) / 350, 1);
    el.textContent = Math.round(start + diff * easeOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function buildCard() {
  const card = document.createElement('div');
  card.className = 'relative w-64 rounded-xl border border-[var(--va-divider,#E5E7EB)] bg-white shadow-[0_10px_30px_rgba(2,24,43,.08)] text-[var(--va-navy,#05243A)]';
  card.innerHTML = `
    <div class="absolute -top-3 -right-3 bg-[var(--va-gold,#CFAE70)] text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">Live Now</div>
    <div class="px-4 py-3 text-sm font-medium border-b border-[var(--va-divider,#E5E7EB)]">VA Dashboard</div>
    <ul class="px-4 py-3 space-y-2 text-sm">
      <li class="flex justify-between"><span>Cold Calls Today</span><span id="metric-calls" class="font-semibold" aria-live="polite">0</span></li>
      <li class="flex justify-between"><span>Appointments Set</span><span id="metric-appts" class="font-semibold" aria-live="polite">0</span></li>
      <li class="flex justify-between"><span>Lists Processed</span><span id="metric-lists" class="font-semibold" aria-live="polite">0</span></li>
    </ul>
    <div class="flex items-center justify-between px-4 py-2 border-t border-[var(--va-divider,#E5E7EB)] text-xs text-gray-500">
      <button id="prev-va" aria-label="Previous VA" class="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--va-gold,#CFAE70)] rounded">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <span class="va-name font-medium text-[var(--va-navy,#05243A)]"></span>
      <button id="next-va" aria-label="Next VA" class="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--va-gold,#CFAE70)] rounded">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  `;
  return card;
}

function init() {
  const root = document.getElementById('va-dashboard');
  if (!root) return;
  const card = buildCard();
  root.appendChild(card);

  const nameEl = card.querySelector('.va-name');
  const callsEl = card.querySelector('#metric-calls');
  const apptsEl = card.querySelector('#metric-appts');
  const listsEl = card.querySelector('#metric-lists');

  let index = 0;
  function showVA(i) {
    const va = VAs[i];
    nameEl.textContent = va.name;
    countUp(callsEl, va.metrics.calls);
    countUp(apptsEl, va.metrics.appts);
    countUp(listsEl, va.metrics.lists);
  }

  card.querySelector('#prev-va').addEventListener('click', () => {
    index = (index - 1 + VAs.length) % VAs.length;
    showVA(index);
  });
  card.querySelector('#next-va').addEventListener('click', () => {
    index = (index + 1) % VAs.length;
    showVA(index);
  });

  // auto-rotate every 5s
  setInterval(() => {
    index = (index + 1) % VAs.length;
    showVA(index);
  }, 5000);

  startLiveSimulation(() => showVA(index));
  showVA(index);
}

document.addEventListener('DOMContentLoaded', init);
