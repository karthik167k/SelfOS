const $=s=>document.querySelector(s),K="selfos_v1";
const key=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const C={fit:["Fitness","💪"],skl:["Skills","💻"],std:["Study","🎓"],rd:["Reading","📖"],gr:["Growth","🌱"],cu:["Custom","⭐"]};
const DN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],ALL=[0,1,2,3,4,5,6];
const T=(id,name,time,cat,min)=>({id,name,time,cat,min,days:ALL,on:true});
const DEF=()=>({u:null,areas:[],tasks:[T(1,"Wake up & drink water","05:00","gr",5),T(2,"Morning run","05:30","fit",40),T(3,"Push-ups, squats & crunches","06:15","fit",30),T(4,"Read Bhagavad Gita","07:20","rd",20),T(5,"Evening calisthenics & combat","17:30","fit",60),T(6,"Edit & upload clips","20:00","skl",60),T(7,"Sleep by 10:30 PM","22:30","gr",0)],log:{},nx:8,fx:true,nt:false});
let S=DEF();

const sb=supabase.createClient(CFG.url,CFG.key);
let SES=null,READY=false,pt;const AF={mode:"in",email:"",pw:"",msg:""};
const save=()=>{try{localStorage.setItem(K+(SES?SES.user.id:""),JSON.stringify(S))}catch(e){}clearTimeout(pt);pt=setTimeout(push,800)};
let V="home",M=0,R="week",RS=0,F={cat:"fit",days:[1,2,3,4,5,6,0],name:"",time:"06:00",min:30,wn:""};
const LOGO='<svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 2 1.5 21h5.2L12 11.2l5.3 9.8h5.2z" fill="#b4f12a"/></svg>';
const act=d=>S.tasks.filter(t=>t.on&&t.days.includes(d.getDay()));
const ok=i=>S.tasks.some(t=>t.id===i);
const dn=d=>(S.log[key(d)]||[]).filter(ok).length;
const sc=d=>{const n=act(d).length;return n?Math.min(100,Math.round(dn(d)/n*100)):0};
const cnt=()=>Object.keys(S.log).reduce((a,k)=>a+S.log[k].filter(ok).length,0);
const ago=n=>{const d=new Date();d.setDate(d.getDate()-n);return d};
const streak=()=>{let n=0,i=sc(ago(0))>=50?0:1;while(sc(ago(i))>=50){n++;i++}return n};
const best=()=>{let b=0,r=0,p=null;Object.keys(S.log).sort().forEach(k=>{if(sc(new Date(k+"T12:00:00"))<50){r=0;p=null;return}r=p&&Math.round((new Date(k)-new Date(p))/864e5)===1?r+1:1;p=k;b=Math.max(b,r)});return b};
const xp=()=>cnt()*20,lv=()=>Math.floor(xp()/200)+1,TT=["Rookie","Starter","Consistency Builder","Disciplined","Warrior","Legend"];
const toast=m=>{const t=$("#ts");t.textContent=m;t.classList.add("s");clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove("s"),1700)};
function burst(x,y){for(let i=0;i<22;i++){const e=document.createElement("i");e.className="cf";e.style.cssText="left:"+x+"px;top:"+y+"px;background:hsl("+(70+Math.random()*50)+",90%,"+(50+Math.random()*30)+"%);--dx:"+(Math.random()-.5)*260+"px;--dy:"+(-Math.random()*210-30)+"px;--rt:"+Math.random()*720+"deg";document.body.appendChild(e);setTimeout(()=>e.remove(),950)}}
function toggle(id,e){const k=key(new Date()),a=S.log[k]||[],on=a.includes(id),l0=lv();S.log[k]=on?a.filter(i=>i!==id):[...a,id];save();render();if(on)return;
 if(S.fx)burst(e.clientX,e.clientY);toast(lv()>l0?"Level up! 🎉":sc(new Date())===100?"Perfect day! 💯":"+20 XP ⚡")}
const ring=(p,s,t,u)=>{const r=s/2-8,c=2*Math.PI*r;return `<div class="rg" style="width:${s}px;height:${s}px"><svg width="${s}" height="${s}" style="transform:rotate(-90deg)"><circle cx="${s/2}" cy="${s/2}" r="${r}" fill="none" stroke="#1a2620" stroke-width="9"/><circle cx="${s/2}" cy="${s/2}" r="${r}" fill="none" stroke="#b4f12a" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p/100)}"/></svg><div class="rt"><b>${t}</b><small>${u||""}</small></div></div>`};
const hd=(t,s,r)=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><h2>${t}</h2><div class="s" style="margin-top:3px">${s}</div></div>${r||""}</div>`;

const home=()=>{const d=new Date(),h=d.getHours(),tk=key(d),X=xp()%200,mon=ago((d.getDay()+6)%7),st=streak(),s=sc(d),t=act(d).sort((a,b)=>a.time.localeCompare(b.time)),dd=t.filter(x=>(S.log[tk]||[]).includes(x.id)).length;
 const wk=[0,1,2,3,4,5,6].map(i=>{const x=new Date(mon);x.setDate(mon.getDate()+i);const k=key(x);return `<div class="dy ${k===tk?"t":""}"><span>${DN[x.getDay()]}</span><b>${x.getDate()}</b><i class="dt ${sc(x)>=50?"y":k<tk?"n":""}"></i></div>`}).join("");
 const rows=t.map(x=>{const on=(S.log[tk]||[]).includes(x.id);return `<div class="r ${on?"on":""}"><button class="ck" data-a="chk" data-v="${x.id}">${on?"✓":""}</button><div class="n">${esc(x.name)}<small>${x.time}${x.min?" · "+x.min+" min":""}</small></div><span>${C[x.cat][1]}</span></div>`}).join("")||'<div class="s">No tasks today. Create a routine!</div>';
 return hd(`${h<12?"Good morning":h<17?"Good afternoon":"Good evening"}, ${esc(S.u.name)} ☀️`,"Your consistency is building your future.",`<button class="av" data-a="nav" data-v="profile">${esc((S.u.name[0]||"U").toUpperCase())}</button>`)+
 `<div class="gr"><div class="c"><div class="l">Daily Score</div>${ring(s,112,s,"/100")}</div>
 <div class="c"><div class="l">🔥 Streak</div><div class="big">${st}</div><div class="s" style="margin-top:6px">${st===1?"Day":"Days"} · ${st?"Keep going!":"Start today"}</div></div>
 <div class="c w"><div class="l">Level ${lv()}</div><div style="font-weight:700">${TT[Math.min(5,lv()-1)]}</div><div class="bar" style="margin:10px 0 6px"><i style="width:${X/2}%"></i></div><div class="s">${xp()} XP · ${X} / 200 to next level</div></div>
 <div class="c w"><div style="display:flex;justify-content:space-between"><div class="l">Today's Routine</div><span class="s">${dd}/${t.length} completed</span></div>${rows}</div>
 <div class="c w"><div class="l">Weekly Calendar</div><div class="cal">${wk}</div></div>
 <div class="c w" style="background:linear-gradient(110deg,#0c1411 45%,rgba(180,241,42,.2))"><b>“Better than yesterday.”</b> <span class="s">— SelfOS</span></div></div>`};

const routines=()=>hd("My Routines","Create and manage your daily routines.",'<button class="bt" data-a="nav" data-v="create">+ Create</button>')+'<div style="margin-top:14px">'+S.tasks.map(t=>`<div class="c" style="display:flex;align-items:center;gap:12px;margin-bottom:10px"><div class="ic">${C[t.cat][1]}</div><div class="n">${esc(t.name)}<small><span class="ch">${C[t.cat][0]}</span>⏰ ${t.time} · ${t.days.length===7?"Every day":[1,2,3,4,5,6,0].filter(i=>t.days.includes(i)).map(i=>DN[i]).join(", ")}</small></div><button class="sw ${t.on?"on":""}" data-a="tg" data-v="${t.id}"></button><button class="x" data-a="del" data-v="${t.id}">×</button></div>`).join("")+"</div>";

const create=()=>hd("Create New Routine","Plan your routine and build a better you.")+`<div class="c" style="margin-top:14px"><label class="s">Routine name</label><input class="in" value="${esc(F.name)}" placeholder="e.g. Morning Growth" maxlength="40" oninput="F.name=this.value">
<label class="s">Category</label><div class="pk">${Object.keys(C).map(k=>`<button data-a="cat" data-v="${k}" class="${F.cat===k?"on":""}">${C[k][1]} ${C[k][0]}</button>`).join("")}</div>
<label class="s">Days of week</label><div class="dc">${[1,2,3,4,5,6,0].map(i=>`<button data-a="day" data-v="${i}" class="${F.days.includes(i)?"on":""}">${DN[i]}</button>`).join("")}</div>
<label class="s">Reminder time</label><input class="in" type="time" value="${F.time}" onchange="F.time=this.value">
<label class="s">Duration (minutes)</label><input class="in" type="number" min="0" max="600" value="${F.min}" onchange="F.min=+this.value"><button class="bt" style="width:100%" data-a="mk">Create Routine</button></div>`;

const calendar=()=>{const n=new Date(),tk=key(n),b=new Date(n.getFullYear(),n.getMonth()+M,1),dim=new Date(b.getFullYear(),b.getMonth()+1,0).getDate();
 let g=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(x=>`<span>${x}</span>`).join("")+"<i></i>".repeat((b.getDay()+6)%7),o=0,el=0;
 for(let i=1;i<=dim;i++){const x=new Date(b.getFullYear(),b.getMonth(),i),k=key(x),p=sc(x)>=50;if(k<=tk){el++;if(p)o++}g+=`<div class="dy ${k===tk?"t":""}"><b>${i}</b><i class="dt ${p?"y":k<tk?"n":""}"></i></div>`}
 const pc=el?Math.round(o/el*100):0;
 return hd("Calendar","Track your daily progress and maintain your streak.")+`<div class="gr"><div class="c w"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><b>${b.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</b><span><button class="ar" data-a="mo" data-v="-1">‹</button><button class="ar" data-a="mo" data-v="1">›</button></span></div><div class="cal">${g}</div></div>
 <div class="c"><div class="l">Current Streak</div><div class="big">🔥 ${streak()}</div><div class="s" style="margin-top:6px">days · Longest ${best()}</div></div>
 <div class="c"><div class="l">Monthly Completion</div>${ring(pc,100,pc+"%")}<div class="s" style="margin-top:8px">${o}/${el} days</div></div></div>`};

const progress=()=>{const n=R==="week"?7:R==="month"?30:12,D=R==="week"?7:R==="month"?30:365,B=[],cc={},cols=["#b4f12a","#7bd01a","#4ade80","#22d3ee","#a3e635","#64748b"],ks=Object.keys(C);
 for(let i=n-1;i>=0;i--){if(R==="year"){const y=new Date(new Date().getFullYear(),new Date().getMonth()-i,1),p=key(y).slice(0,7);let v=0;for(const k in S.log)if(k.slice(0,7)===p)v+=S.log[k].filter(ok).length;B.push(v)}else B.push(dn(ago(i)))}
 let sum=0,ds=0,tot=0;for(let i=0;i<D;i++){const d=ago(i);if(act(d).length){sum+=sc(d);ds++}(S.log[key(d)]||[]).forEach(id=>{const t=S.tasks.find(x=>x.id===id);if(t){cc[t.cat]=(cc[t.cat]||0)+1;tot++}})}
 let a=0;const gd=tot?ks.map((k,i)=>{const p=(cc[k]||0)/tot*100,r=`${cols[i]} ${a}% ${a+p}%`;a+=p;return r}).join(","):"#1a2620 0 100%",mx=Math.max(1,...B);
 return hd("Progress","See your growth, track your habits, and stay motivated.",`<div class="pl">${["week","month","year"].map(r=>`<button data-a="rg" data-v="${r}" class="${R===r?"on":""}">${r[0].toUpperCase()+r.slice(1)}</button>`).join("")}</div>`)+
 `<div class="gr"><div class="c"><div class="l">Total XP</div><div class="big">${tot*20}</div></div><div class="c"><div class="l">Tasks Completed</div><div class="big">${tot}</div></div><div class="c w"><div class="l">Avg. Daily Score</div><div class="big">${ds?Math.round(sum/ds):0}</div></div>
 <div class="c w"><div class="l">XP Progress</div><div class="bars">${B.map(v=>`<i style="height:${v/mx*100}%"></i>`).join("")}</div></div>
 <div class="c w"><div class="l">Category Breakdown</div><div style="display:flex;gap:18px;align-items:center"><div class="dn" style="background:conic-gradient(${gd})"></div><div style="flex:1">${ks.filter(k=>cc[k]).map(k=>`<div class="lk"><i style="background:${cols[ks.indexOf(k)]}"></i>${C[k][0]}<b>${Math.round(cc[k]/tot*100)}%</b></div>`).join("")||'<div class="s">Complete tasks to see data</div>'}</div></div></div></div>`};

const achv=()=>{const c=cnt(),b=Math.max(best(),streak()),A=[["First Step","Complete your first task","🛡️",c,1],["7-Day Warrior","Maintain a 7-day streak","⭐",b,7],["Consistency","Complete 50 tasks","🎯",c,50],["30-Day Legend","Maintain a 30-day streak","🏅",b,30],["XP Master","Reach level 10","👑",lv(),10],["Life Changer","Complete 100 tasks","🔥",c,100]];
 return hd("Achievements","Complete challenges and earn rewards.")+'<div class="gr">'+A.map(a=>{const u=a[3]>=a[4];return `<div class="c" style="text-align:center;${u?"border-color:var(--ac)":""}"><div style="font-size:36px;margin-bottom:6px;${u?"":"filter:grayscale(1);opacity:.45"}">${a[2]}</div><b style="font-size:14px">${a[0]}</b><div class="s" style="margin:4px 0 12px">${a[1]}</div>${u?'<div style="color:var(--ac);font-weight:700;font-size:12px">✓ Unlocked</div>':`<div class="bar"><i style="width:${a[3]/a[4]*100}%"></i></div><div class="s" style="margin-top:6px">${a[3]}/${a[4]}</div>`}</div>`}).join("")+"</div>"};

const profile=()=>hd("Profile & Settings","Manage your account and preferences.")+`<div class="c" style="margin-top:14px;display:flex;gap:14px;align-items:center"><div class="av" style="width:56px;height:56px;font-size:22px">${esc((S.u.name[0]||"U").toUpperCase())}</div><div style="flex:1"><input class="in" id="pn" style="margin:0 0 6px" value="${esc(S.u.name)}" maxlength="24"><div class="s">Level ${lv()} · ${xp()} XP</div></div></div>
<div class="c" style="margin-top:12px"><div class="l">Preferences</div><div class="r"><div class="n">Reminder notifications<small>Push alerts at each routine's time, even when the app is closed</small></div><button class="sw ${S.nt?"on":""}" data-a="pf" data-v="nt"></button></div><div class="r"><div class="n">Confetti &amp; effects</div><button class="sw ${S.fx?"on":""}" data-a="pf" data-v="fx"></button></div></div>
<div class="c" style="margin-top:12px"><button class="bt" style="width:100%;margin-bottom:10px" data-a="out">Log out</button><button class="bt" style="background:#2a1a17;color:#ff8a6b" data-a="rs">${RS?"Tap again to confirm reset":"Reset all data"}</button><div class="s" style="margin-top:12px">Signed in as ${esc(SES?SES.user.email:"")} · your data syncs to the cloud.</div></div>`;

const welcome=()=>`<div class="wl"><div class="lg">${LOGO}SelfOS</div><h1 class="hh">Build Yourself.<br><span>One Day at a Time.</span></h1><p class="s" style="margin:14px 0 24px">Track your habits. Build better routines. Level up your life.</p><label class="s">Your name</label><input class="in" placeholder="e.g. Karthik" maxlength="24" value="${esc(F.wn)}" oninput="F.wn=this.value"><div class="l">What do you want to improve?</div><div class="pk">${Object.keys(C).map(k=>`<button data-a="ar" data-v="${k}" class="${S.areas.includes(k)?"on":""}">${C[k][1]} ${C[k][0]}</button>`).join("")}</div><button class="bt" style="width:100%" data-a="go">Get Started →</button></div>`;

const VIEWS={home,routines,create,calendar,progress,achv,profile};
function render(){const m=$("#app");if(!READY){m.innerHTML='<div class="wl s">Loading…</div>';return}if(!SES){m.innerHTML=authv();return}if(!S.u){m.innerHTML=welcome();return}
 const nav=[["home","🏠","Home"],["routines","📋","Routines"],["calendar","📅","Calendar"],["progress","📈","Progress"],["achv","🏆","Awards"],["profile","👤","Profile"]].map(n=>`<button data-a="nav" data-v="${n[0]}" class="${V===n[0]?"on":""}"><span>${n[1]}</span>${n[2]}</button>`).join("");
 m.innerHTML=`<div class="sh"><aside class="sb"><div class="lg">${LOGO}SelfOS</div>${nav}</aside><main class="mn">${VIEWS[V]()}</main></div><nav class="nv">${nav}</nav>`}
document.addEventListener("click",e=>{const el=e.target.closest("[data-a]");if(!el)return;const a=el.dataset.a,v=el.dataset.v;
 if(a==="chk")return toggle(+v,e);
 if(a==="nav"){V=v;M=0;RS=0;scrollTo(0,0)}
 else if(a==="tg"){const t=S.tasks.find(x=>x.id===+v);t.on=!t.on}
 else if(a==="del")S.tasks=S.tasks.filter(x=>x.id!==+v);
 else if(a==="cat")F.cat=v;
 else if(a==="day")F.days=F.days.includes(+v)?F.days.filter(x=>x!==+v):[...F.days,+v];
 else if(a==="mk"){if(!F.name.trim())return toast("Give your routine a name");if(!F.days.length)return toast("Pick at least one day");S.tasks.push({id:S.nx++,name:F.name.trim(),time:F.time||"06:00",cat:F.cat,min:F.min||0,days:F.days,on:true});F.name="";V="routines";toast("Routine created ✅")}
 else if(a==="mo")M+=+v;
 else if(a==="rg")R=v;
 else if(a==="pf"){S[v]=!S[v];if(v==="nt"){S.nt?enablePush():disablePush()}}
 else if(a==="ar")S.areas=S.areas.includes(v)?S.areas.filter(x=>x!==v):[...S.areas,v];
 else if(a==="go"){S.u={name:F.wn.trim()||"Friend"};if(S.areas.length){const f=S.tasks.filter(t=>S.areas.includes(t.cat));if(f.length)S.tasks=f}}
 else if(a==="mode"){AF.mode=AF.mode==="in"?"up":"in";AF.msg=""}
 else if(a==="goog"){sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin+location.pathname}});return}
 else if(a==="auth"){doAuth();return}
 else if(a==="out"){sb.auth.signOut().then(()=>{SES=null;S=DEF();render()});return}
 else if(a==="rs"){if(!RS){RS=1;render();return}S=DEF();RS=0;push().then(render);return}
 save();render()});
document.addEventListener("change",e=>{if(e.target.id==="pn"){S.u.name=e.target.value.trim()||S.u.name;save()}});
const authv=()=>`<div class="wl"><div class="lg">${LOGO}SelfOS</div><h1 class="hh">${AF.mode==="in"?"Welcome back!":"Create your account"}</h1><p class="s" style="margin:12px 0 22px">${AF.mode==="in"?"Log in to continue your journey.":"Start your journey today."}</p><label class="s">Email</label><input class="in" type="email" placeholder="you@example.com" value="${esc(AF.email)}" oninput="AF.email=this.value"><label class="s">Password</label><input class="in" type="password" placeholder="Min 6 characters" value="${esc(AF.pw)}" oninput="AF.pw=this.value"><div class="s" style="color:#ff8a6b;min-height:18px;margin-bottom:10px">${esc(AF.msg)}</div><button class="bt" style="width:100%" data-a="auth">${AF.mode==="in"?"Login":"Register"}</button><div class="s" style="text-align:center;margin:14px 0">or</div><button class="bt" style="width:100%;background:#15221b;color:var(--tx)" data-a="goog">Continue with Google</button><p class="s" style="text-align:center;margin-top:18px">${AF.mode==="in"?"Don't have an account?":"Already have an account?"} <button class="x" style="color:var(--ac);font-size:13px" data-a="mode">${AF.mode==="in"?"Register":"Login"}</button></p></div>`;
async function doAuth(){AF.msg="";const e=AF.email.trim(),p=AF.pw;if(!e||p.length<6){AF.msg="Enter your email and a password (min 6 characters).";return render()}
 const r=AF.mode==="in"?await sb.auth.signInWithPassword({email:e,password:p}):await sb.auth.signUp({email:e,password:p});
 if(r.error){AF.msg=r.error.message;return render()}
 if(!r.data.session){AF.msg="Check your email to confirm, then log in.";AF.mode="in";return render()}
 SES=r.data.session;await pull();render()}
async function pull(){const{data,error}=await sb.from("user_data").select("data").eq("user_id",SES.user.id).maybeSingle();
 if(error){try{S=JSON.parse(localStorage.getItem(K+SES.user.id))||DEF()}catch(e){S=DEF()}return}
 S=data&&data.data&&data.data.tasks?data.data:DEF()}
async function push(){if(!SES)return;try{await sb.from("user_data").upsert({user_id:SES.user.id,data:S,updated_at:new Date().toISOString()})}catch(e){}}
const b64=s=>{const r=atob((s+"=".repeat((4-s.length%4)%4)).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from([...r].map(c=>c.charCodeAt(0)))};
async function enablePush(){try{const reg=await navigator.serviceWorker.ready;if(await Notification.requestPermission()!=="granted"){S.nt=false;save();render();return toast("Notifications blocked")}
 const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(CFG.vapid)});
 await sb.from("push_subscriptions").upsert({user_id:SES.user.id,endpoint:sub.endpoint,sub:sub.toJSON(),tz:Intl.DateTimeFormat().resolvedOptions().timeZone},{onConflict:"endpoint"});toast("Reminders on 🔔")}
 catch(e){S.nt=false;save();render();toast("Push not supported on this device/browser")}}
async function disablePush(){try{const reg=await navigator.serviceWorker.ready,sub=await reg.pushManager.getSubscription();if(sub){await sb.from("push_subscriptions").delete().eq("endpoint",sub.endpoint);await sub.unsubscribe()}}catch(e){}}
async function boot(){if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
 const{data}=await sb.auth.getSession();SES=data.session;if(SES)await pull();READY=true;render();
 sb.auth.onAuthStateChange((ev,s)=>{if(ev==="SIGNED_IN"&&s&&!SES)setTimeout(async()=>{SES=s;await pull();render()},0);else if(ev==="SIGNED_OUT"){SES=null;render()}})}
boot();
