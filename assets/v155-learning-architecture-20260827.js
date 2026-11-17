(()=>{
  'use strict';

  const exercise=document.querySelector('[data-v155-popularity-exercise]');
  if(exercise){
    const button=exercise.querySelector('[data-v155-popularity-check]');
    const feedback=exercise.querySelector('[data-v155-popularity-feedback]');
    const render=()=>{
      const en=(window.EBG_I18N?.getLanguage?.()||document.documentElement.lang)==='en';
      const selected=exercise.querySelector('input[name="m1-popularity-sim-v155"]:checked');
      if(!selected){
        feedback.hidden=false;
        feedback.className='v155-popularity-feedback is-wrong';
        feedback.textContent=en?'Choose one answer. The reaction count alone does not tell us whether the claim has been checked.':'Wybierz jedną odpowiedź. Sam licznik reakcji nie mówi jeszcze, czy twierdzenie zostało sprawdzone.';
        return;
      }
      const correct=selected.value==='b';
      feedback.hidden=false;
      feedback.className=`v155-popularity-feedback ${correct?'is-correct':'is-wrong'}`;
      feedback.innerHTML=correct
        ? (en?'<strong>Correct.</strong> The numbers describe engagement and reach. They do not show whether the claim is true, whether people sharing the material read the source, or whether anyone verified it.':'<strong>Dobrze.</strong> Liczby opisują zaangażowanie i zasięg. Nie pokazują, czy twierdzenie jest prawdziwe, czy osoby udostępniające materiał przeczytały źródło ani czy ktokolwiek je zweryfikował.')
        : (en?'<strong>Not yet.</strong> Popularity tells us about audience behaviour, not the quality of evidence. Even with thousands of reactions, the source, content and context still need to be checked.':'<strong>Jeszcze nie.</strong> Popularność jest informacją o zachowaniu odbiorców, nie o jakości dowodów. Przy tysiącach reakcji nadal trzeba sprawdzić źródło, treść i kontekst twierdzenia.');
    };
    button?.addEventListener('click',render);
  }


  // Keep the sidebar lesson containing the active section open.
  const lessonLinks=[...document.querySelectorAll('.section-nav-lesson [data-section-link]')];
  const syncLesson=link=>{
    if(!link?.classList?.contains('is-active'))return;
    const lesson=link.closest('.section-nav-lesson');
    if(lesson)lesson.open=true;
  };
  lessonLinks.forEach(link=>{
    syncLesson(link);
    new MutationObserver(()=>syncLesson(link)).observe(link,{attributes:true,attributeFilter:['class']});
  });

  // On touch devices a second tap elsewhere should naturally dismiss a focused tooltip.
  document.addEventListener('pointerdown',event=>{
    const active=document.activeElement;
    if(active?.classList?.contains('course-term-tooltip') && !active.contains(event.target)) active.blur();
  });
})();
