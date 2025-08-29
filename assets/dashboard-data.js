export const VAs = [
  {
    id: "va-sarah",
    name: "Sarah M.",
    avatar: null,
    timezone: "America/Chicago",
    status: "active",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 64, appts: 2, lists: 0, talkMin: 28, connects: 8 },
    history: {
      callsHourly: Array.from({ length: 12 }, () => 5 + Math.floor(Math.random() * 8)),
      connectsHourly: Array.from({ length: 12 }, () => 1 + Math.floor(Math.random() * 4))
    }
  },
  {
    id: "va-samir",
    name: "Samir Khaled",
    avatar: null,
    timezone: "America/New_York",
    status: "active",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 58, appts: 1, lists: 0, talkMin: 24, connects: 7 },
    history: {
      callsHourly: Array.from({ length: 12 }, () => 4 + Math.floor(Math.random() * 7)),
      connectsHourly: Array.from({ length: 12 }, () => 1 + Math.floor(Math.random() * 3))
    }
  },
  {
    id: "va-jessica",
    name: "Jessica R.",
    avatar: null,
    timezone: "America/Denver",
    status: "idle",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 42, appts: 1, lists: 0, talkMin: 19, connects: 6 },
    history: {
      callsHourly: Array.from({ length: 12 }, () => 3 + Math.floor(Math.random() * 6)),
      connectsHourly: Array.from({ length: 12 }, () => 1 + Math.floor(Math.random() * 3))
    }
  },
  {
    id: "va-mike",
    name: "Mike Chen",
    avatar: null,
    timezone: "America/Los_Angeles",
    status: "active",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 70, appts: 3, lists: 0, talkMin: 35, connects: 10 },
    history: {
      callsHourly: Array.from({ length: 12 }, () => 6 + Math.floor(Math.random() * 9)),
      connectsHourly: Array.from({ length: 12 }, () => 2 + Math.floor(Math.random() * 4))
    }
  },
  {
    id: "va-david",
    name: "David T.",
    avatar: null,
    timezone: "America/Phoenix",
    status: "offline",
    goals: { calls: 200, appts: 4, lists: 2 },
    metrics: { calls: 12, appts: 0, lists: 0, talkMin: 6, connects: 1 },
    history: {
      callsHourly: Array.from({ length: 12 }, () => Math.floor(Math.random() * 3)),
      connectsHourly: Array.from({ length: 12 }, () => Math.floor(Math.random() * 2))
    }
  }
];

function computeTotals() {
  return VAs.reduce(
    (acc, va) => {
      acc.calls += va.metrics.calls;
      acc.appts += va.metrics.appts;
      acc.lists += va.metrics.lists;
      return acc;
    },
    { calls: 0, appts: 0, lists: 0 }
  );
}

let prevTotals = computeTotals();

export function startLiveSimulation(onTick, interval = 30000) {
  function tick() {
    VAs.forEach((va) => {
      if (va.status === "offline") return;
      const callInc = Math.floor(Math.random() * 4);
      va.metrics.calls += callInc;
      va.metrics.talkMin += Math.floor(callInc * 0.5);
      if (Math.random() < 0.1) va.metrics.appts += 1;
      if (Math.random() < 0.05) va.metrics.lists += 1;
      if (Math.random() < 0.6) va.metrics.connects += 1;
      va.history.callsHourly.push(callInc);
      va.history.connectsHourly.push(Math.floor(Math.random() * 2));
      if (va.history.callsHourly.length > 12) va.history.callsHourly.shift();
      if (va.history.connectsHourly.length > 12) va.history.connectsHourly.shift();
    });
    const totals = computeTotals();
    const delta = {
      calls: totals.calls - prevTotals.calls,
      appts: totals.appts - prevTotals.appts,
      lists: totals.lists - prevTotals.lists
    };
    prevTotals = { ...totals };
    onTick({ vas: VAs, totals, delta });
  }
  tick();
  setInterval(tick, interval);
}

export default { VAs, startLiveSimulation };

