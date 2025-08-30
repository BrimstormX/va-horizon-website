(async () => {
  const root = document.querySelector('.va-qs');
  if (!root) return;
  const tpl = await fetch('quick-stats-card.html').then(r => r.text()).catch(() => '');
  root.innerHTML = tpl;

  const roster = [
    { id: 'sarah-m', name: 'Sarah M.', level: 'senior' },
    { id: 'jamal-r', name: 'Jamal R.', level: 'senior' },
    { id: 'elena-v', name: 'Elena V.', level: 'senior' },
    { id: 'noah-p', name: 'Noah P.', level: 'senior' },
    { id: 'priya-k', name: 'Priya K.', level: 'junior' },
    { id: 'carlos-d', name: 'Carlos D.', level: 'junior' },
    { id: 'maya-t', name: 'Maya T.', level: 'junior' },
    { id: 'leo-s', name: 'Leo S.', level: 'junior' },
    { id: 'aria-b', name: 'Aria B.', level: 'junior' },
    { id: 'owen-k', name: 'Owen K.', level: 'junior' }
  ];
  const lateShift = new Set(['jamal-r', 'priya-k', 'leo-s']);
  const ranges = {
    senior: { calls: [450, 900], connect: [0.12, 0.2], appt: [0.08, 0.15], lists: [8, 16] },
    junior: { calls: [320, 700], connect: [0.08, 0.16], appt: [0.04, 0.1], lists: [5, 12] }
  };
  const storage = (() => {
    try {
      const k = '__qs';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      return localStorage;
    } catch (e) {
      return { getItem: () => null, setItem: () => {} };
    }
  })();
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    return h;
  }
  function rng(seed) {
    return function () {
      seed = Math.imul(seed, 1664525) + 1013904223;
      return (seed >>> 0) / 4294967296;
    };
  }
  function initials(name) {
    return name.split(' ').map(n => n[0]).join('');
  }
  function shift(id) {
    if (lateShift.has(id)) return { start: 11 * 60, end: 19 * 60 + 30, lunch: 14 * 60 + 30 };
    return { start: 9 * 60, end: 17 * 60 + 30, lunch: 12 * 60 + 30 };
  }
  function getData(va) {
    const day = new Date().toISOString().slice(0, 10);
    const key = 'qs-' + va.id;
    let obj = null;
    try { obj = JSON.parse(storage.getItem(key)); } catch (e) { obj = null; }
    if (!obj || obj.day !== day) {
      const hist = obj && obj.totals ? [{ day: obj.day, totals: obj.totals }, ...(obj.history || [])].slice(0, 7) : (obj ? obj.history : []);
      const r = rng(hash(va.id + day));
      const range = ranges[va.level];
      const calls = Math.round(range.calls[0] + r() * (range.calls[1] - range.calls[0]));
      const connectRate = range.connect[0] + r() * (range.connect[1] - range.connect[0]);
      let connects = Math.round(calls * connectRate);
      const apptRate = range.appt[0] + r() * (range.appt[1] - range.appt[0]);
      let appointments = Math.round(connects * apptRate);
      if (appointments > connects) appointments = connects;
      const lists = Math.round(range.lists[0] + r() * (range.lists[1] - range.lists[0]));
      obj = { day, totals: { calls, connects, appointments, lists }, history: hist };
      storage.setItem(key, JSON.stringify(obj));
    }
    return obj;
  }
  function progress(id) {
    const { start, end, lunch } = shift(id);
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const lunchEnd = lunch + 45;
    if (mins <= start) return 0;
    if (mins >= end) return 1;
    let worked = mins - start;
    if (mins > lunch) worked -= Math.min(mins, lunchEnd) - lunch;
    const total = (end - start) - 45;
    return Math.max(0, Math.min(1, worked / total));
  }
  function compute(va) {
    const data = getData(va);
    const p = progress(va.id);
    const j = rng(hash(va.id + String(Date.now()).slice(0, -4)));
    const current = ['calls', 'appointments', 'lists'].reduce((acc, f) => {
      const total = data.totals[f];
      let val = Math.round(total * p + (j() - 0.5) * 3);
      if (val < 0) val = 0;
      if (val > total) val = total;
      acc[f] = val;
      return acc;
    }, {});
    const y = data.history && data.history.length ? data.history[0].totals : null;
    const trend = {};
    ['calls', 'appointments', 'lists'].forEach(f => {
      trend[f] = y && y[f] > 0 ? Math.round((current[f] - y[f]) / y[f] * 100) : 0;
    });
    return { current, trend };
  }

  const list = root.querySelector('.va-qs-list');
  roster.forEach(va => {
    const li = document.createElement('li');
    li.className = 'va-qs-option';
    li.setAttribute('role', 'option');
    li.dataset.id = va.id;
    li.innerHTML = `<span class="va-qs-avatar">${initials(va.name)}</span><span>${va.name}</span>`;
    list.appendChild(li);
  });
  const selectedBtn = root.querySelector('.va-qs-selected');
  const nameEl = root.querySelector('.va-qs-name');
  const avatarEl = root.querySelector('.va-qs-selected .va-qs-avatar');
  let listOpen = false;
  let currentIndex = 0;
  function openList() {
    list.setAttribute('aria-hidden', 'false');
    selectedBtn.setAttribute('aria-expanded', 'true');
    listOpen = true;
  }
  function closeList() {
    list.setAttribute('aria-hidden', 'true');
    selectedBtn.setAttribute('aria-expanded', 'false');
    listOpen = false;
  }
  function selectVA(id) {
    currentIndex = roster.findIndex(v => v.id === id);
    const va = roster[currentIndex];
    nameEl.textContent = va.name;
    avatarEl.textContent = initials(va.name);
    list.querySelectorAll('.va-qs-option').forEach(opt => {
      opt.setAttribute('aria-selected', opt.dataset.id === id);
    });
    currentVA = va;
    sparkData.length = 0;
    update();
  }
  selectedBtn.addEventListener('click', () => { listOpen ? closeList() : openList(); });
  list.addEventListener('click', e => {
    const li = e.target.closest('.va-qs-option');
    if (li) { selectVA(li.dataset.id); closeList(); }
  });
  selectedBtn.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); openList(); list.children[currentIndex]?.focus(); }
  });
  list.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); currentIndex = (currentIndex + 1) % roster.length; list.children[currentIndex].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); currentIndex = (currentIndex + roster.length - 1) % roster.length; list.children[currentIndex].focus(); }
    else if (e.key === 'Enter') { e.preventDefault(); const id = list.children[currentIndex].dataset.id; selectVA(id); closeList(); selectedBtn.focus(); }
    else if (e.key === 'Escape') { e.preventDefault(); closeList(); selectedBtn.focus(); }
  });
  document.addEventListener('click', e => { if (!root.contains(e.target)) closeList(); });

  let currentVA = roster[0];
  const values = { calls: 0, appointments: 0, lists: 0 };
  const sparkPath = root.querySelector('.va-qs-spark path');
  const sparkData = [];
  const timeEl = root.querySelector('.va-qs-time');
  let lastUpdate = Date.now();

  function animateNumber(el, start, end) {
    if (prefersReduced) { el.textContent = end; return; }
    const duration = 180;
    const sTime = performance.now();
    function step(now) {
      const t = Math.min(1, (now - sTime) / duration);
      const val = Math.round(start + (end - start) * t);
      el.textContent = val;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function updateField(field, value, trend) {
    const vEl = root.querySelector(`[data-field="${field}"]`);
    const tEl = root.querySelector(`[data-trend="${field}"]`);
    animateNumber(vEl, values[field] || 0, value);
    values[field] = value;
    const sign = trend > 0 ? '+' : '';
    tEl.textContent = `${sign}${trend}% vs yesterday`;
    if (!prefersReduced) {
      tEl.style.opacity = 0;
      requestAnimationFrame(() => { tEl.style.opacity = 1; });
    }
  }
  function updateSpark(val) {
    sparkData.push(val);
    if (sparkData.length > 60) sparkData.shift();
    const max = Math.max(...sparkData, 1);
    const pts = sparkData.map((v, i) => {
      const x = i / (sparkData.length - 1) * 100;
      const y = 40 - v / max * 40;
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    }).join(' ');
    sparkPath.setAttribute('d', pts);
  }
  function updateTime() {
    const now = Date.now();
    const diff = Math.round((now - lastUpdate) / 60000);
    timeEl.textContent = diff === 0 ? 'just now' : `${diff}m ago`;
    timeEl.setAttribute('datetime', new Date(now).toISOString());
    lastUpdate = now;
  }
  function update() {
    const { current, trend } = compute(currentVA);
    updateField('calls', current.calls, trend.calls);
    updateField('appointments', current.appointments, trend.appointments);
    updateField('lists', current.lists, trend.lists);
    updateSpark(current.calls);
    updateTime();
    setTimeout(update, 10000);
  }
  selectVA(currentVA.id);
})();
