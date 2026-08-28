(() => {
  'use strict';
  const COURSE_KEY='ebgCourseV2State';
  const QUIZ_KEY='ebgCourseModuleQuizV4';
  const read=(k,f={})=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
  const sections=()=>[...document.querySelectorAll('.course-section[data-course-section]')].filter(s=>s.dataset.quizRequired!=='false');
  function status(){
    const completed=new Set(read(COURSE_KEY,{completed:[]}).completed||[]);
    const all=sections(), done=all.filter(s=>completed.has(s.dataset.courseSection)).length;
    const quizzes=read(QUIZ_KEY,{}); let passed=0;
    for(let m=1;m<=5;m++) if(quizzes[m]?.passed && Number(quizzes[m].score)>=7) passed++;
    // Każdy test modułowy odblokowuje się dopiero po ukończeniu wymaganych treści modułu.
    // Zaliczenie wszystkich pięciu testów jest więc ostatecznym potwierdzeniem ukończenia kursu.
    const allQuizzesPassed=passed===5;
    const sectionPercent=all.length?Math.min(100,Math.round(done/all.length*100)):0;
    const eligible=sectionPercent===100&&allQuizzesPassed;
    const overall=eligible?100:Math.min(99,Math.round(((sectionPercent/100)*5+passed)/10*100));
    return {done,total:all.length,sectionPercent,passed,eligible,overall};
  }
  function update(){
    const s=status();
    document.querySelectorAll('[data-certificate-sections]').forEach(n=>n.textContent=`${s.sectionPercent}%`);
    document.querySelectorAll('[data-certificate-quizzes]').forEach(n=>n.textContent=`${s.passed} z 5`);
    document.querySelectorAll('[data-certificate-progress-text]').forEach(n=>n.textContent=`${s.overall}%`);
    document.querySelectorAll('[data-certificate-bar]').forEach(n=>n.style.width=`${s.overall}%`);
    document.querySelectorAll('[data-certificate-status]').forEach(n=>n.textContent=s.eligible?'Dyplom ukończenia kursu jest odblokowany':s.passed===5?'Zaliczono testy - ukończ wszystkie tematy modułów':s.sectionPercent===100?'Ukończono wszystkie tematy - zalicz testy modułowe':'Dyplom nie jest jeszcze odblokowany');
    document.dispatchEvent(new CustomEvent('ebg:certificate-requirements-updated',{detail:s}));
  }
  document.querySelector('[data-enter-course]')?.addEventListener('click',()=>document.querySelector('.course-app')?.scrollIntoView({behavior:'smooth',block:'start'}));
  const modal=document.querySelector('[data-certificate-rules-modal]'); let ret=null;
  const open=()=>{if(!modal)return;ret=document.activeElement;modal.hidden=false;document.body.classList.add('has-privacy-modal');requestAnimationFrame(()=>modal.querySelector('.course-privacy-modal__panel')?.focus())};
  const close=()=>{if(!modal)return;modal.hidden=true;document.body.classList.remove('has-privacy-modal');if(ret instanceof HTMLElement)ret.focus()};
  document.querySelectorAll('[data-certificate-rules-open]').forEach(b=>b.addEventListener('click',open));
  modal?.querySelectorAll('[data-certificate-rules-close]').forEach(b=>b.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden)close()});
  document.addEventListener('ebg:course-progress-updated',update);
  document.addEventListener('ebg:module-quiz-updated',update);
  window.addEventListener('storage',e=>{if([COURSE_KEY,QUIZ_KEY].includes(e.key))update()});
  update();
})();
