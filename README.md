const T={ticket:'Log a Ticket',home:'Home',about:'About',services:'Services',team:'Team',dashboard:'Dashboard',contact:'Contact'};
let charted=false;
function route(){
  let r=(location.hash||'#home').slice(1); if(!T[r]) r='home';
  document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!=='v-'+r);
  document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+r));
  document.title=T[r]+' | Zart IT Network Solutions'; scrollTo(0,0);
  if(r==='dashboard'&&!charted){charted=true;charts();}
}
addEventListener('hashchange',route);route();
function charts(){
  if(!window.Chart){document.getElementById('chartnote').textContent='Charts could not load. Check your internet connection and refresh.';return;}
  const o={responsive:true,maintainAspectRatio:false};
  new Chart(caseResolution,{type:'line',data:{labels:['Jan','Feb','Mar','Apr','May'],datasets:[{label:'Resolved',data:[12,19,15,22,18],borderColor:'#16804a'},{label:'Open',data:[8,12,10,14,9],borderColor:'#0879c9'},{label:'Pending',data:[5,7,6,8,4],borderColor:'#e49a20'}]},options:o});
  new Chart(hardwareStatus,{type:'pie',data:{labels:['Replace','Keep'],datasets:[{data:[31,72],backgroundColor:['#d94a4a','#8996a8']}]},options:o});
  new Chart(changeRequests,{type:'bar',data:{labels:['Approved','Declined'],datasets:[{label:'Requests',data:[30,10],backgroundColor:['#16804a','#d94a4a']}]},options:o});
  new Chart(ticketsCategory,{type:'bar',data:{labels:['Printer','Hardware','Network','Software'],datasets:[{label:'Tickets',data:[15,30,25,35],backgroundColor:['#8665b5','#0879c9','#e49a20','#168b83']}]},options:{...o,indexAxis:'y'}});
}
const $=i=>document.getElementById(i);
const load=()=>{try{return JSON.parse(localStorage.getItem('zart-tickets')||'[]')}catch(e){return[]}};
const save=a=>{try{localStorage.setItem('zart-tickets',JSON.stringify(a));return true}catch(e){return false}};

const LEVELS=[
{k:'Critical',d:'Service or system is down and many users or core business operations are stopped.'},
{k:'High',d:'A major function is seriously degraded, or a key user or team cannot work.'},
{k:'Medium',d:'A problem affects one user or has a workaround, but work is slowed.'},
{k:'Low',d:'A minor issue, question or request that does not block work.'}];
const SLA={Critical:'',High:'',Medium:'',Low:''}; // add response/resolution targets from the SLA here, e.g. 'Respond within 1 hour'
levels.innerHTML=LEVELS.map((l,i)=>`<label class="lv"><input type="radio" name="lvl" value="${l.k}" ${i==2?'checked':''} form="tk"><span><strong>${l.k}</strong><br><span class="note">${l.d}<br>Target: ${SLA[l.k]||'To be confirmed per SLA'}</span></span></label>`).join('');
tk.addEventListener('submit',e=>{
  e.preventDefault();
  const a=load(),id='ZT-'+(1001+a.length+Math.floor(Math.random()*90)),lv=document.querySelector('input[name=lvl]:checked').value;
  const ok=save([...a,{id,name:$('tn').value,subject:$('tc').value+' ticket',level:lv,date:new Date().toLocaleString()}]);
  tdone.hidden=false;tdone.textContent='';
  const s=document.createElement('strong');s.textContent='Ticket logged. Reference: '+id+' | Priority: '+lv;
  tdone.append(s,document.createElement('br'),'Thank you, '+$('tn').value+'. Use this reference on the Contact page to check your ticket.'+(ok?'':' (Reference could not be saved in this browser.)'));
  tk.reset();
});

enq.addEventListener('submit',e=>{
  e.preventDefault();
  const a=load(),id='ZT-'+(1001+a.length+Math.floor(Math.random()*90));
  const stored=save([...a,{id,name:$('name').value,subject:subject.value,date:new Date().toLocaleString()}]);
  done.hidden=false;done.textContent='';
  const s=document.createElement('strong');s.textContent='Enquiry registered. Reference: '+id;
  done.append(s,document.createElement('br'),'Thank you, '+$('name').value+'. Our team will follow up by email.'+(stored?'':' (Reference could not be saved in this browser.)'));
  enq.reset();
});
look.addEventListener('submit',e=>{
  e.preventDefault();
  const t=load().find(x=>x.id.toLowerCase()===ref.value.trim().toLowerCase());
  res.textContent=t?t.id+' ('+t.subject+(t.level?', '+t.level+' priority':'')+') was registered on '+t.date+'. Status: Registered, awaiting initial assessment.':'No enquiry with that reference was found in this browser.';
});
