(() => {
  'use strict';

  const STATE_KEY = 'ebgCourseR3State';
  const VERSION = 'R3-2026-08-30';
  const PASS_SCORE = 7;
  const MODULES = ['m1','m2','m3','m4','m5'];
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  const I18N = {
    pl: {
      lesson:'Lekcja', module:'Moduł', quiz:'Test modułowy', questions:'8 pytań - zaliczenie od 7/8',
      notPassed:'Jeszcze niezaliczony', passed:'Zaliczony', score:'Wynik', check:'Sprawdź test', retry:'Sprawdź ponownie',
      chooseAll:'Odpowiedz na wszystkie 8 pytań.', passedMsg:'Test zaliczony. Możesz przejść dalej.',
      failedMsg:'Jeszcze nie. Sprawdź zaznaczone odpowiedzi i spróbuj ponownie.', correct:'✓ Poprawna odpowiedź', wrong:'✕ Błędna odpowiedź',
      exerciseChoose:'Zaznacz odpowiedź w każdym pytaniu.', exerciseOk:'Dobrze - wszystkie odpowiedzi są poprawne.', exerciseSome:'Nie wszystkie odpowiedzi są poprawne. Sprawdź oznaczenia i wyjaśnienia.',
      completed:'Ukończone', markComplete:'Oznacz jako ukończone', unmark:'Cofnij oznaczenie ukończenia',
      saved:'Zapisano lokalnie.', imported:'Postęp został zaimportowany.', badImport:'Nie udało się odczytać pliku postępu.',
      resetConfirm:'Wyzerować cały postęp kursu?', search:'Szukaj w kursie...', noResults:'Brak wyników w planie kursu.',
      finalDone:'Kurs ukończony', finalInProgress:'Kurs w toku', finalText:(l,p)=>`Lekcje: ${l}/${totalLessons()}. Zaliczone testy: ${p}/${MODULES.length}.`,
      needName:'Wpisz imię i nazwisko, aby utworzyć dyplom.', pdfBuilding:'Trwa przygotowywanie dyplomu PDF…', pdfDone:'Dyplom PDF został utworzony.', pdfFail:'Nie udało się przygotować dyplomu.',
      diplomaTitle:'DYPLOM UKOŃCZENIA KURSU', receives:'otrzymuje', forCompletion:'za ukończenie kursu online',
      diplomaCourse:'Media Literacy, Fake News i Krytyczne Myślenie', diplomaSkills:'Uczestnik nabył umiejętności rozpoznawania dezinformacji i manipulacji, krytycznej oceny źródeł oraz odpowiedzialnego korzystania z informacji i mediów cyfrowych.'
    },
    en: {
      lesson:'Lesson', module:'Module', quiz:'Module quiz', questions:'8 questions - pass mark 7/8',
      notPassed:'Not passed yet', passed:'Passed', score:'Score', check:'Check quiz', retry:'Check again',
      chooseAll:'Answer all 8 questions.', passedMsg:'Quiz passed. You can continue.',
      failedMsg:'Not yet. Review the marked answers and try again.', correct:'✓ Correct answer', wrong:'✕ Incorrect answer',
      exerciseChoose:'Choose an answer for every question.', exerciseOk:'Good - all answers are correct.', exerciseSome:'Some answers are incorrect. Review the markings and explanations.',
      completed:'Completed', markComplete:'Mark as completed', unmark:'Undo completion',
      saved:'Saved locally.', imported:'Progress imported.', badImport:'Could not read the progress file.',
      resetConfirm:'Reset all course progress?', search:'Search the course...', noResults:'No results in the course plan.',
      finalDone:'Course completed', finalInProgress:'Course in progress', finalText:(l,p)=>`Lessons: ${l}/${totalLessons()}. Passed quizzes: ${p}/${MODULES.length}.`,
      needName:'Enter your name to create the diploma.', pdfBuilding:'Preparing diploma PDF…', pdfDone:'Diploma PDF created.', pdfFail:'Could not create the diploma.',
      diplomaTitle:'COURSE COMPLETION DIPLOMA', receives:'awarded to', forCompletion:'for completing the online course',
      diplomaCourse:'Media Literacy, Fake News and Critical Thinking', diplomaSkills:'The participant developed skills in recognising misinformation and manipulation, critically evaluating sources, and using digital information and media responsibly.'
    }
  };

  const QUIZZES = {
    m1: [
      q('Co mówi duża liczba reakcji pod postem?','What does a large reaction count under a post tell us?',[
        ['Że twierdzenie jest prawdziwe.','That the claim is true.'],['Że treść wywołała duże zaangażowanie.','That the content generated strong engagement.'],['Że źródło zostało zweryfikowane.','That the source was verified.'],['Że post pochodzi z redakcji.','That the post comes from a newsroom.']],1),
      q('Dlaczego dwa konta mogą widzieć inny zestaw informacji?','Why can two accounts see different sets of information?',[
        ['Bo platformy personalizują rekomendacje na podstawie sygnałów i zachowań.','Because platforms personalise recommendations using signals and behaviour.'],['Bo prawda jest inna dla każdego użytkownika.','Because truth is different for each user.'],['Bo każde konto ma inne zasady prawne.','Because every account has different legal rules.'],['Tylko z powodu godziny logowania.','Only because of login time.']],0),
      q('Co najlepiej opisuje ekonomię uwagi?','What best describes the attention economy?',[
        ['Rywalizację o ograniczony czas i uwagę odbiorcy.','Competition for the audience’s limited time and attention.'],['System płacenia za każdą przeczytaną wiadomość.','A system of paying for every story read.'],['Wyłącznie reklamę polityczną.','Political advertising only.'],['Zakaz publikowania długich tekstów.','A ban on publishing long texts.']],0),
      q('Kiedy nagłówek staje się problematyczny?','When does a headline become problematic?',[
        ['Gdy jest krótki.','When it is short.'],['Gdy zawiera czasownik.','When it contains a verb.'],['Gdy sugeruje wniosek mocniejszy niż treść artykułu.','When it suggests a conclusion stronger than the article supports.'],['Gdy pojawia się na stronie głównej.','When it appears on the home page.']],2),
      q('Co może zniknąć przy dalszym udostępnianiu informacji?','What can disappear as information is reshared?',[
        ['Data, autor i link do pełnego kontekstu.','Date, author and link to full context.'],['Tylko emotikony.','Only emojis.'],['Wyłącznie reklamy.','Only advertisements.'],['Zawsze sama treść informacji.','Always the information itself.']],0),
      q('Czym różni się bańka filtrująca od komory pogłosowej?','How does a filter bubble differ from an echo chamber?',[
        ['Bańka wiąże się z personalizacją ekspozycji, a komora także ze społecznym wzmacnianiem podobnych poglądów.','A filter bubble concerns personalised exposure, while an echo chamber also involves social reinforcement of similar views.'],['Nie ma żadnej różnicy.','There is no difference.'],['Komora dotyczy wyłącznie telewizji.','An echo chamber concerns television only.'],['Bańka jest zawsze celową dezinformacją.','A filter bubble is always deliberate disinformation.']],0),
      q('Jak AI zmienia obieg informacji?','How does AI change information circulation?',[
        ['Może przyspieszać tworzenie i skalowanie treści, ale nie gwarantuje ich prawdziwości.','It can accelerate and scale content creation but does not guarantee truth.'],['Automatycznie usuwa fałszywe informacje.','It automatically removes false information.'],['Sprawia, że źródła nie są potrzebne.','It makes sources unnecessary.'],['Dotyczy tylko grafiki.','It concerns images only.']],0),
      q('Jaki jest pierwszy sensowny krok przed oceną prawdziwości treści?','What is a sensible first step before judging a message as true?',[
        ['Zauważyć, kto ją tworzy i jak do nas dotarła.','Notice who created it and how it reached us.'],['Sprawdzić liczbę lajków.','Check the number of likes.'],['Przeczytać wyłącznie komentarze.','Read comments only.'],['Udostępnić i zapytać znajomych.','Share it and ask friends.']],0)
    ],
    m2: [
      q('Co zwykle robi silna emocja w pierwszych sekundach kontaktu z przekazem?','What does strong emotion often do in the first seconds of seeing a message?',[
        ['Może przyspieszyć ocenę przed sprawdzeniem dowodów.','It can speed up judgement before evidence is checked.'],['Zawsze poprawia dokładność oceny.','It always improves accuracy.'],['Wyłącza pamięć długotrwałą.','It switches off long-term memory.'],['Nie ma wpływu na decyzje.','It has no effect on decisions.']],0),
      q('Czym jest heurystyka?','What is a heuristic?',[
        ['Uproszczoną regułą myślenia pomagającą szybko podjąć decyzję.','A simplified thinking rule that helps make quick decisions.'],['Rodzajem złośliwego oprogramowania.','A type of malware.'],['Formalnym dowodem naukowym.','A formal scientific proof.'],['Techniką montażu filmowego.','A video editing technique.']],0),
      q('Na czym polega błąd potwierdzenia?','What is confirmation bias?',[
        ['Łatwiej przyjmujemy informacje zgodne z tym, co już sądzimy.','We more readily accept information that fits what we already believe.'],['Wierzymy tylko informacjom negatywnym.','We believe only negative information.'],['Nie pamiętamy źródeł.','We cannot remember sources.'],['Zawsze ufamy ekspertom.','We always trust experts.']],0),
      q('Dlaczego powtarzane twierdzenie może zacząć wydawać się prawdziwsze?','Why can a repeated claim start to feel more true?',[
        ['Znajomość przekazu może zostać pomylona z wiarygodnością.','Familiarity can be mistaken for credibility.'],['Powtórzenie automatycznie tworzy dowód.','Repetition automatically creates evidence.'],['Algorytm sprawdza je przed kolejnym pokazaniem.','The algorithm verifies it before showing it again.'],['Każde powtórzenie pochodzi z nowego źródła.','Every repetition comes from a new source.']],0),
      q('Co najlepiej opisuje społeczny dowód słuszności?','What best describes social proof?',[
        ['Traktowanie zachowania innych jako wskazówki, co jest wiarygodne lub właściwe.','Using other people’s behaviour as a cue to what is credible or appropriate.'],['Dowód z dokumentu urzędowego.','Evidence from an official document.'],['Weryfikację przez dwie redakcje.','Verification by two newsrooms.'],['Liczenie komentarzy botów.','Counting bot comments.']],0),
      q('Dlaczego niepewność sprzyja prostym narracjom?','Why can uncertainty favour simple narratives?',[
        ['Proste wyjaśnienie może dawać szybkie poczucie porządku i kontroli.','A simple explanation can quickly restore a sense of order and control.'],['Bo wszystkie proste wyjaśnienia są prawdziwe.','Because all simple explanations are true.'],['Bo wtedy media przestają działać.','Because media stop working then.'],['Bo ludzie nie odczuwają emocji.','Because people stop feeling emotion.']],0),
      q('Co tworzy zasięg treści w internecie?','What shapes content reach online?',[
        ['Połączenie technologii, psychologii i relacji społecznych.','A combination of technology, psychology and social relationships.'],['Wyłącznie jakość merytoryczna.','Content quality alone.'],['Tylko płatna reklama.','Paid advertising only.'],['Wyłącznie liczba obserwujących autora.','Only the author’s follower count.']],0),
      q('Co oznacza „zatrzymaj reakcję, nie ciekawość”?','What does “pause the reaction, not the curiosity” mean?',[
        ['Nie udostępniać pod wpływem impulsu, ale nadal sprawdzać i pytać.','Do not share impulsively, but keep checking and asking questions.'],['Ignorować wszystkie emocjonalne informacje.','Ignore all emotional information.'],['Przestać korzystać z mediów społecznościowych.','Stop using social media.'],['Odpowiadać dopiero następnego dnia bez sprawdzania.','Reply the next day without checking.']],0)
    ],
    m3: [
      q('Co oznacza fałszywy kontekst?','What is false context?',[
        ['Autentyczny materiał zostaje opisany tak, jakby dotyczył innego miejsca, czasu lub zdarzenia.','Authentic material is presented as if it concerned another place, time or event.'],['Zdjęcie ma słabą jakość.','An image has low quality.'],['Autor używa pseudonimu.','The author uses a nickname.'],['Tekst zawiera błąd ortograficzny.','The text contains a spelling mistake.']],0),
      q('Który element może zmienić znaczenie przekazu bez zmiany samego zdjęcia?','Which element can change a message’s meaning without changing the image itself?',[
        ['Podpis i kontekst publikacji.','The caption and publication context.'],['Rozdzielczość monitora.','Screen resolution.'],['Kolor przycisku udostępniania.','The colour of the share button.'],['Liczba otwartych kart w przeglądarce.','The number of browser tabs.']],0),
      q('Na czym polega podszywanie się pod źródło?','What is source impersonation?',[
        ['Na tworzeniu profilu, strony lub domeny przypominającej wiarygodną instytucję lub medium.','Creating a profile, site or domain resembling a trusted institution or outlet.'],['Na cytowaniu oficjalnego dokumentu.','Quoting an official document.'],['Na podaniu nazwiska autora.','Providing the author’s name.'],['Na publikacji sprostowania.','Publishing a correction.']],0),
      q('Co oznacza 4O „Odkształć”?','What does the 4O step “Distort” mean?',[
        ['Zmienić znaczenie faktu przez selekcję, przesadę lub wyrwanie z kontekstu.','Change the meaning of a fact through selection, exaggeration or removal from context.'],['Usunąć konto autora.','Delete the author’s account.'],['Sprawdzić źródło pierwotne.','Check the primary source.'],['Zgłosić phishing.','Report phishing.']],0),
      q('Dlaczego skoordynowana operacja wpływu może być bardziej przekonująca niż pojedynczy fake?','Why can a coordinated influence operation be more convincing than a single fake?',[
        ['Kilka pozornie niezależnych elementów może wzajemnie się „potwierdzać”.','Several seemingly independent elements can appear to confirm one another.'],['Zawsze używa lepszej grafiki.','It always uses better graphics.'],['Jest publikowana tylko przez media państwowe.','It is published only by state media.'],['Nie wywołuje emocji.','It does not trigger emotion.']],0),
      q('Co w case Polska-Czechy uzasadniało rosyjski trop?','What supported the Russian lead in the Poland-Czechia case?',[
        ['Silne podobieństwo użytych technik do wcześniej znanych rosyjskich metod wpływu.','Strong similarity between the techniques used and previously known Russian influence methods.'],['Sama obecność języka czeskiego.','The presence of Czech language alone.'],['Każda krytyka Polski w internecie.','Any criticism of Poland online.'],['Jedno anonimowe konto.','One anonymous account.']],0),
      q('Czy materiał syntetyczny jest automatycznie dezinformacją?','Is synthetic media automatically misinformation?',[
        ['Nie. Znaczenie zależy od sposobu użycia, oznaczenia i intencji.','No. It depends on how it is used, labelled and intended.'],['Tak, zawsze.','Yes, always.'],['Tylko jeśli jest filmem.','Only if it is video.'],['Tylko gdy wygląda realistycznie.','Only when it looks realistic.']],0),
      q('Dlaczego tematy wrażliwe wymagają większej ostrożności?','Why do sensitive topics require extra caution?',[
        ['Wyższa stawka emocjonalna może ułatwiać polaryzację i pochopne wnioski.','Higher emotional stakes can make polarisation and hasty conclusions easier.'],['Bo nie wolno ich sprawdzać.','Because they must not be verified.'],['Bo zawsze są fałszywe.','Because they are always false.'],['Bo nie istnieją źródła pierwotne.','Because primary sources do not exist.']],0)
    ],
    m4: [
      q('Od czego najlepiej zacząć weryfikację?','What is the best place to start verification?',[
        ['Od precyzyjnego nazwania sprawdzanego twierdzenia.','By precisely naming the claim being checked.'],['Od opinii w komentarzach.','From opinions in the comments.'],['Od liczby udostępnień.','From share count.'],['Od szukania autora na zdjęciach.','By searching for photos of the author.']],0),
      q('Dlaczego źródło pierwotne jest ważne?','Why is the primary source important?',[
        ['Pozwala zobaczyć oryginalny dokument, wypowiedź, dane lub materiał bez kolejnych warstw interpretacji.','It lets us see the original document, statement, data or material without added interpretation layers.'],['Zawsze jest krótsze.','It is always shorter.'],['Zawsze potwierdza przekaz z mediów społecznościowych.','It always confirms social media posts.'],['Nie wymaga oceny wiarygodności.','It does not require credibility assessment.']],0),
      q('Na czym polega czytanie lateralne?','What is lateral reading?',[
        ['Na wyjściu poza badaną stronę i sprawdzeniu, co mówią o niej niezależne źródła.','Leaving the page and checking what independent sources say about it.'],['Na czytaniu tylko nagłówków.','Reading headlines only.'],['Na przewijaniu strony w bok.','Scrolling sideways.'],['Na porównywaniu wielkości czcionek.','Comparing font sizes.']],0),
      q('Co oznacza triangulacja dowodów?','What does evidence triangulation mean?',[
        ['Porównanie kilku niezależnych źródeł lub typów dowodów dotyczących tego samego twierdzenia.','Comparing several independent sources or evidence types about the same claim.'],['Znalezienie trzech identycznych kopii tego samego posta.','Finding three identical copies of the same post.'],['Sprawdzenie trzech komentarzy.','Checking three comments.'],['Użycie trzech wyszukiwarek bez otwierania wyników.','Using three search engines without opening results.']],0),
      q('Do czego może pomóc Google Lens przy zdjęciu?','How can Google Lens help with an image?',[
        ['W znalezieniu wcześniejszych publikacji i podobnych obrazów, które pomagają ustalić pochodzenie i kontekst.','Finding earlier publications and similar images that help establish origin and context.'],['W potwierdzeniu prawdziwości każdego podpisu.','Confirming the truth of every caption.'],['W ustaleniu intencji autora z pełną pewnością.','Determining the author’s intent with certainty.'],['W automatycznym wykryciu każdej manipulacji.','Automatically detecting every manipulation.']],0),
      q('Co pokazał case AFP z filmem przedstawianym jako nagranie z Polski?','What did the AFP case of a video presented as filmed in Poland show?',[
        ['Autentyczny film może zostać użyty z fałszywą informacją o miejscu.','An authentic video can be used with false information about location.'],['Każdy film z autobusu jest zmanipulowany.','Every bus video is manipulated.'],['AFP ocenia wiarygodność po liczbie lajków.','AFP judges credibility by likes.'],['Film był wygenerowany przez AI.','The video was AI-generated.']],0),
      q('Co pokazał drugi case AFP ze starym zdjęciem?','What did the second AFP case with an old image show?',[
        ['Prawdziwe zdjęcie może zostać przedstawione jako bieżące wydarzenie przez zmianę kontekstu czasu.','A real image can be presented as a current event by changing the time context.'],['Stare zdjęcia są zawsze fałszywe.','Old images are always false.'],['Daty publikacji nie mają znaczenia.','Publication dates do not matter.'],['Wyszukiwanie obrazem zastępuje wszystkie inne kroki.','Reverse image search replaces all other steps.']],0),
      q('Jaki powinien być końcowy wniosek fact-checkingu?','What should a fact-checking conclusion be like?',[
        ['Nie mocniejszy niż pozwalają na to zebrane dowody i ich ograniczenia.','No stronger than the evidence and its limitations allow.'],['Zawsze jednoznacznie „prawda” albo „fałsz”.','Always simply “true” or “false”.'],['Zgodny z pierwszym wrażeniem.','Consistent with the first impression.'],['Jak najbardziej stanowczy, niezależnie od danych.','As decisive as possible regardless of evidence.']],0)
    ],
    m5: [
      q('Co należy zrobić po zakończeniu weryfikacji?','What comes after verification?',[
        ['Dobrać reakcję do ryzyka, zasięgu i odbiorcy.','Choose a response proportionate to risk, reach and audience.'],['Zawsze opublikować publiczne dementi.','Always publish a public rebuttal.'],['Zawsze zgłosić konto policji.','Always report the account to police.'],['Udostępnić fałsz z ostrzeżeniem.','Share the falsehood with a warning.']],0),
      q('Czym różni się prebunking od debunkingu?','How does prebunking differ from debunking?',[
        ['Prebunking przygotowuje przed kontaktem z manipulacją, debunking prostuje ją po fakcie.','Prebunking prepares people before exposure; debunking corrects after the fact.'],['Nie ma różnicy.','There is no difference.'],['Debunking dotyczy tylko phishingu.','Debunking only concerns phishing.'],['Prebunking polega na usuwaniu kont.','Prebunking means deleting accounts.']],0),
      q('Jaki ton zwykle pomaga w rozmowie z osobą, która udostępniła fałszywą informację?','What tone usually helps when talking to someone who shared false information?',[
        ['Wspólne sprawdzenie źródła bez upokarzania rozmówcy.','Checking the source together without humiliating the person.'],['Publiczne wyśmianie.','Public ridicule.'],['Zasypanie dziesiątkami linków.','Flooding them with dozens of links.'],['Natychmiastowe zerwanie rozmowy.','Immediately ending the conversation.']],0),
      q('Co zrobić z podejrzanym linkiem podszywającym się pod instytucję?','What should you do with a suspicious link impersonating an institution?',[
        ['Nie klikać, sprawdzić oficjalny kanał i zgłosić incydent.','Do not click; verify through an official channel and report the incident.'],['Kliknąć, aby zobaczyć dokąd prowadzi.','Click to see where it goes.'],['Odpisać danymi testowymi.','Reply with test data.'],['Przesłać znajomym do oceny.','Forward it to friends for evaluation.']],0),
      q('Dlaczego nie zawsze warto publicznie dementować niszowy fake?','Why is a public rebuttal not always best for a niche falsehood?',[
        ['Może niepotrzebnie zwiększyć jego zasięg.','It may unnecessarily increase its reach.'],['Bo każdy fake znika sam.','Because every fake disappears on its own.'],['Bo instytucje nie powinny prostować informacji.','Because institutions should not correct information.'],['Bo komentarze są zawsze lepsze.','Because comments are always better.']],0),
      q('Co oznacza higiena informacyjna?','What is information hygiene?',[
        ['Zarządzanie ekspozycją i uwagą tak, by zachować zdolność spokojnej oceny informacji.','Managing exposure and attention so we retain the capacity for calm evaluation.'],['Unikanie wszystkich trudnych wiadomości.','Avoiding all difficult news.'],['Czytanie tylko jednego zaufanego serwisu.','Reading only one trusted outlet.'],['Wyłączenie internetu na stałe.','Permanently switching off the internet.']],0),
      q('Co sprawdza przypomnienie SHARE przed udostępnieniem?','What does the SHARE reminder check before sharing?',[
        ['Źródło, możliwą szkodę, dokładność, powód udostępnienia i emocję.','Source, potential harm, accuracy, reason for sharing and emotion.'],['Tylko autora i datę.','Only author and date.'],['Wyłącznie liczbę reakcji.','Only reaction count.'],['Czy post ma zdjęcie.','Whether the post has an image.']],0),
      q('Jak brzmi końcowy skrót całego kursu?','What is the course’s final three-step reminder?',[
        ['Zatrzymaj - Sprawdź - Zareaguj.','Pause - Verify - Respond.'],['Kliknij - Udostępnij - Skomentuj.','Click - Share - Comment.'],['Przeczytaj - Polub - Zapisz.','Read - Like - Save.'],['Zgłoś - Usuń - Zapomnij.','Report - Delete - Forget.']],0)
    ]
  };

  function q(pl,en,opts,correct){ return {pl,en,opts,correct}; }

  function defaultState(){ return {version:VERSION,lang:'pl',completed:[],quizzes:{},name:'',updatedAt:new Date().toISOString()}; }
  function loadState(){
    try { const raw = JSON.parse(localStorage.getItem(STATE_KEY)); return raw && typeof raw==='object' ? {...defaultState(),...raw,completed:Array.isArray(raw.completed)?raw.completed:[],quizzes:raw.quizzes||{}} : defaultState(); }
    catch { return defaultState(); }
  }
  let state = loadState();
  function saveState(message=true){ state.updatedAt=new Date().toISOString(); localStorage.setItem(STATE_KEY,JSON.stringify(state)); if(message) flashSave(t().saved); updateAll(); }
  function t(){ return I18N[state.lang] || I18N.pl; }
  function currentLang(){ return state.lang==='en'?'en':'pl'; }
  function txt(pair){ return pair[currentLang()==='en'?1:0]; }

  function setLanguage(lang){
    state.lang = lang==='en'?'en':'pl';
    document.documentElement.lang = state.lang;
    $$('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===state.lang)));
    const search=$('#courseSearch'); if(search) search.placeholder=t().search;
    const name=$('#participantName'); if(name) name.placeholder=state.lang==='en'?'Name and surname':'Imię i nazwisko';
    renderSidebar(); renderQuizzes(); updateExerciseStatusLabels(); updateAll(); localStorage.setItem(STATE_KEY,JSON.stringify(state));
  }

  function moduleTitle(article){ const el=article.querySelector('.module-hero h2 .lang-'+currentLang()); return el?.textContent.trim()||article.id; }
  function sectionTitle(sec){ const el=sec.querySelector('h3 .lang-'+currentLang()); return el?.textContent.trim()||sec.id; }

  function renderSidebar(){
    const nav=$('#sidebarNav'); if(!nav) return; nav.innerHTML='';
    $$('.course-module').forEach((article,i)=>{
      const wrap=document.createElement('div'); wrap.className='sidebar-module';
      const button=document.createElement('button'); button.type='button'; button.className='sidebar-module__button';
      button.innerHTML=`<span>${i+1}</span><span>${escapeHtml(moduleTitle(article))}<small>${article.querySelectorAll(':scope > .required-section').length} ${t().lesson.toLowerCase()}${currentLang()==='pl'?'i':''}</small></span>`;
      button.addEventListener('click',()=>showModule(article.dataset.module));
      wrap.appendChild(button);
      const list=document.createElement('div'); list.className='sidebar-lessons';
      article.querySelectorAll(':scope > .required-section').forEach(sec=>{
        const a=document.createElement('a'); a.href='#'+sec.id; a.dataset.target=sec.id; a.textContent=sectionTitle(sec); if(state.completed.includes(sec.id)) a.classList.add('is-complete');
        a.addEventListener('click',e=>{e.preventDefault();showModule(article.dataset.module,sec.id);}); list.appendChild(a);
      });
      const qa=document.createElement('a'); qa.href='#quiz-'+article.dataset.module; qa.dataset.target='quiz-'+article.dataset.module; qa.textContent=t().quiz; if(state.quizzes[article.dataset.module]?.passed) qa.classList.add('is-complete');
      qa.addEventListener('click',e=>{e.preventDefault();showModule(article.dataset.module,'quiz-'+article.dataset.module);}); list.appendChild(qa);
      wrap.appendChild(list); nav.appendChild(wrap);
    });
    filterSidebar();
  }

  function updateSections(){
    $$('.required-section').forEach(sec=>{
      const done=state.completed.includes(sec.id); sec.classList.toggle('is-complete',done);
      const btn=sec.querySelector('.section-complete'); if(!btn)return;
      btn.classList.toggle('is-complete',done); btn.setAttribute('aria-pressed',String(done)); btn.title=done?t().unmark:t().markComplete; btn.setAttribute('aria-label',done?t().unmark:t().markComplete);
    });
  }
  function toggleSection(sec){ const id=sec.id; if(state.completed.includes(id)) state.completed=state.completed.filter(x=>x!==id); else state.completed=[...state.completed,id]; saveState(false); renderSidebar(); renderQuizzes(); updateAll(); flashSave(t().saved); }

  function moduleLessonStatus(module){ const secs=$$(`#module-${module} > .required-section`); const done=secs.filter(sec=>state.completed.includes(sec.id)).length; return {done,total:secs.length,complete:secs.length>0&&done===secs.length}; }

  function renderQuizzes(){
    $$('.module-quiz').forEach(host=>{
      const module=host.dataset.quizModule, items=QUIZZES[module], stored=state.quizzes[module]||{};
      host.classList.toggle('is-passed',!!stored.passed); host.innerHTML='';
      const head=document.createElement('div'); head.className='quiz-head';
      const left=document.createElement('div'); left.innerHTML=`<p class="exercise-kicker">${escapeHtml(t().quiz)}</p><h3>${escapeHtml(module.toUpperCase())}: ${escapeHtml(t().quiz)}</h3><p>${escapeHtml(t().questions)}</p>`;
      const status=document.createElement('span'); status.className='quiz-status'; status.textContent=stored.passed?`${t().passed} - ${stored.score}/8`:t().notPassed; head.append(left,status); host.appendChild(head);
      const lessonStatus=moduleLessonStatus(module);
      const qwrap=document.createElement('div'); qwrap.className='quiz-questions';
      items.forEach((item,qi)=>{
        const field=document.createElement('fieldset'); field.className='quiz-question'; field.dataset.question=String(qi);
        const legend=document.createElement('legend'); legend.innerHTML=`<b>${qi+1}</b>${escapeHtml(currentLang()==='pl'?item.pl:item.en)}`; field.appendChild(legend);
        const list=document.createElement('div'); list.className='choice-list';
        item.opts.forEach((opt,oi)=>{
          const label=document.createElement('label'); label.className='choice';
          label.innerHTML=`<input type="radio" name="quiz-${module}-${qi}" value="${oi}"><span>${escapeHtml(txt(opt))}</span>`; list.appendChild(label);
        });
        field.appendChild(list); qwrap.appendChild(field);
      }); host.appendChild(qwrap);
      const actions=document.createElement('div'); actions.className='quiz-actions';
      const submit=document.createElement('button'); submit.type='button'; submit.className='quiz-submit'; submit.textContent=stored.attempts?t().retry:t().check;
      const result=document.createElement('span'); result.className='quiz-result';
      if(stored.score!=null) result.textContent=`${t().score}: ${stored.score}/8`; else if(!lessonStatus.complete) result.textContent=currentLang()==='pl'?`Test odblokuje się po ukończeniu lekcji modułu (${lessonStatus.done}/${lessonStatus.total}).`:`The quiz unlocks after completing the module lessons (${lessonStatus.done}/${lessonStatus.total}).`;
      submit.disabled=!lessonStatus.complete;
      actions.append(submit,result); host.appendChild(actions);
      const achievement=document.createElement('div'); achievement.className='achievement-row'; achievement.innerHTML=`<span>${currentLang()==='pl'?'Karta osiągnięcia modułu':'Module achievement card'}</span>`; const ab=document.createElement('button'); ab.type='button'; ab.disabled=!stored.passed; ab.textContent=currentLang()==='pl'?'Pobierz PDF':'Download PDF'; ab.addEventListener('click',()=>downloadAchievement(module)); achievement.appendChild(ab); host.appendChild(achievement);
      submit.addEventListener('click',()=>gradeQuiz(module,host,result,status,submit));
    });
  }

  function gradeQuiz(module,host,result,status,submit){
    const lessonStatus=moduleLessonStatus(module); if(!lessonStatus.complete){result.textContent=currentLang()==='pl'?`Najpierw ukończ wszystkie lekcje modułu (${lessonStatus.done}/${lessonStatus.total}).`:`Complete all module lessons first (${lessonStatus.done}/${lessonStatus.total}).`;return;}
    const items=QUIZZES[module]; let answered=0,score=0;
    host.querySelectorAll('.choice').forEach(c=>{c.classList.remove('is-correct','is-wrong'); c.querySelector('.choice-status')?.remove();});
    items.forEach((item,qi)=>{
      const field=host.querySelector(`[data-question="${qi}"]`); const selected=field.querySelector('input:checked'); if(!selected)return; answered++;
      const oi=Number(selected.value), selectedLabel=selected.closest('.choice'), correctInput=field.querySelector(`input[value="${item.correct}"]`), correctLabel=correctInput.closest('.choice');
      if(oi===item.correct){ score++; applyChoiceStatus(selectedLabel,true); } else { applyChoiceStatus(selectedLabel,false); applyChoiceStatus(correctLabel,true); }
    });
    if(answered<8){ result.textContent=t().chooseAll; result.style.color='var(--danger)'; return; }
    const passed=score>=PASS_SCORE, prev=state.quizzes[module]||{};
    state.quizzes[module]={score,passed,attempts:(prev.attempts||0)+1,updatedAt:new Date().toISOString()}; saveState(false);
    host.classList.toggle('is-passed',passed); result.textContent=`${t().score}: ${score}/8 - ${passed?t().passedMsg:t().failedMsg}`; result.style.color=passed?'var(--success)':'var(--danger)';
    status.textContent=passed?`${t().passed} - ${score}/8`:`${score}/8 - ${t().notPassed}`; submit.textContent=t().retry; const ab=host.querySelector('.achievement-row button'); if(ab)ab.disabled=!passed; renderSidebar(); updateAll();
  }

  function applyChoiceStatus(label,correct){
    if(!label)return; label.classList.add(correct?'is-correct':'is-wrong'); let s=label.querySelector('.choice-status'); if(!s){s=document.createElement('small');s.className='choice-status';label.querySelector('span')?.appendChild(s);} s.textContent=correct?t().correct:t().wrong;
  }

  function initExercises(){
    $$('.exercise').forEach(ex=>{
      ex.addEventListener('change',e=>{ if(e.target.matches('input[type="radio"],input[type="checkbox"]')){ const q=e.target.closest('.exercise-question'); q?.querySelectorAll('.choice').forEach(c=>c.classList.toggle('is-selected',!!c.querySelector('input:checked'))); } });
      ex.querySelector('.exercise-check')?.addEventListener('click',()=>gradeExercise(ex));
      ex.querySelector('.exercise-reset')?.addEventListener('click',()=>resetExercise(ex));
    });
  }
  function gradeExercise(ex){
    const qs=$$('.exercise-question',ex); let answered=0, correctCount=0;
    qs.forEach(qel=>{
      $$('.choice',qel).forEach(c=>{c.classList.remove('is-correct','is-wrong'); c.querySelector('.choice-status')?.remove();});
      const selected=qel.querySelector('input:checked'); if(!selected)return; answered++;
      const selectedLabel=selected.closest('.choice'); const isCorrect=selected.dataset.correct==='true'; if(isCorrect){correctCount++;applyChoiceStatus(selectedLabel,true);} else {applyChoiceStatus(selectedLabel,false); const ci=qel.querySelector('input[data-correct="true"]'); if(ci)applyChoiceStatus(ci.closest('.choice'),true);}
      const specific=isCorrect ? qel.dataset[`feedbackCorrect${currentLang()==='pl'?'Pl':'En'}`] : qel.dataset[`feedbackWrong${currentLang()==='pl'?'Pl':'En'}`];
      if(specific){ let note=qel.querySelector('.question-feedback'); if(!note){note=document.createElement('p');note.className='question-feedback';qel.appendChild(note);} note.textContent=specific; note.style.color=isCorrect?'var(--success)':'var(--danger)'; }
    });
    const feedback=ex.querySelector('.exercise-feedback'); if(!feedback)return;
    if(answered<qs.length){feedback.textContent=t().exerciseChoose;feedback.className='exercise-feedback bad';return;}
    const all=correctCount===qs.length; feedback.textContent=all?t().exerciseOk:t().exerciseSome; feedback.className='exercise-feedback '+(all?'ok':'bad');
  }
  function resetExercise(ex){ ex.querySelectorAll('input').forEach(i=>{i.checked=false}); ex.querySelectorAll('.choice').forEach(c=>c.classList.remove('is-selected','is-correct','is-wrong')); ex.querySelectorAll('.choice-status,.question-feedback').forEach(n=>n.remove()); const f=ex.querySelector('.exercise-feedback');if(f){f.textContent='';f.className='exercise-feedback';} }
  function updateExerciseStatusLabels(){ $$('.choice-status').forEach(s=>{ const c=s.closest('.choice'); s.textContent=c?.classList.contains('is-correct')?t().correct:t().wrong; }); }

  function initTooltips(){
    const tip=$('#courseTooltip'); if(!tip)return;
    const hide=()=>{tip.hidden=true; document.querySelectorAll('.term[aria-describedby]').forEach(el=>el.removeAttribute('aria-describedby'));};
    const show=(el)=>{
      const text=el.dataset[currentLang()==='pl'?'tooltipPl':'tooltipEn']; if(!text)return; tip.textContent=text; tip.hidden=false; tip.id='courseTooltip'; el.setAttribute('aria-describedby','courseTooltip');
      requestAnimationFrame(()=>positionTooltip(el,tip));
    };
    $$('.term').forEach(el=>{
      el.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover) and (pointer:fine)').matches)show(el)}); el.addEventListener('mouseleave',()=>{if(matchMedia('(hover:hover) and (pointer:fine)').matches)hide()});
      el.addEventListener('focus',()=>show(el)); el.addEventListener('blur',hide); el.addEventListener('click',e=>{e.preventDefault(); if(!tip.hidden&&el.getAttribute('aria-describedby'))hide(); else show(el);});
    });
    document.addEventListener('pointerdown',e=>{if(!e.target.closest('.term')&&!e.target.closest('#courseTooltip'))hide();});
    addEventListener('scroll',()=>{ if(!tip.hidden){const el=document.querySelector('.term[aria-describedby]'); if(el)positionTooltip(el,tip);} },{passive:true});
    addEventListener('resize',hide);
  }
  function positionTooltip(el,tip){
    const mobile=innerWidth<=900; tip.style.left='';tip.style.right='';tip.style.top='';tip.style.bottom='';tip.style.maxWidth='';
    if(mobile){tip.style.left='12px';tip.style.right='12px';tip.style.bottom='12px';tip.style.maxWidth='none';return;}
    const r=el.getBoundingClientRect(), tr=tip.getBoundingClientRect(), margin=12, sidebar=$('.course-r1-sidebar'), minLeft=(sidebar&&sidebar.getBoundingClientRect().right>0?sidebar.getBoundingClientRect().right+10:margin);
    let left=Math.min(Math.max(r.left+r.width/2-tr.width/2,minLeft),innerWidth-tr.width-margin); let top=r.top-tr.height-10; if(top<margin)top=r.bottom+10;
    tip.style.left=Math.round(left)+'px';tip.style.top=Math.round(top)+'px';
  }

  function passedCount(){return MODULES.filter(m=>state.quizzes[m]?.passed).length;}
  function totalLessons(){return $$('.required-section').length;}
  function completedCount(){return $$('.required-section').filter(s=>state.completed.includes(s.id)).length;}
  function eligible(){return completedCount()===totalLessons()&&passedCount()===MODULES.length;}
  function coursePercent(){const total=totalLessons()+MODULES.length; return total?Math.round(((completedCount()+passedCount())/total)*100):0;}
  function updateProgress(){
    const pct=coursePercent(); $('#overallProgress')&&( $('#overallProgress').textContent=pct+'%' ); $('#overallProgressBar')&&( $('#overallProgressBar').style.width=pct+'%' );
    $('#finalPercent')&&( $('#finalPercent').textContent=pct+'%' ); $('#finalRing')?.style.setProperty('--pct',pct+'%');
    const title=$('#finalStatusTitle'); if(title) title.innerHTML=`<span class="lang-pl">${eligible()?'Kurs ukończony':'Kurs w toku'}</span><span class="lang-en">${eligible()?'Course completed':'Course in progress'}</span>`;
    $('#finalStatusText')&&( $('#finalStatusText').textContent=t().finalText(completedCount(),passedCount()) );
    const name=$('#participantName'); const ok=eligible() && (name?.value.trim().length||0)>=3; $('#downloadDiploma')&&( $('#downloadDiploma').disabled=!ok ); $('#printDiploma')&&( $('#printDiploma').disabled=!ok );
    const evaluation=$('#evaluationBox'); if(evaluation) evaluation.hidden=!eligible();
  }
  function updateAll(){ updateSections(); updateProgress(); }

  function setActiveModuleStep(module){
    $$('.hero-path__step').forEach(step=>step.classList.toggle('is-active',step.dataset.moduleStep===module));
  }
  function showModule(module,targetId=null,instant=false){
    const target=$('#module-'+module); if(!target)return;
    $$('.course-module').forEach(article=>article.hidden=article!==target);
    const final=$('#courseFinal'); if(final)final.hidden=true;
    setActiveModuleStep(module);
    document.body.dataset.activeModule=module;
    const scrollTarget=targetId?$('#'+targetId):target;
    requestAnimationFrame(()=>scrollTarget?.scrollIntoView({behavior:instant?'auto':'smooth',block:'start'}));
  }
  function showFinal(instant=false){
    $$('.course-module').forEach(article=>article.hidden=true);
    const final=$('#courseFinal'); if(final)final.hidden=false;
    setActiveModuleStep(''); document.body.dataset.activeModule='final';
    requestAnimationFrame(()=>final?.scrollIntoView({behavior:instant?'auto':'smooth',block:'start'}));
  }
  function moduleForElement(el){return el?.closest('.course-module')?.dataset.module||null;}

  function initNavigation(){
    $('#startCourse')?.addEventListener('click',()=>showModule('m1','r2-m1-1'));
    $('#continueCourse')?.addEventListener('click',()=>{
      const first=$$('.required-section').find(sec=>!state.completed.includes(sec.id));
      if(first){const module=moduleForElement(first); return showModule(module,first.id);}
      const q=MODULES.find(m=>!state.quizzes[m]?.passed); if(q)return showModule(q,'quiz-'+q);
      showFinal();
    });
    $$('[data-module-nav]').forEach(btn=>btn.addEventListener('click',()=>{
      const article=btn.closest('.course-module'), all=$$('.course-module'), i=all.indexOf(article), dir=btn.dataset.moduleNav==='next'?1:-1, target=all[i+dir];
      if(target)return showModule(target.dataset.module);
      if(dir>0)return showFinal();
    }));
    $$('.hero-path__step').forEach(step=>step.addEventListener('click',()=>showModule(step.dataset.moduleStep)));
    $('#finalBackToM5')?.addEventListener('click',()=>showModule('m5'));
    const sidebar=$('#courseSidebar'), backdrop=$('.sidebar-backdrop'); const open=()=>{sidebar?.classList.add('is-open');backdrop&&(backdrop.hidden=false);$('.sidebar-open')?.setAttribute('aria-expanded','true')}; const close=()=>{sidebar?.classList.remove('is-open');backdrop&&(backdrop.hidden=true);$('.sidebar-open')?.setAttribute('aria-expanded','false')};
    $('.sidebar-open')?.addEventListener('click',open); $('.sidebar-close')?.addEventListener('click',close); backdrop?.addEventListener('click',close); $('#sidebarNav')?.addEventListener('click',e=>{if((e.target.closest('a')||e.target.closest('.sidebar-module__button'))&&innerWidth<=900)close()});

    const hash=(location.hash||'').slice(1), hashEl=hash&&$('#'+hash); const hashModule=moduleForElement(hashEl);
    if(hash==='courseFinal')showFinal(true); else if(hashModule)showModule(hashModule,hash,true); else showModule('m1',null,true);
  }

  function initSearch(){ $('#courseSearch')?.addEventListener('input',filterSidebar); }
  function filterSidebar(){ const input=$('#courseSearch'), nav=$('#sidebarNav'); if(!input||!nav)return; const needle=input.value.trim().toLocaleLowerCase(); $$('.sidebar-module',nav).forEach(mod=>{ let any=false; $$('.sidebar-lessons a',mod).forEach(a=>{const show=!needle||a.textContent.toLocaleLowerCase().includes(needle)||mod.querySelector('.sidebar-module__button').textContent.toLocaleLowerCase().includes(needle);a.hidden=!show;any ||= show;}); mod.hidden=!any;}); }

  function initExportImport(){
    $('#exportProgress')?.addEventListener('click',()=>{ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`edukacja-bez-granic-kurs-r3-postep-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    $('#importProgress')?.addEventListener('click',()=>$('#importProgressFile')?.click());
    $('#importProgressFile')?.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!data||!Array.isArray(data.completed)||typeof data.quizzes!=='object')throw Error('bad');state={...defaultState(),...data,completed:data.completed,quizzes:data.quizzes};saveState(false);setLanguage(state.lang);flashSave(t().imported);}catch{flashSave(t().badImport,true);}e.target.value='';});
    $('#resetProgress')?.addEventListener('click',()=>{if(!confirm(t().resetConfirm))return;state=defaultState();localStorage.removeItem(STATE_KEY);setLanguage('pl');renderQuizzes();updateAll();});
  }
  function flashSave(message,bad=false){const el=$('#saveStatus');if(!el)return;el.textContent=message;el.style.color=bad?'var(--danger)':'var(--muted)';clearTimeout(flashSave.timer);flashSave.timer=setTimeout(()=>{el.innerHTML=`<span class="lang-pl">Postęp zapisuje się lokalnie w tej przeglądarce.</span><span class="lang-en">Progress is saved locally in this browser.</span>`;el.style.color='';},2800);}


  const MODULE_TITLES={
    m1:['Dlaczego widzę właśnie tę informację?','Why am I seeing this information?'],
    m2:['Dlaczego reaguję, zanim sprawdzę?','Why do I react before I verify?'],
    m3:['Jak buduje się manipulację?','How is manipulation constructed?'],
    m4:['Jak sprawdzać informacje?','How do I verify information?'],
    m5:['Co zrobić po sprawdzeniu?','What should I do after verification?']
  };
  async function achievementCanvas(module){const c=document.createElement('canvas');c.width=1240;c.height=1754;const x=c.getContext('2d');x.fillStyle='#f4f0e7';x.fillRect(0,0,c.width,c.height);x.fillStyle='#11261e';x.fillRect(0,0,c.width,230);x.fillStyle='#b8da2f';x.fillRect(0,230,c.width,14);x.textAlign='center';x.fillStyle='#fff';x.font='800 38px Arial';x.fillText(currentLang()==='pl'?'EDUKACJA BEZ GRANIC':'EDUCATION WITHOUT BORDERS',620,100);x.font='700 26px Arial';x.fillText(currentLang()==='pl'?'KURS ONLINE - MEDIA LITERACY':'ONLINE COURSE - MEDIA LITERACY',620,155);x.fillStyle='#17231e';x.font='800 46px Arial';x.fillText(currentLang()==='pl'?`KARTA OSIĄGNIĘCIA - MODUŁ ${module.slice(1)}`:`ACHIEVEMENT CARD - MODULE ${module.slice(1)}`,620,440);x.font='700 42px Arial';wrap(x,txt(MODULE_TITLES[module]),940).forEach((line,i)=>x.fillText(line,620,545+i*56));const score=state.quizzes[module]?.score||0;x.fillStyle='#2f7d4a';x.font='800 86px Arial';x.fillText(`${score}/8`,620,790);x.fillStyle='#5d6a64';x.font='400 31px Arial';x.fillText(currentLang()==='pl'?'Test modułowy zaliczony':'Module quiz passed',620,855);x.fillStyle='#17231e';x.font='600 28px Arial';x.fillText(new Date().toLocaleDateString(currentLang()==='pl'?'pl-PL':'en-GB'),620,1010);x.fillStyle='#5d6a64';x.font='400 27px Arial';wrap(x,currentLang()==='pl'?'Karta potwierdza ukończenie modułu i zaliczenie testu wynikiem co najmniej 7/8.':'This card confirms completion of the module and a quiz score of at least 7/8.',900).forEach((line,i)=>x.fillText(line,620,1130+i*40));x.strokeStyle='#cfd7d2';x.lineWidth=3;x.strokeRect(90,340,1060,980);return c;}
  async function downloadAchievement(module){if(!state.quizzes[module]?.passed)return;try{const c=await achievementCanvas(module),blob=makePdf(c),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(currentLang()==='pl'?`karta-osiagniecia-${module}-`:`achievement-card-${module}-`)+new Date().toISOString().slice(0,10)+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);}catch(e){console.error(e);flashSave(t().pdfFail,true);}}

  function initCertificate(){
    const name=$('#participantName'), dl=$('#downloadDiploma'), pr=$('#printDiploma'); if(!name||!dl||!pr)return; name.value=state.name||''; name.addEventListener('input',()=>{state.name=name.value.trim();localStorage.setItem(STATE_KEY,JSON.stringify(state));updateProgress();}); dl.addEventListener('click',downloadDiploma); pr.addEventListener('click',printDiploma); updateProgress();
  }
  function rounded(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
  function wrap(ctx,text,max){const words=String(text).split(/\s+/),out=[];let line='';for(const w of words){const test=line?line+' '+w:w;if(!line||ctx.measureText(test).width<=max)line=test;else{out.push(line);line=w}}if(line)out.push(line);return out}
  const enc=s=>new TextEncoder().encode(s); function b64(data){const str=atob(data.split(',')[1]),a=new Uint8Array(str.length);for(let i=0;i<str.length;i++)a[i]=str.charCodeAt(i);return a}
  function makePdf(canvas){const PW=595.28,PH=841.89,img=b64(canvas.toDataURL('image/jpeg',.92)),stream=`q ${PW} 0 0 ${PH} 0 0 cm /Im1 Do Q`,objs=[],chunks=[enc('%PDF-1.4\n')],offs=[0];objs[1]=enc('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');objs[2]=enc('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');objs[3]=enc(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);objs[4]=[enc(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`),img,enc('\nendstream\nendobj\n')];objs[5]=enc(`5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`);let len=chunks[0].length;for(let i=1;i<=5;i++){offs[i]=len;for(const p of (Array.isArray(objs[i])?objs[i]:[objs[i]])){chunks.push(p);len+=p.length}}const xoff=len;let x='xref\n0 6\n0000000000 65535 f \n';for(let i=1;i<=5;i++)x+=`${String(offs[i]).padStart(10,'0')} 00000 n \n`;x+=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xoff}\n%%EOF`;chunks.push(enc(x));return new Blob(chunks,{type:'application/pdf'})}
  async function diplomaCanvas(name){const c=document.createElement('canvas');c.width=1240;c.height=1754;const x=c.getContext('2d'),bg=new Image();await new Promise((res,rej)=>{bg.onload=res;bg.onerror=rej;bg.src=window.EBG_DIPLOMA_BACKGROUND||'grafiki/dyplom-media-literacy-tlo.png'});x.drawImage(bg,0,0,c.width,c.height);x.textAlign='center';x.fillStyle='#173f5c';x.font='700 38px Arial';x.fillText(t().diplomaTitle,620,860);x.fillStyle='#6b7f8c';x.font='400 24px Arial';x.fillText(t().receives,620,912);x.fillStyle='#123a56';x.font='700 64px Arial';const nl=wrap(x,name,900);nl.forEach((line,i)=>x.fillText(line,620,1010+i*70));const y=1010+(nl.length-1)*70;x.strokeStyle='#d8a928';x.lineWidth=3;x.beginPath();x.moveTo(220,y+34);x.lineTo(1020,y+34);x.stroke();x.fillStyle='#2d556f';x.font='400 26px Arial';x.fillText(t().forCompletion,620,y+94);x.font='700 34px Arial';x.fillText(t().diplomaCourse,620,y+146);x.fillStyle='#486678';x.font='400 24px Arial';wrap(x,t().diplomaSkills,820).forEach((line,i)=>x.fillText(line,620,y+208+i*34));return c;}
  async function downloadDiploma(){if(!eligible())return;const name=$('#participantName').value.trim();if(name.length<3)return flashSave(t().needName,true);const btn=$('#downloadDiploma');btn.disabled=true;flashSave(t().pdfBuilding);try{const c=await diplomaCanvas(name),blob=makePdf(c),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(currentLang()==='pl'?'dyplom-ukonczenia-kursu-r3-':'course-completion-diploma-r3-')+new Date().toISOString().slice(0,10)+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);flashSave(t().pdfDone);}catch(e){console.error(e);flashSave(t().pdfFail,true);}finally{updateProgress();}}
  async function printDiploma(){if(!eligible())return;const name=$('#participantName').value.trim();if(name.length<3)return flashSave(t().needName,true);const w=window.open('','_blank');if(!w)return;try{const img=(await diplomaCanvas(name)).toDataURL('image/png');w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(t().diplomaTitle)}</title><style>@page{size:A4;margin:0}body{margin:0}img{width:100%;display:block}</style></head><body><img src="${img}"><script>onload=()=>setTimeout(()=>print(),400)<\/script></body></html>`);w.document.close();}catch(e){w.close();console.error(e);}}

  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  function init(){
    document.documentElement.lang=state.lang;
    $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
    $$('.section-complete').forEach(btn=>btn.addEventListener('click',()=>toggleSection(btn.closest('.required-section'))));
    initNavigation(); initSearch(); initExercises(); initTooltips(); initExportImport(); initCertificate();
    renderSidebar(); renderQuizzes(); setLanguage(state.lang); updateAll();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
