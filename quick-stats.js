document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.va-quick-stats');
  if (!root) return;

  const roster = [
    { id: 'sarah-m', name: 'Sarah M.', level: 'senior' },
    { id: 'jamal-r', name: 'Jamal R.', level: 'senior' },
    { id: 'elena-v', name: 'Elena V.', level: 'senior' },
    { id: 'noah-p', name: 'Noah P.', level: 'senior' },
    { id: 'priya-k', name: 'Priya K.', level: 'junior', late: true },
    { id: 'carlos-d', name: 'Carlos D.', level: 'junior', late: true },
    { id: 'maya-t', name: 'Maya T.', level: 'junior', late: true },
    { id: 'leo-s', name: 'Leo S.', level: 'junior' },
    { id: 'aria-b', name: 'Aria B.', level: 'junior' },
    { id: 'owen-k', name: 'Owen K.', level: 'junior' }
  ];

  const ranges = {
    senior: { calls: [450, 900], connect: [12, 20], appt: [8, 15], lists: [8, 16] },
    junior: { calls: [320, 700], connect: [8, 16], appt: [4, 10], lists: [5, 12] }
  };

  const scheduleDefault = {
    start: [9, 0],
    end: [17, 30],
    breaks: [[10, 45, 11, 0], [12, 30, 13, 15], [15, 15, 15, 30]]
  };
  const scheduleLate = {
    start: [11, 0],
    end: [19, 30],
    breaks: [[14, 0, 14, 15], [17, 0, 17, 15]]
  };

  const storage = safeStorage();
  const STORAGE_KEY = 'vaQS';
  const today = dateStr(new Date());
  let state = storage ? JSON.parse(storage.getItem(STORAGE_KEY) || '{}') : {};
  if (state.date !== today) {
    const old = state.vas || {};
    state = { date: today, vas: {} };
    roster.forEach(v => {
      const ring = old[v.id] && old[v.id].ring ? old[v.id].ring : [];
      if (old[v.id] && old[v.id].totals) {
        ring.push(old[v.id].totals);
        if (ring.length > 7) ring.shift();
      }
      state.vas[v.id] = { ring };
    });
  }
  roster.forEach(v => {
    if (!state.vas[v.id]) state.vas[v.id] = {};
    const entry = state.vas[v.id];
    if (!entry.final || entry.date !== today) {
      entry.final = generateBaseline(v);
      entry.totals = { calls: 0, appointments: 0, lists: 0 };
      entry.history = [];
      entry.date = today;
    }
    if (!entry.ring) entry.ring = [];
  });
  save();

  const combo = root.querySelector('.qs-combobox');
  const input = root.querySelector('#qs-input');
  const list = root.querySelector('#qs-list');
  let currentId = roster[0].id;
  let open = false;
  let active = -1;

  combo.insertAdjacentHTML('afterbegin', `<span class="avatar">${initials(roster[0].name)}</span>`);
  input.value = roster[0].name;

  function populate(filter) {
    list.innerHTML = '';
    roster.filter(v => v.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach(v => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.dataset.id = v.id;
        li.innerHTML = `<span class="avatar">${initials(v.name)}</span><span class="name">${v.name}</span>`;
        li.addEventListener('click', () => select(v.id));
        list.appendChild(li);
      });
  }
  populate('');

  function openList() {
    populate(input.value);
    list.hidden = false;
    combo.setAttribute('aria-expanded', 'true');
    open = true;
  }
  function closeList() {
    list.hidden = true;
    combo.setAttribute('aria-expanded', 'false');
    open = false;
    active = -1;
  }
  input.addEventListener('focus', openList);
  input.addEventListener('input', openList);
  input.addEventListener('keydown', e => {
    const opts = Array.from(list.children);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) openList();
      active = (active + 1) % opts.length;
      highlight(opts, active);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) openList();
      active = (active - 1 + opts.length) % opts.length;
      highlight(opts, active);
    } else if (e.key === 'Enter') {
      if (open && active >= 0) {
        e.preventDefault();
        select(opts[active].dataset.id);
      }
    } else if (e.key === 'Escape') {
      closeList();
    }
  });
  document.addEventListener('click', e => {
    if (!root.contains(e.target)) closeList();
  });

  function highlight(opts, i) {
    opts.forEach((el, idx) => {
      el.classList.toggle('active', idx === i);
    });
  }
  function select(id) {
    currentId = id;
    const va = roster.find(v => v.id === id);
    input.value = va.name;
    combo.querySelector('.avatar').textContent = initials(va.name);
    closeList();
    root.classList.add('fade');
    setTimeout(() => {
      render(true);
      root.classList.remove('fade');
    }, 150);
  }

  function initials(name) {
    return name.split(' ').map(n => n[0]).join('');
  }

  const updatedEl = root.querySelector('.qs-updated');
  const spark = root.querySelector('.qs-spark');
  let lastUpdate = Date.now();

  function render(skipAnim) {
    const entry = state.vas[currentId];
    const prev = entry.ring[entry.ring.length - 1] || { calls: 0, appointments: 0, lists: 0 };
    ['calls', 'appointments', 'lists'].forEach(key => {
      const el = root.querySelector(`.kpi[data-key="${key}"] .value`);
      const target = entry.totals[key];
      if (skipAnim) {
        el.textContent = target;
      } else {
        tween(el, parseInt(el.textContent, 10) || 0, target);
      }
      const trendEl = root.querySelector(`.kpi[data-key="${key}"] .trend`);
      trendEl.textContent = formatTrend(target, prev[key]);
    });
    drawSpark(entry.history, entry.final.calls);
  }

  function update() {
    const now = new Date();
    const current = dateStr(now);
    if (current !== state.date) {
      rollover(current);
    }
    const entry = state.vas[currentId];
    const vaInfo = roster.find(v => v.id === currentId);
    const schedule = vaInfo.late ? scheduleLate : scheduleDefault;
    const progress = getProgress(now, schedule);
    const rng = seeded(`${currentId}${Math.floor(now.getTime() / 10000)}`);
    const target = {
      calls: Math.min(entry.final.calls, Math.round(entry.final.calls * progress + jitter(rng, 2))),
      appointments: Math.min(entry.final.appointments, Math.round(entry.final.appointments * progress + jitter(rng, 1))),
      lists: Math.min(entry.final.lists, Math.round(entry.final.lists * progress + jitter(rng, 1)))
    };
    ['calls', 'appointments', 'lists'].forEach(k => {
      if (target[k] < entry.totals[k]) target[k] = entry.totals[k];
    });
    entry.history.push(target.calls);
    if (entry.history.length > 60) entry.history.shift();
    entry.totals = target;
    lastUpdate = now.getTime();
    save();
    render();
  }

  update();
  setInterval(update, 10000);
  setInterval(() => {
    updatedEl.textContent = 'Last updated ' + relative(Date.now() - lastUpdate);
  }, 1000);

  function rollover(newDate) {
    Object.keys(state.vas).forEach(id => {
      const e = state.vas[id];
      e.ring.push(e.totals);
      if (e.ring.length > 7) e.ring.shift();
      e.final = generateBaseline(roster.find(v => v.id === id));
      e.totals = { calls: 0, appointments: 0, lists: 0 };
      e.history = [];
      e.date = newDate;
    });
    state.date = newDate;
    save();
  }

  function tween(el, from, to) {
    if (el._raf) cancelAnimationFrame(el._raf);
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / 180, 1);
      const val = Math.round(from + (to - from) * p);
      el.textContent = val;
      if (p < 1) {
        el._raf = requestAnimationFrame(frame);
      }
    }
    el._raf = requestAnimationFrame(frame);
  }

  function formatTrend(curr, prev) {
    if (!prev) return '+0% vs yesterday';
    const diff = prev ? ((curr - prev) / prev) * 100 : 0;
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${diff.toFixed(0)}% vs yesterday`;
  }
  function relative(ms) {
    const s = Math.round(ms / 1000);
    if (s < 1) return 'just now';
    if (s < 60) return s + 's ago';
    const m = Math.floor(s / 60);
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    return h + 'h ago';
  }

  function jitter(rng, amp) {
    return (rng() - 0.5) * amp;
  }

  function drawSpark(hist, maxCalls) {
    if (!hist.length) {
      spark.innerHTML = '';
      return;
    }
    const max = Math.max(...hist, maxCalls);
    const w = 200;
    const h = 40;
    let d = '';
    hist.forEach((v, i) => {
      const x = i * (w / Math.max(hist.length - 1, 1));
      const y = h - (v / max) * h;
      d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
    });
    spark.innerHTML = `<path d="${d}" fill="none" stroke="#cfae70" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  function getProgress(now, schedule) {
    const mNow = now.getHours() * 60 + now.getMinutes();
    const start = schedule.start[0] * 60 + schedule.start[1];
    const end = schedule.end[0] * 60 + schedule.end[1];
    const total = workMinutes(schedule);
    if (mNow <= start) return 0;
    if (mNow >= end) return 1;
    let work = mNow - start;
    schedule.breaks.forEach(b => {
      const bStart = b[0] * 60 + b[1];
      const bEnd = b[2] * 60 + b[3];
      if (mNow > bStart) {
        work -= Math.min(mNow, bEnd) - bStart;
      }
    });
    return Math.max(0, Math.min(1, work / total));
  }
  function workMinutes(schedule) {
    const start = schedule.start[0] * 60 + schedule.start[1];
    const end = schedule.end[0] * 60 + schedule.end[1];
    let mins = end - start;
    schedule.breaks.forEach(b => {
      mins -= (b[2] * 60 + b[3]) - (b[0] * 60 + b[1]);
    });
    return mins;
  }

  function generateBaseline(va) {
    const rng = seeded(`${va.id}${today}`);
    const r = ranges[va.level];
    const calls = randInt(rng, r.calls[0], r.calls[1]);
    const connectRate = r.connect[0] + rng() * (r.connect[1] - r.connect[0]);
    const connects = Math.round(calls * connectRate / 100);
    const apptRate = r.appt[0] + rng() * (r.appt[1] - r.appt[0]);
    const appointments = Math.round(connects * apptRate / 100);
    const lists = randInt(rng, r.lists[0], r.lists[1]);
    return { calls, connects, appointments, lists };
  }

  function seeded(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return function () {
      h = Math.imul(48271, h) | 0;
      return ((h >>> 0) % 2147483647) / 2147483647;
    };
  }
  function randInt(rng, min, max) {
    return Math.round(rng() * (max - min)) + min;
  }

  function dateStr(d) {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  function save() {
    if (storage) storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function safeStorage() {
    try {
      const s = window.localStorage;
      const t = '__test__';
      s.setItem(t, '1');
      s.removeItem(t);
      return s;
    } catch (e) {
      return null;
    }
  }
});
