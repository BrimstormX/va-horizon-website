(() => {
  const POLL_INTERVAL = 60000;
  const STORAGE_KEY = 'va-dashboard-selected';

  const seedData = [
    {
      id: 'va1',
      name: 'Alice',
      online: true,
      updatedAt: new Date().toISOString(),
      coldCallsToday: 12,
      appointmentsSet: 3,
      listsProcessed: 5
    },
    {
      id: 'va2',
      name: 'Bob',
      online: false,
      updatedAt: new Date().toISOString(),
      coldCallsToday: 8,
      appointmentsSet: 2,
      listsProcessed: 1
    }
  ];

  const widget = document.querySelector('[data-widget]');
  if (!widget) return;

  const select = widget.querySelector('.va-select');
  const statusDot = widget.querySelector('.status-dot');
  const statusText = widget.querySelector('.status-text');
  const livePill = widget.querySelector('.live-pill');
  const metricsEl = widget.querySelector('.va-metrics');
  const metricEls = {
    coldCallsToday: metricsEl.querySelector('[data-metric="coldCallsToday"]'),
    appointmentsSet: metricsEl.querySelector('[data-metric="appointmentsSet"]'),
    listsProcessed: metricsEl.querySelector('[data-metric="listsProcessed"]')
  };

  let data = seedData;
  let current;
  let pollTimer;

  function init() {
    buildOptions();
    select.addEventListener('change', () => {
      localStorage.setItem(STORAGE_KEY, select.value);
      render(true);
    });
    render(true);
    fetchData();
    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);
  }

  function buildOptions() {
    select.innerHTML = '';
    data.forEach(va => {
      const opt = document.createElement('option');
      opt.value = va.id;
      opt.textContent = va.name;
      select.appendChild(opt);
    });
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && data.some(v => v.id === stored)) {
      select.value = stored;
    }
  }

  function handleVisibility() {
    if (document.hidden) {
      clearInterval(pollTimer);
    } else {
      fetchData();
      startPolling();
    }
  }

  function startPolling() {
    clearInterval(pollTimer);
    pollTimer = setInterval(fetchData, POLL_INTERVAL);
  }

  async function fetchData() {
    try {
      const res = await fetch('/api/va-stats', { cache: 'no-store' });
      if (!res.ok) throw new Error('Network');
      const json = await res.json();
      if (Array.isArray(json) && json.length) {
        data = json;
        buildOptions();
        render();
      }
      widget.querySelector('.offline')?.remove();
    } catch (e) {
      if (!widget.querySelector('.offline')) {
        const off = document.createElement('div');
        off.className = 'offline';
        off.textContent = 'Data unavailable';
        widget.appendChild(off);
      }
    }
  }

  function render(force = false) {
    current = data.find(v => v.id === select.value) || data[0];
    if (!current) return;
    statusDot.classList.toggle('online', current.online);
    livePill.hidden = !current.online;
    statusText.textContent = `Updated ${timeAgo(new Date(current.updatedAt))}`;
    Object.entries(metricEls).forEach(([key, el]) => {
      const newVal = current[key] || 0;
      const prev = parseInt(el.textContent.replace(/,/g, '')) || 0;
      if (force || newVal !== prev) {
        animateNumber(el, prev, newVal);
        const row = el.closest('.metric-row');
        row.classList.add('updated');
        setTimeout(() => row.classList.remove('updated'), 300);
      }
    });
  }

  function animateNumber(el, from, to) {
    cancelAnimationFrame(el._raf);
    const start = performance.now();
    const dur = 500;
    function frame(now) {
      const progress = Math.min((now - start) / dur, 1);
      const val = Math.round(from + (to - from) * progress);
      el.textContent = val.toLocaleString();
      if (progress < 1 && !document.hidden) {
        el._raf = requestAnimationFrame(frame);
      }
    }
    el._raf = requestAnimationFrame(frame);
  }

  function timeAgo(date) {
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return 'just now';
    const mins = Math.floor(diff / 60);
    return `${mins}m ago`;
  }

  init();
})();
