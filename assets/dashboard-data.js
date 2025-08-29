export const VAs = [
  { id: 'va-sarah',  name: 'Sarah M.',        status: 'active',  metrics: { calls: 64, appts: 2, lists: 0 } },
  { id: 'va-samir',  name: 'Samir Khaled',    status: 'active',  metrics: { calls: 58, appts: 1, lists: 0 } },
  { id: 'va-jessica',name: 'Jessica R.',      status: 'idle',    metrics: { calls: 42, appts: 1, lists: 0 } },
  { id: 'va-mike',   name: 'Mike Chen',       status: 'active',  metrics: { calls: 70, appts: 3, lists: 0 } },
  { id: 'va-david',  name: 'David T.',        status: 'offline', metrics: { calls: 12, appts: 0, lists: 0 } }
];

/**
 * Starts a tiny fake simulation that bumps metrics every 30s.
 * @param {(vas: typeof VAs) => void} onTick
 * @param {number} interval
 */
export function startLiveSimulation(onTick, interval = 30000) {
  function tick() {
    VAs.forEach((va) => {
      if (va.status === 'offline') return;
      va.metrics.calls += Math.floor(Math.random() * 3);
      if (Math.random() < 0.1) va.metrics.appts += 1;
      if (Math.random() < 0.05) va.metrics.lists += 1;
    });
    onTick(VAs);
  }
  tick();
  setInterval(tick, interval);
}
