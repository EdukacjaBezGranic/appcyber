(() => {
  'use strict';

  const STATE_KEY = 'ebgCourseR3State';
  const VERSION = 'R8.2-2026-08-30';
  const PASS_SCORE = 7;
  const MODULES = ['m1','m2','m3','m4','m5'];
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  const I18N = {
    pl: {
      lesson:'Lekcja', module:'Moduł', quiz:'Test modułowy', questions:'8 pytań - część ma 2 poprawne odpowiedzi - zaliczenie 7/8', multiHint:'Wybierz dokładnie 2 odpowiedzi.',
      notPassed:'Jeszcze niezaliczony', passed:'Zaliczony', score:'Wynik', check:'Sprawdź test', retry:'Sprawdź ponownie',
      chooseAll:'Odpowiedz na wszystkie 8 pytań. W pytaniach wielokrotnego wyboru zaznacz dokładnie 2 odpowiedzi.', passedMsg:'Test zaliczony. Możesz przejść dalej.',
      failedMsg:'Jeszcze nie. Sprawdź zaznaczone odpowiedzi i spróbuj ponownie.', correct:'✓ Poprawna odpowiedź', wrong:'✕ Błędna odpowiedź',
      exerciseChoose:'Zaznacz odpowiedź w każdym pytaniu.', exerciseOk:'Dobrze - wszystkie odpowiedzi są poprawne.', exerciseSome:'Nie wszystkie odpowiedzi są poprawne. Sprawdź oznaczenia i wyjaśnienia.',
      exerciseRetry:'Spróbuj ponownie', exerciseSolution:'Pokaż rozwiązanie', exerciseSolutionShown:'Rozwiązanie zostało pokazane. Przeczytaj wyjaśnienia przy odpowiedziach.',
      completed:'Ukończone', markComplete:'Zaznacz jako ukończone', unmark:'Cofnij oznaczenie ukończenia',
      saved:'Zapisano lokalnie.', imported:'Postęp został zaimportowany.', badImport:'Nie udało się odczytać pliku postępu.',
      resetConfirm:'Wyzerować cały postęp kursu?', search:'Szukaj w kursie...', noResults:'Brak wyników w planie kursu.',
      finalDone:'Kurs ukończony', finalInProgress:'Kurs w toku', finalText:(l,p)=>`Lekcje: ${l}/${totalLessons()}. Zaliczone testy: ${p}/${MODULES.length}.`,
      needName:'Wpisz imię i nazwisko, aby utworzyć dyplom.', pdfBuilding:'Trwa przygotowywanie dyplomu PDF…', pdfDone:'Dyplom PDF został utworzony.', pdfFail:'Nie udało się przygotować dyplomu.',
      diplomaTitle:'DYPLOM UKOŃCZENIA KURSU', receives:'otrzymuje', forCompletion:'za ukończenie kursu online',
      diplomaCourse:'Media Literacy, Fake News i Krytyczne Myślenie', diplomaSkills:'Uczestnik nabył umiejętności rozpoznawania dezinformacji i manipulacji, krytycznej oceny źródeł oraz odpowiedzialnego korzystania z informacji i mediów cyfrowych.'
    },
    en: {
      lesson:'Lesson', module:'Module', quiz:'Module quiz', questions:'8 questions - some have 2 correct answers - pass mark 7/8', multiHint:'Choose exactly 2 answers.',
      notPassed:'Not passed yet', passed:'Passed', score:'Score', check:'Check quiz', retry:'Check again',
      chooseAll:'Answer all 8 questions. In multiple-choice questions select exactly 2 answers.', passedMsg:'Quiz passed. You can continue.',
      failedMsg:'Not yet. Review the marked answers and try again.', correct:'✓ Correct answer', wrong:'✕ Incorrect answer',
      exerciseChoose:'Choose an answer for every question.', exerciseOk:'Good - all answers are correct.', exerciseSome:'Some answers are incorrect. Review the markings and explanations.',
      exerciseRetry:'Try again', exerciseSolution:'Show solution', exerciseSolutionShown:'The solution is shown. Read the explanation under each answer.',
      completed:'Completed', markComplete:'Mark as complete', unmark:'Undo completion',
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
      q('Post ma 24 tys. polubień i 8 tys. udostępnień. Co możemy stwierdzić na podstawie samych tych liczb?','A post has 24,000 likes and 8,000 shares. What can we conclude from those numbers alone?',[
        ['Autor jest wiarygodny, bo zdobył duży zasięg.','The author is credible because the post reached many people.'],
        ['Twierdzenie zostało potwierdzone przez użytkowników, którzy je polubili i udostępnili.','The claim has been verified by the users who liked and shared it.'],
        ['Treść wywołała duże zaangażowanie, ale liczby nie potwierdzają jej prawdziwości.','The content generated strong engagement, but the numbers do not prove it is true.'],
        ['Materiał pochodzi z profesjonalnej redakcji lub instytucji.','The material comes from a professional newsroom or institution.']],2),
      q('Dwie osoby korzystają z tej samej platformy, ale widzą inny zestaw treści. Które dwa czynniki mogą to realnie wyjaśniać?','Two people use the same platform but see different content. Which two factors can realistically explain this?',[
        ['Historia oglądania, kliknięć i czasu poświęcanego różnym treściom.','Their history of viewing, clicking and time spent on different content.'],
        ['To, że dla każdego użytkownika obowiązuje inna wersja faktów.','The fact that a different version of facts applies to each user.'],
        ['Obserwowane konta, grupy i wcześniejsze interakcje społeczne.','The accounts and groups they follow and their previous social interactions.'],
        ['Losowy dobór treści całkowicie niezależny od wcześniejszych zachowań.','A fully random content selection unrelated to previous behaviour.']],[0,2]),
      q('Serwis testuje kilka wersji tytułu i wybiera tę, która zatrzymuje odbiorców najdłużej. Jaki mechanizm najlepiej to opisuje?','A service tests several headline versions and chooses the one that holds attention longest. What mechanism best describes this?',[
        ['Weryfikację źródła pierwotnego i ograniczeń danych jeszcze przed publikacją materiału.','Verification of the primary source and data limitations before publication.'],
        ['Rywalizację o ograniczony czas i uwagę odbiorcy.','Competition for the audience’s limited time and attention.'],
        ['Czytanie lateralne wykonywane przez redakcję.','Lateral reading performed by the newsroom.'],
        ['Triangulację kilku niezależnych dowodów.','Triangulation of several independent pieces of evidence.']],1),
      q('Nagłówek brzmi „Program nie działa”, a tekst opisuje jedno badanie i zaznacza, że nie pozwala ocenić całego programu. Która ocena jest najtrafniejsza?','The headline says “The programme does not work”, while the article describes one study and says it cannot assess the whole programme. Which assessment is most accurate?',[
        ['Artykuł jest niewiarygodny, ponieważ sam autor przyznaje w treści, że badanie ma ograniczenia metodologiczne.','The article is unreliable because the author admits that the study has methodological limitations.'],
        ['Nagłówek jest poprawny, jeśli przyciąga uwagę do ważnego tematu.','The headline is acceptable if it draws attention to an important topic.'],
        ['Zastrzeżenie w tekście sprawia, że tytuł nie wpływa na odbiorcę.','The caveat in the body means the headline no longer affects readers.'],
        ['Nagłówek sugeruje wniosek mocniejszy niż ten, na który pozwala treść.','The headline suggests a stronger conclusion than the body supports.']],3),
      q('Post jest wielokrotnie kopiowany i udostępniany bez linku do pierwotnej publikacji. Które dwa elementy kontekstu najłatwiej mogą zniknąć po drodze?','A post is repeatedly copied and reshared without a link to the original publication. Which two pieces of context can most easily disappear along the way?',[
        ['Liczba osób obserwujących profil, który udostępnia kopię.','The number of followers of the account sharing the copy.'],
        ['Data oraz informacja, kiedy materiał został opublikowany po raz pierwszy.','The date and information about when the material was first published.'],
        ['Kolorystyka interfejsu platformy, na której widzimy kolejną kopię.','The interface colours of the platform where we see the next copy.'],
        ['Autor, źródło i zastrzeżenia widoczne dopiero w pełnym materiale.','The author, source and caveats visible only in the full material.']],[1,3]),
      q('Które zdanie najlepiej odróżnia bańkę filtrującą od komory pogłosowej?','Which statement best distinguishes a filter bubble from an echo chamber?',[
        ['Bańka dotyczy wyłącznie reklam, a komora wyłącznie wiadomości politycznych.','A filter bubble concerns only ads, while an echo chamber concerns only political news.'],
        ['Komora pogłosowa powstaje wyłącznie wtedy, gdy algorytm platformy technicznie usuwa wszystkie odmienne punkty widzenia.','An echo chamber exists only when the platform algorithm technically removes all opposing viewpoints.'],
        ['Bańka wiąże się z personalizacją ekspozycji, a komora także ze społecznym wzmacnianiem podobnych przekonań.','A filter bubble concerns personalised exposure, while an echo chamber also involves social reinforcement of similar beliefs.'],
        ['Oba pojęcia oznaczają dokładnie ten sam mechanizm rekomendacyjny.','Both terms describe exactly the same recommendation mechanism.']],2),
      q('Które dwa stwierdzenia trafnie opisują rolę AI w obiegu informacji?','Which two statements accurately describe the role of AI in information circulation?',[
        ['AI może przyspieszać tworzenie i skalowanie tekstów, obrazów, dźwięku i wideo.','AI can accelerate and scale the creation of text, images, audio and video.'],
        ['Treść wygenerowana przez AI jest automatycznie sprawdzona pod kątem faktów.','AI-generated content is automatically fact-checked.'],
        ['Jeżeli tekst brzmi płynnie i profesjonalnie, nie trzeba już sprawdzać jego źródeł.','If a text sounds fluent and professional, its sources no longer need checking.'],
        ['Płynny i przekonujący wynik AI może nadal zawierać błędy lub zmyślone informacje.','A fluent and convincing AI output can still contain errors or fabricated information.']],[0,3]),
      q('Widzisz alarmujący post, którego wcześniej nie znałeś. Jaki pierwszy krok najlepiej przygotowuje do dalszej oceny?','You see an alarming post you have not encountered before. Which first step best prepares you for further evaluation?',[
        ['Najpierw porównać ton i liczbę pozytywnych oraz negatywnych komentarzy, aby ocenić reakcję odbiorców.','First compare the tone and number of positive and negative comments to assess audience reaction.'],
        ['Ustalić, kto publikuje treść, czego dotyczy twierdzenie i jak materiał do nas dotarł.','Establish who published it, what the claim is and how the material reached us.'],
        ['Porównać liczbę reakcji z innymi postami na tym samym profilu.','Compare its reaction count with other posts on the same profile.'],
        ['Udostępnić materiał z pytaniem, czy ktoś potrafi go potwierdzić.','Share the material and ask whether anyone can confirm it.']],1)
    ],
    m2: [
      q('Czytasz post, który wywołuje silny gniew i natychmiast zachęca do udostępnienia. Co jest największym ryzykiem w pierwszych sekundach?','You read a post that triggers strong anger and immediately urges you to share it. What is the biggest risk in the first seconds?',[
        ['Silna emocja sprawi, że lepiej zapamiętasz wszystkie szczegóły źródła.','Strong emotion will make you remember every source detail better.'],
        ['Emocja automatycznie wskaże, która część informacji jest prawdziwa.','Emotion will automatically reveal which part of the information is true.'],
        ['Sama obecność emocjonalnego wezwania do działania pozwala uznać, że przekaz został celowo zmanipulowany.','The presence of an emotional call to action alone proves that the message was deliberately manipulated.'],
        ['Możesz ocenić i przekazać treść dalej, zanim sprawdzisz źródło oraz dowody.','You may judge and pass the content on before checking the source and evidence.']],3),
      q('Które dwie sytuacje pokazują działanie skrótu myślowego, a nie spokojnej analizy dowodów?','Which two situations show a mental shortcut rather than a careful analysis of evidence?',[
        ['Dramatyczny przykład łatwo przychodzi mi do głowy, więc uznaję zjawisko za częstsze niż wskazują dane.','A dramatic example comes easily to mind, so I judge the phenomenon as more common than the data suggest.'],
        ['Otwieram źródło pierwotne i sprawdzam, jak zdefiniowano badaną grupę.','I open the primary source and check how the studied group was defined.'],
        ['Widzę tysiące reakcji i traktuję popularność jako wskazówkę, że informacja prawdopodobnie jest poprawna.','I see thousands of reactions and treat popularity as a cue that the information is probably correct.'],
        ['Porównuję dane z dwóch niezależnych źródeł przed sformułowaniem wniosku.','I compare data from two independent sources before drawing a conclusion.']],[0,2]),
      q('Post potwierdza Twoje wcześniejsze przekonanie. Które zachowanie najlepiej ogranicza błąd potwierdzenia?','A post confirms your existing belief. Which behaviour best reduces confirmation bias?',[
        ['Udostępnić go szybko, zanim pojawi się więcej komentarzy podważających przekaz.','Share it quickly before more comments appear questioning the message.'],
        ['Sprawdzić przede wszystkim źródła, które wcześniej uznawałeś za wiarygodne i zgodne z własnym stanowiskiem.','Check primarily sources you previously considered credible and aligned with your own position.'],
        ['Zadać sobie takie same pytania o źródło i dowody jak przy informacji, z którą się nie zgadzasz.','Ask the same questions about source and evidence as you would for information you disagree with.'],
        ['Uznać zgodność z własnym doświadczeniem za wystarczające potwierdzenie.','Treat agreement with your own experience as sufficient confirmation.']],2),
      q('To samo twierdzenie pojawia się przez kilka dni na różnych kontach. Dlaczego może zacząć wydawać się bardziej wiarygodne, nawet bez nowych dowodów?','The same claim appears for several days on different accounts. Why can it start to feel more credible even without new evidence?',[
        ['Każde kolejne powtórzenie jest automatycznie niezależnym potwierdzeniem.','Each repetition automatically becomes independent confirmation.'],
        ['Znajomość i łatwość rozpoznania przekazu mogą zostać pomylone z jego prawdziwością.','Familiarity and ease of recognition can be mistaken for truth.'],
        ['Platforma przed kolejnym pokazaniem treści sprawdza jej zgodność z faktami.','The platform checks the content against facts before showing it again.'],
        ['Częste pojawianie się tej samej informacji na różnych kontach oznacza, że wszystkie dotarły do źródła pierwotnego.','Frequent appearance of the same information on different accounts means they all reached the primary source.']],1),
      q('Post ma bardzo dużo reakcji. Które dwa wnioski są jednocześnie poprawne?','A post has a very large number of reactions. Which two conclusions are both correct?',[
        ['Duża liczba reakcji dowodzi, że większość odbiorców przeczytała pełne źródło.','A high reaction count proves that most users read the full source.'],
        ['Popularność może wpływać na pierwsze wrażenie o wiarygodności przekazu.','Popularity can influence a first impression of a message’s credibility.'],
        ['Jeśli post jest popularny, dodatkowa weryfikacja zwykle nie jest już potrzebna.','If a post is popular, additional verification is usually unnecessary.'],
        ['Liczba reakcji mówi o zachowaniu odbiorców, ale nie rozstrzyga prawdziwości twierdzenia.','Reaction counts describe audience behaviour but do not establish whether the claim is true.']],[1,3]),
      q('W czasie kryzysu pojawia się proste wyjaśnienie wskazujące jednego sprawcę wszystkich problemów. Dlaczego taki przekaz może być atrakcyjny?','During a crisis, a simple explanation appears blaming one actor for every problem. Why can such a message be attractive?',[
        ['Ponieważ proste narracje zawsze trafniej opisują złożone wydarzenia.','Because simple narratives always describe complex events more accurately.'],
        ['Ponieważ przy braku pełnych danych odbiorcy zwykle uznają najbardziej zdecydowane wyjaśnienie za najlepiej udokumentowane.','Because with incomplete data audiences usually treat the most confident explanation as the best documented one.'],
        ['Ponieważ odbiorcy w sytuacji niepewności przestają korzystać z wcześniejszej wiedzy.','Because audiences stop using prior knowledge in uncertain situations.'],
        ['Ponieważ daje szybkie poczucie porządku i kontroli, zanim złożoność zostanie sprawdzona.','Because it offers a quick sense of order and control before the complexity is examined.']],3),
      q('Które dwa elementy mogą wspólnie zwiększać zasięg treści, choć żaden z nich nie potwierdza jej prawdziwości?','Which two elements can jointly increase a message’s reach even though neither proves it is true?',[
        ['System rekomendacji wzmacniający treści, które długo zatrzymują uwagę.','A recommendation system amplifying content that holds attention for a long time.'],
        ['Pełny dokument źródłowy opisujący metodologię i ograniczenia danych.','A full source document describing methodology and data limitations.'],
        ['Silna emocja i relacje społeczne skłaniające ludzi do dalszego udostępniania.','Strong emotion and social relationships encouraging further sharing.'],
        ['Korekta redakcyjna, która ogranicza zbyt mocny wniosek w nagłówku.','An editorial correction that tones down an overly strong headline conclusion.']],[0,2]),
      q('Co oznacza praktyczna zasada „zatrzymaj reakcję, nie ciekawość”?','What does the practical rule “pause the reaction, not the curiosity” mean?',[
        ['Nie czytać treści wywołujących emocje, aby uniknąć wpływu na ocenę.','Avoid reading emotional content so it cannot influence your judgement.'],
        ['Wstrzymać komentarz lub udostępnienie, ale nadal sprawdzać źródło i zadawać pytania.','Pause commenting or sharing, while still checking the source and asking questions.'],
        ['Odłożyć każdą decyzję do następnego dnia, niezależnie od rodzaju informacji.','Postpone every decision until the next day regardless of the type of information.'],
        ['Zignorować własne pierwsze wrażenie i automatycznie przyjąć przeciwną interpretację, zanim zacznie się sprawdzanie.','Ignore your first impression and automatically accept the opposite interpretation before verification begins.']],1)
    ],
    m3: [
      q('Nagranie jest autentyczne, ale opis twierdzi, że powstało w innym kraju niż w rzeczywistości. Jak najlepiej nazwać problem?','A video is authentic, but its caption claims it was recorded in a different country. What best describes the problem?',[
        ['Materiał syntetyczny wygenerowany przez AI.','Synthetic content generated by AI.'],
        ['Błąd techniczny w jakości nagrania.','A technical problem with video quality.'],
        ['Fałszywy kontekst nadany prawdziwemu materiałowi.','False context attached to authentic material.'],
        ['Satyra lub parodia, ponieważ sam plik wideo pozostał autentyczny i nie został technicznie przerobiony.','Satire or parody because the video file itself remained authentic and was not technically altered.']],2),
      q('Które dwa działania mogą zmienić znaczenie prawdziwego zdjęcia bez tworzenia całkiem nowego obrazu?','Which two actions can change the meaning of a real photo without creating an entirely new image?',[
        ['Dodać podpis przypisujący zdjęciu inne miejsce lub datę niż w rzeczywistości.','Add a caption assigning the photo a different place or date than the real one.'],
        ['Zmniejszyć rozdzielczość pliku podczas wysyłania przez komunikator.','Reduce the file resolution when sending it through a messenger.'],
        ['Zmienić nazwę pliku zapisanego na dysku użytkownika.','Change the filename stored on the user’s device.'],
        ['Wykadrować fragment tak, by usunąć element istotny dla właściwego kontekstu.','Crop the image to remove an element important to the proper context.']],[0,3]),
      q('Profil ma nazwę i grafikę bardzo podobną do oficjalnej instytucji, ale używa lekko zmienionej domeny i nie ma historii publikacji. Jaki mechanizm jest tu najważniejszy?','A profile uses a name and visuals very similar to an official institution, but has a slightly altered domain and no publication history. What is the key mechanism?',[
        ['Selektywne przedstawienie danych statystycznych.','Selective presentation of statistical data.'],
        ['Podszywanie się pod wiarygodne źródło.','Impersonation of a credible source.'],
        ['Efekt powtarzania tej samej informacji.','The repetition effect of the same information.'],
        ['Czytanie lateralne prowadzone przez odbiorcę.','Lateral reading performed by the audience.']],1),
      q('Które dwa przykłady najlepiej pasują do ruchu 4O „Odkształć”?','Which two examples best fit the 4O move “Distort”?',[
        ['Zamiast odpowiedzieć na zarzut, autor zaczyna mówić o zupełnie innym skandalu.','Instead of answering the allegation, the author shifts to a completely different scandal.'],
        ['Z raportu pokazuje tylko korzystny fragment i pomija dane, które zmieniają obraz wyniku.','The author shows only the favourable part of a report and omits data that change the picture.'],
        ['Stare zdjęcie opisuje jako dowód wydarzenia, które ma się dziać właśnie teraz.','An old photo is presented as evidence of an event supposedly happening now.'],
        ['Autor odrzuca niewygodne źródło wyłącznie przez atak na jego nadawcę.','The author dismisses an inconvenient source solely by attacking its sender.']],[1,2]),
      q('W jednej narracji pojawiają się fałszywy profil dyplomaty, spreparowany dokument i strona podszywająca się pod medium. Dlaczego taki układ może działać mocniej niż jeden fake?','A narrative includes a fake diplomat profile, a fabricated document and a site impersonating a media outlet. Why can this work more strongly than one fake?',[
        ['Ponieważ trzy materiały automatycznie oznaczają trzy niezależne źródła.','Because three materials automatically mean three independent sources.'],
        ['Ponieważ odbiorca może uznać kilka podobnych publikacji za niezależne potwierdzenia, nawet jeśli wszystkie pochodzą z jednej narracji.','Because audiences may treat several similar publications as independent confirmations even when they stem from one narrative.'],
        ['Ponieważ skoordynowana operacja nie potrzebuje żadnego prawdziwego kontekstu.','Because a coordinated operation needs no real context at all.'],
        ['Ponieważ elementy mogą tworzyć pozór wzajemnego, niezależnego potwierdzania tej samej historii.','Because the elements can create the appearance of mutually independent confirmation.']],3),
      q('Które dwie obserwacje uzasadniają mówienie o rosyjskim tropie w case Polska-Czechy, bez przedstawiania atrybucji jako pewnika?','Which two observations support discussing a Russian lead in the Poland-Czechia case without presenting attribution as certain?',[
        ['Zastosowane techniki były silnie podobne do metod znanych z wcześniejszych rosyjskich operacji wpływu.','The techniques strongly resembled methods known from earlier Russian influence operations.'],
        ['W części materiałów pojawiał się język czeski, więc sprawca musiał pochodzić z zagranicy.','Some materials used Czech, so the perpetrator had to be foreign.'],
        ['Występował skoordynowany zestaw podszyć, fałszywych dokumentów i pozornych potwierdzeń typowy dla takich operacji.','There was a coordinated set of impersonations, fake documents and apparent confirmations typical of such operations.'],
        ['W internecie pojawiały się krytyczne komentarze o relacjach polsko-czeskich.','There were critical online comments about Polish-Czech relations.']],[0,2]),
      q('Materiał wideo został wygenerowany syntetycznie, ale jest wyraźnie oznaczonym elementem kampanii edukacyjnej. Czy sam fakt użycia AI czyni go dezinformacją?','A video was synthetically generated but is clearly labelled as part of an educational campaign. Does the use of AI itself make it disinformation?',[
        ['Tak, ponieważ każdy realistyczny materiał syntetyczny jest dezinformacją.','Yes, because every realistic synthetic material is disinformation.'],
        ['Nie. Znaczenie zależy od sposobu użycia, oznaczenia, celu i kontekstu materiału.','No. Its meaning depends on how it is used, labelled, intended and contextualised.'],
        ['Tak, jeśli materiał zawiera wizerunek człowieka, niezależnie od oznaczenia.','Yes, if it depicts a person, regardless of labelling.'],
        ['Nie, ponieważ materiały generowane przez AI nie mogą nikogo wprowadzać w błąd.','No, because AI-generated materials cannot mislead anyone.']],1),
      q('Które dwa czynniki sprawiają, że tematy wrażliwe wymagają szczególnie ostrożnej oceny przekazu?','Which two factors make sensitive topics require particularly careful evaluation?',[
        ['Takich tematów nie da się weryfikować za pomocą źródeł pierwotnych.','Such topics cannot be verified using primary sources.'],
        ['Wysoka stawka emocjonalna może przyspieszać ocenę i zwiększać podatność na polaryzację.','High emotional stakes can speed up judgement and increase susceptibility to polarisation.'],
        ['Każda treść dotycząca konfliktu lub migracji jest z definicji manipulacją.','Every piece of content about conflict or migration is by definition manipulation.'],
        ['Etykietowanie grup i dehumanizacja mogą przesuwać uwagę z dowodów na tożsamość oraz wrogość.','Labelling groups and dehumanisation can shift attention from evidence to identity and hostility.']],[1,3])
    ],
    m4: [
      q('Post twierdzi, że „nowe przepisy likwidują obsługę stacjonarną”. Od czego najlepiej zacząć weryfikację?','A post claims that “new rules abolish in-person service”. What is the best place to start verification?',[
        ['Od zebrania komentarzy i relacji osób, które deklarują, że nowe przepisy już wpłynęły na ich sposób załatwiania spraw.','Collect comments and reports from people who say the new rules have already affected how they access services.'],
        ['Od precyzyjnego zapisania, jakie konkretne twierdzenie trzeba sprawdzić.','Precisely state the specific claim that needs to be checked.'],
        ['Od porównania liczby udostępnień z podobnymi postami.','Compare the number of shares with similar posts.'],
        ['Od ustalenia, czy grafika posta wygląda profesjonalnie.','Determine whether the post’s graphic looks professional.']],1),
      q('Które dwa materiały są źródłami pierwotnymi dla sprawdzanego twierdzenia?','Which two materials are primary sources for the claim being checked?',[
        ['Pełny zapis wypowiedzi osoby, której słowa są cytowane.','The full recording or transcript of the person whose words are quoted.'],
        ['Artykuł podsumowujący wypowiedź na podstawie innej redakcji.','An article summarising the statement based on another newsroom.'],
        ['Post, który kopiuje fragment artykułu bez linku do oryginału.','A post copying part of an article without linking to the original.'],
        ['Oficjalny dokument, rejestr lub zbiór danych, którego dotyczy twierdzenie.','The official document, register or dataset to which the claim refers.']],[0,3]),
      q('Strona wygląda profesjonalnie, ale nie wiesz, kto ją prowadzi. Co najlepiej ilustruje czytanie lateralne?','A website looks professional, but you do not know who runs it. What best illustrates lateral reading?',[
        ['Przeczytać stronę od góry do dołu i zaufać opisowi „O nas”.','Read the page from top to bottom and trust its “About us” section.'],
        ['Porównać kolory, typografię i jakość zdjęć z dużymi portalami.','Compare its colours, typography and image quality with major websites.'],
        ['Otworzyć nowe karty i sprawdzić, co niezależne źródła mówią o stronie, autorze i domenie.','Open new tabs and see what independent sources say about the site, author and domain.'],
        ['Najpierw sprawdzić najpopularniejsze materiały strony i ocenić, czy ich komentarze wskazują na zaufanie stałych odbiorców.','First check the site’s most popular materials and assess whether comments suggest trust among regular readers.']],2),
      q('Które dwa kroki tworzą sensowną triangulację, a nie tylko powielanie tej samej informacji?','Which two steps create meaningful triangulation rather than merely repeating the same information?',[
        ['Znaleźć trzy portale, które kopiują ten sam komunikat agencyjny bez własnych źródeł.','Find three websites that copy the same agency release without their own sources.'],
        ['Porównać oficjalne dane statystyczne z metodologią i innym niezależnym zbiorem dotyczącym tego samego zjawiska.','Compare official statistics and methodology with another independent dataset on the same phenomenon.'],
        ['Sprawdzić pełny akt prawny oraz niezależną analizę jego zastosowania do badanego przypadku.','Check the full legal act and an independent analysis of how it applies to the case.'],
        ['Przeczytać kilka komentarzy użytkowników, którzy podają podobne doświadczenia.','Read several comments from users reporting similar experiences.']],[1,2]),
      q('Masz zdjęcie bez wiarygodnego podpisu. W czym Google Lens może realnie pomóc?','You have an image without a reliable caption. What can Google Lens realistically help with?',[
        ['Na podstawie podobnych obrazów ustalić z pełną pewnością intencję osoby, która jako pierwsza opublikowała fotografię.','Use similar images to determine with certainty the intention of the person who first published the photograph.'],
        ['Automatycznie potwierdzić prawdziwość każdego podpisu dołączonego do obrazu.','Automatically verify the truth of every caption attached to the image.'],
        ['Rozpoznać każdą edycję obrazu, nawet jeśli nie istnieją wcześniejsze kopie.','Detect every image edit even when no earlier copies exist.'],
        ['Znaleźć wcześniejsze publikacje i podobne obrazy, które pomagają ustalić pochodzenie oraz kontekst.','Find earlier publications and similar images that help establish origin and context.']],3),
      q('Które dwa elementy w case AFP z filmem najmocniej pomagały sprawdzić twierdzenie o miejscu nagrania?','Which two elements in the AFP video case most strongly helped check the claim about where the video was recorded?',[
        ['Wcześniejsze publikacje i geolokalizacja elementów otoczenia wskazujące na Jarosław w Rosji.','Earlier publications and geolocation of visual features pointing to Yaroslavl in Russia.'],
        ['Duża liczba komentarzy pod późniejszym postem w mediach społecznościowych.','A large number of comments under the later social-media post.'],
        ['Dodatkowe potwierdzenie lokalizacji uzyskane podczas weryfikacji od źródeł związanych z miejscem.','Additional confirmation of the location obtained during verification from sources connected with the place.'],
        ['Sama obecność rosyjskiej marki produktu widocznej na nagraniu.','The mere presence of a Russian product brand visible in the video.']],[0,2]),
      q('Stare zdjęcie z 2009 roku zostaje pokazane jako świeże wydarzenie z 2026 roku. Co przede wszystkim zostało zmanipulowane?','An old photo from 2009 is presented as a fresh event from 2026. What has primarily been manipulated?',[
        ['Autentyczność samego zdjęcia, ponieważ fotografia sprzed wielu lat musi być cyfrowo zmieniona, aby mogła wrócić do obiegu.','The authenticity of the photo itself, because an old photograph must be digitally altered before it can circulate again.'],
        ['Kontekst czasu: prawdziwy materiał przedstawiono jako dowód bieżącego wydarzenia.','The time context: authentic material was presented as evidence of a current event.'],
        ['Liczba osób widocznych na fotografii.','The number of people visible in the photograph.'],
        ['Jakość techniczna obrazu, która uniemożliwia ocenę źródła.','The technical image quality, which prevents source evaluation.']],1),
      q('Które dwa elementy powinien zawierać uczciwy końcowy wniosek fact-checkingu?','Which two elements should an honest final fact-checking conclusion contain?',[
        ['Wyraźne wskazanie ograniczeń dowodów i tego, czego nadal nie udało się ustalić.','A clear statement of evidence limitations and what still could not be established.'],
        ['Zawsze jednoznaczną etykietę „prawda” albo „fałsz”, nawet przy niepełnych danych.','Always a binary “true” or “false” label, even when the evidence is incomplete.'],
        ['Najbardziej stanowcze sformułowanie, jakie da się obronić retorycznie.','The strongest wording that can be defended rhetorically.'],
        ['Rozróżnienie między „nie znaleziono potwierdzenia” a dowodem, że coś na pewno nie wydarzyło się.','A distinction between “no confirmation was found” and evidence that something definitely did not happen.']],[0,3])
    ],
    m5: [
      q('Po weryfikacji okazuje się, że post jest fałszywy, ale ma bardzo mały zasięg i nie stwarza bezpośredniego zagrożenia. Jaka reakcja jest najbardziej proporcjonalna?','Verification shows that a post is false, but it has very limited reach and creates no immediate danger. Which response is most proportionate?',[
        ['Natychmiast opublikować oficjalne dementi z linkiem do fałszywego posta.','Immediately publish an official rebuttal linking to the false post.'],
        ['Zgłosić sprawę wszystkim dostępnym instytucjom i platformom, nawet jeśli treść nie powoduje szkody ani większego zasięgu.','Report the case to every available institution and platform even if the content causes no harm or significant reach.'],
        ['Ocenić ryzyko i zasięg, monitorować sytuację i nie zwiększać widoczności bez potrzeby.','Assess risk and reach, monitor the situation and avoid increasing visibility unnecessarily.'],
        ['Udostępnić post z ostrzeżeniem, aby jak najwięcej osób dowiedziało się o fałszu.','Share the post with a warning so as many people as possible learn it is false.']],2),
      q('Które dwa przykłady poprawnie pokazują różnicę między prebunkingiem a debunkingiem?','Which two examples correctly show the difference between prebunking and debunking?',[
        ['Usunięcie konta po publikacji fałszywej informacji jest przykładem prebunkingu.','Removing an account after it posts false information is an example of prebunking.'],
        ['Przed kampanią ostrzegamy odbiorców, jak działa podszywanie się pod źródło i na co zwracać uwagę.','Before a campaign, we warn audiences how source impersonation works and what to watch for.'],
        ['Wyśmianie autora fałszywego posta po publikacji jest przykładem debunkingu.','Mocking the author of a false post after publication is an example of debunking.'],
        ['Po pojawieniu się fałszu publikujemy korektę z poprawną informacją, dowodem i kontekstem.','After a falsehood appears, we publish a correction with accurate information, evidence and context.']],[1,3]),
      q('Znajomy udostępnił stary artykuł jako dzisiejszą wiadomość. Jaka pierwsza reakcja zwykle najlepiej łączy korektę z szacunkiem do rozmówcy?','A friend shared an old article as today’s news. Which first response usually best combines correction with respect?',[
        ['Publicznie wkleić screen i napisać, że znajomy znowu dał się nabrać.','Post a public screenshot saying your friend has been fooled again.'],
        ['Spokojnie wskazać datę, pokazać aktualne źródło i zaprosić do wspólnego sprawdzenia.','Calmly point out the date, show a current source and invite them to check it together.'],
        ['Wysłać kilkanaście linków bez dodatkowego wyjaśnienia, zakładając, że sama liczba materiałów przekona rozmówcę do zmiany zdania.','Send a dozen links without explanation, assuming the number of materials alone will persuade the person to change their mind.'],
        ['Zakończyć rozmowę, ponieważ korekta może tylko zwiększyć konflikt.','End the conversation because correction can only increase conflict.']],1),
      q('Dostajesz wiadomość podszywającą się pod instytucję z linkiem do „pilnej weryfikacji danych”. Które dwa działania są właściwe?','You receive a message impersonating an institution with a link for “urgent data verification”. Which two actions are appropriate?',[
        ['Nie klikać linku i samodzielnie wejść na oficjalną stronę lub aplikację instytucji.','Do not click the link; independently open the institution’s official website or app.'],
        ['Kliknąć link w trybie prywatnym, aby sprawdzić, czy formularz wygląda wiarygodnie.','Click the link in private mode to see whether the form looks credible.'],
        ['Zachować dowód wiadomości i zgłosić podejrzane podszycie właściwym kanałem, np. CERT Polska.','Preserve evidence of the message and report the suspected impersonation through the proper channel, e.g. CERT Polska.'],
        ['Przesłać link kilku znajomym i poprosić, aby sprawdzili go na swoich urządzeniach.','Forward the link to several friends and ask them to test it on their devices.']],[0,2]),
      q('Dlaczego publiczne dementi nie zawsze jest najlepszą pierwszą reakcją na niszową fałszywą treść?','Why is a public rebuttal not always the best first response to a niche false claim?',[
        ['Ponieważ fałszywe treści o małym zasięgu zawsze znikają bez żadnego monitorowania.','Because low-reach false content always disappears without any monitoring.'],
        ['Ponieważ instytucja nie powinna odpowiadać na treści publikowane przez małe konta.','Because an institution should not respond to content posted by small accounts.'],
        ['Ponieważ komentarz prywatnej osoby jest zawsze skuteczniejszy od komunikatu instytucji, niezależnie od rodzaju ryzyka i odbiorców.','Because a private person’s comment is always more effective than an institutional statement regardless of risk and audience.'],
        ['Ponieważ publiczna korekta może nadać treści dodatkowy zasięg, zanim stanie się realnym problemem.','Because a public correction can give the content additional reach before it becomes a real problem.']],3),
      q('Które dwa zachowania dobrze ilustrują higienę informacyjną, a nie unikanie informacji?','Which two behaviours illustrate information hygiene rather than information avoidance?',[
        ['Całkowicie przestać czytać trudne wiadomości, aby nie odczuwać żadnych emocji.','Stop reading difficult news entirely so that no emotions are felt.'],
        ['Ustalić momenty sprawdzania wiadomości zamiast reagować na każdą kolejną aktualizację.','Set intentional times for checking news instead of reacting to every new update.'],
        ['Korzystać z kilku wiarygodnych źródeł i świadomie robić przerwy, gdy przeciążenie pogarsza ocenę.','Use several credible sources and take deliberate breaks when overload worsens judgement.'],
        ['Czytać wyłącznie jeden serwis, aby ograniczyć liczbę sprzecznych informacji.','Read only one outlet to reduce the number of conflicting messages.']],[1,2]),
      q('Przed udostępnieniem emocjonalnego posta chcesz szybko zastosować SHARE. Który zestaw najlepiej odpowiada temu przypomnieniu?','Before sharing an emotional post, you want to apply SHARE quickly. Which set best matches the SHARE reminder?',[
        ['Autor, data, liczba komentarzy, format pliku i długość posta.','Author, date, comment count, file format and post length.'],
        ['Popularność, zgodność z opinią znajomych, atrakcyjność grafiki, tempo i temat.','Popularity, agreement with friends, visual appeal, speed and topic.'],
        ['Źródło, możliwa szkoda, dokładność, powód udostępnienia i własna emocja.','Source, potential harm, accuracy, reason for sharing and your own emotion.'],
        ['Nagłówek, liczba reakcji, godzina publikacji, urządzenie i platforma.','Headline, reaction count, publication time, device and platform.']],2),
      q('Które dwa działania najlepiej oddają końcową zasadę kursu „Zatrzymaj - Sprawdź - Zareaguj”?','Which two actions best reflect the course’s final rule “Pause - Verify - Respond”?',[
        ['Przy silnej emocji wstrzymać natychmiastową reakcję, zanim ocena zamieni się w udostępnienie.','When emotion is strong, pause the immediate reaction before judgement turns into sharing.'],
        ['Traktować dużą liczbę reakcji jako wystarczający sygnał, że treść została już sprawdzona.','Treat a high reaction count as sufficient evidence that the content has already been checked.'],
        ['Po wykryciu błędu zawsze publikować publiczne dementi, niezależnie od zasięgu i ryzyka.','After finding an error, always publish a public rebuttal regardless of reach and risk.'],
        ['Sprawdzić twierdzenie, źródło i dowody, a dopiero potem dobrać reakcję do sytuacji.','Check the claim, source and evidence, then choose a response proportionate to the situation.']],[0,3])
    ]
  };

  const QUIZ_REASONS={
    m1:[
      ['Liczby opisują zasięg i reakcje odbiorców, nie jakość źródła ani prawdziwość twierdzenia.','Numbers describe reach and audience reactions, not source quality or truth.'],
      ['Personalizacja korzysta z historii zachowań i sieci relacji; nie tworzy osobnej wersji faktów.','Personalisation uses behaviour history and social networks; it does not create separate facts.'],
      ['Testowanie tytułów pod kątem zatrzymania uwagi jest elementem konkurencji o czas odbiorcy.','Testing headlines for attention is part of competition for the audience’s time.'],
      ['Zastrzeżenie w treści ogranicza wniosek, więc kategoryczny nagłówek wykracza poza przedstawione dowody.','The caveat limits the conclusion, so the categorical headline goes beyond the evidence.'],
      ['Bez oryginalnego linku najłatwiej tracimy datę, autora, źródło i ważne zastrzeżenia.','Without the original link, date, author, source and caveats are easily lost.'],
      ['Bańka dotyczy ekspozycji personalizowanej, a komora dodaje społeczne wzmacnianie podobnych poglądów.','A filter bubble concerns personalised exposure; an echo chamber adds social reinforcement.'],
      ['AI zwiększa skalę tworzenia, ale płynność wyniku nie gwarantuje jego prawdziwości.','AI increases production scale, but fluent output is not guaranteed to be true.'],
      ['Przed oceną trzeba ustalić nadawcę, treść twierdzenia i drogę, którą materiał do nas dotarł.','Before judging, establish the sender, claim and route by which it reached you.']
    ],
    m2:[
      ['Silna emocja może przyspieszyć ocenę i udostępnienie przed sprawdzeniem źródła.','Strong emotion can accelerate judgement and sharing before verification.'],
      ['Dostępność dramatycznego przykładu i popularność są skrótami, natomiast źródło i porównanie danych są analizą.','A vivid example and popularity are shortcuts; source checking and data comparison are analysis.'],
      ['Te same pytania wobec treści zgodnej i niezgodnej z poglądami ograniczają selektywne sprawdzanie.','Applying the same questions to agreeable and disagreeable content reduces selective checking.'],
      ['Powtarzanie zwiększa znajomość przekazu, którą łatwo pomylić z prawdziwością.','Repetition increases familiarity, which can be mistaken for truth.'],
      ['Popularność wpływa na pierwsze wrażenie, ale nadal opisuje zachowanie odbiorców, nie dowód.','Popularity affects first impressions but still describes audience behaviour, not evidence.'],
      ['Prosta opowieść daje poczucie porządku w niepewności, nawet jeśli pomija złożoność.','A simple story creates order under uncertainty even when it omits complexity.'],
      ['Rekomendacje, emocje i relacje zwiększają dystrybucję, lecz same nie weryfikują twierdzenia.','Recommendations, emotion and relationships increase distribution but do not verify a claim.'],
      ['Pauza dotyczy reakcji; ciekawość nadal prowadzi do źródła i pytań.','The pause concerns reaction; curiosity still leads to sources and questions.']
    ],
    m3:[
      ['Autentyczny materiał może wprowadzać w błąd, gdy opis zmienia jego miejsce, czas lub znaczenie.','Authentic material can mislead when its caption changes place, time or meaning.'],
      ['Fałszywy podpis i selektywne kadrowanie zmieniają kontekst bez tworzenia nowego obrazu.','A false caption and selective crop change context without creating a new image.'],
      ['Podobna nazwa, grafika i zmieniona domena wskazują na podszywanie się pod wiarygodne źródło.','A similar name, visuals and altered domain indicate source impersonation.'],
      ['Selekcja prawdziwych danych może tworzyć fałszywy obraz całości, gdy pomija istotny kontekst.','Selecting true data can distort the whole picture when material context is omitted.'],
      ['Kilka elementów jednej operacji może wyglądać jak niezależne potwierdzenia tej samej historii.','Several elements of one operation can look like independent confirmations.'],
      ['Atrybucję wspiera podobieństwo metod i skoordynowany zestaw podszyć, nie sam język publikacji.','Attribution is supported by method similarity and coordinated impersonation, not language alone.'],
      ['AI jest narzędziem; o dezinformacji decydują cel, kontekst, oznaczenie i sposób użycia.','AI is a tool; intent, context, labelling and use determine whether content misleads.'],
      ['Wysoka stawka emocjonalna i dehumanizacja przesuwają uwagę z dowodów na konflikt tożsamości.','High emotional stakes and dehumanisation shift attention from evidence to identity conflict.']
    ],
    m4:[
      ['Precyzyjne zapisanie twierdzenia wyznacza, jakiego dowodu trzeba szukać.','Stating the claim precisely determines what evidence is needed.'],
      ['Pełna wypowiedź i oficjalny dokument są bezpośrednimi materiałami, a nie cudzym omówieniem.','A full statement and official document are direct materials, not someone else’s summary.'],
      ['Czytanie lateralne oznacza wyjście poza stronę i sprawdzenie jej w niezależnych źródłach.','Lateral reading means leaving the site and checking it through independent sources.'],
      ['Triangulacja porównuje niezależne typy dowodów, a nie wiele kopii tego samego źródła.','Triangulation compares independent evidence types, not multiple copies of one source.'],
      ['Wyszukiwanie obrazem pomaga znaleźć wcześniejsze wystąpienia i ustalić pochodzenie, ale nie odczytuje intencji.','Reverse image search finds earlier uses and provenance but cannot determine intent.'],
      ['Miejsce potwierdzają wcześniejsze publikacje, geolokalizacja i niezależny kontakt ze źródłami lokalnymi.','Location is supported by earlier posts, geolocation and independent local confirmation.'],
      ['Zdjęcie może być autentyczne, a manipulacja dotyczyć wyłącznie przypisanej mu daty.','A photo may be authentic while the manipulation concerns only its assigned date.'],
      ['Uczciwy wniosek pokazuje ograniczenia i odróżnia brak potwierdzenia od dowodu nieistnienia.','An honest conclusion states limits and distinguishes no confirmation from proof of absence.']
    ],
    m5:[
      ['Przy małym zasięgu i niskim ryzyku publiczne dementi może niepotrzebnie zwiększyć widoczność.','With low reach and risk, a public rebuttal can unnecessarily increase visibility.'],
      ['Prebunking uprzedza o technice przed fałszem, a debunking koryguje konkretny fałsz po publikacji.','Prebunking warns about a technique beforehand; debunking corrects a specific falsehood afterwards.'],
      ['Spokojne wskazanie daty i źródła koryguje informację bez zawstydzania rozmówcy.','Calmly showing the date and source corrects information without shaming the person.'],
      ['Przy podszyciu nie klikamy; sprawdzamy kanał oficjalny, zachowujemy dowód i zgłaszamy incydent.','With impersonation, do not click; use the official channel, preserve evidence and report.'],
      ['Publiczna korekta może nadać niszowej treści zasięg, którego wcześniej nie miała.','A public correction can give niche content reach it did not previously have.'],
      ['Higiena informacyjna porządkuje kontakt z informacją, ale nie oznacza całkowitego unikania wiadomości.','Information hygiene structures news use; it does not mean avoiding information entirely.'],
      ['SHARE łączy ocenę źródła, szkody, dokładności, celu udostępnienia i własnej emocji.','SHARE combines source, harm, accuracy, reason for sharing and emotion.'],
      ['Najpierw zatrzymujemy impuls, potem sprawdzamy dowody i dopiero dobieramy proporcjonalną reakcję.','First pause the impulse, then verify evidence and choose a proportionate response.']
    ]
  };

  function q(pl,en,opts,correct){ return {pl,en,opts,correct}; }
  const QUIZ_OPTION_PERMS=[[0,1,2,3],[1,3,0,2],[2,0,3,1],[3,2,1,0]];

  function defaultState(){ return {version:VERSION,lang:'pl',completed:[],quizzes:{},name:'',updatedAt:new Date().toISOString()}; }
  function loadState(){
    try {
      const raw = JSON.parse(localStorage.getItem(STATE_KEY));
      if(!raw || typeof raw!=='object') return defaultState();
      const migrated = {...defaultState(),...raw,completed:Array.isArray(raw.completed)?raw.completed:[],quizzes:raw.quizzes||{}};
      if(raw.version !== VERSION){ migrated.version=VERSION; migrated.quizzes={}; }
      return migrated;
    } catch { return defaultState(); }
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

  function sidebarActiveModule(){
    return document.body.dataset.activeModule && document.body.dataset.activeModule!=='final'
      ? document.body.dataset.activeModule
      : ($$('.course-module').find(article=>!article.hidden)?.dataset.module || 'm1');
  }

  function syncSidebarModuleState(module=sidebarActiveModule()){
    $$('#sidebarNav .sidebar-module').forEach(mod=>{
      const active=mod.dataset.module===module;
      mod.classList.toggle('is-active',active);
      const button=mod.querySelector('.sidebar-module__button');
      const list=mod.querySelector('.sidebar-lessons');
      button?.setAttribute('aria-expanded',String(active));
      if(list) list.hidden=!active;
    });
  }

  function renderSidebar(){
    const nav=$('#sidebarNav'); if(!nav) return; nav.innerHTML='';
    const activeModule=sidebarActiveModule();
    $$('.course-module').forEach((article,i)=>{
      const module=article.dataset.module;
      const lessons=[...article.querySelectorAll(':scope > .required-section')];
      const done=lessons.filter(sec=>state.completed.includes(sec.id)).length;
      const wrap=document.createElement('div'); wrap.className='sidebar-module'; wrap.dataset.module=module;
      const button=document.createElement('button'); button.type='button'; button.className='sidebar-module__button';
      button.setAttribute('aria-expanded',String(module===activeModule));
      button.innerHTML=`<span class="sidebar-module__num">${i+1}</span><span class="sidebar-module__copy"><strong>${escapeHtml(moduleTitle(article))}</strong><small>${done}/${lessons.length} ${currentLang()==='pl'?'tematów ukończonych':'topics completed'}</small></span><span class="sidebar-module__chevron" aria-hidden="true">⌄</span>`;
      button.addEventListener('click',()=>showModule(module));
      wrap.appendChild(button);
      const list=document.createElement('div'); list.className='sidebar-lessons'; list.hidden=module!==activeModule;
      lessons.forEach((sec,lessonIndex)=>{
        const a=document.createElement('a'); a.href='#'+sec.id; a.dataset.target=sec.id; a.className='sidebar-lesson';
        if(state.completed.includes(sec.id)) a.classList.add('is-complete');
        a.innerHTML=`<span class="sidebar-lesson__num">${String(lessonIndex+1).padStart(2,'0')}</span><span class="sidebar-lesson__title">${escapeHtml(sectionTitle(sec))}</span><span class="sidebar-lesson__status" aria-hidden="true">${state.completed.includes(sec.id)?'✓':''}</span>`;
        a.addEventListener('click',e=>{e.preventDefault();showModule(module,sec.id);}); list.appendChild(a);
      });
      const qa=document.createElement('a'); qa.href='#quiz-'+module; qa.dataset.target='quiz-'+module; qa.className='sidebar-lesson sidebar-lesson--quiz';
      if(state.quizzes[module]?.passed) qa.classList.add('is-complete');
      qa.innerHTML=`<span class="sidebar-lesson__num">T</span><span class="sidebar-lesson__title">${escapeHtml(t().quiz)}</span><span class="sidebar-lesson__status" aria-hidden="true">${state.quizzes[module]?.passed?'✓':''}</span>`;
      qa.addEventListener('click',e=>{e.preventDefault();showModule(module,'quiz-'+module);}); list.appendChild(qa);
      wrap.appendChild(list); nav.appendChild(wrap);
    });
    syncSidebarModuleState(activeModule);
    filterSidebar();
  }

  function updateSections(){
    $$('.required-section').forEach(sec=>{
      const done=state.completed.includes(sec.id); sec.classList.toggle('is-complete',done);
      const btn=sec.querySelector('.section-complete'); if(!btn)return;
      const visibleLabel=done?t().completed:t().markComplete;
      btn.classList.toggle('is-complete',done);
      btn.setAttribute('aria-pressed',String(done));
      btn.title=done?t().unmark:t().markComplete;
      btn.setAttribute('aria-label',done?t().unmark:t().markComplete);
      btn.innerHTML=`<span class="section-complete__icon" aria-hidden="true">${done?'✓':''}</span><span class="section-complete__label">${escapeHtml(visibleLabel)}</span>`;
    });
  }
  function toggleSection(sec){ const id=sec.id; if(state.completed.includes(id)) state.completed=state.completed.filter(x=>x!==id); else state.completed=[...state.completed,id]; saveState(false); renderSidebar(); renderQuizzes(); updateAll(); flashSave(t().saved); }

  function moduleLessonStatus(module){ const secs=$$(`#module-${module} > .required-section`); const done=secs.filter(sec=>state.completed.includes(sec.id)).length; return {done,total:secs.length,complete:secs.length>0&&done===secs.length}; }

  function renderQuizzes(){
    $$('.module-quiz').forEach(host=>{
      const module=host.dataset.quizModule, items=QUIZZES[module], stored=state.quizzes[module]||{};
      const wasOpen=host.querySelector('.quiz-details')?.open || false;
      host.classList.toggle('is-passed',!!stored.passed); host.innerHTML='';
      const details=document.createElement('details'); details.className='quiz-details'; details.open=wasOpen;
      const summary=document.createElement('summary'); summary.className='quiz-summary';
      const left=document.createElement('span'); left.className='quiz-summary__copy'; left.innerHTML=`<span class="exercise-kicker">${escapeHtml(t().quiz)}</span><strong>${escapeHtml(module.toUpperCase())}: ${escapeHtml(t().quiz)}</strong><small>${escapeHtml(t().questions)}</small>`;
      const status=document.createElement('span'); status.className='quiz-status'; status.textContent=stored.passed?`${t().passed} - ${stored.score}/8`:t().notPassed;
      summary.append(left,status); details.appendChild(summary);
      const body=document.createElement('div'); body.className='quiz-details__body'; details.appendChild(body); host.appendChild(details);
      const lessonStatus=moduleLessonStatus(module);
      const qwrap=document.createElement('div'); qwrap.className='quiz-questions';
      items.forEach((item,qi)=>{
        const field=document.createElement('fieldset'); field.className='quiz-question'; field.dataset.question=String(qi);
        const isMulti=Array.isArray(item.correct);
        const legend=document.createElement('legend'); legend.innerHTML=`<b>${qi+1}</b>${escapeHtml(currentLang()==='pl'?item.pl:item.en)}`; field.appendChild(legend);
        if(isMulti){ const hint=document.createElement('p'); hint.className='quiz-question__mode'; hint.textContent=t().multiHint; field.appendChild(hint); }
        const list=document.createElement('div'); list.className='choice-list';
        const permutation=QUIZ_OPTION_PERMS[(qi+MODULES.indexOf(module))%QUIZ_OPTION_PERMS.length];
        permutation.forEach(oi=>{
          const opt=item.opts[oi];
          const label=document.createElement('label'); label.className='choice';
          label.innerHTML=`<input type="${isMulti?'checkbox':'radio'}" name="quiz-${module}-${qi}" value="${oi}"><span>${escapeHtml(txt(opt))}</span>`; list.appendChild(label);
        });
        field.appendChild(list); qwrap.appendChild(field);
      }); body.appendChild(qwrap);
      const actions=document.createElement('div'); actions.className='quiz-actions';
      const submit=document.createElement('button'); submit.type='button'; submit.className='quiz-submit'; submit.textContent=stored.attempts?t().retry:t().check;
      const result=document.createElement('span'); result.className='quiz-result';
      if(stored.score!=null) result.textContent=`${t().score}: ${stored.score}/8`; else if(!lessonStatus.complete) result.textContent=currentLang()==='pl'?`Test odblokuje się po ukończeniu lekcji modułu (${lessonStatus.done}/${lessonStatus.total}).`:`The quiz unlocks after completing the module lessons (${lessonStatus.done}/${lessonStatus.total}).`;
      submit.disabled=!lessonStatus.complete;
      actions.append(submit,result); body.appendChild(actions);
      const achievement=document.createElement('div'); achievement.className='achievement-row'; achievement.innerHTML=`<span>${currentLang()==='pl'?'Karta osiągnięcia modułu':'Module achievement card'}</span>`; const ab=document.createElement('button'); ab.type='button'; ab.disabled=!stored.passed; ab.textContent=currentLang()==='pl'?'Pobierz PDF':'Download PDF'; ab.addEventListener('click',()=>downloadAchievement(module)); achievement.appendChild(ab); body.appendChild(achievement);
      submit.addEventListener('click',()=>gradeQuiz(module,host,result,status,submit));
    });
  }

  function gradeQuiz(module,host,result,status,submit){
    const lessonStatus=moduleLessonStatus(module); if(!lessonStatus.complete){result.textContent=currentLang()==='pl'?`Najpierw ukończ wszystkie lekcje modułu (${lessonStatus.done}/${lessonStatus.total}).`:`Complete all module lessons first (${lessonStatus.done}/${lessonStatus.total}).`;return;}
    const items=QUIZZES[module]; let answered=0,score=0;
    host.querySelectorAll('.choice').forEach(c=>{c.classList.remove('is-correct','is-wrong'); c.querySelector('.choice-status')?.remove();});host.querySelectorAll('.quiz-question-feedback').forEach(n=>n.remove());
    items.forEach((item,qi)=>{
      const field=host.querySelector(`[data-question="${qi}"]`);
      const expected=Array.isArray(item.correct)?item.correct:[item.correct];
      const selected=[...field.querySelectorAll('input:checked')];
      if(selected.length!==expected.length)return;
      answered++;
      const selectedIndexes=selected.map(input=>Number(input.value));
      const isCorrect=selectedIndexes.length===expected.length && selectedIndexes.every(index=>expected.includes(index));
      if(isCorrect){
        score++;
        selected.forEach(input=>applyChoiceStatus(input.closest('.choice'),true));
      } else {
        selected.forEach(input=>applyChoiceStatus(input.closest('.choice'),expected.includes(Number(input.value))));
        expected.forEach(index=>{ const input=field.querySelector(`input[value="${index}"]`); if(input&&!input.checked) applyChoiceStatus(input.closest('.choice'),true); });
      }
      const reason=QUIZ_REASONS[module]?.[qi]?.[currentLang()==='pl'?0:1]||'';
      const note=document.createElement('div');note.className='quiz-question-feedback '+(isCorrect?'is-correct':'is-guidance');
      const lead=currentLang()==='pl'?(isCorrect?'Dobrze.':'Ten wybór nie jest najlepiej uzasadniony przez materiał.'):(isCorrect?'Correct.':'This choice is not the best supported by the material.');
      const answers=expected.map(index=>escapeHtml(txt(item.opts[index]))).join(currentLang()==='pl'?' oraz ':' and ');
      note.innerHTML=`<strong>${escapeHtml(lead)}</strong> ${escapeHtml(reason)}${isCorrect?'':` <span>${currentLang()==='pl'?'Najlepiej uzasadniona odpowiedź:':'Best-supported answer:'} <b>${answers}</b></span>`}`;
      field.appendChild(note);
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
      const actions=ex.querySelector('.exercise-actions'); if(!actions)return;
      if(!actions.querySelector('.exercise-retry')){const b=document.createElement('button');b.type='button';b.className='exercise-retry';b.hidden=true;b.textContent=t().exerciseRetry;actions.insertBefore(b,actions.querySelector('.exercise-feedback'));}
      if(!actions.querySelector('.exercise-solution')){const b=document.createElement('button');b.type='button';b.className='exercise-solution';b.hidden=true;b.textContent=t().exerciseSolution;actions.insertBefore(b,actions.querySelector('.exercise-feedback'));}
    });
    // Delegated listeners make exercises reliable even after module switching or dynamic DOM updates.
    document.addEventListener('change',e=>{
      const input=e.target.closest?.('.exercise input[type="radio"], .exercise input[type="checkbox"]');
      if(!input)return;
      const q=input.closest('.exercise-question');
      q?.querySelectorAll('.choice').forEach(c=>c.classList.toggle('is-selected',!!c.querySelector('input:checked')));
    });
    document.addEventListener('click',e=>{
      const btn=e.target.closest?.('.exercise-check, .exercise-reset, .exercise-retry, .exercise-solution');
      if(!btn)return;
      const ex=btn.closest('.exercise');
      if(!ex)return;
      e.preventDefault();
      if(btn.classList.contains('exercise-check')) gradeExercise(ex);
      else if(btn.classList.contains('exercise-solution')) showExerciseSolution(ex);
      else resetExercise(ex);
    });
  }
  function gradeExercise(ex){
    const qs=$$('.exercise-question',ex); let answered=0, correctCount=0;
    qs.forEach(qel=>{
      $$('.choice',qel).forEach(c=>{c.classList.remove('is-correct','is-wrong'); c.querySelector('.choice-status')?.remove();});
      const selected=qel.querySelector('input:checked'); if(!selected)return; answered++;
      const selectedLabel=selected.closest('.choice'); const isCorrect=selected.dataset.correct==='true'; if(isCorrect){correctCount++;applyChoiceStatus(selectedLabel,true);} else {applyChoiceStatus(selectedLabel,false);}
      const specific=isCorrect ? qel.dataset[`feedbackCorrect${currentLang()==='pl'?'Pl':'En'}`] : qel.dataset[`feedbackWrong${currentLang()==='pl'?'Pl':'En'}`];
      if(specific){ let note=qel.querySelector('.question-feedback'); if(!note){note=document.createElement('p');note.className='question-feedback';qel.appendChild(note);} note.className='question-feedback '+(isCorrect?'is-correct':'is-guidance');note.textContent=isCorrect?specific:(currentLang()==='pl'?`Niezupełnie. ${specific}`:`Not quite. ${specific}`); }
    });
    const feedback=ex.querySelector('.exercise-feedback'); if(!feedback)return;
    if(answered<qs.length){feedback.textContent=t().exerciseChoose;feedback.className='exercise-feedback bad';return;}
    const all=correctCount===qs.length; feedback.textContent=all?t().exerciseOk:t().exerciseSome; feedback.className='exercise-feedback '+(all?'ok':'bad');
    const retry=ex.querySelector('.exercise-retry'),solution=ex.querySelector('.exercise-solution');if(retry)retry.hidden=all;if(solution)solution.hidden=all;
  }
  function showExerciseSolution(ex){
    $$('.exercise-question',ex).forEach(qel=>{qel.querySelectorAll('.choice').forEach(c=>c.classList.remove('is-selected','is-correct','is-wrong'));const ci=qel.querySelector('input[data-correct="true"]');if(ci){ci.checked=true;applyChoiceStatus(ci.closest('.choice'),true);}const specific=qel.dataset[`feedbackCorrect${currentLang()==='pl'?'Pl':'En'}`];if(specific){let note=qel.querySelector('.question-feedback');if(!note){note=document.createElement('p');qel.appendChild(note);}note.className='question-feedback is-correct';note.textContent=specific;}});
    const f=ex.querySelector('.exercise-feedback');if(f){f.textContent=t().exerciseSolutionShown;f.className='exercise-feedback ok';}const retry=ex.querySelector('.exercise-retry'),solution=ex.querySelector('.exercise-solution');if(retry)retry.hidden=false;if(solution)solution.hidden=true;
  }
  function resetExercise(ex){ ex.querySelectorAll('input').forEach(i=>{i.checked=false}); ex.querySelectorAll('.choice').forEach(c=>c.classList.remove('is-selected','is-correct','is-wrong')); ex.querySelectorAll('.choice-status,.question-feedback').forEach(n=>n.remove()); const f=ex.querySelector('.exercise-feedback');if(f){f.textContent='';f.className='exercise-feedback';} const retry=ex.querySelector('.exercise-retry'),solution=ex.querySelector('.exercise-solution');if(retry)retry.hidden=true;if(solution)solution.hidden=true; }
  function updateExerciseStatusLabels(){ $$('.choice-status').forEach(s=>{ const c=s.closest('.choice'); s.textContent=c?.classList.contains('is-correct')?t().correct:t().wrong; });$$('.exercise-retry').forEach(b=>b.textContent=t().exerciseRetry);$$('.exercise-solution').forEach(b=>b.textContent=t().exerciseSolution); }

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
    syncSidebarModuleState(module);
    const scrollTarget=targetId?$('#'+targetId):target;
    if(targetId?.startsWith('quiz-')) scrollTarget?.querySelector('.quiz-details')?.setAttribute('open','');
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
  function filterSidebar(){
    const input=$('#courseSearch'), nav=$('#sidebarNav'); if(!input||!nav)return;
    const needle=input.value.trim().toLocaleLowerCase();
    $$('.sidebar-module',nav).forEach(mod=>{
      const moduleMatch=mod.querySelector('.sidebar-module__button').textContent.toLocaleLowerCase().includes(needle);
      let any=moduleMatch;
      $$('.sidebar-lessons a',mod).forEach(a=>{
        const show=!needle || moduleMatch || a.textContent.toLocaleLowerCase().includes(needle);
        a.hidden=!show; any ||= show;
      });
      mod.hidden=!any;
      const list=mod.querySelector('.sidebar-lessons'), button=mod.querySelector('.sidebar-module__button');
      if(needle){ if(list)list.hidden=!any; button?.setAttribute('aria-expanded',String(any)); }
      else { const active=mod.dataset.module===sidebarActiveModule(); if(list)list.hidden=!active; button?.setAttribute('aria-expanded',String(active)); }
    });
  }

  function initExportImport(){
    $('#exportProgress')?.addEventListener('click',()=>{ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`edukacja-bez-granic-kurs-r4-postep-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
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
  const MODULE_SKILLS={
    m1:[
      ['Analizować drogę informacji od nadawcy, przez platformę i algorytm, do odbiorcy.','Analyse how information travels from the sender, through platforms and algorithms, to the audience.'],
      ['Odróżniać popularność i duży zasięg od wiarygodności przekazu.','Distinguish popularity and wide reach from the credibility of a message.'],
      ['Rozpoznawać ekonomię uwagi, personalizację oraz utratę kontekstu.','Recognise the attention economy, personalisation and loss of context.']
    ],
    m2:[
      ['Rozpoznawać emocje i presję czasu, które przyspieszają ocenę treści.','Recognise emotions and time pressure that accelerate judgement.'],
      ['Wyjaśniać wpływ negatywności, błędu potwierdzenia, społecznego dowodu i powtarzania.','Explain the effects of negativity, confirmation bias, social proof and repetition.'],
      ['Stosować krótką pauzę i pytania kontrolne przed reakcją lub udostępnieniem.','Use a brief pause and control questions before reacting or sharing.']
    ],
    m3:[
      ['Rozróżniać misinformation, disinformation i malinformation bez zgadywania intencji.','Distinguish misinformation, disinformation and malinformation without guessing intent.'],
      ['Analizować źródło, kontekst, język i formę przekazu.','Analyse the source, context, language and form of a message.'],
      ['Rozpoznawać podszywanie, cherry-picking, media syntetyczne i skoordynowaną aktywność.','Recognise impersonation, cherry-picking, synthetic media and coordinated activity.']
    ],
    m4:[
      ['Precyzować sprawdzalne twierdzenie i dobierać do niego właściwy dowód.','Define a verifiable claim and select evidence appropriate to it.'],
      ['Weryfikować autora, źródło pierwotne, zdjęcia, nagrania oraz dane.','Verify the author, primary source, images, recordings and data.'],
      ['Stosować czytanie lateralne, SIFT i triangulację oraz formułować uczciwy wniosek.','Use lateral reading, SIFT and triangulation, and formulate a well-supported conclusion.']
    ],
    m5:[
      ['Dobierać reakcję do ryzyka szkody, zasięgu treści i odbiorcy.','Match the response to the risk of harm, content reach and audience.'],
      ['Tworzyć skuteczne sprostowania oraz rozróżniać debunking i prebunking.','Create effective corrections and distinguish debunking from prebunking.'],
      ['Dokumentować i zgłaszać oszustwa oraz rozmawiać o błędzie bez zawstydzania.','Document and report fraud, and discuss errors without humiliating others.']
    ]
  };
  const ACHIEVEMENT_LOGOS=[
    'grafiki/logo-projektu-wide.png',
    'grafiki/logo-ue-mono-black.png',
    'grafiki/logo-wup.png'
  ];
  function loadCanvasImage(src){return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src;});}
  function drawContained(ctx,img,x,y,w,h){if(!img)return;const scale=Math.min(w/img.naturalWidth,h/img.naturalHeight),dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);}
  function drawSkillList(ctx,items,x,y,maxWidth){ctx.textAlign='left';ctx.font='500 25px Arial';let cursor=y;items.forEach(item=>{const lines=wrap(ctx,txt(item),maxWidth-48);ctx.fillStyle='#b8da2f';ctx.beginPath();ctx.arc(x+9,cursor-8,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#25352e';lines.forEach((line,i)=>ctx.fillText(line,x+42,cursor+i*34));cursor+=lines.length*34+22;});return cursor;}
  async function achievementCanvas(module){
    const c=document.createElement('canvas');c.width=1240;c.height=1754;const x=c.getContext('2d');
    x.fillStyle='#f4f0e7';x.fillRect(0,0,c.width,c.height);
    x.fillStyle='#11261e';x.fillRect(0,0,c.width,230);
    x.fillStyle='#b8da2f';x.fillRect(0,230,c.width,14);
    x.textAlign='center';x.fillStyle='#fff';x.font='800 38px Arial';x.fillText(currentLang()==='pl'?'EDUKACJA BEZ GRANIC':'EDUCATION WITHOUT BORDERS',620,100);
    x.font='700 26px Arial';x.fillText(currentLang()==='pl'?'KURS ONLINE - MEDIA LITERACY':'ONLINE COURSE - MEDIA LITERACY',620,155);

    x.fillStyle='#fffdf8';x.fillRect(70,300,1100,1040);
    x.strokeStyle='#cfd7d2';x.lineWidth=3;x.strokeRect(70,300,1100,1040);
    x.fillStyle='#17231e';x.font='800 42px Arial';x.fillText(currentLang()==='pl'?`KARTA OSIĄGNIĘCIA - MODUŁ ${module.slice(1)}`:`ACHIEVEMENT CARD - MODULE ${module.slice(1)}`,620,390);
    x.font='700 38px Arial';wrap(x,txt(MODULE_TITLES[module]),940).forEach((line,i)=>x.fillText(line,620,478+i*48));

    const score=state.quizzes[module]?.score||0;
    x.fillStyle='#2f7d4a';x.font='800 76px Arial';x.fillText(`${score}/8`,620,685);
    x.fillStyle='#5d6a64';x.font='400 27px Arial';x.fillText(currentLang()==='pl'?'Test modułowy zaliczony':'Module quiz passed',620,738);
    x.strokeStyle='#d9e1dc';x.lineWidth=2;x.beginPath();x.moveTo(135,790);x.lineTo(1105,790);x.stroke();

    x.textAlign='left';x.fillStyle='#17231e';x.font='800 28px Arial';x.fillText(currentLang()==='pl'?'PO UKOŃCZENIU MODUŁU POTRAFISZ:':'AFTER COMPLETING THIS MODULE, YOU CAN:',145,850);
    drawSkillList(x,MODULE_SKILLS[module],145,910,950);

    x.textAlign='center';x.fillStyle='#5d6a64';x.font='400 23px Arial';
    wrap(x,currentLang()==='pl'?'Karta potwierdza ukończenie modułu i zaliczenie testu wynikiem co najmniej 7/8.':'This card confirms completion of the module and a quiz score of at least 7/8.',880).forEach((line,i)=>x.fillText(line,620,1240+i*32));
    x.fillStyle='#17231e';x.font='600 25px Arial';x.fillText(new Date().toLocaleDateString(currentLang()==='pl'?'pl-PL':'en-GB'),620,1302);

    x.strokeStyle='#cfd7d2';x.lineWidth=2;x.beginPath();x.moveTo(90,1390);x.lineTo(1150,1390);x.stroke();
    const logos=await Promise.all(ACHIEVEMENT_LOGOS.map(loadCanvasImage));
    drawContained(x,logos[0],90,1420,330,170);
    drawContained(x,logos[1],455,1450,330,95);
    drawContained(x,logos[2],820,1440,330,115);
    x.fillStyle='#5d6a64';x.font='400 18px Arial';x.textAlign='center';x.fillText(currentLang()==='pl'?'Materiał edukacyjny przygotowany w ramach projektu współfinansowanego ze środków Unii Europejskiej.':'Educational material prepared as part of a project co-funded by the European Union.',620,1660);
    return c;
  }
  async function downloadAchievement(module){if(!state.quizzes[module]?.passed)return;try{const c=await achievementCanvas(module),blob=makePdf(c),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(currentLang()==='pl'?`karta-osiagniecia-${module}-`:`achievement-card-${module}-`)+new Date().toISOString().slice(0,10)+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);}catch(e){console.error(e);flashSave(t().pdfFail,true);}}

  function initCertificate(){
    const name=$('#participantName'), dl=$('#downloadDiploma'), pr=$('#printDiploma'); if(!name||!dl||!pr)return; name.value=state.name||''; name.addEventListener('input',()=>{state.name=name.value.trim();localStorage.setItem(STATE_KEY,JSON.stringify(state));updateProgress();}); dl.addEventListener('click',downloadDiploma); pr.addEventListener('click',printDiploma); updateProgress();
  }
  function rounded(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
  function wrap(ctx,text,max){const words=String(text).split(/\s+/),out=[];let line='';for(const w of words){const test=line?line+' '+w:w;if(!line||ctx.measureText(test).width<=max)line=test;else{out.push(line);line=w}}if(line)out.push(line);return out}
  const enc=s=>new TextEncoder().encode(s); function b64(data){const str=atob(data.split(',')[1]),a=new Uint8Array(str.length);for(let i=0;i<str.length;i++)a[i]=str.charCodeAt(i);return a}
  function makePdf(canvas){const PW=595.28,PH=841.89,img=b64(canvas.toDataURL('image/jpeg',.92)),stream=`q ${PW} 0 0 ${PH} 0 0 cm /Im1 Do Q`,objs=[],chunks=[enc('%PDF-1.4\n')],offs=[0];objs[1]=enc('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');objs[2]=enc('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');objs[3]=enc(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);objs[4]=[enc(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`),img,enc('\nendstream\nendobj\n')];objs[5]=enc(`5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`);let len=chunks[0].length;for(let i=1;i<=5;i++){offs[i]=len;for(const p of (Array.isArray(objs[i])?objs[i]:[objs[i]])){chunks.push(p);len+=p.length}}const xoff=len;let x='xref\n0 6\n0000000000 65535 f \n';for(let i=1;i<=5;i++)x+=`${String(offs[i]).padStart(10,'0')} 00000 n \n`;x+=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xoff}\n%%EOF`;chunks.push(enc(x));return new Blob(chunks,{type:'application/pdf'})}
  async function diplomaCanvas(name){const c=document.createElement('canvas');c.width=1240;c.height=1754;const x=c.getContext('2d'),bg=new Image();await new Promise((res,rej)=>{bg.onload=res;bg.onerror=rej;bg.src=window.EBG_DIPLOMA_BACKGROUND||'grafiki/dyplom-media-literacy-tlo.png'});x.drawImage(bg,0,0,c.width,c.height);x.textAlign='center';x.fillStyle='#173f5c';x.font='700 38px Arial';x.fillText(t().diplomaTitle,620,860);x.fillStyle='#6b7f8c';x.font='400 24px Arial';x.fillText(t().receives,620,912);x.fillStyle='#123a56';x.font='700 64px Arial';const nl=wrap(x,name,900);nl.forEach((line,i)=>x.fillText(line,620,1010+i*70));const y=1010+(nl.length-1)*70;x.strokeStyle='#d8a928';x.lineWidth=3;x.beginPath();x.moveTo(220,y+34);x.lineTo(1020,y+34);x.stroke();x.fillStyle='#2d556f';x.font='400 26px Arial';x.fillText(t().forCompletion,620,y+94);x.font='700 34px Arial';x.fillText(t().diplomaCourse,620,y+146);x.fillStyle='#486678';x.font='400 24px Arial';wrap(x,t().diplomaSkills,820).forEach((line,i)=>x.fillText(line,620,y+208+i*34));return c;}
  async function downloadDiploma(){if(!eligible())return;const name=$('#participantName').value.trim();if(name.length<3)return flashSave(t().needName,true);const btn=$('#downloadDiploma');btn.disabled=true;flashSave(t().pdfBuilding);try{const c=await diplomaCanvas(name),blob=makePdf(c),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(currentLang()==='pl'?'dyplom-ukonczenia-kursu-r4-':'course-completion-diploma-r4-')+new Date().toISOString().slice(0,10)+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);flashSave(t().pdfDone);}catch(e){console.error(e);flashSave(t().pdfFail,true);}finally{updateProgress();}}
  async function printDiploma(){if(!eligible())return;const name=$('#participantName').value.trim();if(name.length<3)return flashSave(t().needName,true);const w=window.open('','_blank');if(!w)return;try{const img=(await diplomaCanvas(name)).toDataURL('image/png');w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(t().diplomaTitle)}</title><style>@page{size:A4;margin:0}body{margin:0}img{width:100%;display:block}</style></head><body><img src="${img}"><script>onload=()=>setTimeout(()=>print(),400)<\/script></body></html>`);w.document.close();}catch(e){w.close();console.error(e);}}

  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  function safeInit(name,fn){
    try{fn();}catch(err){console.error(`[EBG course] ${name}:`,err);}
  }
  function init(){
    document.documentElement.lang=state.lang;
    $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
    $$('.section-complete').forEach(btn=>btn.addEventListener('click',()=>toggleSection(btn.closest('.required-section'))));
    // Bind core learning interactions first so a secondary UI failure cannot disable exercises.
    safeInit('exercises',initExercises);
    safeInit('navigation',initNavigation);
    safeInit('search',initSearch);
    safeInit('tooltips',initTooltips);
    safeInit('export/import',initExportImport);
    safeInit('certificate',initCertificate);
    safeInit('sidebar',renderSidebar);
    safeInit('quizzes',renderQuizzes);
    safeInit('language',()=>setLanguage(state.lang));
    safeInit('progress',updateAll);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

  function initM2SelfAssessment(){
    const root = document.querySelector('[data-self-assessment="m2"]');
    const check = document.getElementById('m2SelfAssessmentCheck');
    const clear = document.getElementById('m2SelfAssessmentClear');
    const result = document.getElementById('m2SelfAssessmentResult');
    if(!root || !check || !clear || !result) return;
    const storageKey = 'ebgSelfAssessmentM2R72';
    const items = [...root.querySelectorAll('.self-assessment-item')];
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      items.forEach(item => {
        const v = saved[item.dataset.key];
        if(v){ const input=item.querySelector(`input[value="${v}"]`); if(input) input.checked=true; }
      });
    } catch(e) {}
    root.addEventListener('change', () => {
      const values={};
      items.forEach(item => { const c=item.querySelector('input:checked'); if(c) values[item.dataset.key]=c.value; });
      try{ localStorage.setItem(storageKey, JSON.stringify(values)); }catch(e){}
      result.hidden=true;
    });
    check.addEventListener('click', () => {
      const values={};
      let complete=true;
      items.forEach(item => { const c=item.querySelector('input:checked'); if(!c) complete=false; else values[item.dataset.key]=Number(c.value); });
      const lang=document.documentElement.lang==='en'?'en':'pl';
      if(!complete){
        result.hidden=false;
        result.innerHTML=lang==='pl' ? '<strong>Uzupełnij wszystkie sześć odpowiedzi.</strong><span>Samoocena nie ma punktów - potrzebujemy kompletu odpowiedzi tylko po to, aby pokazać sensowne podsumowanie.</span>' : '<strong>Answer all six statements.</strong><span>There is no score - a complete set is only needed to generate a meaningful summary.</span>';
        return;
      }
      const notes=[];
      if(values.popularity>=4) notes.push(lang==='pl'?'Popularność mocno wpływa na pierwsze wrażenie. Warto przypominać sobie: zasięg mówi o zainteresowaniu, nie o prawdziwości.':'Popularity strongly shapes your first impression. Remind yourself: reach signals attention, not truth.');
      if(values.repetition>=4) notes.push(lang==='pl'?'Powtarzanie zwiększa poczucie prawdopodobieństwa. Przy kolejnym zetknięciu z tym samym twierdzeniem sprawdź, czy pojawił się nowy dowód, czy tylko kolejna kopia.':'Repetition increases plausibility. When you see the same claim again, check whether there is new evidence or only another copy.');
      if(values.headline>=4) notes.push(lang==='pl'?'Presja czasu sprzyja ocenie po nagłówku. Przy informacji ważnej dla decyzji otwórz pełną treść przed reakcją.':'Time pressure encourages headline-based judgement. For decision-relevant information, open the full content before reacting.');
      if(values.pause<=2 || values.evidence<=2) notes.push(lang==='pl'?'Warto wzmocnić krótką pauzę przed reakcją: nazwij emocję, twierdzenie i źródło, zanim klikniesz „udostępnij”.':'Strengthen the short pause before reacting: name the emotion, claim and source before clicking “share”.');
      if(values.confirm<=2) notes.push(lang==='pl'?'Największą ostrożność warto zachować przy treściach zgodnych z własnymi przekonaniami - właśnie wtedy błąd potwierdzenia jest najmniej widoczny.':'Be especially careful with content that fits your existing beliefs - confirmation bias is hardest to notice then.');
      if(!notes.length) notes.push(lang==='pl'?'Twoje odpowiedzi pokazują kilka ochronnych nawyków. Najważniejsze jest utrzymanie ich także wtedy, gdy treść jest pilna, emocjonalna albo zgodna z Twoimi poglądami.':'Your answers show several protective habits. The key is maintaining them when content is urgent, emotional or aligned with your views.');
      const title=lang==='pl'?'Co warto zauważyć w swoich odpowiedziach?':'What is worth noticing in your answers?';
      const action=lang==='pl'?'Wybierz jeden mały krok na najbliższy tydzień: sprawdź źródło przed udostępnieniem, przeczytaj pełną treść przed oceną nagłówka albo przy informacji zgodnej z Twoimi poglądami zadaj sobie dodatkowe pytanie „skąd to wiem?”.':'Choose one small step for the next week: check the source before sharing, read the full content before judging the headline, or ask “how do I know this?” when information confirms your beliefs.';
      result.hidden=false;
      result.innerHTML=`<strong>${title}</strong><ul>${notes.map(n=>`<li>${n}</li>`).join('')}</ul><p>${action}</p>`;
    });
    clear.addEventListener('click', () => {
      root.querySelectorAll('input').forEach(i=>i.checked=false);
      try{localStorage.removeItem(storageKey)}catch(e){}
      result.hidden=true; result.innerHTML='';
    });
  }
  initM2SelfAssessment();

})();
