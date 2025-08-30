(()=>{
  const vas = Array.from({length:10}, (_,i)=>({
    name:`VA ${i+1}`,
    stats:{tasks:0,calls:0,hours:0}
  }));

  const container = document.querySelector('.dashboard .bg-white');
  if(!container) return;

  container.innerHTML = `
    <div class="va-header flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <span class="status-dot"></span>
        <span class="status-text">Updated just now</span>
      </div>
      <button class="next-btn btn btn-secondary">Next Assistant</button>
    </div>
    <h3 class="va-name text-xl font-bold mb-2"></h3>
    <ul class="va-stats space-y-2">
      <li class="stat-row flex justify-between" data-key="tasks"><span>Tasks</span><span class="value">0</span></li>
      <li class="stat-row flex justify-between" data-key="calls"><span>Calls</span><span class="value">0</span></li>
      <li class="stat-row flex justify-between" data-key="hours"><span>Hours</span><span class="value">0</span></li>
    </ul>
    <div class="offline hidden text-sm mt-2">Offline - retrying...</div>
  `;

  const nameEl = container.querySelector('.va-name');
  const statRows = Array.from(container.querySelectorAll('.stat-row'));
  const statusText = container.querySelector('.status-text');
  const offlineNotice = container.querySelector('.offline');
  const nextBtn = container.querySelector('.next-btn');

  let current = parseInt(localStorage.getItem('vaIndex')||'0',10);
  let timers = {};

  function renderVA(){
    const va = vas[current];
    nameEl.textContent = va.name + ' – Top Achiever';
    statRows.forEach(r=>{
      const key = r.dataset.key;
      r.querySelector('.value').textContent = va.stats[key];
    });
  }

  function tween(el,start,end){
    if(timers[el]) cancelAnimationFrame(timers[el]);
    const dur=500;
    const startTime=performance.now();
    function step(now){
      const p=Math.min((now-startTime)/dur,1);
      const val=Math.floor(start+(end-start)*p);
      el.textContent=val;
      if(p<1) timers[el]=requestAnimationFrame(step);
    }
    timers[el]=requestAnimationFrame(step);
  }

  function updateStats(){
    try{
      vas.forEach(va=>{
        Object.keys(va.stats).forEach(k=>{
          const inc=Math.floor(Math.random()*3);
          const old=va.stats[k];
          const nu=old+inc;
          va.stats[k]=nu;
          if(va===vas[current]){
            const el=container.querySelector(`.stat-row[data-key="${k}"] .value`);
            tween(el,old,nu);
          }
        });
      });
      statusText.textContent='Updated just now';
      offlineNotice.classList.add('hidden');
    }catch(e){
      offlineNotice.classList.remove('hidden');
    }
  }

  function resetAtMidnight(){
    const now=new Date();
    const msTillMidnight=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1).getTime()-now.getTime();
    setTimeout(()=>{
      vas.forEach(va=>{Object.keys(va.stats).forEach(k=>va.stats[k]=0);});
      renderVA();
      resetAtMidnight();
    },msTillMidnight);
  }

  nextBtn.addEventListener('click',()=>{
    current=(current+1)%vas.length;
    localStorage.setItem('vaIndex',current);
    container.querySelector('.va-stats').classList.add('slide');
    setTimeout(()=>container.querySelector('.va-stats').classList.remove('slide'),300);
    renderVA();
  });

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      clearInterval(interval);
    }else{
      interval=setInterval(updateStats,5000);
    }
  });

  renderVA();
  let interval=setInterval(updateStats,5000);
  resetAtMidnight();
})();
