(()=>{'use strict';
const KEY='ebgCourseModuleQuizV1', STATE='ebgCourseV2State';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const quizzes={
1:[
['Wiadomość otrzymana od znajomego zawiera link do sensacyjnego artykułu. Co należy ocenić jako źródło informacji?',['Znajomego, który przesłał link','Portal lub autora pierwotnej publikacji','Komunikator, przez który wiadomość dotarła','Liczbę reakcji pod wiadomością'],1],
['Platforma pokazuje użytkownikowi coraz więcej treści zgodnych z jego wcześniejszymi wyborami. Najtrafniej opisuje to:',['neutralny porządek chronologiczny','personalizacja algorytmiczna','weryfikacja redakcyjna','anonimizacja danych'],1],
['Które działanie najlepiej ogranicza wpływ bańki filtrującej?',['Śledzenie wyłącznie jednego zaufanego profilu','Porównywanie informacji w źródłach o różnych perspektywach','Wyłączanie komentarzy pod publikacjami','Udostępnianie treści przed ich przeczytaniem'],1],
['Odpowiedź AI zawiera nazwę raportu i konkretne liczby. Co powinien zrobić użytkownik przed wykorzystaniem ich w ważnej decyzji?',['Uznać dane za pewne, bo są szczegółowe','Poprosić AI o bardziej stanowczą odpowiedź','Dotrzeć do wskazanego raportu i sprawdzić dane w materiale pierwotnym','Sprawdzić wyłącznie popularność narzędzia AI'],2],
['Które stwierdzenie najlepiej odróżnia kanał dotarcia od źródła?',['Kanał odpowiada za treść, a źródło za jej zasięg','Kanał to sposób, którym informacja do nas dotarła, a źródło to miejsce jej pierwotnego powstania','Kanał i źródło zawsze oznaczają to samo','Źródłem jest zawsze osoba, która ostatnia udostępniła treść'],1],
['Duża liczba podobnych publikacji w strumieniu użytkownika przede wszystkim dowodzi, że:',['informacja jest prawdziwa','temat został zweryfikowany przez ekspertów','algorytm może wzmacniać określony typ treści','wszystkie źródła są od siebie niezależne'],2],
['Które pytanie najlepiej pomaga ocenić wpływ technologii na odbiór wiadomości?',['Czy podoba mi się grafika?','Czy treść została mi pokazana w wyniku rekomendacji lub personalizacji?','Czy tekst jest krótki?','Czy autor użył prostych słów?'],1],
['Komora pogłosowa powstaje przede wszystkim wtedy, gdy:',['użytkownik spotyka wiele sprzecznych źródeł','podobne poglądy są stale wzmacniane wewnątrz zamkniętej grupy','portal publikuje sprostowanie','odbiorca korzysta z wyszukiwarki'],1]
],
2:[
['Prawdziwe zdjęcie z wcześniejszego wydarzenia opublikowano jako ilustrację bieżącego kryzysu. Jest to przede wszystkim:',['satyra','fałszywy kontekst','błąd typograficzny','komentarz ekspercki'],1],
['Autor wybiera tylko dane potwierdzające jego tezę, pomijając wyniki przeciwne. Ta technika to:',['triangulacja','cherry-picking','odwrotne wyszukiwanie','korekta redakcyjna'],1],
['Nagłówek wywołuje strach i nakłania do natychmiastowego udostępnienia. Najlepsza pierwsza reakcja to:',['udostępnić ostrzeżenie na wszelki wypadek','zatrzymać się i sprawdzić źródło oraz kontekst','ocenić wiarygodność po liczbie komentarzy','skopiować treść do innego komunikatora'],1],
['Który sygnał najmocniej wskazuje na podszywanie się pod instytucję?',['oficjalny komunikat na zweryfikowanej domenie','nazwa konta bardzo podobna do oficjalnej, ale z dodatkowym członem i świeżą datą utworzenia','podanie numeru telefonu centrali','link do strony BIP'],1],
['W metodzie SIFT krok „Investigate the source” oznacza:',['zbadanie reputacji, celu i kompetencji źródła','natychmiastowe zgłoszenie publikacji','ocenę wyłącznie wyglądu strony','przeczytanie komentarzy użytkowników'],0],
['Materiał zawiera prawdziwe liczby, ale przedstawia je bez wielkości grupy i okresu badania. Głównym problemem jest:',['brak kontekstu','brak emocjonalnego języka','zbyt duża liczba źródeł','nadmierna długość tekstu'],0],
['Które zdanie jest przykładem języka manipulacyjnego?',['Raport opublikowano 12 maja','Każdy rozsądny człowiek wie, że tylko zdrajcy mogą się z tym nie zgodzić','Badanie obejmowało 1200 respondentów','Autor wskazuje trzy ograniczenia analizy'],1],
['Misinformation różni się od disinformation przede wszystkim tym, że:',['zawsze dotyczy polityki','jest rozpowszechniana bez zamiaru wprowadzania w błąd','musi zawierać sfałszowane zdjęcie','pochodzi wyłącznie z mediów społecznościowych'],1]
],
3:[
['Zdanie „Nowa procedura prawdopodobnie skróci kolejki” jest przede wszystkim:',['faktem już potwierdzonym','przewidywaniem','danymi pierwotnymi','definicją'],1],
['Który element najsilniej zwiększa wartość dowodową twierdzenia?',['zgodność z opinią odbiorcy','możliwość dotarcia do danych i sprawdzenia metody','emocjonalny ton autora','duża liczba udostępnień'],1],
['Dwa rzetelne źródła podają różne wartości. Najlepszym następnym krokiem jest:',['wybrać większą wartość','sprawdzić definicje, zakres, okres i metodę obu pomiarów','uznać oba źródła za fałszywe','uśrednić liczby bez dalszej analizy'],1],
['Które pytanie najlepiej wykrywa ukryte założenie?',['Jakiego koloru jest wykres?','Co musi być prawdą, aby ten wniosek był uzasadniony?','Ile osób polubiło post?','Czy autor pisze krótko?'],1],
['Wykres zaczyna oś pionową od wartości 95 zamiast od zera i pokazuje zmianę z 98 do 100 jako ogromny skok. Problem polega na:',['braku autora','zniekształceniu skali','nieprawidłowej pisowni','zbyt dużej próbie'],1],
['Triangulacja informacji polega na:',['trzykrotnym przeczytaniu tego samego tekstu','porównaniu twierdzenia z kilkoma niezależnymi źródłami lub rodzajami dowodów','wybraniu trzech najpopularniejszych komentarzy','sprawdzeniu wyłącznie trzech pierwszych wyników wyszukiwania'],1],
['Która odpowiedź najlepiej oddziela fakt od interpretacji?',['Fakt opisuje sprawdzalne zdarzenie lub dane, a interpretacja nadaje im znaczenie','Interpretacja zawsze jest fałszywa','Fakt zależy od poglądów autora','Nie ma między nimi różnicy'],0],
['Przed podjęciem decyzji na podstawie raportu należy przede wszystkim ocenić:',['czy wniosek jest zgodny z intuicją','źródło, metodę, dane, kontekst i ograniczenia','wyłącznie nazwisko autora','liczbę grafik w dokumencie'],1]
],
4:[
['Ta sama informacja może prowadzić do różnych ocen, gdy zostanie przedstawiona w odmiennych ramach. Rama interpretacyjna to:',['techniczny błąd strony','sposób wyboru i uporządkowania elementów przekazu','podpis pod fotografią','liczba znaków w tekście'],1],
['Które sformułowanie najbardziej polaryzuje debatę?',['Nie zgadzam się z tym rozwiązaniem z trzech powodów','Zwolennicy tej propozycji są wrogami zwykłych ludzi','Dane wymagają dodatkowego wyjaśnienia','Warto porównać skutki obu wariantów'],1],
['Odpowiedzialne udostępnienie informacji o grupie społecznej wymaga przede wszystkim:',['uogólnienia pojedynczego przypadku','sprawdzenia danych, kontekstu i ryzyka stygmatyzacji','zastosowania mocniejszego nagłówka','pominięcia źródła dla ochrony autora'],1],
['Która odpowiedź stanowi rzeczowy sprzeciw?',['Każdy, kto tak uważa, jest ignorantem','Nie zgadzam się, ponieważ podane dane nie obejmują całej badanej grupy','Nie ma sensu z tobą rozmawiać','Wasza strona zawsze kłamie'],1],
['Pluralizm w debacie publicznej oznacza, że:',['każde twierdzenie jest równie prawdziwe','różne poglądy mogą być przedstawiane, ale fakty nadal podlegają weryfikacji','nie wolno krytykować żadnego stanowiska','większość zawsze ma rację'],1],
['Które działanie platformy może wzmacniać konflikt?',['promowanie treści wywołujących silne reakcje i długi czas zaangażowania','publikowanie sprostowań','udostępnianie dokumentów źródłowych','oznaczanie daty publikacji'],0],
['Materiał krytykuje decyzję instytucji, ale bez dowodów sugeruje, że cała instytucja działa nielegalnie. Jest to przykład:',['rzeczowej krytyki proceduralnej','nieuzasadnionego podważania wiarygodności instytucji','neutralnego streszczenia','analizy statystycznej'],1],
['Przed udostępnieniem emocjonalnej treści dotyczącej konfliktu społecznego najlepiej:',['sprawdzić źródło, pełny kontekst i możliwe skutki rozpowszechnienia','usunąć nazwisko autora i udostępnić','dodać jeszcze ostrzejszy komentarz','ocenić prawdziwość po zgodności z własnym poglądem'],0]
],
5:[
['Doomscrolling to:',['planowe czytanie długich raportów','nawykowe przewijanie kolejnych niepokojących treści mimo pogarszającego się samopoczucia','sprawdzanie jednego komunikatu alarmowego','wyłączanie powiadomień'],1],
['Która reakcja najlepiej pokazuje przejście od impulsu do świadomej odpowiedzi?',['natychmiastowe odpisanie pod wpływem złości','pauza, nazwanie emocji, sprawdzenie informacji i wybór działania','przesłanie treści wszystkim znajomym','ignorowanie każdego komunikatu'],1],
['Odporność informacyjna nie oznacza:',['zdolności sprawdzania informacji mimo presji','całkowitej nieufności wobec wszystkich źródeł','świadomego zarządzania uwagą','odraczania reakcji na silnie emocjonalne treści'],1],
['Który nawyk najlepiej ogranicza przeciążenie informacyjne?',['ciągłe włączone powiadomienia','ustalone pory sprawdzania wiadomości i ograniczenie zbędnych alertów','śledzenie jak największej liczby kont','czytanie wiadomości bez przerw przed snem'],1],
['Silna emocja po przeczytaniu posta powinna być traktowana jako:',['dowód prawdziwości','sygnał do zwolnienia i sprawdzenia treści','powód do natychmiastowego udostępnienia','dowód złych intencji autora'],1],
['Które zachowanie wspiera higienę informacyjną?',['regularne przerwy, świadomy dobór źródeł i ograniczenie czasu ekspozycji','czytanie tylko treści zgodnych z własnymi poglądami','rezygnacja z każdego źródła instytucjonalnego','zastępowanie snu przeglądaniem wiadomości'],0],
['Gdy nie można szybko zweryfikować alarmującej informacji, odpowiedzialne działanie to:',['udostępnić ją z dopiskiem „nie wiem, czy prawda”','wstrzymać rozpowszechnianie do czasu uzyskania potwierdzenia','usunąć datę i źródło','zapytać wyłącznie osoby o podobnych poglądach'],1],
['Zdrowa rutyna medialna powinna być:',['identyczna dla wszystkich użytkowników','realistyczna, regularna i dopasowana do własnych obowiązków oraz reakcji','oparta na całkowitym odcięciu od informacji','mierzona wyłącznie liczbą przeczytanych artykułów'],1]
]};
function moduleProgress(m){
 const state=read(STATE,{completed:[]});
 const stored=new Set(Array.isArray(state.completed)?state.completed:[]);
 const secs=$$(`.course-section[data-module-number="${m}"]`).filter(s=>s.dataset.quizRequired!=="false");
 const isDone=section=>{
  const id=section.dataset.courseSection;
  const nav=id?$(`[data-section-link="${CSS.escape(id)}"]`):null;
  return Boolean(id&&(stored.has(id)||section.classList.contains('is-complete')||nav?.classList.contains('is-complete')));
 };
 const completed=secs.filter(isDone);
 return{done:completed.length,total:secs.length,missing:secs.filter(s=>!isDone(s)).map(s=>s.dataset.courseSection)};
}
function quizState(){return read(KEY,{})}
function passed(m){return Boolean(quizState()[m]?.passed)}
function render(panel,m){
 const nav=$('.module-bottom-nav',panel); if(!nav||$('[data-module-quiz]',panel))return;
 const section=document.createElement('section');section.className='module-quiz';section.dataset.moduleQuiz=m;
 section.innerHTML=`<div class="module-quiz__head"><div><span>TEST MODUŁOWY</span><h2>Sprawdź wiedzę z Modułu ${m}</h2><p>Odpowiedz na 8 pytań. Do zaliczenia potrzebujesz co najmniej 7 poprawnych odpowiedzi.</p></div><strong data-quiz-status>Nieukończony</strong></div><form><div class="module-quiz__questions"></div><div class="module-quiz__actions"><button type="submit">Sprawdź wynik</button><p data-quiz-result aria-live="polite"></p></div></form>`;
 const box=$('.module-quiz__questions',section);
 quizzes[m].forEach((q,i)=>{const item=document.createElement('fieldset');item.innerHTML=`<legend><span>${i+1}</span>${q[0]}</legend><div>${q[1].map((a,j)=>`<label><input type="radio" name="quiz-${m}-${i}" value="${j}"><span>${a}</span></label>`).join('')}</div>`;box.append(item)});
 nav.before(section);
 const saved=quizState()[m]; if(saved?.answers) Object.entries(saved.answers).forEach(([i,v])=>{const f=$(`input[name="quiz-${m}-${i}"][value="${v}"]`,section);if(f)f.checked=true});
 const update=()=>{const p=moduleProgress(m),btn=$('button[type="submit"]',section),status=$('[data-quiz-status]',section),result=$('[data-quiz-result]',section);btn.disabled=!p.total||p.done<p.total;if(saved?.passed||passed(m)){status.textContent='Zaliczony';section.classList.add('is-passed');result.textContent=`Test zaliczony: ${quizState()[m].score}/8. Karta osiągnięcia jest odblokowana.`}else if(btn.disabled){result.textContent=`Test odblokuje się po ukończeniu wszystkich tematów modułu (${p.done}/${p.total}).`}else{result.textContent='Możesz rozpocząć test.'}};update();
 section.addEventListener('change',()=>{const st=quizState(),answers={};quizzes[m].forEach((_,i)=>{const c=$(`input[name="quiz-${m}-${i}"]:checked`,section);if(c)answers[i]=Number(c.value)});st[m]={...(st[m]||{}),answers};write(KEY,st)});
 $('form',section).addEventListener('submit',e=>{e.preventDefault();const p=moduleProgress(m);if(p.done<p.total){update();return}let score=0,answered=0,answers={};quizzes[m].forEach((q,i)=>{const c=$(`input[name="quiz-${m}-${i}"]:checked`,section);if(c){answered++;answers[i]=Number(c.value);if(Number(c.value)===q[2])score++}});const result=$('[data-quiz-result]',section);if(answered<8){result.textContent=`Odpowiedz na wszystkie pytania (${answered}/8).`;section.classList.add('has-error');return}const ok=score>=7,st=quizState();st[m]={answers,score,passed:ok,attempts:(st[m]?.attempts||0)+1,completedAt:ok?new Date().toISOString():st[m]?.completedAt||null};write(KEY,st);section.classList.toggle('is-passed',ok);section.classList.toggle('has-error',!ok);$('[data-quiz-status]',section).textContent=ok?'Zaliczony':'Do poprawy';result.textContent=ok?`Test zaliczony: ${score}/8. Możesz pobrać kartę osiągnięcia.`:`Wynik: ${score}/8. Do zaliczenia brakuje ${7-score} ${7-score===1?'punktu':'punktów'}. Popraw odpowiedzi i spróbuj ponownie.`;document.dispatchEvent(new CustomEvent('ebg:module-quiz-updated',{detail:{module:m,score,passed:ok}}))});
 document.addEventListener('ebg:course-progress-updated',update);
}
$$('.course-module[data-module-panel]').forEach(p=>render(p,Number(p.dataset.modulePanel)));
window.EBGModuleQuiz={key:KEY,passed,score:m=>quizState()[m]?.score||0,state:quizState};
})();
