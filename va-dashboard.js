class VADashboard {
  constructor(
    rootEl,
    {
      dataUrl = '/api/va-stats',
      fallbackUrl = 'va-dashboard.data.json',
      pollMs = 60000
    } = {}
  ) {
    this.root = rootEl;
    this.dataUrl = dataUrl;
    this.fallbackUrl = fallbackUrl;
    this.pollMs = pollMs;
    this.state = { items: [], selectedId: null };
    this.etag = null;
    this.timers = new Map();
    this.backoff = pollMs;
  }

  async init() {
    this.selectEl = this.root.querySelector('.va-dash__select');
    this.statusDot = this.root.querySelector('.status-dot');
    this.statusLabel = this.root.querySelector('.status-label');
    this.noticeEl = this.root.querySelector('.va-dash__notice');
    this.vaBubble = this.root.querySelector('.va-dash__va-bubble');
    await this.loadData();
    this.populateSelect();
    const saved = localStorage.getItem('va-dashboard:selected');
    if (saved && this.state.items.some((it) => it.id === saved)) {
      this.state.selectedId = saved;
    } else {
      this.state.selectedId = this.state.items[0]?.id || null;
    }
    if (this.state.selectedId) {
      this.selectEl.value = this.state.selectedId;
      this.setSelected(this.state.selectedId, true);
    }
    this.selectEl.addEventListener('change', (e) => {
      this.debounceSelect(() => this.setSelected(e.target.value));
    });
    this.startPolling();
  }

  populateSelect() {
    this.selectEl.innerHTML = '';
    this.state.items.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item.name;
      this.selectEl.appendChild(opt);
    });
  }

  debounceSelect(fn) {
    clearTimeout(this.selectDebounce);
    this.selectDebounce = setTimeout(fn, 50);
  }

  async loadData() {
    try {
      const res = await fetch(this.dataUrl, this.etag ? { headers: { 'If-None-Match': this.etag } } : {});
      if (res.status === 304) {
        this.hideNotice();
        return;
      }
      if (!res.ok) {
        throw new Error('Network');
      }
      this.etag = res.headers.get('ETag') || this.etag;
      const data = await res.json();
      this.state.items = data.items;
      this.hideNotice();
      this.backoff = this.pollMs;
    } catch (e) {
      if (!this.state.items.length) {
        const res = await fetch(this.fallbackUrl);
        const data = await res.json();
        this.state.items = data.items;
      }
      this.showNotice('Offline—showing last known stats');
      this.backoff = Math.min(this.backoff * 2, 300000);
    }
  }

  setSelected(id, skipAnim = false) {
    if (!id) return;
    this.state.selectedId = id;
    localStorage.setItem('va-dashboard:selected', id);
    const item = this.state.items.find((it) => it.id === id);
    if (!item) return;
    this.statusDot.style.background = item.online ? '#12B76A' : '#98A2B3';
    this.statusLabel.textContent = 'Updated just now';
    this.vaBubble.querySelector('[data-va-name]').textContent = item.name;
    this.vaBubble.style.display = 'block';
    const list = this.root.querySelector('.va-dash__list');
    const rows = list.querySelectorAll('.kpi');
    if (!skipAnim) {
      rows.forEach((li) => li.classList.add('is-leaving'));
      setTimeout(() => {
        rows.forEach((li) => li.classList.remove('is-leaving'));
        rows.forEach((li) => li.classList.add('is-entering'));
        requestAnimationFrame(() => {
          rows.forEach((li) => li.classList.add('is-entered'));
        });
        setTimeout(() => {
          rows.forEach((li) => li.classList.remove('is-entering', 'is-entered'));
        }, 220);
      }, 200);
    }
    const metrics = item.metrics;
    rows.forEach((li) => {
      const key = li.dataset.key;
      const valueEl = li.querySelector('[data-value]');
      const to = metrics[key] || 0;
      const from = Number(valueEl.textContent) || 0;
      if (skipAnim) {
        valueEl.textContent = to;
      } else {
        this.animateValue(valueEl, from, to);
      }
    });
  }

  animateValue(el, from, to, duration = 450) {
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const val = Math.round(from + (to - from) * ease(progress));
      el.textContent = val;
      if (progress < 1) {
        const id = requestAnimationFrame(step);
        this.timers.set(el, id);
      } else {
        this.timers.delete(el);
      }
    };
    cancelAnimationFrame(this.timers.get(el));
    const id = requestAnimationFrame(step);
    this.timers.set(el, id);
  }

  async poll() {
    if (document.visibilityState === 'hidden') {
      this.schedulePoll();
      return;
    }
    const prev = this.state.items.find((it) => it.id === this.state.selectedId);
    await this.loadData();
    const current = this.state.items.find((it) => it.id === this.state.selectedId);
    if (prev && current) {
      const changed =
        current.metrics.coldCalls !== prev.metrics.coldCalls ||
        current.metrics.appointmentsSet !== prev.metrics.appointmentsSet ||
        current.metrics.listsProcessed !== prev.metrics.listsProcessed;
      if (changed) {
        this.setSelected(this.state.selectedId);
      }
    }
    this.schedulePoll();
  }

  schedulePoll(interval = this.backoff) {
    clearTimeout(this.pollTimer);
    this.pollTimer = setTimeout(() => this.poll(), interval);
  }

  startPolling() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.poll();
      }
    });
    this.schedulePoll();
  }

  showNotice(msg) {
    if (!this.noticeEl) return;
    this.noticeEl.textContent = msg;
    this.noticeEl.hidden = false;
  }

  hideNotice() {
    if (!this.noticeEl) return;
    this.noticeEl.hidden = true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.va-dashboard').forEach((el) => {
    const dash = new VADashboard(el);
    dash.init();
  });
});
