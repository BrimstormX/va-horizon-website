class VADashboard {
  constructor(rootEl, { dataUrl = '/api/va-stats', fallbackUrl = 'va-dashboard.data.json', pollMs = 60000 } = {}) {
    this.root = rootEl;
    this.dataUrl = dataUrl;
    this.fallbackUrl = fallbackUrl;
    this.pollMs = pollMs;
    this.state = { items: [], selectedId: null };
    this.animations = new Map();
    this.etag = null;
    this.noticeEl = rootEl.querySelector('.va-dash__notice');
    this.pollTimer = null;
  }

  async init() {
    await this.loadData();
    if (!this.state.items.length) return;
    const select = this.root.querySelector('.va-dash__select');
    const saved = localStorage.getItem('va-dashboard:selected');
    if (saved && this.state.items.find(i => i.id === saved)) {
      select.value = saved;
      this.setSelected(saved, false);
    } else {
      select.value = this.state.items[0].id;
      this.setSelected(this.state.items[0].id, false);
    }
    let changeTimer;
    select.addEventListener('change', e => {
      const id = e.target.value;
      clearTimeout(changeTimer);
      changeTimer = setTimeout(() => {
        localStorage.setItem('va-dashboard:selected', id);
        this.setSelected(id);
      }, 50);
    });
    this.startPolling();
  }

  async fetchData(url) {
    const headers = {};
    if (this.etag && url === this.dataUrl) headers['If-None-Match'] = this.etag;
    const res = await fetch(url, { headers });
    if (res.status === 304) return null;
    if (!res.ok) throw new Error('status ' + res.status);
    if (url === this.dataUrl) this.etag = res.headers.get('ETag');
    return res.json();
  }

  async loadData() {
    try {
      const data = await this.fetchData(this.dataUrl);
      if (data) {
        this.state.items = data.items || [];
        this.hideNotice();
        this.setupSelect();
        return;
      }
    } catch (e) {
      // ignore and try fallback
    }
    try {
      const data = await this.fetchData(this.fallbackUrl);
      if (data) {
        this.state.items = data.items || [];
        this.showNotice('Offline—showing last known stats');
        this.setupSelect();
      }
    } catch (e) {
      this.showNotice('Offline—no data');
    }
  }

  setupSelect() {
    const select = this.root.querySelector('.va-dash__select');
    select.innerHTML = '';
    this.state.items.forEach(va => {
      const opt = document.createElement('option');
      opt.value = va.id;
      opt.textContent = va.name;
      select.appendChild(opt);
    });
  }

  setSelected(id, animate = true) {
    const va = this.state.items.find(i => i.id === id);
    if (!va) return;
    if (this.state.selectedId === id && animate) return; // no re-render
    this.state.selectedId = id;
    this.renderVA(va, animate);
  }

  renderVA(va, animate = true) {
    // status
    const statusDot = this.root.querySelector('.status-dot');
    statusDot.classList.toggle('is-off', !va.online);
    this.root.querySelector('.status-label').textContent = 'Updated just now';

    // bubble
    const bubble = this.root.querySelector('.va-dash__va-bubble');
    bubble.querySelector('[data-va-name]').textContent = va.name;
    bubble.classList.add('is-visible');

    const rows = Array.from(this.root.querySelectorAll('.kpi'));
    if (!animate) {
      rows.forEach(li => {
        const key = li.dataset.key;
        const valEl = li.querySelector('[data-value]');
        valEl.textContent = va.metrics[key] || 0;
      });
      return;
    }
    rows.forEach(li => li.classList.add('is-leaving'));
    setTimeout(() => {
      rows.forEach(li => {
        li.classList.remove('is-leaving');
        li.classList.add('is-entering');
        const key = li.dataset.key;
        const target = va.metrics[key] || 0;
        const valEl = li.querySelector('[data-value]');
        const current = parseInt(valEl.textContent, 10) || 0;
        if (current !== target) this.animateValue(valEl, current, target);
        requestAnimationFrame(() => li.classList.add('is-entered'));
        li.addEventListener('transitionend', () => {
          li.classList.remove('is-entering', 'is-entered');
        }, { once: true });
      });
    }, 200);
  }

  animateValue(el, from, to, duration = 450) {
    if (this.animations.has(el)) cancelAnimationFrame(this.animations.get(el));
    const start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      el.textContent = value;
      if (t < 1) {
        const raf = requestAnimationFrame(step);
        this.animations.set(el, raf);
      } else {
        this.animations.delete(el);
      }
    };
    const raf = requestAnimationFrame(step);
    this.animations.set(el, raf);
  }

  startPolling() {
    const poll = async () => {
      if (document.visibilityState === 'hidden') {
        this.pollTimer = setTimeout(poll, this.pollMs);
        return;
      }
      try {
        const data = await this.fetchData(this.dataUrl);
        if (data) {
          this.hideNotice();
          this.state.items = data.items || [];
          const current = this.state.items.find(i => i.id === this.state.selectedId);
          if (current) this.renderVA(current, true);
          this.pollMs = 60000; // reset
        }
      } catch (e) {
        this.showNotice('Offline—showing last known stats');
        this.pollMs = Math.min(this.pollMs * 2, 300000);
      }
      this.pollTimer = setTimeout(poll, this.pollMs);
    };
    poll();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !this.pollTimer) poll();
    });
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
  document.querySelectorAll('.va-dashboard').forEach(el => {
    const dash = new VADashboard(el);
    dash.init();
  });
});
