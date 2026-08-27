/*
  V154 — aktywne linki do anonimowej ankiety ewaluacyjnej.
  Linki prowadzą do formularzy respondentów Google Forms (PL / EN).
*/
(()=>{
  const FORM_URLS={
    pl:"https://docs.google.com/forms/d/e/1FAIpQLScPPHIwXHXyN3Gay4if8j3f4Uixz64qzAqrEvk0Ff5drKvs9w/viewform?usp=dialog",
    en:"https://docs.google.com/forms/d/e/1FAIpQLScAuYaZnnhjZC5ZuNcaKM-eeZT_kfVm-IagbaYjb9-NRMgSmA/viewform?usp=dialog"
  };

  const getLanguage=()=>{
    try{
      const lang=window.EBG_I18N&&typeof window.EBG_I18N.getLanguage==='function'
        ? window.EBG_I18N.getLanguage()
        : document.documentElement.lang;
      return lang==='en'?'en':'pl';
    }catch(_){return 'pl';}
  };

  const isSafeFormUrl=url=>/^https:\/\/(docs\.google\.com\/forms|forms\.gle)\//i.test(url||'');

  function applyEvaluationLink(){
    const button=document.querySelector('[data-evaluation-form-button]');
    const pending=document.querySelector('[data-evaluation-form-pending]');
    const ready=document.querySelector('[data-evaluation-form-ready]');
    if(!button)return;

    const language=getLanguage();
    const url=(FORM_URLS[language]||FORM_URLS.pl||'').trim();
    const enabled=isSafeFormUrl(url);

    button.disabled=!enabled;
    button.setAttribute('aria-disabled',enabled?'false':'true');
    if(pending)pending.hidden=enabled;
    if(ready)ready.hidden=!enabled;

    button.onclick=enabled?()=>window.open(url,'_blank','noopener,noreferrer'):null;
  }

  document.addEventListener('DOMContentLoaded',applyEvaluationLink,{once:true});
  document.addEventListener('ebg:language-changed',applyEvaluationLink);
})();
