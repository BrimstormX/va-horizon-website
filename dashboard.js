(function(){
  const root=document.getElementById('va-dashboard');
  if(!root) return;
  root.innerHTML=`<div class="top"><div class="status-dots"><span></span><span></span><span></span></div><h2>Horizon Command Center</h2><div class="live" aria-live="polite">Live Now</div></div><div class="controls"><select id="va-select" aria-label="Select VA"></select><div class="toggle" role="group" aria-label="Period"><button data-period="today" class="active">Today</button><button data-period="week">Week</button></div></div><div class="kpis"><div class="kpi" data-key="coldCalls"><div class="kpi-info"><span class="kpi-label">Cold Calls</span><svg class="spark" viewBox="0 0 80 24"></svg></div><div class="kpi-value"><span class="kpi-number">0</span><span class="trend"></span></div></div><div class="kpi" data-key="appointments"><div class="kpi-info"><span class="kpi-label">Appointments Set</span><svg class="spark" viewBox="0 0 80 24"></svg></div><div class="kpi-value"><span class="kpi-number appointments">0</span><span class="trend"></span></div></div><div class="kpi" data-key="lists"><div class="kpi-info"><span class="kpi-label">Lists Processed</span><svg class="spark" viewBox="0 0 80 24"></svg></div><div class="kpi-value"><span class="kpi-number">0</span><span class="trend"></span></div></div><div class="kpi" data-key="avgDuration"><div class="kpi-info"><span class="kpi-label">Avg Call Duration</span><svg class="spark" viewBox="0 0 80 24"></svg></div><div class="kpi-value"><span class="kpi-number">0</span><span class="trend"></span></div></div><div class="kpi" data-key="connectRate"><div class="kpi-info"><span class="kpi-label">Connect Rate</span><svg class="spark" viewBox="0 0 80 24"></svg></div><div class="kpi-value"><span class="kpi-number">0</span><span class="trend"></span></div></div></div><div class="timeline"><svg viewBox="0 0 600 40" preserveAspectRatio="none"></svg></div><div class="footer"><div class="status-text">Your VA: <span class="va-name"></span> • <span class="online-state"></span> • Updated <span class="last-update"></span></div><button id="refresh-btn" aria-label="Refresh">⟳</button></div>`;

  const roster=[
    {id:'sarah',name:'Sarah M.',shift:[9,17.5]},
    {id:'jamal',name:'Jamal R.',shift:[9,17.5]},
    {id:'elena',name:'Elena V.',shift:[9,17.5]},
    {id:'noah',name:'Noah P.',shift:[11,19.5]},
    {id:'priya',name:'Priya K.',shift:[9,17.5]},
    {id:'carlos',name:'Carlos D.',shift:[9,17.5]},
    {id:'maya',name:'Maya T.',shift:[9,17.5]},
    {id:'leo',name:'Leo S.',shift:[11,19.5]},
    {id:'aria',name:'Aria B.',shift:[9,17.5]},
    {id:'owen',name:'Owen K.',shift:[9,17.5]}
  ];

  const select=root.querySelector('#va-select');
  roster.forEach(v=>{const opt=document.createElement('option');opt.value=v.id;opt.textContent=v.name;select.appendChild(opt);});

  const state={selected:roster[0].id,period:'today',lastUpdated:Date.now(),};

  function storageKey(va){return `vaStats_${va.id}_${new Date().toISOString().slice(0,10)}`;}
  function weekKey(va){return `vaWeek_${va.id}`;}
  function loadStats(va){const key=storageKey(va);let stats=JSON.parse(localStorage.getItem(key));if(!stats){stats={coldCalls:0,appointments:0,lists:0,connects:0,avgDuration:0,series:{coldCalls:[],appointments:[],lists:[],avgDuration:[],connectRate:[]},timeline:[]};localStorage.setItem(key,JSON.stringify(stats));}return stats;}
  function saveStats(va,stats){localStorage.setItem(storageKey(va),JSON.stringify(stats));}

  function isOnline(va){const now=new Date();const h=now.getHours()+now.getMinutes()/60;const [start,end]=va.shift;return h>=start&&h<=end;}
  function rand(stats){let x=stats.seed||Date.now();x=Math.imul(48271,x)&0x7fffffff;stats.seed=x;return x/0x7fffffff;}
  function addSeries(arr,val){arr.push(val);if(arr.length>20)arr.shift();}
  function drawSpark(svg,data,color){const max=Math.max(...data,1);const step=80/(data.length-1||1);let d='';data.forEach((v,i)=>{const x=i*step;const y=24-(v/max)*24;d+= (i?'L':'M')+x+','+y;});svg.innerHTML=`<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;}
  function tween(el,newVal){const start=parseFloat(el.textContent)||0;const dur=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:200;const diff=newVal-start;let t0;function step(t){if(!t0)t0=t;const p=Math.min((t-t0)/dur,1);el.textContent=(start+diff*p).toFixed(el.classList.contains('rate')?2:0);if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}

  function render(){const va=roster.find(r=>r.id===state.selected);const stats=loadStats(va);const periodStats=state.period==='week'?computeWeek(va,stats):stats;root.querySelector('.va-name').textContent=va.name;root.querySelector('.online-state').textContent=isOnline(va)?'Online':'Offline';root.querySelector('.last-update').textContent=new Date(state.lastUpdated).toLocaleTimeString();['coldCalls','appointments','lists','avgDuration','connectRate'].forEach(key=>{const row=root.querySelector(`.kpi[data-key="${key}"]`);const num=row.querySelector('.kpi-number');const val=periodStats[key==='avgDuration'||key==='connectRate'?key:key]||0;tween(num,key==='connectRate'? +(periodStats.connectRate||0).toFixed(2):val);if(key==='connectRate')num.classList.add('rate');row.querySelector('.trend').textContent=trendText(va,key,stats);drawSpark(row.querySelector('.spark'),stats.series[key]||[],key==='appointments'?'#cfae70':'#fff');});drawTimeline(stats.timeline,va);}

  function trendText(va,key,stats){const wk=JSON.parse(localStorage.getItem(weekKey(va))||'[]');const yesterday=wk[wk.length-1];if(!yesterday)return '';const today=stats[key==='avgDuration'||key==='connectRate'?key:key];const prev=yesterday[key==='avgDuration'||key==='connectRate'?key:key]||0;const pct=prev?((today-prev)/prev*100).toFixed(0):0;return `${pct>=0?'+':''}${pct}% vs yesterday`;}

  function computeWeek(va,today){let wk=JSON.parse(localStorage.getItem(weekKey(va))||'[]');const totals={coldCalls:today.coldCalls,appointments:today.appointments,lists:today.lists,avgDuration:today.avgDuration,connectRate:today.connectRate};wk.forEach(d=>{totals.coldCalls+=d.coldCalls;totals.appointments+=d.appointments;totals.lists+=d.lists;});if(totals.coldCalls){totals.connectRate=(today.connects+wk.reduce((a,b)=>a+b.connects,0))/totals.coldCalls;}return totals;}

  function drawTimeline(events,va){const svg=root.querySelector('.timeline svg');const width=600;svg.setAttribute('viewBox',`0 0 ${width} 40`);let pips='';const [start,end]=va.shift;events.forEach(ev=>{const d=new Date(ev.t);const h=d.getHours()+d.getMinutes()/60;const x=(h-start)/(end-start)*width;const color=ev.type==='appointment'? '#cfae70':'#fff';pips+=`<circle cx="${x}" cy="20" r="3" fill="${color}"/>`;});svg.innerHTML=`<line x1="0" y1="20" x2="${width}" y2="20" stroke="rgba(255,255,255,.3)" stroke-width="2"/>${pips}`;}

  function tick(){const va=roster.find(r=>r.id===state.selected);let stats=loadStats(va);if(isOnline(va)){const c=Math.floor(rand(stats)*3);stats.coldCalls+=c;const conn=Math.min(c,Math.floor(rand(stats)*2));stats.connects+=conn;const ap=Math.min(conn,Math.floor(rand(stats)));stats.appointments+=ap;stats.lists+=Math.floor(rand(stats)*2);stats.avgDuration=Math.round(20+rand(stats)*40);stats.connectRate=stats.coldCalls?stats.connects/stats.coldCalls:0;addSeries(stats.series.coldCalls,stats.coldCalls);addSeries(stats.series.appointments,stats.appointments);addSeries(stats.series.lists,stats.lists);addSeries(stats.series.avgDuration,stats.avgDuration);addSeries(stats.series.connectRate,stats.connectRate);for(let i=0;i<c;i++)stats.timeline.push({t:Date.now(),type:'call'});for(let i=0;i<ap;i++)stats.timeline.push({t:Date.now(),type:'appointment'});stats.timeline=stats.timeline.slice(-100);}
  state.lastUpdated=Date.now();saveStats(va,stats);render();}

  function midnightCheck(){const va=roster.find(r=>r.id===state.selected);const key=storageKey(va);const storedKey=localStorage.getItem('vaStats_current_'+va.id);if(storedKey&&storedKey!==key){const oldStats=JSON.parse(localStorage.getItem(storedKey)||'null');if(oldStats){let wk=JSON.parse(localStorage.getItem(weekKey(va))||'[]');wk.push({coldCalls:oldStats.coldCalls,appointments:oldStats.appointments,lists:oldStats.lists,connects:oldStats.connects,avgDuration:oldStats.avgDuration,connectRate:oldStats.connectRate});wk=wk.slice(-7);localStorage.setItem(weekKey(va),JSON.stringify(wk));}localStorage.setItem('vaStats_current_'+va.id,key);localStorage.removeItem(key);}}

  select.addEventListener('change',e=>{state.selected=e.target.value;render();});
  root.querySelectorAll('.toggle button').forEach(btn=>btn.addEventListener('click',()=>{state.period=btn.dataset.period;root.querySelectorAll('.toggle button').forEach(b=>b.classList.toggle('active',b===btn));render();}));
  root.querySelector('#refresh-btn').addEventListener('click',()=>{tick();});

  setInterval(()=>{midnightCheck();tick();},10000);
  tick();
})();
