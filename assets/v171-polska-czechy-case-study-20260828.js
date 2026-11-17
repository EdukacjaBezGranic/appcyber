(()=>{
  'use strict';
  const lang=()=>document.documentElement.lang?.toLowerCase().startsWith('en')?'en':'pl';
  const field=document.querySelector('[data-v171-question="ecosystem"]');
  const button=document.querySelector('[data-v171-check="ecosystem"]');
  const feedback=document.querySelector('[data-v171-feedback="ecosystem"]');
  const clear=()=>{field?.querySelectorAll('.v167-answer-correct,.v167-answer-incorrect').forEach(label=>{label.classList.remove('v167-answer-correct','v167-answer-incorrect');label.querySelector('.v167-answer-state-badge')?.remove();});if(feedback){feedback.className='v171-feedback';feedback.textContent='';}};
  field?.querySelectorAll('input').forEach(input=>input.addEventListener('change',clear));
  button?.addEventListener('click',()=>{
    const chosen=field?.querySelector('input:checked');
    if(!chosen){if(feedback){feedback.className='v171-feedback is-wrong';feedback.textContent=lang()==='en'?'Choose one answer first.':'Najpierw wybierz jedną odpowiedź.';}return;}
    clear();
    const ok=chosen.value===field.dataset.correct;
    const label=chosen.closest('label');
    label?.classList.add(ok?'v167-answer-correct':'v167-answer-incorrect');
    const span=label?.querySelector('span');
    if(span){span.classList.add('v168-answer-content');const badge=document.createElement('span');badge.className='v167-answer-state-badge';badge.textContent=lang()==='en'?(ok?'✓ Correct answer':'✕ Incorrect answer'):(ok?'✓ Poprawna odpowiedź':'✕ Błędna odpowiedź');span.append(badge);}
    if(feedback){feedback.className='v171-feedback '+(ok?'is-correct':'is-wrong');feedback.textContent=ok?(lang()==='en'?'Exactly. Several channels can create the appearance of independent confirmation even when they amplify the same narrative or rely on the same source. Real triangulation means checking source independence, not merely counting publications.':'Dokładnie. Kilka kanałów może stworzyć pozór niezależnego potwierdzenia, choć wzmacniają tę samą narrację lub korzystają z tego samego źródła. Prawdziwa triangulacja wymaga sprawdzenia niezależności źródeł, a nie tylko policzenia publikacji.'):(lang()==='en'?'Not quite. The key mechanism is the appearance of independent confirmation. Ask whether the sources are genuinely independent and where each claim originated.':'Niezupełnie. Kluczowy jest pozór niezależnych potwierdzeń. Trzeba sprawdzić, czy źródła są rzeczywiście niezależne i skąd każde z nich wzięło twierdzenie.');}
  });
})();
