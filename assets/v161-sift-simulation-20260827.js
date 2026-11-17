(()=>{
  'use strict';
  const t=s=>window.EBG_I18N?.t?.(s)||s;
  const sims=[...document.querySelectorAll('[data-sift-sim]')];
  sims.forEach(sim=>{
    const stages=[...sim.querySelectorAll('[data-sift-stage]')];
    const progress=[...sim.querySelectorAll('[data-sift-progress]')];
    const summary=sim.querySelector('[data-sift-summary]');
    const feedbackText={
      1:{ok:'Tak. SIFT zaczyna się od przerwania automatycznej reakcji. Na tym etapie nie wiesz jeszcze, czy post jest prawdziwy, więc nie zwiększasz jego zasięgu i nie wydajesz werdyktu.',bad:'Jeszcze nie. Pierwszy krok SIFT nie polega ani na udostępnieniu, ani na natychmiastowym nazwaniu treści fałszywą. Najpierw zatrzymaj reakcję i zostaw sobie przestrzeń na sprawdzenie.'},
      2:{ok:'Tak. Profesjonalnie brzmiąca nazwa nie potwierdza wiarygodności. W kroku I wychodzisz poza profil i sprawdzasz, kto rzeczywiście stoi za źródłem.',bad:'Niezupełnie. Z podanych danych nie wynika ani oficjalny status profilu, ani pewność, że konto jest fałszywe. Najuczciwiej jest uznać źródło za niejasne i sprawdzić je poza jego własnym profilem.'},
      3:{ok:'Tak. W kroku F szukasz źródeł, które są lepsze od materiału, od którego zacząłeś - przede wszystkim źródła pierwotnego i niezależnego omówienia prowadzącego do dowodów.',bad:'Niezupełnie. Powtórzenie tej samej tezy przez kolejny profil ani popularność wyniku nie tworzą niezależnego potwierdzenia. Wybierz źródła, które pozwalają sprawdzić dokument i kontekst.'},
      4:{ok:'Tak. Dopiero źródło pierwotne pokazuje zmianę sensu: możliwość załatwienia części spraw online została przedstawiona jako likwidacja wszystkich urzędów.',bad:'Niezupełnie. Porównaj dokładnie oba zdania. Komunikat źródłowy mówi o dodatkowej obsłudze online i zachowaniu obsługi stacjonarnej, a post wyciąga z tego znacznie dalej idący wniosek.'},
      5:{ok:'Tak. Po wykonaniu SIFT nie rozpowszechniasz błędnej wersji. Jeśli reagujesz, opierasz sprostowanie na źródle i pokazujesz konkretnie, gdzie zmienił się sens.',bad:'Niezupełnie. Sam dopisek ostrzegawczy nadal zwiększa zasięg błędnego posta, a nie każda fałszywa informacja jest automatycznie treścią nielegalną. Wybierz reakcję opartą na sprawdzonym źródle.'}
    };
    const setProgress=n=>progress.forEach((item,i)=>{item.classList.toggle('is-done',i+1<n);item.classList.toggle('is-active',i+1===n)});
    const reveal=n=>{const stage=stages[n-1];if(!stage)return;stage.hidden=false;setProgress(n);};
    const checkStage=stage=>{
      const n=Number(stage.dataset.siftStage);
      const selected=stage.querySelector('input[type="radio"]:checked');
      const button=stage.querySelector('[data-sift-check]');
      const feedback=stage.querySelector('[data-sift-feedback]');
      if(!selected){feedback.className='sift-sim__feedback is-incorrect';feedback.textContent=t('Najpierw wybierz odpowiedź.');return false;}
      const ok=selected.value===button.dataset.correct;
      feedback.className=`sift-sim__feedback ${ok?'is-correct':'is-incorrect'}`;
      feedback.textContent=t(feedbackText[n][ok?'ok':'bad']);
      if(!ok)return false;
      stage.dataset.siftComplete='true';
      if(n<stages.length){reveal(n+1);setTimeout(()=>stages[n]?.scrollIntoView({behavior:'smooth',block:'nearest'}),80)}
      else{progress.forEach(x=>{x.classList.remove('is-active');x.classList.add('is-done')});if(summary)summary.hidden=false;}
      return true;
    };
    stages.forEach(stage=>{
      stage.querySelector('[data-sift-check]')?.addEventListener('click',()=>checkStage(stage));
      stage.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener('change',()=>{const f=stage.querySelector('[data-sift-feedback]');if(f){f.textContent='';f.className='sift-sim__feedback';}}));
    });
    // Restore a completed path only when the saved answer for each preceding step is still correct.
    let next=1;
    for(const stage of stages){
      const selected=stage.querySelector('input[type="radio"]:checked');
      const expected=stage.querySelector('[data-sift-check]')?.dataset.correct;
      const n=Number(stage.dataset.siftStage);
      if(n===1)stage.hidden=false;
      if(selected&&selected.value===expected){stage.hidden=false;stage.dataset.siftComplete='true';next=n+1;if(n<stages.length)stages[n].hidden=false;}
      else break;
    }
    if(next>stages.length){progress.forEach(x=>{x.classList.remove('is-active');x.classList.add('is-done')});if(summary)summary.hidden=false;}
    else setProgress(Math.max(1,next));
  });
})();
