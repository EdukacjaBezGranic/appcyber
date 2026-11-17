(() => {
'use strict';
const COURSE_KEY='ebgCourseV2State',QUIZ_KEY='ebgCourseModuleQuizV4',PROFILE_KEY='ebgCourseV2Profile';
const TITLES={1:'Informacja jako produkt i zmiana środowiska informacyjnego',2:'Dlaczego jesteśmy podatni na manipulację?',3:'Jak działa dezinformacja i manipulacja?',4:'Jak sprawdzać informacje w praktyce?',5:'Jak reagować i budować odporność informacyjną?'};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const read=(k,f={})=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
const panel=$('[data-certificate-document]'),nameInput=$('[data-certificate-name]'),downloadBtn=$('[data-certificate-download]'),printBtn=$('[data-certificate-print]'),helper=$('[data-certificate-helper]'),fallback=$('[data-certificate-pdf-fallback]');
if(!panel||!nameInput||!downloadBtn||!printBtn)return;
function requirements(){const stored=new Set(read(COURSE_KEY,{completed:[]}).completed||[]),sections=$$('.course-section[data-course-section]').filter(s=>s.dataset.quizRequired!=='false'),q=read(QUIZ_KEY,{});const isDone=s=>{const id=s.dataset.courseSection,nav=id?$(`[data-section-link="${CSS.escape(id)}"]`):null;return Boolean(id&&(stored.has(id)||s.classList.contains('is-complete')||nav?.classList.contains('is-complete')))};const done=sections.filter(isDone).length;const passed=[1,2,3,4,5].filter(m=>q[m]?.passed&&Number(q[m].score)>=7);return{done,total:sections.length,passed,q,eligible:done===sections.length&&passed.length===5}}
function update(){const r=requirements();panel.hidden=!r.eligible;const profile=read(PROFILE_KEY,{});if(document.activeElement!==nameInput&&!nameInput.value)nameInput.value=profile.name||'';const ok=r.eligible&&nameInput.value.trim().length>=3;downloadBtn.disabled=!ok;printBtn.disabled=!ok;helper.textContent=!r.eligible?'Ukończ 100% kursu i zalicz wszystkie testy modułowe.':ok?'Warunki zostały spełnione. Możesz pobrać dyplom PDF.':'Wpisz imię i nazwisko, aby odblokować pobieranie dyplomu.'}
function rounded(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function wrap(ctx,text,max){const words=String(text).split(/\s+/),out=[];let line='';for(const w of words){const t=line?line+' '+w:w;if(!line||ctx.measureText(t).width<=max)line=t;else{out.push(line);line=w}}if(line)out.push(line);return out}
const enc=t=>new TextEncoder().encode(t);function b64(u){const s=atob(u.split(',')[1]),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return a}
function makePdf(c){const PW=595.28,PH=841.89,img=b64(c.toDataURL('image/jpeg',.92)),stream=`q ${PW} 0 0 ${PH} 0 0 cm /Im1 Do Q`,objs=[];objs[1]=enc('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');objs[2]=enc('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');objs[3]=enc(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);objs[4]=[enc(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${c.width} /Height ${c.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`),img,enc('\nendstream\nendobj\n')];objs[5]=enc(`5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`);const chunks=[enc('%PDF-1.4\n')],offs=[0];let len=chunks[0].length;for(let i=1;i<=5;i++){offs[i]=len;const parts=Array.isArray(objs[i])?objs[i]:[objs[i]];for(const p of parts){chunks.push(p);len+=p.length}}const xoff=len;let x='xref\n0 6\n0000000000 65535 f \n';for(let i=1;i<=5;i++)x+=`${String(offs[i]).padStart(10,'0')} 00000 n \n`;x+=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xoff}\n%%EOF`;chunks.push(enc(x));return new Blob(chunks,{type:'application/pdf'})}
async function canvas(name,r){
  const c=document.createElement('canvas');c.width=1240;c.height=1754;
  const x=c.getContext('2d');
  const bg=new Image();
  await new Promise((resolve,reject)=>{bg.onload=resolve;bg.onerror=reject;bg.src=window.EBG_DIPLOMA_BACKGROUND||'grafiki/dyplom-media-literacy-tlo.png'});
  x.drawImage(bg,0,0,c.width,c.height);

  // Dane dyplomu są umieszczone niżej, bez osobnego tła,
  // w centralnej pustej części ilustracji.
  x.textAlign='center';
  x.textBaseline='alphabetic';

  x.fillStyle='#173f5c';x.font='700 38px Arial';
  x.fillText('DYPLOM UKOŃCZENIA KURSU',620,860);
  x.fillStyle='#6b7f8c';x.font='400 24px Arial';
  x.fillText('otrzymuje',620,912);

  x.fillStyle='#123a56';x.font='700 64px Arial';
  const nameLines=wrap(x,name,900);
  nameLines.forEach((line,i)=>x.fillText(line,620,1010+i*70));
  const afterName=1010+(nameLines.length-1)*70;

  x.strokeStyle='#d8a928';x.lineWidth=3;x.beginPath();x.moveTo(220,afterName+34);x.lineTo(1020,afterName+34);x.stroke();

  x.fillStyle='#2d556f';x.font='400 26px Arial';
  x.fillText('za ukończenie kursu online',620,afterName+94);
  x.font='700 34px Arial';
  x.fillText('Media Literacy, Fake News i Krytyczne Myślenie',620,afterName+146);

  x.fillStyle='#486678';x.font='400 24px Arial';
  const skills='Uczestnik nabył umiejętności rozpoznawania dezinformacji i manipulacji, krytycznej oceny źródeł oraz odpowiedzialnego korzystania z informacji i mediów cyfrowych.';
  const skillLines=wrap(x,skills,820);
  skillLines.forEach((line,i)=>x.fillText(line,620,afterName+208+i*34));
  return c;
}
async function download(){const r=requirements(),name=nameInput.value.trim();if(!r.eligible||name.length<3)return update();localStorage.setItem(PROFILE_KEY,JSON.stringify({...read(PROFILE_KEY,{}),name}));downloadBtn.disabled=true;helper.textContent='Trwa przygotowywanie dyplomu PDF…';try{const c=await canvas(name,r),blob=makePdf(c),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(window.EBG_I18N?.getLanguage?.()==='en'?`course-completion-diploma-${new Date().toISOString().slice(0,10)}.pdf`:`dyplom-ukonczenia-kursu-${new Date().toISOString().slice(0,10)}.pdf`);document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);helper.textContent='Dyplom PDF został utworzony i zapisany na urządzeniu.'}catch(e){console.error(e);helper.textContent='Nie udało się przygotować dyplomu. Odśwież stronę i spróbuj ponownie.'}finally{update()}}
async function printVersion(){const r=requirements(),name=nameInput.value.trim();if(!r.eligible||name.length<3)return update();const w=window.open('','_blank');if(!w){helper.textContent='Przeglądarka zablokowała nowe okno. Zezwól na otwieranie okien i spróbuj ponownie.';return}try{const img=(await canvas(name,r)).toDataURL('image/png');w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${window.EBG_I18N?.getLanguage?.()==='en'?'Course completion diploma':'Dyplom ukończenia kursu'}</title><style>@page{size:A4;margin:0}body{margin:0}img{width:100%;display:block}</style></head><body><img src="${img}"><script>onload=()=>setTimeout(()=>print(),400)<\/script></body></html>`);w.document.close()}catch(e){console.error(e);w.close();helper.textContent='Nie udało się przygotować wersji do druku.'}}
nameInput.addEventListener('input',()=>{localStorage.setItem(PROFILE_KEY,JSON.stringify({...read(PROFILE_KEY,{}),name:nameInput.value.trim()}));update()});downloadBtn.addEventListener('click',download);printBtn.addEventListener('click',printVersion);document.addEventListener('ebg:certificate-requirements-updated',update);document.addEventListener('ebg:course-progress-updated',update);document.addEventListener('ebg:module-quiz-updated',update);update();
})();
