/*
 * VA Horizon Live Dashboard
 * -------------------------
 * Minimal vanilla JS implementation of the hero dashboard. Data comes from
 * /assets/dashboard-data.js and is simulated client-side. To add or remove
 * VAs, edit that file. Simulation cadence (30s) and increments can also be
 * tuned there.
 */

import { VAs, startLiveSimulation } from './dashboard-data.js';

const state = {
  sort: { field: 'calls', dir: 'desc' },
  status: 'all',
  search: '',
  range: 'today',
  data: VAs,
  totals: { calls:0, appts:0, lists:0 },
  deltas: { calls:0, appts:0, lists:0 }
};

const root = document.getElementById('va-dashboard');

// lightweight styles for flash highlight
const style = document.createElement('style');
style.textContent = `
.change-flash{position:relative;}
.change-flash::after{content:"";position:absolute;inset:0;background:rgba(207,174,112,.25);opacity:0;transition:opacity .6s;pointer-events:none;border-radius:inherit;}
.change-flash.active::after{opacity:1;}
`;
document.head.appendChild(style);

function formatTime(tz){
  try {
    return new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZone:tz});
  } catch { return ''; }
}

function render(){
  root.innerHTML = '';
  const header = renderHeader();
  const list = document.createElement('div');
  list.className = 'mt-4 grid sm:grid-cols-2 gap-4';
  list.id = 'va-list';
  root.appendChild(header);
  root.appendChild(list);
  renderTotals();
  renderVAList();
}

function renderHeader(){
  const wrap = document.createElement('div');
  wrap.className = 'mb-4';
  wrap.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <div class="flex gap-2" role="group" aria-label="Sort">
        <button data-sort="name" class="px-2 py-1 text-xs rounded border border-va-divider">Name</button>
        <button data-sort="calls" class="px-2 py-1 text-xs rounded border border-va-divider">Calls</button>
        <button data-sort="appts" class="px-2 py-1 text-xs rounded border border-va-divider">Appointments</button>
      </div>
      <div class="flex gap-2" role="group" aria-label="Status">
        <button data-status="all" class="px-2 py-1 text-xs rounded border border-va-divider">All</button>
        <button data-status="active" class="px-2 py-1 text-xs rounded border border-va-divider">Active</button>
        <button data-status="idle" class="px-2 py-1 text-xs rounded border border-va-divider">Idle</button>
        <button data-status="offline" class="px-2 py-1 text-xs rounded border border-va-divider">Offline</button>
      </div>
    </div>
    <div class="flex items-center gap-2 mb-4">
      <input type="text" placeholder="Search VA by name" class="flex-1 px-3 py-2 border border-va-divider rounded" id="va-search" />
      <div id="totals" class="flex gap-2"></div>
    </div>`;
  wrap.addEventListener('click',e=>{
    const sort = e.target.getAttribute('data-sort');
    if(sort){
      if(state.sort.field===sort){state.sort.dir = state.sort.dir==='asc'?'desc':'asc';}
      else{state.sort={field:sort,dir:sort==='name'?'asc':'desc'};}
      renderVAList();
    }
    const st = e.target.getAttribute('data-status');
    if(st){ state.status = st; renderVAList(); }
  });
  wrap.querySelector('#va-search').addEventListener('input',e=>{
    state.search = e.target.value.toLowerCase();
    renderVAList();
  });
  return wrap;
}

function renderTotals(){
  const tot = root.querySelector('#totals');
  tot.innerHTML = `
    ${renderTotalChip('Cold Calls', state.totals.calls, state.deltas.calls)}
    ${renderTotalChip('Appointments', state.totals.appts, state.deltas.appts)}
    ${renderTotalChip('Lists', state.totals.lists, state.deltas.lists)}
  `;
}
function renderTotalChip(label,val,delta){
  const color = delta>0?'text-green-600':delta<0?'text-red-600':'text-gray-400';
  const arrow = delta>0?'\u25B2':delta<0?'\u25BC':'';
  return `<div class="rounded-lg bg-va-smoke px-3 py-2 text-xs" aria-live="polite">${label}: <span class="font-bold">${val}</span> <span class="${color}">${arrow} ${Math.abs(delta)}</span></div>`;
}

function renderVAList(){
  const list = document.getElementById('va-list');
  let v = state.data.slice();
  if(state.status!=='all') v = v.filter(x=>x.status===state.status);
  if(state.search) v = v.filter(x=>x.name.toLowerCase().includes(state.search));
  v.sort((a,b)=>{
    const dir = state.sort.dir==='asc'?1:-1;
    if(state.sort.field==='name') return a.name.localeCompare(b.name)*dir;
    return (b.metrics[state.sort.field]-a.metrics[state.sort.field])*dir;
  });
  if(!v.length){
    list.innerHTML='<div class="p-6 text-center text-sm text-gray-500 border border-va-divider rounded">No team members match your filters</div>';
    return;
  }
  const frag=document.createDocumentFragment();
  for(const va of v){
    let card=list.querySelector(`[data-va="${va.id}"]`);
    if(!card) card=renderCard(va);
    frag.appendChild(card);
  }
  list.innerHTML="";
  list.appendChild(frag);
}

function renderCard(va){
  const card = document.createElement('div');
  card.setAttribute('data-va', va.id);
  card.className='va-card group relative rounded-xl border border-va-divider bg-white shadow-sm hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-[--va-gold]';
  card.innerHTML = `
    <button class="absolute inset-0" aria-label="Open details for ${va.name}" aria-expanded="false" aria-controls="details-${va.id}" tabindex="-1"></button>
    <div class="p-4">
      <div class="flex items-center gap-3">
        ${renderAvatar(va)}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-semibold text-va-navy truncate">${va.name}</h3>
            <span class="inline-flex items-center gap-1 text-xs">${renderStatus(va.status)}</span>
          </div>
          <div class="text-xs text-gray-500" title="${va.timezone}">Local ${formatTime(va.timezone)}</div>
        </div>
        <div class="text-xs text-gray-500">Goal: ${va.goals.calls}</div>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-3">
        ${kpiTile('Cold Calls','calls',va)}
        ${kpiTile('Appointments','appts',va)}
        ${simpleTile('Talk Time','talkMin',va,'min')}
        ${simpleTile('Conversion','conv',va,'%',true)}
      </div>
      <div class="mt-4">
        <svg class="w-full h-10 text-[--va-gold]" viewBox="0 0 100 20" aria-hidden="true"><path class="stroke-current fill-none" stroke-width="1.5" d="${sparkPath(va.history.callsHourly)}"/></svg>
      </div>
    </div>
    <div id="details-${va.id}" class="grid transition-[grid-template-rows] duration-400 ease-out [grid-template-rows:0fr]">
      <div class="overflow-hidden">
        <div class="px-4 pb-4 text-sm text-gray-700">
          <p class="mb-2 font-medium">Last outcomes:</p>
          <div class="flex flex-wrap gap-1">${['No Answer','Voicemail','Connected','Qualified'].map(o=>`<span class='px-2 py-1 bg-va-smoke rounded text-xs'>${o}</span>`).join('')}</div>
        </div>
      </div>
    </div>`;
  card.querySelector('button').addEventListener('click',()=>toggleDetails(card));
  return card;
}

function renderAvatar(va){
  if(va.avatar) return `<img src="${va.avatar}" alt="" class="h-10 w-10 rounded-full"/>`;
  const initials = va.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  return `<div class="h-10 w-10 rounded-full bg-va-smoke flex items-center justify-center font-semibold text-va-navy">${initials}</div>`;
}
function renderStatus(status){
  const map={active:'bg-green-500',idle:'bg-yellow-400',offline:'bg-red-500'};
  const label=status.charAt(0).toUpperCase()+status.slice(1);
  return `<span class="h-2.5 w-2.5 rounded-full ${map[status]} shadow-[0_0_0_3px_rgba(16,185,129,.15)]"></span><span class="text-gray-500">${label}</span>`;
}
function kpiTile(label,key,va){
  const val = va.metrics[key];
  const pct = Math.min(100, Math.round((val/va.goals.calls)*100));
  return `<div class="rounded-lg bg-gradient-to-b from-white to-[#F7F9FC] p-3 border border-va-divider change-flash">
      <div class="flex items-center justify-between"><span class="text-xs text-gray-500">${label}</span></div>
      <div class="mt-1 text-2xl font-bold text-va-navy kpi-${key}" aria-live="polite">${val}</div>
      <div class="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden"><div class="h-full bg-[--va-gold] w-[${pct}%] transition-[width] duration-500 progress-${key}"></div></div>
    </div>`;
}
function simpleTile(label,key,va,suffix="",isPct){
  let val;
  if(key==='conv'){
    val = va.metrics.connects? Math.round(va.metrics.appts/va.metrics.connects*100):0;
  }else val = va.metrics[key];
  return `<div class="rounded-lg bg-gradient-to-b from-white to-[#F7F9FC] p-3 border border-va-divider change-flash">
      <div class="flex items-center justify-between"><span class="text-xs text-gray-500">${label}</span><span class="text-[10px] font-medium text-gray-400">${suffix}</span></div>
      <div class="mt-1 text-2xl font-bold text-va-navy kpi-${key}" aria-live="polite">${val}${isPct?'%':''}</div>
    </div>`;
}
function sparkPath(arr){
  const max=Math.max(...arr,1); const step=100/(arr.length-1); let d=`M0 ${20-(arr[0]/max)*20}`; arr.forEach((v,i)=>{if(i>0)d+=` L${i*step} ${20-(v/max)*20}`}); return d;
}


function countTo(el, to, suffix=''){
  const from = Number(el.textContent.replace(/[^0-9]/g,'')) || 0;
  const start = performance.now();
  const dur = 350;
  function frame(t){
    const p = Math.min((t-start)/dur,1);
    const val = Math.round(from + (to-from)*(1-Math.pow(1-p,3)));
    el.textContent = suffix ? `${val}${suffix}` : val;
    if(p<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function flash(el){
  if(!el) return;
  el.classList.add('active');
  setTimeout(()=>el.classList.remove('active'),600);
}
function toggleDetails(card){
  const btn = card.querySelector('button');
  const drawer = card.querySelector('[id^="details-"]');
  const expanded = btn.getAttribute('aria-expanded')==='true';
  btn.setAttribute('aria-expanded', !expanded);
  drawer.style.gridTemplateRows = expanded? '0fr':'1fr';
}


function patch(update){
  state.data = update.VAs;
  state.totals = update.totals;
  state.deltas = update.deltas;
  renderTotals();
  renderVAList();
  for(const va of update.VAs){
    const card=document.querySelector(`[data-va='${va.id}']`);
    if(!card) continue;
    const callsEl=card.querySelector('.kpi-calls');
    countTo(callsEl, va.metrics.calls);
    card.querySelector('.progress-calls').style.width = `${Math.min(100, Math.round(va.metrics.calls/va.goals.calls*100))}%`;
    flash(callsEl.closest('.change-flash'));
    const apptEl=card.querySelector('.kpi-appts');
    countTo(apptEl, va.metrics.appts);
    card.querySelector('.progress-appts').style.width = `${Math.min(100, Math.round(va.metrics.appts/va.goals.appts*100))}%`;
    flash(apptEl.closest('.change-flash'));
    const talkEl=card.querySelector('.kpi-talkMin');
    countTo(talkEl, va.metrics.talkMin);
    flash(talkEl.closest('.change-flash'));
    const convVal=va.metrics.connects? Math.round(va.metrics.appts/va.metrics.connects*100):0;
    const convEl=card.querySelector('.kpi-conv');
    countTo(convEl, convVal,'%');
    flash(convEl.closest('.change-flash'));
  }
}


function init(){
  render();
  startLiveSimulation(patch);
}

document.addEventListener('DOMContentLoaded',init);
