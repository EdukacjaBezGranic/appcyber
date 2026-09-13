(()=>{
  'use strict';
  const add=()=>{
    const api=window.EBG_SITE_I18N;
    if(!api||!api.dict)return false;
    Object.assign(api.dict,{
      'Ta część serwisu jest przeznaczona dla osób prowadzących szkolenia w ramach projektu „Edukacja bez granic”. Po zalogowaniu znajdziesz tu materiały wspierające przygotowanie i realizację zajęć.':'This area is intended for people delivering training as part of the “Education without Borders” project. Once signed in, you will find materials to support the preparation and delivery of training sessions.',
      'Materiały prowadzącego':'Trainer materials',
      'scenariusze, prezentacje i wskazówki do realizacji zajęć':'session plans, presentations and guidance for delivering training',
      'Ćwiczenia i pliki':'Exercises and files',
      'karty pracy, materiały do wydruku i zasoby dla uczestników':'worksheets, printable materials and resources for participants',
      'Organizacja szkolenia':'Training delivery',
      'narzędzia i dokumentacja pomocna przed, w trakcie i po zajęciach':'tools and documentation useful before, during and after a training session',
      'Dostęp jest chroniony hasłem przekazanym osobom prowadzącym zajęcia.':'Access is protected by a password provided to authorised trainers.'
    });
    return true;
  };
  if(!add()) document.addEventListener('DOMContentLoaded',add,{once:true});
})();
