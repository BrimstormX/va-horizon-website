/**
 * Live VA Dashboard
 * Add or remove VAs in assets/dashboard-data.js. Adjust simulator cadence
 * by passing a custom interval to startLiveSimulation().
 */
import { startLiveSimulation } from './dashboard-data.js';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function countUp(el, to) {
  const from = Number(el.textContent) || 0;
  const diff = to - from;
  if (diff === 0) return;
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / 350, 1);
    el.textContent = Math.round(from + diff * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function flash(el) {
  el.classList.add('change-flash');
  setTimeout(() => el.classList.remove('change-flash'), 600);
}

function createTotals(totals, delta) {
  const metrics = [
    { key: 'calls', label: 'Cold Calls' },
    { key: 'appts', label: 'Appointments Set' },
    { key: 'lists', label: 'Lists Processed' }
  ];
  return metrics
    .map((m) => {
      const d = delta[m.key];
      const up = d >= 0;
      return `<div class="flex items-center gap-1 rounded-full bg-[var(--va-smoke,#F5F7FA)] px-3 py-1 text-xs" aria-live="polite">
        <span class="font-medium text-[color:#0B1220]">${m.label}:</span>
        <span class="font-semibold kpi-total" data-key="${m.key}">${totals[m.key]}</span>
        <span class="flex items-center ${up ? 'text-green-600' : 'text-red-600'}">
          ${up ? arrowUpSvg() : arrowDownSvg()}${Math.abs(d)}
        </span>
      </div>`;
    })
    .join('');
}

function arrowUpSvg() {
  return '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
}
function arrowDownSvg() {
  return '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
}

function render(root, data) {
  root.innerHTML = `<div class="bg-white rounded-xl shadow-[0_10px_30px_rgba(2,24,43,.08)] border border-[var(--va-divider,#E5E7EB)]">
    <div class="flex items-center justify-between p-4 border-b border-[var(--va-divider,#E5E7EB)]">
      <div class="flex items-center gap-2">
        <div class="flex gap-1"><div class="w-2 h-2 rounded-full bg-red-400"></div><div class="w-2 h-2 rounded-full bg-yellow-400"></div><div class="w-2 h-2 rounded-full bg-green-400"></div></div>
        <span class="text-xs font-medium text-[color:#0B1220] tracking-wide">VA Dashboard</span>
      </div>
      <span class="rounded-lg px-3 py-1 text-xs font-semibold bg-[var(--va-gold,#CFAE70)] text-white shadow">Live Now</span>
    </div>
    <div class="p-4 space-y-4" id="dashboard-inner" aria-busy="true"></div>
  </div>`;

  const inner = root.querySelector('#dashboard-inner');
  inner.innerHTML = `<div class="flex flex-wrap items-center gap-2" id="controls">
      <div class="flex gap-1" role="group" aria-label="Sort">
        <button data-sort="name" class="sort-btn px-2 py-1 text-xs rounded border border-[var(--va-divider,#E5E7EB)]">Name</button>
        <button data-sort="calls" class="sort-btn px-2 py-1 text-xs rounded border border-[var(--va-divider,#E5E7EB)] bg-[var(--va-smoke,#F5F7FA)]">Calls</button>
        <button data-sort="appts" class="sort-btn px-2 py-1 text-xs rounded border border-[var(--va-divider,#E5E7EB)]">Appointments</button>
      </div>
      <div class="flex gap-1" role="group" aria-label="Status filter">
        <button data-status="all" class="status-btn px-2 py-1 text-xs rounded border border-[var(--va-divider,#E5E7EB)] bg-[var(--va-smoke,#F5F7FA)]">All</button>
        <button data-status="active" class="status-btn px-2 py-1 text-xs rounded border border-[var(--va-divider,#E5E7EB)]">Active</button>
        <button data-status="idle" class="status-btn px-2 py-1 text-xs rounded border border-[var(--va-divider,#E5E7EB)]">Idle</button>
        <button data-status="offline" class="status-btn px-2 py-1 text-xs rounded border border-[var(--va-divider,#E5E7EB)]">Offline</button>
      </div>
      <input type="search" placeholder="Search VA by name" class="search-input flex-1 px-2 py-1 border rounded text-sm" />
    </div>
    <div class="flex gap-2" id="totals-bar"></div>
    <div class="grid gap-4 sm:grid-cols-2" id="va-list" aria-live="polite"></div>`;

  inner.removeAttribute('aria-busy');

  root.dataset.sort = 'calls';
  root.dataset.status = 'all';
  renderTotals(root, data);
  renderVAList(root, data.vas);
  setupControls(root, data);
}

function renderTotals(root, data) {
  const bar = root.querySelector('#totals-bar');
  bar.innerHTML = createTotals(data.totals, data.delta);
}

function renderVAList(root, vas) {
  const list = root.querySelector('#va-list');
  list.innerHTML = '';
  vas.forEach((va) => {
    list.appendChild(renderCard(va));
  });
}

function renderCard(va) {
  const card = document.createElement('div');
  card.className = 'va-card group relative rounded-xl border border-[var(--va-divider,#E5E7EB)] bg-white shadow-sm hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-[var(--va-gold,#CFAE70)]';
  card.innerHTML = `<button class="absolute inset-0" aria-label="Open details for ${va.name}" aria-expanded="false" aria-controls="details-${va.id}" tabindex="-1"></button>
    <div class="p-4">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-full bg-[var(--va-smoke,#F5F7FA)] flex items-center justify-center font-semibold text-[var(--va-navy,#05243A)]">${initials(va.name)}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-semibold text-[var(--va-navy,#05243A)] truncate">${va.name}</h3>
            <span class="inline-flex items-center gap-1 text-xs">
              <span class="h-2.5 w-2.5 rounded-full ${statusColor(va.status)}"></span>
              <span class="text-gray-500 capitalize">${va.status}</span>
            </span>
          </div>
          <div class="text-xs text-gray-500" title="${va.timezone}">Local <span data-local-time="${va.timezone}"></span></div>
        </div>
        <div class="text-xs text-gray-500">Goal: ${va.goals.calls}</div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <div class="rounded-lg bg-gradient-to-b from-white to-[#F7F9FC] p-3 border border-[var(--va-divider,#E5E7EB)]">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">Cold Calls</span>
          </div>
          <div class="mt-1 text-2xl font-bold text-[var(--va-navy,#05243A)] kpi-calls" aria-live="polite">${va.metrics.calls}</div>
          <div class="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden"><div class="h-full bg-[var(--va-gold,#CFAE70)] w-[${(va.metrics.calls/va.goals.calls)*100}%] transition-[width] duration-500 progress-calls"></div></div>
        </div>
        <div class="rounded-lg bg-gradient-to-b from-white to-[#F7F9FC] p-3 border border-[var(--va-divider,#E5E7EB)]">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">Appointments</span>
          </div>
          <div class="mt-1 text-2xl font-bold text-[var(--va-navy,#05243A)] kpi-appts" aria-live="polite">${va.metrics.appts}</div>
          <div class="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden"><div class="h-full bg-[var(--va-gold,#CFAE70)] w-[${(va.metrics.appts/va.goals.appts)*100}%] transition-[width] duration-500 progress-appts"></div></div>
        </div>
        <div class="rounded-lg bg-gradient-to-b from-white to-[#F7F9FC] p-3 border border-[var(--va-divider,#E5E7EB)]">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">Talk Time</span>
            <span class="text-[10px] text-gray-400">min</span>
          </div>
          <div class="mt-1 text-2xl font-bold text-[var(--va-navy,#05243A)] kpi-talk" aria-live="polite">${va.metrics.talkMin}</div>
        </div>
        <div class="rounded-lg bg-gradient-to-b from-white to-[#F7F9FC] p-3 border border-[var(--va-divider,#E5E7EB)]">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">Conversion</span>
          </div>
          <div class="mt-1 text-2xl font-bold text-[var(--va-navy,#05243A)] kpi-conv" aria-live="polite">${conversion(va)}%</div>
        </div>
      </div>
      <div class="mt-4">
        <svg class="w-full h-10 text-[var(--va-gold,#CFAE70)]" viewBox="0 0 100 20" aria-hidden="true"><path class="stroke-current fill-none" stroke-width="1.5" d="${sparkPath(va.history.callsHourly)}"/></svg>
      </div>
    </div>
    <div id="details-${va.id}" class="grid transition-[grid-template-rows] duration-400 ease-out [grid-template-rows:0fr]">
      <div class="overflow-hidden">
        <div class="px-4 pb-4 text-sm text-gray-700">
          <p>No details available</p>
        </div>
      </div>
    </div>`;
  const btn = card.querySelector('button');
  btn.addEventListener('click', () => toggleDetails(card, btn, va));
  return card;
}

function statusColor(status) {
  const map = { active: 'bg-green-500 shadow-[0_0_0_3px_rgba(16,185,129,.15)]', idle: 'bg-yellow-500 shadow-[0_0_0_3px_rgba(234,179,8,.15)]', offline: 'bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,.15)]' };
  return map[status] || 'bg-gray-300';
}

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function sparkPath(arr) {
  const step = 100 / (arr.length - 1);
  return arr
    .map((v, i) => `${i * step},${20 - v}`)
    .reduce((acc, p, i) => (i === 0 ? `M${p}` : acc + ` L${p}`), '');
}

function conversion(va) {
  return va.metrics.connects ? Math.round((va.metrics.appts / va.metrics.connects) * 100) : 0;
}

function toggleDetails(card, btn) {
  const drawer = card.querySelector('[id^="details-"]');
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  drawer.style.gridTemplateRows = open ? '0fr' : '1fr';
}

function setupControls(root, data) {

  root.querySelectorAll('.sort-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.dataset.sort = btn.dataset.sort;
      root.querySelectorAll('.sort-btn').forEach((b) => b.classList.remove('bg-[var(--va-smoke,#F5F7FA)]'));
      btn.classList.add('bg-[var(--va-smoke,#F5F7FA)]');
      applyFilters(root, data);
    });
  });
  root.querySelectorAll('.status-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.dataset.status = btn.dataset.status;
      root.querySelectorAll('.status-btn').forEach((b) => b.classList.remove('bg-[var(--va-smoke,#F5F7FA)]'));
      btn.classList.add('bg-[var(--va-smoke,#F5F7FA)]');
      applyFilters(root, data);
    });
  });
  const search = root.querySelector('.search-input');
  let to;
  search.addEventListener('input', () => {
    clearTimeout(to);
    to = setTimeout(() => {
      root.dataset.query = search.value.toLowerCase();
      applyFilters(root, data);
    }, 150);
  });
}

function applyFilters(root, data) {
  const sortKey = root.dataset.sort;
  const status = root.dataset.status;
  const q = root.dataset.query || '';
  let vas = [...data.vas];
  if (status !== 'all') vas = vas.filter((v) => v.status === status);
  if (q) vas = vas.filter((v) => v.name.toLowerCase().includes(q));
  vas.sort((a, b) => {
    if (sortKey === 'name') return a.name.localeCompare(b.name);
    if (sortKey === 'calls') return b.metrics.calls - a.metrics.calls;
    if (sortKey === 'appts') return b.metrics.appts - a.metrics.appts;
    return 0;
  });
  renderVAList(root, vas);
  if (!vas.length) {
    const list = root.querySelector('#va-list');
    list.innerHTML = `<div class="col-span-full text-center text-sm text-gray-500">No team members match your filters</div>`;
  }
}

function updateLocalTimes() {
  document.querySelectorAll('[data-local-time]').forEach((el) => {
    const tz = el.getAttribute('data-local-time');
    el.textContent = new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
  });
}

function patch(root, snapshot) {
  renderTotals(root, snapshot);
  const vas = snapshot.vas;
  vas.forEach((va) => {
    const card = root.querySelector(`[aria-controls="details-${va.id}"]`).closest('.va-card');
    if (!card) return;
    const callsEl = card.querySelector('.kpi-calls');
    if (callsEl) {
      countUp(callsEl, va.metrics.calls);
      const progress = card.querySelector('.progress-calls');
      progress.style.width = `${(va.metrics.calls / va.goals.calls) * 100}%`;
      flash(callsEl);
    }
    const apptsEl = card.querySelector('.kpi-appts');
    if (apptsEl) {
      countUp(apptsEl, va.metrics.appts);
      const progress = card.querySelector('.progress-appts');
      progress.style.width = `${(va.metrics.appts / va.goals.appts) * 100}%`;
      flash(apptsEl);
    }
    const talkEl = card.querySelector('.kpi-talk');
    if (talkEl) {
      countUp(talkEl, va.metrics.talkMin);
    }
    const convEl = card.querySelector('.kpi-conv');
    if (convEl) {
      convEl.textContent = `${conversion(va)}%`;
    }
    const path = card.querySelector('svg path');
    if (path) {
      path.setAttribute('d', sparkPath(va.history.callsHourly));
    }
  });
  updateLocalTimes();
}

function init() {
  const root = document.getElementById('va-dashboard');
  if (!root) return;
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'VA Dashboard live metrics');
  startLiveSimulation((snapshot) => {
    if (!root.hasChildNodes()) {
      render(root, snapshot);
    } else {
      patch(root, snapshot);
    }
  });
  updateLocalTimes();
  setInterval(updateLocalTimes, 60000);
}

document.addEventListener('DOMContentLoaded', init);

// style for change flash
const style = document.createElement('style');
style.textContent = `.change-flash{position:relative;}
.change-flash::after{content:'';position:absolute;inset:0;background:rgba(207,174,112,.15);animation:flash 600ms forwards;}
@keyframes flash{from{opacity:1;}to{opacity:0;}}
`;
document.head.appendChild(style);

