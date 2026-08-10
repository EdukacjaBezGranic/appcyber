(() => {
  const STORAGE_KEY = 'rozpoznaj-profil-progress';

  const categories = {
    authentic: 'Autentyczna osoba',
    influence: 'Operacja wpływu',
    ragebait: 'Realny twórca / rage bait',
    scam: 'Oszustwo'
  };

  const profiles = [
    { id:1,name:'Natalia Krawiec',path:'profiles/1/index.html',answer:'influence',hints:[
      ['Tożsamość bez historii', 'Konto deklaruje zawód dziennikarki, ale nie podaje redakcji, portfolio ani wcześniejszej działalności. Ma tylko krótką historię publikacji.'],
      ['Wymuszanie weryfikacji', 'Wpisy oznaczają wiele redakcji i instytucji. Konto nie udostępnia pełnych źródeł, ale próbuje skłonić media do reakcji i rozpowszechnienia przekazu.']
    ], explanation:'To fikcyjna persona operacji wpływu. Konto publikuje spreparowane materiały i próbuje wciągnąć prawdziwe media w ich dalsze nagłaśnianie.', icon:'📣' },
    { id:2,name:'Karolina Zawadzka',path:'profiles/2/index.html',answer:'influence',hints:[
      ['Wyłącznie polityka', 'Każdy widoczny wpis dotyczy konfliktowego tematu politycznego lub światopoglądowego. Nie ma zwykłej codzienności ani naturalnych relacji.'],
      ['Stałe podbijanie konfliktu', 'Konto seryjnie używa pytań TAK/NIE, prostego wskazania winnego i emocjonalnych wezwań do reakcji.']
    ], explanation:'To fikcyjna persona służąca polaryzowaniu debaty. Profil udaje zwykłą aktywistkę, ale jest zbudowany niemal wyłącznie do wzmacniania konfliktu.', icon:'📣' },
    { id:3,name:'Paweł Krupa',path:'profiles/3/index.html',answer:'authentic',hints:[
      ['Różne obszary życia', 'Obok komentarzy politycznych są tu posty rodzinne, lokalne, wspomnieniowe i codzienne.'],
      ['Naturalne relacje', 'Komentarze zawierają wspólne żarty, wspomnienia i zwykłe rozmowy. Profil nie realizuje tylko jednej agendy.']
    ], explanation:'To profil autentycznej osoby. Autor ma poglądy, ale jego konto jest wielowątkowe, spójne w czasie i osadzone w realnych relacjach.', icon:'👤' },
    { id:4,name:'PolskiLis78',path:'profiles/4/index.html',answer:'ragebait',hints:[
      ['Anonimowość nie oznacza automatycznie bota', 'Brak nazwiska i zdjęcia może ograniczać społeczne konsekwencje agresywnych wpisów, ale konto nadal może prowadzić realna osoba.'],
      ['Prawdziwy, lecz niewiarygodny', 'Realny influencer może zarabiać na oburzeniu i jednocześnie rozpowszechniać spreparowane materiały dla zasięgu.']
    ], explanation:'Za kontem stoi prawdziwa osoba, ale jej model działania opiera się na rage baicie i monetyzowaniu polaryzacji.', icon:'🔥' },
    { id:5,name:'Katarzyna Gradowska',path:'profiles/5/index.html',answer:'scam',hints:[
      ['Atrakcyjny wizerunek nie potwierdza kompetencji', 'Profesjonalne zdjęcie ma budować zaufanie. Nie jest dowodem, że osoba istnieje lub jest ekspertką.'],
      ['Referencje mogą należeć do tej samej sieci', 'Rzekomi klienci wzajemnie się oznaczają, używają podobnego języka i wspólnie budują pozory skutecznej inwestycji.']
    ], explanation:'To oszustwo inwestycyjne. Profil ekspertki i rzekomych klientów wspólnie budują wiarygodność, aby skłonić odbiorcę do wpłaty pieniędzy.', icon:'🎭' }
  ];

  const els = {
    intro: document.getElementById('introScreen'), game: document.getElementById('gameScreen'), result: document.getElementById('resultScreen'),
    start: document.getElementById('startGame'), resume: document.getElementById('resumeGame'), restartTop: document.getElementById('restartTop'),
    frame: document.getElementById('profileFrame'), profileName: document.getElementById('profileName'), roundLabel: document.getElementById('roundLabel'),
    progress: document.getElementById('progressBar'), progressPercent: document.getElementById('progressPercent'), scoreValue: document.getElementById('scoreValue'),
    categoryGrid: document.getElementById('categoryGrid'), hintButton: document.getElementById('hintButton'), hintContent: document.getElementById('hintContent'),
    hintPenalty: document.getElementById('hintPenalty'), feedback: document.getElementById('feedback'), submitAnswer: document.getElementById('submitAnswer'),
    roundActions: document.getElementById('roundActions'), nextRound: document.getElementById('nextRound'),
    analysisAccordion: document.getElementById('analysisAccordion'), analysisContent: document.getElementById('analysisContent'), finalScore: document.getElementById('finalScore'),
    resultLevel: document.getElementById('resultLevel'), resultGrid: document.getElementById('resultGrid'), playAgain: document.getElementById('playAgain'),
    reviewMistakes: document.getElementById('reviewMistakes'), exitToMenu: document.getElementById('exitToMenu'), showInstructions: document.getElementById('showInstructions'),
    modal: document.getElementById('instructionsModal'), closeInstructions: document.getElementById('closeInstructions')
  };

  let state = freshState();
  function freshState(){ return { current:0, score:0, hintsUsed:0, answered:false, results:[], selected:null }; }
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function loadSaved(){ try{ const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(!parsed||!Array.isArray(parsed.results)) return null; return parsed; }catch(_){ return null; } }

  function setScreen(name){
    els.intro.hidden = name!=='intro'; els.game.hidden = name!=='game'; els.result.hidden = name!=='result';
    els.restartTop.hidden = name==='intro'; if(name!=='game') closeModal(); window.scrollTo({top:0,behavior:'smooth'});
  }
  function startNew(){ state=freshState(); save(); setScreen('game'); renderRound(); }
  function resume(){ const saved=loadSaved(); if(!saved) return startNew(); state=saved; if(state.current>=profiles.length){ renderResults(); setScreen('result'); } else { setScreen('game'); renderRound(); } }

  function updateSubmitState(){
    if(state.answered){ els.submitAnswer.disabled = true; els.submitAnswer.className='submit-button'; return; }
    if(state.selected){ els.submitAnswer.disabled = false; els.submitAnswer.className='submit-button ready'; }
    else { els.submitAnswer.disabled = true; els.submitAnswer.className='submit-button enabled'; }
  }

  function resetRoundUi(){
    state.hintsUsed=0; state.answered=false; state.selected=null;
    els.hintContent.hidden=true; els.hintContent.innerHTML='';
    els.hintButton.hidden=false; els.hintButton.textContent='Pokaż wskazówkę';
    els.hintPenalty.textContent='Jedna wskazówka na rundę. Odblokuje podpowiedź dotyczącą sygnałów ostrzegawczych.';
    els.feedback.hidden=true; els.feedback.className='feedback'; els.feedback.innerHTML='';
    els.roundActions.hidden=true;
    document.querySelectorAll('.category-card').forEach(btn => { btn.disabled=false; btn.classList.remove('selected','correct','wrong'); btn.setAttribute('aria-checked','false'); });
    updateSubmitState();
  }

  function renderRound(){
    const profile=profiles[state.current]; resetRoundUi();
    els.roundLabel.textContent=`Profil ${state.current+1} z ${profiles.length}`;
    els.profileName.textContent=profile.name;
    els.scoreValue.textContent=`${state.score} pkt`;
    const percent=Math.round(((state.current+1)/profiles.length)*100); els.progress.style.width=`${percent}%`; els.progressPercent.textContent=`${percent}%`;
    els.analysisAccordion.open=false;
    els.analysisContent.innerHTML='<p class="analysis-loading">Omówienie pojawi się po udzieleniu odpowiedzi.</p>';
    els.nextRound.textContent=state.current===profiles.length-1?'Zobacz wynik':'Następny profil';
    els.frame.src=`${profile.path}?embed=1`; save();
  }

  function prepareEmbeddedProfile(){
    try{
      const doc=els.frame.contentDocument; if(!doc||!doc.head) return;
      const style=doc.createElement('style');
      style.textContent=`
      .training-header,.exercise-intro,.decision-panel,.takeaway,#podsumowanie,.site-footer,.skip-link{display:none!important}
      body{background:#fff!important;overflow-x:hidden!important}
      main{padding:0!important;margin:0!important;max-width:none!important}
      .exercise-layout{display:block!important;grid-template-columns:1fr!important;max-width:none!important;margin:0!important;padding:0!important}
      .social-shell{max-width:none!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important}
      img{visibility:visible!important;opacity:1!important}
      .avatar,.post-avatar,.profile-photo,.profile-avatar{visibility:visible!important;opacity:1!important}
      `; doc.head.appendChild(style);
    }catch(_){ }
  }

  function showHint(){
    if(state.answered) return; const profile=profiles[state.current]; if(state.hintsUsed>=profile.hints.length) return;
    const [title,text]=profile.hints[state.hintsUsed]; state.hintsUsed += 1;
    els.hintContent.hidden=false; els.hintContent.innerHTML += `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span>`;
    els.hintPenalty.textContent='Po użyciu wskazówki nadal możesz zdobyć maksymalnie 1 punkt za tę rundę.';
    if(state.hintsUsed>=profile.hints.length) els.hintButton.hidden=true; else els.hintButton.textContent='Pokaż drugą wskazówkę';
    save();
  }

  function selectCategory(button){
    if(state.answered) return;
    state.selected = button.dataset.category;
    document.querySelectorAll('.category-card').forEach(btn => { btn.classList.toggle('selected', btn===button); btn.setAttribute('aria-checked', btn===button ? 'true' : 'false'); });
    updateSubmitState(); save();
  }

  function submitAnswer(){
    if(!state.selected || state.answered) return;
    const button=[...document.querySelectorAll('.category-card')].find(btn=>btn.dataset.category===state.selected);
    answer(state.selected, button);
  }

  function answer(category, button){
    const profile=profiles[state.current]; const correct = category===profile.answer; const points = correct ? (state.hintsUsed>0 ? 1 : 2) : 0;
    state.answered=true; state.score += points;
    state.results.push({ profileId:profile.id, name:profile.name, chosen:category, correctCategory:profile.answer, correct, points, hintsUsed:state.hintsUsed });
    document.querySelectorAll('.category-card').forEach(item => { item.disabled=true; if(item.dataset.category===profile.answer) item.classList.add('correct'); });
    if(!correct && button) button.classList.add('wrong');
    els.scoreValue.textContent=`${state.score} pkt`;
    els.feedback.hidden=false; els.feedback.className=`feedback ${correct?'good':'bad'}`;
    els.feedback.innerHTML=`<strong>${correct ? `Dobra odpowiedź — ${points} ${points === 1 ? 'punkt' : 'punkty'}.` : 'To nie jest najlepsza kategoria.'}</strong><span>Poprawna odpowiedź: <b>${escapeHtml(categories[profile.answer])}</b>. ${escapeHtml(profile.explanation)}</span>`;
    els.roundActions.hidden=false; els.analysisAccordion.open=false; els.hintButton.hidden=true; els.submitAnswer.disabled=true; els.submitAnswer.className='submit-button';
    loadAnalysis(profile); save(); els.feedback.scrollIntoView({block:'nearest',behavior:'smooth'});
  }

  async function loadAnalysis(profile){
    els.analysisAccordion.open=false;
    els.analysisContent.innerHTML='<p class="analysis-loading">Ładowanie omówienia…</p>';
    try {
      const embedded = window.PROFILE_ANALYSIS_HTML && window.PROFILE_ANALYSIS_HTML[String(profile.id)];
      if (embedded) {
        const parsed = new DOMParser().parseFromString(embedded,'text/html');
        const section = parsed.querySelector('#podsumowanie');
        if (!section) throw new Error('Brak lokalnego omówienia');
        els.analysisContent.innerHTML = buildAnalysisContent(section, profile);
        return;
      }

      const response = await fetch(profile.path, {cache:'no-store'});
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const source = await response.text();
      const parsed = new DOMParser().parseFromString(source,'text/html');
      const section = parsed.querySelector('#podsumowanie');
      if(!section) throw new Error('Brak sekcji podsumowania');
      els.analysisContent.innerHTML = buildAnalysisContent(section, profile);
    } catch(error){
      els.analysisContent.innerHTML = '<p>Nie udało się wczytać omówienia. Odśwież stronę i spróbuj ponownie.</p>';
      console.error('Błąd omówienia profilu:', error);
    }
  }

  function buildAnalysisContent(section, profile){
    const title = section.querySelector(':scope > h2'); const lead = section.querySelector(':scope > .takeaway-lead'); const grid = section.querySelector(':scope > .takeaway-grid'); const keyLesson = section.querySelector(':scope > .important-takeaway'); const groups=[];
    if(grid){
      const items = [...grid.children].map((article,index)=>{ const heading=article.querySelector('h3'); const number=article.querySelector(':scope > span'); const body=[...article.children].filter(node=>node!==heading && node!==number).map(node=>node.outerHTML).join(''); return `<details class="analysis-subsection"><summary><span class="analysis-number">${number ? escapeHtml(number.textContent.trim()) : String(index+1)}</span>${heading ? escapeHtml(heading.textContent.trim()) : `Element ${index+1}`}</summary><div>${body}</div></details>`; }).join('');
      groups.push(`<section class="analysis-group"><h4>Jak działa ten profil?</h4>${items}</section>`);
    }
    const labels = [['.evidence-panel','Sygnały widoczne w profilu'],['.revenue-proof','Dlaczego ten mechanizm się opłaca?'],['.scam-path','Jak przebiega oszustwo?'],['.polish-context','Kontekst polski'],['.warning-links','Co sprawdzić i gdzie szukać pomocy?'],['.sources','Źródła i podstawa ćwiczenia'],['.scenario-note','Nota metodologiczna']];
    labels.forEach(([selector,label])=>{ const node = section.querySelector(`:scope > ${selector}`); if(!node) return; groups.push(`<details class="analysis-section"><summary>${label}</summary><div class="analysis-section-body">${node.innerHTML}</div></details>`); });
    return `<div class="analysis-overview"><p class="analysis-category">Poprawna kategoria: <strong>${escapeHtml(categories[profile.answer])}</strong></p>${title ? `<h3>${escapeHtml(title.textContent.trim())}</h3>`:''}${lead ? `<p>${lead.innerHTML}</p>`:''}</div>${groups.join('')}${keyLesson ? `<div class="analysis-key">${keyLesson.innerHTML}</div>`:''}`;
  }

  function nextRound(){ if(!state.answered) return; state.current += 1; if(state.current >= profiles.length){ save(); renderResults(); setScreen('result'); } else { renderRound(); window.scrollTo({top:0,behavior:'smooth'}); } }
  function renderResults(){
    els.finalScore.textContent=state.score; let level;
    if(state.score>=9) level='Świetnie rozpoznajesz różnicę między autentycznością konta a wiarygodnością jego treści.';
    else if(state.score>=6) level='Masz dobrą czujność. Najwięcej zyskasz, analizując cały wzorzec działania, a nie pojedynczy post.';
    else if(state.score>=3) level='Dostrzegasz część sygnałów, ale emocjonalna treść lub profesjonalny wygląd profilu mogą odciągać uwagę od mechanizmu działania.';
    else level='To dobry moment, by przejść profile ponownie i korzystać ze wskazówek. Celem jest trening, nie sam wynik.';
    els.resultLevel.textContent=level;
    els.resultGrid.innerHTML = state.results.map(result=>{ const profile=profiles.find(item=>item.id===result.profileId); return `<article class="result-card ${result.correct?'correct':'incorrect'}"><span class="result-icon" aria-hidden="true">${profile.icon}</span><div><h3>${escapeHtml(result.name)} — ${result.correct?'poprawnie':'do ponownej analizy'}</h3><p>Twoja odpowiedź: ${escapeHtml(categories[result.chosen])}. Poprawna kategoria: ${escapeHtml(categories[result.correctCategory])}. Punkty: ${result.points}/2.</p></div></article>`; }).join('');
  }
  function reviewMistakes(){ const firstWrong=state.results.findIndex(result=>!result.correct); const index=firstWrong>=0?firstWrong:0; state.current=index; state.score=state.results.slice(0,index).reduce((sum,result)=>sum+result.points,0); state.results=state.results.slice(0,index); state.hintsUsed=0; state.answered=false; state.selected=null; save(); setScreen('game'); renderRound(); }
  function escapeHtml(value){ return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[char]); }
  function openModal(){ els.modal.hidden=false; document.body.style.overflow='hidden'; }
  function closeModal(){ els.modal.hidden=true; document.body.style.overflow=''; }

  els.start.addEventListener('click', startNew); els.resume.addEventListener('click', resume); els.restartTop.addEventListener('click', ()=>{ if(confirm('Usunąć zapisany wynik i rozpocząć grę od początku?')) startNew(); });
  els.hintButton.addEventListener('click', showHint); els.categoryGrid.addEventListener('click', event => { const button = event.target.closest('.category-card'); if(button) selectCategory(button); });
  els.submitAnswer.addEventListener('click', submitAnswer); els.nextRound.addEventListener('click', nextRound); els.playAgain.addEventListener('click', startNew); els.reviewMistakes.addEventListener('click', reviewMistakes); els.frame.addEventListener('load', prepareEmbeddedProfile);
  els.exitToMenu.addEventListener('click', ()=>{ if(confirm('Czy chcesz wrócić do menu głównego? Obecny postęp pozostanie zapisany.')) setScreen('intro'); });
  els.showInstructions.addEventListener('click', openModal); els.closeInstructions.addEventListener('click', closeModal); els.modal.addEventListener('click', e => { if(e.target===els.modal) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape' && !els.modal.hidden) closeModal(); });

  const saved = loadSaved(); if(saved && (saved.current>0 || saved.results.length>0)){ els.resume.hidden=false; }
})();
