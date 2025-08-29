// Seed data and live simulator for VA dashboard
// Each VA has basic metrics and rolling history arrays used for sparklines.
// startLiveSimulation(onTick) mutates the metrics in place every 30s and
// calls onTick with an updated snapshot including aggregate totals + deltas.

export const VAs = [
  {
    id: "va-sarah",
    name: "Sarah M.",
    avatar: null,
    timezone: "America/Chicago",
    status: "active",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 64, appts: 2, lists: 1, talkMin: 28, connects: 8 },
    history: { callsHourly: Array(12).fill(0), connectsHourly: Array(12).fill(0) }
  },
  {
    id: "va-samir",
    name: "Samir Khaled",
    avatar: null,
    timezone: "America/New_York",
    status: "active",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 58, appts: 1, lists: 1, talkMin: 24, connects: 7 },
    history: { callsHourly: Array(12).fill(0), connectsHourly: Array(12).fill(0) }
  },
  {
    id: "va-jessica",
    name: "Jessica R.",
    avatar: null,
    timezone: "America/Denver",
    status: "idle",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 42, appts: 1, lists: 1, talkMin: 19, connects: 6 },
    history: { callsHourly: Array(12).fill(0), connectsHourly: Array(12).fill(0) }
  },
  {
    id: "va-mike",
    name: "Mike Chen",
    avatar: null,
    timezone: "America/Los_Angeles",
    status: "active",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 70, appts: 3, lists: 1, talkMin: 35, connects: 10 },
    history: { callsHourly: Array(12).fill(0), connectsHourly: Array(12).fill(0) }
  },
  {
    id: "va-david",
    name: "David T.",
    avatar: null,
    timezone: "America/Chicago",
    status: "offline",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 12, appts: 0, lists: 0, talkMin: 6, connects: 1 },
    history: { callsHourly: Array(12).fill(0), connectsHourly: Array(12).fill(0) }
  }
];

function computeTotals(vs){
  return vs.reduce((acc,va)=>{
    acc.calls += va.metrics.calls;
    acc.appts += va.metrics.appts;
    acc.lists += va.metrics.lists;
    return acc;
  },{calls:0,appts:0,lists:0});
}

export function startLiveSimulation(onTick){
  let prevTotals = computeTotals(VAs);
  onTick({ VAs, totals: prevTotals, deltas:{calls:0, appts:0, lists:0} });
  setInterval(()=>{
    for(const va of VAs){
      if(va.status === 'offline') continue;
      const callInc = Math.floor(Math.random()*5); // 0-4
      va.metrics.calls += callInc;
      va.metrics.talkMin += callInc ? Math.round(callInc*(1+Math.random()*3)) : 0;
      const apptInc = Math.random() < 0.1 ? 1 : 0;
      va.metrics.appts += apptInc;
      const listInc = Math.random() < 0.05 ? 1 : 0;
      va.metrics.lists += listInc;
      const connInc = Math.random() < 0.3 ? 1 : 0;
      va.metrics.connects += connInc;
      va.history.callsHourly.push(callInc);
      if(va.history.callsHourly.length>12) va.history.callsHourly.shift();
      va.history.connectsHourly.push(connInc);
      if(va.history.connectsHourly.length>12) va.history.connectsHourly.shift();
    }
    const totals = computeTotals(VAs);
    const deltas = {
      calls: totals.calls - prevTotals.calls,
      appts: totals.appts - prevTotals.appts,
      lists: totals.lists - prevTotals.lists
    };
    prevTotals = { ...totals };
    onTick({ VAs, totals, deltas });
  },30000);
}
