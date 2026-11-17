(()=>{
  const isEnglish=()=>{
    try{return window.EBG_I18N?.getLanguage?.()==='en'}catch(e){return false}
  };
  const copy={
    pl:{
      missing:'Odpowiedz na wszystkie pytania w tym ćwiczeniu. Jeśli czegoś nie wiesz, wybierz odpowiedź, która najlepiej opisuje ograniczenie danych.',
      correct:'Dobrze. ',
      wrong:'Sprawdź jeszcze raz. ',
      success:'Gotowe - przeszedłeś przez sytuację krok po kroku i dopasowałeś decyzję do dostępnych dowodów.',
      partial:'Nie wszystkie odpowiedzi są jeszcze trafne. Przeczytaj wyjaśnienia przy pytaniach i popraw te elementy, które wymagają ponownego sprawdzenia.'
    },
    en:{
      missing:'Answer all questions in this exercise. If something is uncertain, choose the option that best reflects the limits of the available evidence.',
      correct:'Correct. ',
      wrong:'Check this again. ',
      success:'Done - you worked through the situation step by step and matched the decision to the available evidence.',
      partial:'Some answers still need revision. Read the explanations under the questions and correct the parts that require another check.'
    }
  };

  function evaluate(box){
    const lang=isEnglish()?'en':'pl';
    const t=copy[lang];
    const fields=[...box.querySelectorAll('[data-v163-question]')];
    const summary=box.querySelector('[data-v163-summary]');
    let complete=true, correctCount=0;
    fields.forEach(field=>{
      const input=field.querySelector('input[type="radio"]:checked');
      const feedback=field.querySelector('.v163-question-feedback');
      field.classList.remove('is-correct','is-incorrect');
      if(!input){
        complete=false;
        if(feedback) feedback.textContent='';
        return;
      }
      const ok=input.value===field.dataset.correct;
      const explanation=(lang==='en' && field.dataset.explanationEn) ? field.dataset.explanationEn : (field.dataset.explanation||'');
      field.classList.add(ok?'is-correct':'is-incorrect');
      if(feedback) feedback.textContent=(ok?t.correct:t.wrong)+explanation;
      if(ok) correctCount++;
    });
    if(!summary)return;
    summary.classList.remove('is-success','is-partial');
    if(!complete){summary.textContent=t.missing;summary.classList.add('is-partial');return;}
    if(correctCount===fields.length){summary.textContent=t.success;summary.classList.add('is-success');}
    else{summary.textContent=t.partial;summary.classList.add('is-partial');}
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-v163-check]');
    if(!btn)return;
    const box=btn.closest('[data-v163-scenario]');
    if(box)evaluate(box);
  });
})();
