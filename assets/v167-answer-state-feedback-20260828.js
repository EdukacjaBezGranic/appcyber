(()=>{
  'use strict';
  const lang=()=>document.documentElement.lang?.toLowerCase().startsWith('en')?'en':'pl';
  const text=(ok)=>lang()==='en'?(ok?'✓ Correct answer':'✕ Incorrect answer'):(ok?'✓ Poprawna odpowiedź':'✕ Błędna odpowiedź');

  function clear(container){
    if(!container)return;
    container.querySelectorAll('.v167-answer-correct,.v167-answer-incorrect').forEach(el=>{
      el.classList.remove('v167-answer-correct','v167-answer-incorrect');
      el.querySelector('.v167-answer-state-badge')?.remove();
    });
  }
  function mark(container,input,ok){
    if(!container||!input)return;
    clear(container);
    const label=input.closest('label');
    if(!label)return;
    label.classList.add(ok?'v167-answer-correct':'v167-answer-incorrect');
    const badge=document.createElement('span');
    badge.className='v167-answer-state-badge';
    badge.textContent=text(ok);
    // Odpowiedzi w kursie mają zwykle układ: [radio/checkbox] + [span z tekstem].
    // Badge musi należeć do kolumny tekstowej, inaczej w gridzie trafia pod kontrolkę.
    const content=[...label.children].find(el=>el.tagName==='SPAN'&&!el.classList.contains('v167-answer-state-badge'));
    if(content){
      content.classList.add('v168-answer-content');
      content.append(badge);
    }else{
      badge.classList.add('v168-answer-state-badge--fallback');
      label.append(badge);
    }
  }

  // V155 - popularność ≠ prawdziwość.
  document.querySelector('[data-v155-popularity-check]')?.addEventListener('click',()=>{
    const set=document.querySelector('.v155-choice-set');
    const chosen=set?.querySelector('input:checked');
    if(chosen)mark(set,chosen,chosen.value==='b');
  });

  // V161 - symulacja SIFT, etap po etapie.
  document.querySelectorAll('[data-sift-check]').forEach(button=>{
    button.addEventListener('click',()=>{
      const stage=button.closest('[data-sift-stage]');
      const choices=stage?.querySelector('.sift-sim__choices');
      const chosen=choices?.querySelector('input:checked');
      if(chosen)mark(choices,chosen,chosen.value===button.dataset.correct);
    });
  });

  // V163 - scenariusze z konkretnymi danymi.
  document.querySelectorAll('[data-v163-check]').forEach(button=>{
    button.addEventListener('click',()=>{
      const scenario=button.closest('[data-v163-scenario]');
      scenario?.querySelectorAll('[data-v163-question]').forEach(field=>{
        const chosen=field.querySelector('input:checked');
        if(chosen)mark(field,chosen,chosen.value===field.dataset.correct);
      });
    });
  });

  // V166 - pojedyncza decyzja po przepracowanym przykładzie.
  document.querySelectorAll('[data-v166-check]').forEach(button=>{
    button.addEventListener('click',()=>{
      const key=button.dataset.v166Check;
      const field=document.querySelector(`[data-v166-question="${CSS.escape(key)}"]`);
      const chosen=field?.querySelector('input:checked');
      if(chosen)mark(field,chosen,chosen.value===field.dataset.correct);
    });
  });

  // Testy modułowe - odpowiedzi są oznaczane dopiero, gdy użytkownik odpowie na wszystkie pytania.
  document.querySelectorAll('.module-quiz form').forEach(form=>{
    form.addEventListener('submit',()=>{
      const fields=[...form.querySelectorAll('.module-quiz__questions fieldset[data-correct]')];
      if(!fields.length||fields.some(field=>!field.querySelector('input:checked')))return;
      fields.forEach(field=>{
        const chosen=field.querySelector('input:checked');
        mark(field,chosen,Number(chosen.value)===Number(field.dataset.correct));
      });
    });
  });

  // Po zmianie odpowiedzi usuwamy stary kolor/badge w danym pytaniu, aby wynik nie wyglądał na aktualny przed ponownym sprawdzeniem.
  document.addEventListener('change',event=>{
    const input=event.target;
    if(!input.matches('input[type="radio"],input[type="checkbox"],select'))return;
    const container=input.closest('.v155-choice-set,.sift-sim__choices,[data-v163-question],[data-v166-question],.module-quiz fieldset');
    if(container)clear(container);
  });
})();
