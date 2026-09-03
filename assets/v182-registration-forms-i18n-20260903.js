(()=>{
  'use strict';
  const add=()=>{
    const api=window.EBG_SITE_I18N;
    if(!api||!api.dict)return false;
    Object.assign(api.dict,{
      'Otwórz formularz zapisów':'Open registration form',
      'Formularz zapisów wkrótce':'Registration form coming soon',
      'Zapisy wkrótce':'Registration coming soon',
      'Zapisy zakończone':'Registration closed',
      'Sprawdź aktualne terminy w kalendarzu. Zapisy na opublikowane szkolenia prowadzimy przez formularze Google dostępne przy poszczególnych terminach. Pełne opisy programów znajdziesz na stronie':'Check the current dates in the calendar. Registration for published training sessions is handled through Google Forms available for each date. Full programme descriptions are available on the',
      'Po wybraniu szkolenia otwórz przypisany do niego formularz Google i prześlij zgłoszenie.':'After selecting a training session, open its Google Form and submit your registration.',
      'Wybierz termin, aby zobaczyć datę, godzinę, miejsce i dane do zapisu.':'Select a date to view the date, time, venue and registration details.',
      'Kontakt w sprawie zapisów:':'Registration contact:'
    });
    api.setLanguage?.(api.getLanguage?.() || 'pl');
    return true;
  };
  if(!add())document.addEventListener('DOMContentLoaded',add,{once:true});
})();
