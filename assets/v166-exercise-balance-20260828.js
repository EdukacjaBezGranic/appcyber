(()=>{
  const configs={
    clear:{
      correct:'wait',
      ok:'Tak. Dostępne informacje pokazują istotne braki w dowodach. Odpowiedzialna decyzja to wstrzymać wdrożenie do czasu niezależnego sprawdzenia skuteczności, ryzyka i zgodności z prawem.',
      bad:'Jeszcze nie. W danych brakuje informacji potrzebnych do odpowiedzialnego wdrożenia. Sama deklaracja „99%” nie wystarcza, a automatyczne odrzucenie wszystkich narzędzi AI również nie wynika z przedstawionych dowodów.',
      okEn:'Yes. The available information shows important evidence gaps. The responsible decision is to pause deployment until effectiveness, risk and legal compliance are independently checked.',
      badEn:'Not yet. The information needed for responsible deployment is missing. A “99%” claim alone is not enough, while automatically rejecting all AI tools is also not supported by the evidence shown.'
    },
    share:{
      correct:'official',
      ok:'Tak. Nie zwiększasz zasięgu błędnego zrzutu. Jeśli informacja jest przydatna, przekazujesz źródłowy komunikat i jasno opisujesz, co naprawdę wiadomo.',
      bad:'Jeszcze nie. Masz już lepsze źródło, które przeczy najważniejszej części posta. Udostępnienie zrzutu - nawet z zastrzeżeniem - nadal zwiększa zasięg błędnej informacji.',
      okEn:'Yes. You do not amplify the incorrect screenshot. If the information is useful, you share the primary announcement and clearly state what is actually known.',
      badEn:'Not yet. You already have a better source that contradicts the main claim. Sharing the screenshot - even with a caveat - still amplifies incorrect information.'
    }
  };
  const lang=()=>document.documentElement.lang?.toLowerCase().startsWith('en')?'en':'pl';
  document.querySelectorAll('[data-v166-check]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const key=btn.getAttribute('data-v166-check');
      const cfg=configs[key]; if(!cfg)return;
      const fs=document.querySelector(`[data-v166-question="${key}"]`);
      const fb=document.querySelector(`[data-v166-feedback="${key}"]`);
      const chosen=fs?.querySelector('input:checked');
      if(!chosen){
        if(fb){fb.className='v166-feedback is-wrong';fb.textContent=lang()==='en'?'Choose one answer first.':'Najpierw wybierz jedną odpowiedź.';}
        return;
      }
      const good=chosen.value===cfg.correct;
      if(fb){
        fb.className='v166-feedback '+(good?'is-correct':'is-wrong');
        fb.textContent=lang()==='en'?(good?cfg.okEn:cfg.badEn):(good?cfg.ok:cfg.bad);
      }
    });
  });
})();
