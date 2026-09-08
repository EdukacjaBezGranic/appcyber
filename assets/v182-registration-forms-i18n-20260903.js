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
      ,'WUP Katowice / PUP Zabrze':'WUP Katowice / District Labour Office in Zabrze'
      ,'Sztuczna inteligencja w pracy szkolnego doradcy zawodowego':'Artificial intelligence in the work of a school career counsellor'
      ,'AI dla doradców':'AI for counsellors'
      ,'PUP Zabrze':'District Labour Office in Zabrze'
      ,'Szkolni doradcy zawodowi':'School career counsellors'
      ,'Szkolenie pokazuje, jak szkolny doradca zawodowy może praktycznie i odpowiedzialnie wykorzystywać narzędzia sztucznej inteligencji w swojej pracy.':'The training shows how school career counsellors can use artificial intelligence tools practically and responsibly in their work.'
      ,'Uczestnicy poznają zastosowania AI wspierające przygotowanie materiałów, pracę z informacją i działania doradcze, z uwzględnieniem bezpieczeństwa danych oraz kontroli jakości odpowiedzi.':'Participants explore AI applications that support material preparation, information work and career guidance, with attention to data security and response quality control.'
    });
    api.setLanguage?.(api.getLanguage?.() || 'pl');
    return true;
  };
  if(!add())document.addEventListener('DOMContentLoaded',add,{once:true});
})();
