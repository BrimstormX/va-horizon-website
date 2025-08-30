(function(){
  const roster = [
    { id: 'sarah-m', name: 'Sarah M.', initials: 'SM', shift: { start: '09:00', end: '17:30' } },
    { id: 'jamal-r', name: 'Jamal R.', initials: 'JR', shift: { start: '09:00', end: '17:30' } },
    { id: 'elena-v', name: 'Elena V.', initials: 'EV', shift: { start: '09:00', end: '17:30' } },
    { id: 'noah-p', name: 'Noah P.', initials: 'NP', shift: { start: '09:00', end: '17:30' } },
    { id: 'priya-k', name: 'Priya K.', initials: 'PK', shift: { start: '11:00', end: '19:30' } },
    { id: 'carlos-d', name: 'Carlos D.', initials: 'CD', shift: { start: '11:00', end: '19:30' } },
    { id: 'maya-t', name: 'Maya T.', initials: 'MT', shift: { start: '09:00', end: '17:30' } },
    { id: 'leo-s', name: 'Leo S.', initials: 'LS', shift: { start: '09:00', end: '17:30' } },
    { id: 'aria-b', name: 'Aria B.', initials: 'AB', shift: { start: '11:00', end: '19:30' } },
    { id: 'owen-k', name: 'Owen K.', initials: 'OK', shift: { start: '09:00', end: '17:30' } }
  ];

  const storageKey = 'va-dashboard-state';

  function loadState() {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return data;
    } catch (e) {
      return {};
    }
  }

  function saveState(data) {
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  function todayKey(date = new Date()) {
    return date.toISOString().slice(0,10);
  }

  function initVAState() {
    return {
      history: [],
      today: {
        coldCalls: 0,
        appointments: 0,
        lists: 0,
        connects: 0,
        avgCallDuration: 0,
        connectRate: 0,
        series: {
          coldCalls: [],
          appointments: [],
          lists: [],
          connectRate: [],
          avgCallDuration: []
        },
        timeline: [],
        lastUpdated: new Date().toISOString(),
        online: false
      }
    };
  }

  const state = loadState();
  if (!state.date) state.date = todayKey();
  if (!state.vas) state.vas = {};
  if (!state.selectedId) state.selectedId = roster[0].id;
  if (!state.period) state.period = 'today';

  function ensureVA(id) {
    if (!state.vas[id]) state.vas[id] = initVAState();
  }

  roster.forEach(r => ensureVA(r.id));

  function inShift(now, shift) {
    const [sh, sm] = shift.start.split(':').map(Number);
    const [eh, em] = shift.end.split(':').map(Number);
    const start = new Date(now); start.setHours(sh, sm, 0, 0);
    const end = new Date(now); end.setHours(eh, em, 0, 0);
    return now >= start && now <= end;
  }

  function resetDay() {
    Object.values(state.vas).forEach(v => {
      v.history.unshift({ date: state.date, totals: { ...v.today } });
      v.history = v.history.slice(0,7);
      v.today = initVAState().today;
    });
    state.date = todayKey();
    saveState(state);
  }

  function tick() {
    const now = new Date();
    if (state.date !== todayKey(now)) resetDay();
    const va = state.vas[state.selectedId];
    const rosterEntry = roster.find(r => r.id === state.selectedId);
    const online = inShift(now, rosterEntry.shift);
    if (online) {
      const callsInc = Math.floor(Math.random()*3); // 0-2
      const connectInc = Math.floor(Math.random() * (callsInc+1));
      const apptInc = Math.min(connectInc, Math.floor(Math.random()*2));
      va.today.coldCalls += callsInc;
      va.today.connects += connectInc;
      va.today.appointments += apptInc;
      va.today.lists += Math.floor(Math.random()*2);
      va.today.avgCallDuration = Math.round(va.today.avgCallDuration*0.9 + (30 + Math.random()*90)*0.1);
      va.today.connectRate = va.today.coldCalls ? va.today.connects / va.today.coldCalls : 0;
      va.today.series.coldCalls.push(va.today.coldCalls);
      va.today.series.appointments.push(va.today.appointments);
      va.today.series.lists.push(va.today.lists);
      va.today.series.connectRate.push(va.today.connectRate);
      va.today.series.avgCallDuration.push(va.today.avgCallDuration);
      ['coldCalls','appointments','lists','connectRate','avgCallDuration'].forEach(k => {
        const arr = va.today.series[k];
        if (arr.length>20) arr.shift();
      });
      if (callsInc>0) {
        va.today.timeline.push({ t: now.getHours() + now.getMinutes()/60, type: 'call' });
      }
      if (apptInc>0) {
        va.today.timeline.push({ t: now.getHours() + now.getMinutes()/60, type: 'appointment' });
      }
    }
    va.today.online = online;
    va.today.lastUpdated = now.toISOString();
    saveState(state);
  }

  function getWeekTotals(va) {
    const totals = { coldCalls:0, appointments:0, lists:0, connectRate:0, avgCallDuration:0 };
    const days = va.history.slice(0,7);
    days.forEach(d => {
      totals.coldCalls += d.totals.coldCalls || 0;
      totals.appointments += d.totals.appointments || 0;
      totals.lists += d.totals.lists || 0;
      totals.avgCallDuration += d.totals.avgCallDuration || 0;
      totals.connectRate += d.totals.connectRate || 0;
    });
    totals.coldCalls += va.today.coldCalls;
    totals.appointments += va.today.appointments;
    totals.lists += va.today.lists;
    totals.avgCallDuration += va.today.avgCallDuration;
    totals.connectRate += va.today.connectRate;
    if (days.length+1>0) {
      totals.avgCallDuration = Math.round(totals.avgCallDuration/(days.length+1));
      totals.connectRate = totals.connectRate/(days.length+1);
    }
    return totals;
  }

  function timeAgo(ts) {
    const now = Date.now();
    const diff = Math.max(0, now - new Date(ts).getTime());
    if (diff < 60*1000) return 'just now';
    const mins = Math.round(diff/60000);
    return `${mins}m ago`;
  }

  function render() {
    const root = document.getElementById('command-center');
    if (!root) return;
    if (!root.dataset.ready) {
      buildUI(root);
      root.dataset.ready = 'true';
    }
    const va = state.vas[state.selectedId];
    const stats = state.period === 'week' ? getWeekTotals(va) : va.today;
    const name = roster.find(r => r.id === state.selectedId).name;
    // Update stats
    updateNumber(document.querySelector('[data-key="coldCalls"] .value'), stats.coldCalls);
    updateNumber(document.querySelector('[data-key="appointments"] .value'), stats.appointments);
    updateNumber(document.querySelector('[data-key="lists"] .value'), stats.lists);
    updateNumber(document.querySelector('[data-key="avgCallDuration"] .value'), stats.avgCallDuration);
    updateNumber(document.querySelector('[data-key="connectRate"] .value'), stats.connectRate, true);
    // Trends
    const yesterday = va.history[0] ? va.history[0].totals : null;
    setTrend(document.querySelector('[data-key="coldCalls"] .trend'), stats.coldCalls, yesterday ? yesterday.coldCalls : 0);
    setTrend(document.querySelector('[data-key="appointments"] .trend'), stats.appointments, yesterday ? yesterday.appointments : 0);
    setTrend(document.querySelector('[data-key="lists"] .trend'), stats.lists, yesterday ? yesterday.lists : 0);
    setTrend(document.querySelector('[data-key="avgCallDuration"] .trend'), stats.avgCallDuration, yesterday ? yesterday.avgCallDuration : 0, 's');
    setTrend(document.querySelector('[data-key="connectRate"] .trend'), stats.connectRate, yesterday ? yesterday.connectRate : 0, '', true);
    // Sparklines
    renderSpark(document.querySelector('[data-key="coldCalls"] .sparkline'), va.today.series.coldCalls, '#0a224e');
    renderSpark(document.querySelector('[data-key="appointments"] .sparkline'), va.today.series.appointments, '#cfae70');
    renderSpark(document.querySelector('[data-key="lists"] .sparkline'), va.today.series.lists, '#0a224e');
    renderSpark(document.querySelector('[data-key="avgCallDuration"] .sparkline'), va.today.series.avgCallDuration, '#0a224e');
    renderSpark(document.querySelector('[data-key="connectRate"] .sparkline'), va.today.series.connectRate, '#0a224e');
    // Timeline
    renderTimeline(document.getElementById('timeline'), va.today.timeline, roster.find(r=>r.id===state.selectedId).shift);
    // Status line
    const status = document.getElementById('status-text');
    status.textContent = `Your VA: ${name} • ${va.today.online ? 'Online' : 'Offline'} • Updated ${timeAgo(va.today.lastUpdated)}`;
    document.getElementById('va-select').value = state.selectedId;
    document.querySelectorAll('.period-toggle button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.period === state.period);
    });
  }

  function buildUI(root) {
    root.innerHTML = `
      <div class="top-bar">
        <div class="status-dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="title">Horizon Command Center</div>
        <div class="live-pill">Live Now</div>
      </div>
      <div class="va-switcher">
        <select id="va-select" aria-label="Select VA"></select>
        <div class="period-toggle" role="group" aria-label="Select period">
          <button data-period="today" class="active">Today</button>
          <button data-period="week">Week</button>
        </div>
      </div>
      <div class="stats" id="stats">
        ${['coldCalls','appointments','lists','avgCallDuration','connectRate'].map(k => {
          const labels = {
            coldCalls: 'Cold Calls Today',
            appointments: 'Appointments Set',
            lists: 'Lists Processed',
            avgCallDuration: 'Avg Call Duration',
            connectRate: 'Connect Rate'
          };
          const cls = ['kpi', (k==='avgCallDuration'||k==='connectRate')?'micro':'hero'].join(' ');
          return `<div class="${cls}" data-key="${k}"><div class="label">${labels[k]}</div><svg class="sparkline"></svg><div class="value">0</div><div class="trend">—</div></div>`;
        }).join('')}
      </div>
      <div class="timeline" id="timeline" aria-label="Activity timeline"></div>
      <div class="status-footer"><span id="status-text"></span><button id="refresh" aria-label="Refresh">&#x21bb;</button></div>
    `;

    const select = root.querySelector('#va-select');
    roster.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = `${r.initials} – ${r.name}`;
      select.appendChild(opt);
    });

    select.addEventListener('change', e => {
      state.selectedId = e.target.value;
      fadeStats();
      render();
    });

    root.querySelectorAll('.period-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        state.period = btn.dataset.period;
        render();
      });
    });

    root.querySelector('#refresh').addEventListener('click', () => {
      tick();
      render();
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateNumber(el, value, isRate) {
    if (!el) return;
    const format = v => {
      if (isRate) return (v*100).toFixed(0)+'%';
      return v.toString();
    };
    if (prefersReduced) { el.textContent = format(value); return; }
    const start = parseFloat(el.textContent) || 0;
    const end = value;
    const dur = 200;
    const startTime = performance.now();
    const step = now => {
      const p = Math.min(1,(now-startTime)/dur);
      const val = start + (end-start)*p;
      el.textContent = format(isRate?val:Math.round(val));
      if (p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setTrend(el, value, base, suffix='', isRate) {
    if (!el) return;
    if (!base) { el.textContent = '—'; return; }
    const diff = base===0 ? 1 : (value-base)/base;
    const sign = diff>=0 ? '+' : '';
    const pct = (isRate?diff*100:diff*100).toFixed(0);
    el.textContent = `${sign}${pct}% vs yesterday${suffix}`;
  }

  function renderSpark(svg, series, color) {
    if (!svg) return;
    const w = 100, h = 24;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    if (series.length < 2) { svg.innerHTML=''; return; }
    const max = Math.max(...series);
    const step = w / (series.length - 1);
    let d = '';
    series.forEach((v,i) => {
      const x = i*step;
      const y = h - (max ? (v/max)*h : 0);
      d += (i? 'L':'M') + x + ' ' + y + ' ';
    });
    svg.innerHTML = `<path d="${d.trim()}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  function renderTimeline(el, events, shift) {
    if (!el) return;
    el.innerHTML = '';
    const startHour = parseInt(shift.start.split(':')[0],10);
    const endHour = parseInt(shift.end.split(':')[0],10);
    const hours = endHour - startHour;
    for (let i=0;i<=hours;i++) {
      const tick = document.createElement('div');
      tick.className = 'tick';
      tick.style.left = `${(i/hours)*100}%`;
      el.appendChild(tick);
    }
    events.forEach(ev => {
      const pip = document.createElement('div');
      pip.className = 'pip ' + (ev.type==='appointment'?'appointment':'call');
      const pos = ( (ev.t - startHour) / hours ) * 100;
      pip.style.left = pos + '%';
      el.appendChild(pip);
    });
  }

  function fadeStats() {
    const stats = document.getElementById('stats');
    if (!stats) return;
    stats.classList.add('fade');
    setTimeout(() => stats.classList.remove('fade'), 200);
  }

  document.addEventListener('DOMContentLoaded', () => {
    tick();
    render();
    setInterval(() => { tick(); render(); }, 10000);
  });

  window.VADashboard = {
    getState: () => {
      const va = state.vas[state.selectedId];
      return {
        roster,
        selectedId: state.selectedId,
        period: state.period,
        lastUpdated: va.today.lastUpdated,
        stats: state.period === 'week' ? getWeekTotals(va) : va.today
      };
    },
    tick,
    resetDay
  };
})();
