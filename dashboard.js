class FakeVaStatsEngine {
  constructor() {
    this.roster = [
      { id: 'sarah', name: 'Sarah M.', skillTier: 'senior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'SM', updatedAt: new Date().toISOString() },
      { id: 'jamal', name: 'Jamal R.', skillTier: 'senior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'JR', updatedAt: new Date().toISOString() },
      { id: 'elena', name: 'Elena V.', skillTier: 'senior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'EV', updatedAt: new Date().toISOString() },
      { id: 'noah', name: 'Noah P.', skillTier: 'senior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'NP', updatedAt: new Date().toISOString() },
      { id: 'priya', name: 'Priya K.', skillTier: 'junior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'PK', updatedAt: new Date().toISOString() },
      { id: 'carlos', name: 'Carlos D.', skillTier: 'junior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'CD', updatedAt: new Date().toISOString() },
      { id: 'maya', name: 'Maya T.', skillTier: 'junior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'MT', updatedAt: new Date().toISOString() },
      { id: 'leo', name: 'Leo S.', skillTier: 'junior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'LS', updatedAt: new Date().toISOString() },
      { id: 'aria', name: 'Aria B.', skillTier: 'junior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'AB', updatedAt: new Date().toISOString() },
      { id: 'owen', name: 'Owen K.', skillTier: 'junior', tz: Intl.DateTimeFormat().resolvedOptions().timeZone, online: true, avatarInitials: 'OK', updatedAt: new Date().toISOString() }
    ];
    this.selectedVaId = this.roster[0].id;
    this.period = 'today';
    this.lastUpdated = new Date().toISOString();
    this.stats = {};
    this.roster.forEach(v => { this.stats[v.id] = { today: initMetrics(), week: initMetrics() }; });
    this.seed = this.seedForDay(new Date());
  }
  seedForDay(d) {
    const day = d.getFullYear() + '-' + this.dayOfYear(d);
    return cyrb128('VAHorizon:' + day);
  }
  dayOfYear(d) {
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }
  rand() {
    let t = this.seed = (this.seed + 0x6D2B79F5) | 0;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  tick() {
    const data = this.stats[this.selectedVaId][this.period];
    data.coldCalls += Math.floor(this.rand() * 3);
    data.appointments += Math.floor(this.rand() * 2);
    data.lists += Math.floor(this.rand() * 1);
    data.connectRate = Math.min(0.3, Math.max(0.05, data.coldCalls ? (data.appointments * 0.5) / data.coldCalls : 0));
    data.avgCallDurationSec = 60 + Math.floor(this.rand() * 20);
    this.lastUpdated = new Date().toISOString();
    const rosterItem = this.roster.find(r => r.id === this.selectedVaId);
    rosterItem.updatedAt = this.lastUpdated;
  }
  getState() {
    return {
      roster: this.roster,
      selectedVaId: this.selectedVaId,
      period: this.period,
      lastUpdated: this.lastUpdated,
      current: this.stats[this.selectedVaId][this.period]
    };
  }
}
function initMetrics() {
  return { coldCalls: 0, appointments: 0, lists: 0, connectRate: 0, avgCallDurationSec: 0, series: [] };
}
function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}
const engine = new FakeVaStatsEngine();
const vaSelect = document.getElementById('va-select');
engine.roster.forEach(va => {
  const opt = document.createElement('option');
  opt.value = va.id;
  opt.textContent = va.name;
  vaSelect.appendChild(opt);
});
function updateUI() {
  const state = engine.getState();
  const data = state.current;
  document.querySelector('.kpi[data-key="coldCalls"] .value').textContent = data.coldCalls;
  document.querySelector('.kpi[data-key="appointments"] .value').textContent = data.appointments;
  document.querySelector('.kpi[data-key="lists"] .value').textContent = data.lists;
  document.querySelector('.kpi[data-key="avgCallDurationSec"] .value').textContent = Math.round(data.avgCallDurationSec);
  document.querySelector('.kpi[data-key="connectRate"] .value').textContent = (data.connectRate * 100).toFixed(0) + '%';
  document.getElementById('status-name').textContent = state.roster.find(r => r.id === state.selectedVaId).name;
  document.getElementById('status-online').textContent = 'Online';
  document.getElementById('status-updated').textContent = 'just now';
}
vaSelect.addEventListener('change', e => {
  engine.selectedVaId = e.target.value;
  updateUI();
});
document.querySelectorAll('.period-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.period-toggle .active').classList.remove('active');
    btn.classList.add('active');
    engine.period = btn.dataset.period;
    updateUI();
  });
});
document.getElementById('refresh-btn').addEventListener('click', () => {
  engine.tick();
  updateUI();
});
engine.tick();
updateUI();
setInterval(() => {
  engine.tick();
  updateUI();
}, 10000);
