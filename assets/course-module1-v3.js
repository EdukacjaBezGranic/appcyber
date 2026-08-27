(() => {
  'use strict';
  const STORAGE_KEY = 'ebgCourseM1V3';
  const hosts = [...document.querySelectorAll('[data-m1v3-activity]')];
  if (!hosts.length) return;

  const safeStorage = (() => {
    try {
      const s = window.localStorage;
      s.setItem('__m1v3_probe__', '1');
      s.removeItem('__m1v3_probe__');
      return s;
    } catch {
      const memory = new Map();
      return {getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
    }
  })();
  const load = () => { try { return JSON.parse(safeStorage.getItem(STORAGE_KEY)) || {version:'2026.08-v3',activities:{}}; } catch { return {version:'2026.08-v3',activities:{}}; } };
  const state = load();
  state.version = '2026.08-v3';
  state.activities ||= {};
  const save = () => safeStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function serialize(form) {
    const result = {};
    const names = [...new Set([...form.elements].map(el => el.name).filter(Boolean))];
    names.forEach(name => {
      const fields = [...form.elements].filter(el => el.name === name);
      const first = fields[0];
      if (first.type === 'checkbox') result[name] = fields.filter(f => f.checked).map(f => f.value);
      else if (first.type === 'radio') result[name] = fields.find(f => f.checked)?.value || '';
      else result[name] = first.value;
    });
    return result;
  }
  function restore(form, values={}) {
    [...form.elements].forEach(el => {
      if (!el.name || !(el.name in values)) return;
      const value = values[el.name];
      if (el.type === 'checkbox') el.checked = Array.isArray(value) && value.includes(el.value);
      else if (el.type === 'radio') el.checked = value === el.value;
      else el.value = value ?? '';
    });
  }
  const activityGuides = {
    '1.1': {
      steps: [
        'Przeczytaj pierwszą sytuację.',
        'Odpowiedz na trzy pytania: jak informacja do Ciebie dotarła, czy widzisz jej źródło pierwotne i co warto zrobić najpierw.',
        'Tak samo przeanalizuj drugą sytuację.',
        'Kliknij „Sprawdź odpowiedzi”.'
      ],
      note: 'Nie musisz rozstrzygać, czy wiadomość jest prawdziwa. Twoim zadaniem jest odróżnić drogę dotarcia od źródła i wybrać rozsądny pierwszy krok.'
    },
    '1.2': {
      steps: [
        'W pierwszym polu wybierz pytanie, które najrzadziej zadajesz podczas czytania informacji.',
        'W drugim polu wybierz powód, który najlepiej wyjaśnia ten nawyk.',
        'Własną notatkę możesz zostawić pustą.',
        'Kliknij „Zapisz refleksję” albo wybierz „Pomiń”.'
      ],
      note: 'Nie ma tu poprawnej ani błędnej odpowiedzi.'
    },
    '1.3': {
      steps: [
        'Wyobraź sobie, że jedna wiadomość jest skracana i przesyłana dalej przez kolejne osoby.',
        'Najpierw przeczytaj wszystkie pięć wersji. Każda dotyczy tego samego czasowego zamknięcia jednego urzędu.',
        'Przy każdej wersji wybierz jej miejsce w kolejności: 1 to pełny komunikat oficjalny, a 5 to najbardziej zniekształcona i uogólniona wersja.',
        'Każdego numeru od 1 do 5 użyj tylko raz.',
        'Kliknij „Sprawdź kolejność” i przeczytaj wyjaśnienie pod każdą wersją wiadomości.'
      ],
      note: 'To działa jak zabawa w głuchy telefon: im dalej wiadomość jest od źródła, tym więcej szczegółów może zniknąć albo zmienić znaczenie.'
    },
    '1.4': {
      steps: [
        'Przeczytaj całą historię fałszywego profilu — od pojawienia się błędnego terminu do zgłoszenia konta.',
        'W pierwszej sytuacji wskaż, gdzie odbiorca powinien sprawdzić informację.',
        'W drugiej rozpoznaj, co bezpośrednio zwiększa widoczność fałszywego posta.',
        'W trzeciej wskaż podmiot, który może technicznie ograniczyć konto po zgłoszeniu.',
        'Kliknij „Sprawdź decyzje” i przeczytaj, jaką rolę pełni każdy uczestnik obiegu.'
      ],
      note: 'Odpowiedzialność jest rozłożona: instytucja publikuje źródło pierwotne, odbiorca sprawdza i nie zwiększa zasięgu, a platforma obsługuje zgłoszenie i może ograniczyć konto.'
    },
    '1.5': {
      steps: [
        'Przeczytaj krótkie opisy osoby A i osoby B umieszczone bezpośrednio w zadaniu.',
        'Przy każdym z czterech materiałów wybierz osobę, której platforma prawdopodobnie go poleci.',
        'Zaznacz wszystkie sygnały, które mogą wpływać na rekomendacje.',
        'Wybierz najlepszy końcowy wniosek.',
        'Kliknij „Sprawdź symulację”. Jeśli popełnisz błąd, zdecyduj, czy próbujesz ponownie, czy chcesz odsłonić poprawne odpowiedzi.'
      ],
      note: 'Opisy dotyczą wyłącznie ostatnich zachowań w sieci. Nie są oceną zainteresowań ani cech tych osób. Strumień treści nie pokazuje całego internetu ani opinii większości.'
    },
    '1.6': {
      steps: [
        'Przeczytaj pierwszą sytuację.',
        'Wybierz: bańka filtrująca, komora pogłosowa, oba mechanizmy albo brak danych.',
        'Bańka filtrująca dotyczy głównie automatycznego doboru treści przez system.',
        'Komora pogłosowa dotyczy grupy, która powtarza podobne opinie i odrzuca inne głosy.',
        'Odpowiedz na wszystkie cztery sytuacje i kliknij „Sprawdź rozróżnienie”.'
      ],
      note: 'Jeżeli opis nie mówi, jak wybrano treść ani jak działała grupa, możesz wybrać „brak wystarczających danych”.'
    },
    '1.7': {
      steps: [
        'Przeczytaj trzy sytuacje: przygotowanie komunikatu, streszczenie raportu i serię rekomendowanych filmów.',
        'W każdej sytuacji wybierz działanie człowieka, które pozwala sprawdzić źródło, dane lub sposób doboru treści.',
        'Nie oceniaj wyłącznie tego, czy wynik AI brzmi profesjonalnie i spójnie.',
        'Kliknij „Sprawdź decyzje” i porównaj uzasadnienia dla trzech różnych ról technologii.'
      ],
      note: 'Kontrola człowieka wygląda inaczej przy tworzeniu, streszczaniu i rekomendowaniu. Wspólna zasada brzmi: wynik narzędzia nie zastępuje źródła ani odpowiedzialnej decyzji.'
    },
    '1.8': {
      steps: [
        'Wybierz etap, na którym najczęściej korzystasz z pomocy narzędzia: wyszukiwanie, wybór, streszczenie, interpretacja, tworzenie albo udostępnienie.',
        'Po wyborze etapu pojawi się jeden proponowany mały krok.',
        'Przeczytaj ten krok i zdecyduj, czy chcesz go wypróbować.',
        'Notatka jest opcjonalna. Kliknij „Zapisz refleksję” albo „Pomiń”.'
      ],
      note: 'To refleksja bez punktów. Nie oceniamy, czy korzystanie z AI jest dobre albo złe.'
    },
    '1.9': {
      steps: [
        'Ćwiczenie ma pięć krótkich części. Przejdź je po kolei od A do E.',
        'A — zaznacz co najmniej jeden kanał, z którego korzystałeś w ostatnich 24 godzinach.',
        'B — przy czterech drogach wybierz częstotliwość.',
        'C — zaznacz co najmniej jedną grupę źródeł.',
        'D — oceń sześć nawyków w skali od 1 do 5.',
        'E — wybierz jeden możliwy punkt, na który chcesz uważać.',
        'Kliknij „Pokaż mój punkt wyjścia” albo wybierz „Pomiń diagnozę”.'
      ],
      note: 'To nie jest test ani ocena. Ćwiczenie zajmuje około 5–8 minut i opisuje tylko punkt startowy.'
    },
    '1.10': {
      steps: [
        'Dokończ zdanie własnymi słowami.',
        'Napisz co najmniej 20 znaków — zwykle wystarczy jedno lub dwa zdania.',
        'Gdy nie wiesz, od czego zacząć, rozwiń „Potrzebuję inspiracji”.',
        'Kliknij „Zapisz refleksję” albo wybierz „Pomiń”.'
      ],
      note: 'Nie oceniamy stylu ani długości. Liczy się Twoja własna myśl.'
    }
  };

  const guideHtml = id => {
    const guide = activityGuides[id];
    if (!guide) return '';
    return `<aside class="exercise-guide" aria-label="Instrukcja wykonania ćwiczenia"><h4>Co masz zrobić?</h4><ol>${guide.steps.map(step => `<li>${step}</li>`).join('')}</ol>${guide.note ? `<p class="exercise-guide-note"><strong>Ważne:</strong> ${guide.note}</p>` : ''}</aside>`;
  };

  function activityShell(id, number, title, intro, body) {
    return `<section class="m1v3-activity" data-activity-id="${id}" aria-labelledby="m1v3-title-${id.replace('.','-')}">
      <header class="m1v3-activity-header"><span class="m1v3-activity-badge">${number}</span><div><h3 id="m1v3-title-${id.replace('.','-')}">${title}</h3><p>${intro}</p></div></header>
      ${guideHtml(id)}
      ${body}
      <div class="m1v3-feedback" data-feedback aria-live="polite" hidden></div>
    </section>`;
  }
  function setFeedback(host, html, kind='') {
    const box = host.querySelector('[data-feedback]');
    box.hidden = false;
    box.className = `m1v3-feedback${kind ? ` is-${kind}` : ''}`;
    box.innerHTML = html;
  }
  function setupSecondChance(host, {onReveal, onRetryFocus}) {
    const form = host.querySelector('form');
    const panel = document.createElement('aside');
    panel.className = 'm1v3-retry-choice';
    panel.hidden = true;
    panel.setAttribute('aria-live', 'polite');
    panel.innerHTML = '<strong>Nie wszystkie odpowiedzi są trafne. Co chcesz zrobić?</strong><p>Możesz zachować swoje odpowiedzi i spróbować je poprawić albo odsłonić rozwiązania wraz z pełnym wyjaśnieniem.</p><div class="m1v3-actions"><button class="m1v3-button" data-second-try type="button">Spróbuję jeszcze raz</button><button class="m1v3-button is-secondary" data-second-reveal type="button">Pokaż poprawne odpowiedzi</button></div>';
    form.append(panel);
    panel.querySelector('[data-second-try]').addEventListener('click', () => {
      panel.hidden = true;
      onRetryFocus?.();
      setFeedback(host, '<strong>Spróbuj ponownie</strong>Zachowaliśmy Twoje odpowiedzi. Zmień te, które po ponownym przeczytaniu przykładu wydają Ci się mniej trafne, a następnie sprawdź zadanie jeszcze raz.', 'warning');
    });
    panel.querySelector('[data-second-reveal]').addEventListener('click', () => {
      onReveal?.();
      panel.hidden = true;
      setFeedback(host, '<strong>Poprawne odpowiedzi zostały odsłonięte</strong>Porównaj je ze swoimi wyborami. Odsłonięcie rozwiązania nie zmienia zaznaczeń — możesz je poprawić i wykonać zadanie ponownie.', 'warning');
    });
    form.addEventListener('change', () => { panel.hidden = true; });
    return {
      show: () => { panel.hidden = false; },
      hide: () => { panel.hidden = true; }
    };
  }
  function requireRadios(form, names) {
    const missing = names.filter(name => !form.querySelector(`[name="${CSS.escape(name)}"]:checked`));
    if (missing.length) {
      form.querySelector(`[name="${CSS.escape(missing[0])}"]`)?.focus();
      return false;
    }
    return true;
  }
  function finish(host, form, score, max, summary, kind='success', extra={}) {
    const id = host.dataset.m1v3Activity;
    const record = state.activities[id] || {attempts:0};
    record.attempts = (record.attempts || 0) + 1;
    record.completed = true;
    record.values = serialize(form);
    if (typeof score === 'number') { record.score = score; record.max = max; }
    record.summary = summary;
    Object.assign(record, extra);
    state.activities[id] = record;
    save();
    const scoreHtml = typeof score === 'number' ? `<span class="m1v3-score">Poprawnie rozpoznane elementy: ${score} z ${max}.</span> <span class="m1v3-score-note">To informacja do nauki, nie ocena końcowa.</span> ` : '';
    setFeedback(host, `<strong>Aktywność wykonana</strong>${scoreHtml}${summary} <span class="m1v3-complete-note">Możesz poprawić odpowiedzi i wykonać zadanie ponownie.</span>`, kind);
    document.dispatchEvent(new CustomEvent('ebg:activity-complete', {detail:{sectionId:host.dataset.sectionId, activityId:id}}));
  }
  function restoreRecord(host) {
    const id = host.dataset.m1v3Activity;
    const record = state.activities[id];
    const form = host.querySelector('form');
    if (form && record?.values) restore(form, record.values);
    if (record?.completed) {
      const scoreHtml = typeof record.score === 'number' ? `<span class="m1v3-score">Ostatnio poprawnie rozpoznane: ${record.score} z ${record.max}.</span> <span class="m1v3-score-note">To informacja do nauki, nie ocena końcowa.</span> ` : '';
      setFeedback(host, `<strong>Zapisana aktywność</strong>${scoreHtml}${esc(record.summary || 'Odpowiedź została zapisana lokalnie.')}`, 'success');
      document.dispatchEvent(new CustomEvent('ebg:activity-complete', {detail:{sectionId:host.dataset.sectionId, activityId:id}}));
    }
  }
  function option(value, label, name, type='radio') {
    return `<label class="m1v3-choice"><input type="${type}" name="${name}" value="${value}"><span>${label}</span></label>`;
  }
  const categoryOptions = [
    ['search','wyszukane celowo'],['person','podsunięte przez inną osobę'],['platform','polecone przez platformę'],['ai','przetworzone przez AI']
  ];

  const renderers = {
    '1.1'(host) {
      const scenarios = [
        {
          title: 'Sytuacja 1. Zrzut ekranu od koleżanki',
          text: 'Koleżanka przesyła Ci w komunikatorze zrzut ekranu z informacją: „Od poniedziałku urząd będzie zamknięty”. Na zrzucie nie widać autora, daty ani adresu strony.',
          questions: [
            {
              name: 's1_route',
              prompt: '1. Jak ta informacja dotarła do Ciebie?',
              options: [
                ['search', 'przez wyszukiwarkę'],
                ['person', 'przez inną osobę'],
                ['platform', 'przez rekomendację platformy'],
                ['ai', 'przez narzędzie AI']
              ],
              correct: 'person',
              rationale: 'Wiadomość pojawiła się w rozmowie, ponieważ przesłała ją koleżanka. To opis drogi dotarcia, a nie potwierdzenie autora pierwotnego komunikatu.'
            },
            {
              name: 's1_source',
      prompt: '2. Co w tej chwili wiesz?',
              options: [
                ['official', 'To na pewno oficjalny komunikat urzędu.'],
                ['closed', 'Urząd na pewno będzie zamknięty.'],
                ['unknown', 'Ktoś przesłał mi zrzut, ale nie widzę źródła pierwotnego.'],
                ['false', 'Wiadomość na pewno jest fałszywa.']
              ],
              correct: 'unknown',
              rationale: 'Zrzut ekranu nie pokazuje autora, daty ani adresu strony. Można potwierdzić jedynie, że otrzymałeś taki obraz — nie że urząd opublikował tę informację.'
            },
            {
              name: 's1_action',
              prompt: '3. Co warto zrobić jako pierwsze?',
              options: [
                ['share', 'Przesłać zrzut innym osobom.'],
                ['ask', 'Zapytać koleżankę, czy jej zdaniem to prawda.'],
                ['official', 'Poszukać komunikatu na oficjalnej stronie urzędu.'],
                ['reactions', 'Sprawdzić, ile osób zareagowało na tę wiadomość.']
              ],
              correct: 'official',
              rationale: 'Twierdzenie dotyczy godzin działania urzędu, dlatego właściwym punktem odniesienia jest jego oficjalna strona lub potwierdzony kanał.'
            }
          ],
          explanation: 'Informacja dotarła przez inną osobę, ale zrzut ekranu nie pokazuje źródła pierwotnego. Najpierw trzeba odnaleźć oficjalny komunikat.'
        },
        {
          title: 'Sytuacja 2. Streszczenie przygotowane przez AI',
          text: 'Pytasz narzędzie AI, czy nowe badanie dowodzi, że praca zdalna obniża produktywność. Otrzymujesz krótką odpowiedź: „Badanie potwierdza wyraźny spadek produktywności”, ale narzędzie nie podaje linku ani tytułu raportu.',
          questions: [
            {
              name: 's2_route',
              prompt: '1. Jak ta informacja dotarła do Ciebie?',
              options: [
                ['search', 'przez wyszukiwarkę'],
                ['person', 'przez inną osobę'],
                ['platform', 'przez rekomendację platformy'],
                ['ai', 'przez narzędzie AI']
              ],
              correct: 'ai',
              rationale: 'Bezpośrednią odpowiedź przygotowało narzędzie AI. Mogło korzystać z innych materiałów, ale nie pokazało ich użytkownikowi.'
            },
            {
              name: 's2_source',
      prompt: '2. Co w tej chwili wiesz?',
              options: [
                ['proof', 'Badanie na pewno potwierdza tę tezę.'],
                ['summary', 'Widzę streszczenie AI, ale nie widzę raportu, na którym je oparto.'],
                ['false', 'Odpowiedź AI na pewno jest fałszywa.'],
                ['majority', 'Większość ekspertów zgadza się z tą tezą.']
              ],
              correct: 'summary',
              rationale: 'Na ekranie widzisz interpretację narzędzia, a nie sam raport. Bez tytułu, linku i metody nie można sprawdzić, czy streszczenie zachowuje sens badania.'
            },
            {
              name: 's2_action',
              prompt: '3. Co warto zrobić jako pierwsze?',
              options: [
                ['repeat', 'Powtórzyć tę informację w rozmowie lub prezentacji.'],
                ['prompt', 'Zapytać AI jeszcze raz innymi słowami.'],
                ['source', 'Odnaleźć wskazane badanie lub raport i sprawdzić jego treść.'],
                ['popular', 'Sprawdzić, czy podobne stwierdzenie jest popularne w mediach społecznościowych.']
              ],
              correct: 'source',
              rationale: 'Ponowne pytanie tego samego narzędzia może dać inne sformułowanie, ale nadal nie zastępuje sprawdzenia publikacji, danych i zastrzeżeń autorów.'
            }
          ],
          explanation: 'AI jest tutaj pośrednikiem i interpretatorem. Zanim uznasz odpowiedź za wiarygodną, trzeba odnaleźć raport i sprawdzić, czy rzeczywiście mówi to samo.'
        }
      ];

      const body = `<form novalidate>${scenarios.map((scenario,scenarioIndex)=>`<fieldset class="m1v3-fieldset" data-scenario="${scenarioIndex}"><legend>${scenario.title}</legend><p>${scenario.text}</p>${scenario.questions.map((question)=>`<div class="m1v3-question-block" data-question-name="${question.name}"><p><strong>${question.prompt}</strong></p><div class="m1v3-options is-grid">${question.options.map(opt=>option(opt[0],opt[1],question.name)).join('')}</div><span class="m1v3-item-feedback" data-question-feedback="${question.name}" aria-live="polite"></span></div>`).join('')}<span class="m1v3-item-feedback" data-item-feedback="${scenarioIndex}"></span></fieldset>`).join('')}<div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź odpowiedzi</button></div></form>`;

      host.innerHTML = activityShell('1.1','1.1','Droga dotarcia to nie źródło','Dwie krótkie sytuacje: rozpoznaj kanał, źródło i pierwszy krok weryfikacji.',body);
      const form = host.querySelector('form');
      const previousRecord = state.activities['1.1'];
      if (previousRecord?.values && Object.keys(previousRecord.values).some(key => /^q[1-5]$/.test(key))) {
        delete state.activities['1.1'];
        save();
      }
      restoreRecord(host);
      let wrongQuestions=[];
      const secondChance=setupSecondChance(host,{
        onRetryFocus:()=>host.querySelector('.m1v3-question-block.is-incorrect input')?.focus(),
        onReveal:()=>wrongQuestions.forEach(({question})=>{
          const labels=Object.fromEntries(question.options);
          const questionFeedback=host.querySelector(`[data-question-feedback="${question.name}"]`);
          questionFeedback.className='m1v3-item-feedback is-revealed';
          questionFeedback.textContent=`Poprawna odpowiedź: ${labels[question.correct]}. ${question.rationale}`;
        })
      });
      form.addEventListener('submit', e => {
        e.preventDefault();
        const names = scenarios.flatMap(s => s.questions.map(q => q.name));
        if (!requireRadios(form, names)) {
          setFeedback(host, 'Odpowiedz na wszystkie trzy pytania w obu sytuacjach.', 'warning');
          return;
        }
        let score = 0;
        wrongQuestions=[];
        scenarios.forEach((scenario, scenarioIndex) => {
          let scenarioScore = 0;
          scenario.questions.forEach(question => {
            const selected = form.querySelector(`[name="${question.name}"]:checked`)?.value;
            const ok = selected === question.correct;
            if (ok) {
              score += 1;
              scenarioScore += 1;
            } else wrongQuestions.push({question,selected});
            const labels = Object.fromEntries(question.options);
            const block = host.querySelector(`[data-question-name="${question.name}"]`);
            block.classList.remove('is-correct', 'is-incorrect');
            block.classList.add(ok ? 'is-correct' : 'is-incorrect');
            const questionFeedback = host.querySelector(`[data-question-feedback="${question.name}"]`);
            questionFeedback.className = `m1v3-item-feedback ${ok ? 'is-correct' : 'is-incorrect'}`;
            questionFeedback.textContent = ok
              ? `Wybrałeś: ${labels[selected]}. To trafna odpowiedź. ${question.rationale}`
              : `Wybrałeś: ${labels[selected]}. Niezupełnie. ${question.rationale}`;
          });
          const fieldset = host.querySelector(`[data-scenario="${scenarioIndex}"]`);
          const feedback = host.querySelector(`[data-item-feedback="${scenarioIndex}"]`);
          const complete = scenarioScore === scenario.questions.length;
          fieldset.classList.remove('is-correct', 'is-incorrect');
          fieldset.classList.add(complete ? 'is-correct' : 'is-incorrect');
          feedback.className = 'm1v3-item-feedback';
          feedback.textContent = `Wniosek z sytuacji: ${scenario.explanation}`;
        });
        finish(host, form, score, 6, 'Droga, którą informacja trafia na ekran, nie jest tym samym co jej źródło. Przed uznaniem treści za wiarygodną znajdź materiał pierwotny.', score === 6 ? 'success' : 'warning');
        if(score<6)secondChance.show();else secondChance.hide();
      });
    },
    '1.2'(host) {
      const questions=['Kto stworzył tę wiadomość?','Dlaczego powstała?','Jakie dowody potwierdzają tezę?','Jaką emocję przekaz próbuje wywołać?','Jakich informacji brakuje?','Kto zyskuje, gdy uwierzę lub udostępnię?','W jaki sposób treść do mnie dotarła?','Czy AI mogła ją wygenerować, zmienić, streścić lub polecić?'];
      const reasons=['Zwykle brakuje mi czasu.','Treść pochodzi od osoby lub źródła, któremu ufam.','Informacja potwierdza to, co już sądzę.','Nie wiem, jak znaleźć odpowiedź.','Skupiam się na treści, a nie na drodze jej dotarcia.','Inny powód.'];
      const body=`<form><label class="m1v3-control">Pytanie, które zadaję najrzadziej<select name="question" required><option value="">Wybierz pytanie</option>${questions.map((q,i)=>`<option value="${i}">${q}</option>`).join('')}</select></label><label class="m1v3-control">Najbliższy powód<select name="reason" required><option value="">Wybierz powód</option>${reasons.map((q,i)=>`<option value="${i}">${q}</option>`).join('')}</select></label><label class="m1v3-control">Własna notatka – opcjonalnie<textarea name="note" maxlength="250"></textarea></label><div class="m1v3-actions"><button class="m1v3-button" type="submit">Zapisz refleksję</button><button class="m1v3-button is-secondary" type="button" data-skip>Pomiń</button></div></form>`;
      host.innerHTML=activityShell('1.2','1.2','Które pytanie zadaję najrzadziej?','Refleksja bez punktacji.',body); const form=host.querySelector('form'); restoreRecord(host);
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const q=questions[Number(form.question.value)];const prompts=['Przy ważnej wiadomości ustal autora i cel przed oceną nagłówka.','Nie chodzi tylko o korzyść finansową: może nią być zasięg, wpływ lub chaos.','Zapytaj, jaki dokument, dane albo pełne nagranie pozwoliłyby to potwierdzić.'];const tip=q.includes('dowody')?prompts[2]:q.includes('zyskuje')?prompts[1]:'Spróbuj użyć tego pytania przy następnej ważnej wiadomości.';finish(host,form,null,null,`${esc(q)} ${tip}`);});
      host.querySelector('[data-skip]').addEventListener('click',()=>finish(host,form,null,null,'Refleksja została świadomie pominięta.'));
    },
    '1.3'(host) {
      const cards=[
        {position:4, text:'Wiadomość w komunikatorze: „Słyszałem, że urząd pracy w Woli jest zamykany”. Nie ma daty, linku ani wyjaśnienia, że chodzi o krótką przerwę.', rationale:'To wiadomość przekazana z pamięci, bez źródła i najważniejszych ograniczeń. Zachowuje nazwę jednego urzędu, dlatego poprzedza dopiero końcowe uogólnienie.'},
        {position:1, text:'Oficjalny komunikat PUP Wola: „14 sierpnia od 12:00 do 14:00 budynek będzie zamknięty z powodu prac technicznych. Usługi online działają bez zmian”. Podano datę, godziny i link do źródła.', rationale:'To początek historii: znamy nadawcę, dokładny czas, powód, zakres zmiany i sposób potwierdzenia komunikatu.'},
        {position:5, text:'Post w mediach społecznościowych: „Zamykają urzędy pracy. Media milczą”. Informacja o jednym urzędzie została przedstawiona tak, jakby dotyczyła wszystkich urzędów.', rationale:'To najbardziej zniekształcona wersja. Jednorazowa przerwa jednego urzędu została zamieniona w ogólną tezę o zamykaniu urzędów.'},
        {position:2, text:'Informacja lokalnego portalu: „PUP Wola będzie zamknięty 14 sierpnia przez dwie godziny z powodu prac technicznych”. Pod tekstem nadal znajduje się link do komunikatu urzędu.', rationale:'Tekst jest krótszy, ale zachowuje zakres, datę, czas, powód i odsyłacz do źródła. To pierwsze rzetelne skrócenie.'},
        {position:3, text:'Zrzut samego nagłówka: „PUP Wola zamknięty 14 sierpnia”. Nie widać linku, godzin, powodu ani informacji o usługach online.', rationale:'Zrzut zachowuje nazwę urzędu i datę, lecz usuwa link, godziny, powód i informację o działających usługach online.'}
      ];
      const positionOptions=[
        ['1','1 — początek: pełny komunikat oficjalny'],
        ['2','2 — pierwsze, jeszcze rzetelne skrócenie'],
        ['3','3 — sam nagłówek lub zrzut bez pełnego źródła'],
        ['4','4 — wiadomość przekazana bez źródła i ważnych szczegółów'],
        ['5','5 — końcowe uogólnienie zmieniające znaczenie']
      ];
      const body=`<form><div class="m1v3-reference"><p><strong>Ułóż historię wiadomości.</strong> Przeczytaj pięć wersji i ustaw je od pełnego komunikatu do zniekształconego uogólnienia.</p><p><strong>Wskazówka:</strong> zacznij od wersji, która ma autora, datę, godziny i link. Na końcu ustaw wersję, która mówi o wszystkich urzędach, chociaż źródło dotyczyło tylko jednego.</p></div>${cards.map((c,i)=>`<label class="m1v3-row"><p><strong>Tekst ${String.fromCharCode(65+i)}.</strong> ${c.text}</p><select name="pos${i}" required><option value="">Wybierz miejsce w kolejności</option>${positionOptions.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select><span class="m1v3-item-feedback" data-order-feedback="${i}"></span></label>`).join('')}<div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź kolejność</button></div></form>`;
      host.innerHTML=activityShell('1.3','1.3','Jak wiadomość zmienia się po drodze?','Ułóż pięć wersji tej samej wiadomości — od pełnego komunikatu do zniekształconego uogólnienia.',body);const form=host.querySelector('form');restoreRecord(host);
      let wrongOrder=[];
      const secondChance=setupSecondChance(host,{
        onRetryFocus:()=>host.querySelector('.m1v3-row.is-incorrect select')?.focus(),
        onReveal:()=>wrongOrder.forEach(i=>{
          const correctLabel=positionOptions.find(([value])=>Number(value)===cards[i].position)?.[1]||`krok ${cards[i].position}`;
          const fb=host.querySelector(`[data-order-feedback="${i}"]`);
          fb.className='m1v3-item-feedback is-revealed';
          fb.textContent=`Poprawne miejsce: ${correctLabel}. ${cards[i].rationale}`;
        })
      });
      form.addEventListener('submit',e=>{
        e.preventDefault();
        if(!form.reportValidity())return;
        const pos=cards.map((_,i)=>Number(form[`pos${i}`].value));
        if(new Set(pos).size!==5){setFeedback(host,'Każde miejsce od 1 do 5 może być użyte tylko raz. Sprawdź, czy dwa teksty nie mają tego samego numeru.','warning');return;}
        let score=0;
        wrongOrder=[];
        cards.forEach((card,i)=>{
          const ok=pos[i]===card.position;
          if(ok)score++;else wrongOrder.push(i);
          const fb=host.querySelector(`[data-order-feedback="${i}"]`);
          fb.className=`m1v3-item-feedback ${ok?'is-correct':'is-incorrect'}`;
          const selectedLabel=positionOptions.find(([value])=>Number(value)===pos[i])?.[1]||`krok ${pos[i]}`;
          const row=fb.closest('.m1v3-row');
          row.classList.remove('is-correct','is-incorrect');
          row.classList.add(ok?'is-correct':'is-incorrect');
          fb.textContent=ok
            ?`Wybrałeś: ${selectedLabel}. To trafna odpowiedź. ${card.rationale}`
            :`Wybrałeś: ${selectedLabel}. Niezupełnie. ${card.rationale}`;
        });
        finish(host,form,score,5,'Pełny komunikat dotyczył krótkiego zamknięcia jednego urzędu. Po kilku skrótach i przekazaniach zmienił się w nieprawdziwe uogólnienie o zamykaniu wszystkich urzędów pracy.',score===5?'success':'warning');
        if(score<5)secondChance.show();else secondChance.hide();
      });
    },
    '1.4'(host) {
      const cases=[
        {text:'Na profilu łudząco podobnym do profilu urzędu pojawia się fałszywy termin naboru. Gdzie najpierw sprawdzisz informację?',correct:'institution',options:[['comments','W komentarzach pod postem'],['institution','Na oficjalnej stronie i w potwierdzonym kanale instytucji'],['shares','Na profilach, które udostępniły post']],rationale:'Termin naboru ustala instytucja, dlatego jej oficjalny komunikat jest źródłem pierwotnym. Komentarze i kolejne udostępnienia pokazują reakcje odbiorców, lecz nie potwierdzają terminu.'},
        {text:'Post zaczyna być polecany kolejnym osobom po serii reakcji i udostępnień. Co bezpośrednio zwiększa jego widoczność?',correct:'system',options:[['author','Wyłącznie decyzja autora'],['system','Reakcje użytkowników i system rekomendacyjny'],['factchecker','Działanie fact-checkera']],rationale:'Użytkownicy dostarczają sygnałów przez reakcje i udostępnienia, a system może wykorzystać je do dalszych rekomendacji. Autor uruchomił publikację, ale nie kontroluje sam całego zasięgu.'},
        {text:'Po sprawdzeniu okazuje się, że konto podszywa się pod instytucję. Kto może ograniczyć konto po otrzymaniu zgłoszenia?',correct:'platform',options:[['platform','Platforma, na której działa konto'],['recipient','Dowolny odbiorca wiadomości'],['search','Wyszukiwarka internetowa']],rationale:'Odbiorca może zebrać dowody i wysłać zgłoszenie, natomiast techniczne ograniczenie lub usunięcie konta leży po stronie platformy, na której konto działa.'}
      ];
      const body=`<form>${cases.map((item,i)=>`<fieldset class="m1v3-fieldset" data-case="${i}"><legend>Sytuacja ${i+1}</legend><p>${item.text}</p><div class="m1v3-options">${item.options.map(([value,label])=>option(value,label,`actor${i}`)).join('')}</div><span class="m1v3-item-feedback" data-item-feedback="${i}"></span></fieldset>`).join('')}<div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź decyzje</button></div></form>`;
      host.innerHTML=activityShell('1.4','1.4','Kto odpowiada na danym etapie?','Prześledź jedną historię fałszywego profilu i wskaż właściwe działanie.',body);const form=host.querySelector('form');restoreRecord(host);
      let wrongCases=[];
      const secondChance=setupSecondChance(host,{
        onRetryFocus:()=>host.querySelector('.m1v3-fieldset.is-incorrect input')?.focus(),
        onReveal:()=>wrongCases.forEach(i=>{
          const labels=Object.fromEntries(cases[i].options);
          const feedback=host.querySelector(`[data-item-feedback="${i}"]`);
          feedback.className='m1v3-item-feedback is-revealed';
          feedback.textContent=`Poprawna odpowiedź: ${labels[cases[i].correct]}. ${cases[i].rationale}`;
        })
      });
      form.addEventListener('submit',e=>{e.preventDefault();const names=cases.map((_,i)=>`actor${i}`);if(!requireRadios(form,names)){setFeedback(host,'Odpowiedz na trzy pytania dotyczące historii profilu.','warning');return;}let score=0;wrongCases=[];cases.forEach((item,i)=>{const selected=form.querySelector(`[name="actor${i}"]:checked`)?.value;const ok=selected===item.correct;if(ok)score++;else wrongCases.push(i);const labels=Object.fromEntries(item.options);const fieldset=host.querySelector(`[data-case="${i}"]`);fieldset.classList.remove('is-correct','is-incorrect');fieldset.classList.add(ok?'is-correct':'is-incorrect');const feedback=host.querySelector(`[data-item-feedback="${i}"]`);feedback.className=`m1v3-item-feedback ${ok?'is-correct':'is-incorrect'}`;feedback.textContent=ok?`Wybrałeś: ${labels[selected]}. To trafna odpowiedź. ${item.rationale}`:`Wybrałeś: ${labels[selected]}. Niezupełnie. ${item.rationale}`;});finish(host,form,score,3,'Jedna fałszywa treść uruchamia działania kilku stron: instytucja publikuje informacje pierwotne, użytkownicy wpływają na zasięg, a platforma obsługuje zgłoszenie i może ograniczyć konto.',score===3?'success':'warning');if(score<3)secondChance.show();else secondChance.hide();});
    },
    '1.5'(host) {
      const people=[
        {id:'A',title:'Osoba A — szuka praktycznych informacji',text:'W ostatnim tygodniu otwierała dłuższe poradniki o bezpiecznym korzystaniu z AI, zapisała oficjalny przewodnik o ochronie danych i poświęcała więcej czasu materiałom pokazującym konkretne zastosowania. Alarmujące krótkie filmy zwykle szybko pomijała.'},
        {id:'B',title:'Osoba B — zatrzymuje się przy alarmujących materiałach',text:'W ostatnim tygodniu oglądała do końca krótkie filmy o zagrożeniach związanych z AI, reagowała na materiały o utracie miejsc pracy i otwierała kolejne nagrania o błędach systemów. Rzadko przechodziła do dokumentów podanych w opisach.'}
      ];
      const cards=[
        {text:'Długi poradnik: „Jak sprawdzać odpowiedzi AI w pracy urzędowej?”',correct:'A',wrong:'To spokojny materiał instruktażowy. Porównaj go z tym, jak każda osoba korzystała z poradników i krótkich filmów.',rationale:'Osoba A otwierała dłuższe poradniki i poświęcała czas konkretnym zastosowaniom, dlatego ten materiał lepiej odpowiada sygnałom z jej ostatniej aktywności.'},
        {text:'Krótki film: „Za rok większość stanowisk zniknie!”',correct:'B',wrong:'To krótki, alarmujący materiał o utracie pracy. Zwróć uwagę, która osoba zatrzymywała się przy podobnym tonie i formacie.',rationale:'Osoba B oglądała do końca alarmujące filmy o wpływie AI na zatrudnienie, dlatego system może częściej polecić jej podobny materiał.'},
        {text:'Oficjalny przewodnik o ochronie danych podczas korzystania z AI',correct:'A',wrong:'To oficjalny materiał dotyczący bezpiecznego zastosowania. Porównaj go z zachowaniem obu osób wobec dokumentów i poradników.',rationale:'Osoba A zapisała wcześniej oficjalny przewodnik o ochronie danych, co jest wyraźnym sygnałem zainteresowania podobnym materiałem.'},
        {text:'Seria emocjonalnych nagrań o pojedynczych błędach systemów AI',correct:'B',wrong:'To seria emocjonalnych nagrań skupionych na błędach. Sprawdź, która osoba otwierała kolejne materiały o takim wydźwięku.',rationale:'Osoba B przechodziła do kolejnych nagrań o błędach systemów i częściej reagowała na treści alarmujące, dlatego taki ciąg rekomendacji jest bardziej prawdopodobny.'}
      ];
      const signals=['Czas oglądania','Historia wyszukiwania','Komentarze i reakcje','Zapisywanie i obserwowanie','Pomijanie materiałów'];
      const body=`<form><section class="m1v3-person-briefs" aria-labelledby="m1v3-person-briefs-title"><h4 id="m1v3-person-briefs-title">Informacje potrzebne do wykonania zadania</h4><p>Platforma zna jedynie ślady ostatniej aktywności. Na ich podstawie próbuje przewidzieć, co może zatrzymać uwagę każdej osoby.</p><div class="m1v3-two-feeds">${people.map(person=>`<article><strong>${person.title}</strong><p>${person.text}</p></article>`).join('')}</div><p class="m1v3-person-briefs-note">To nie są pełne profile ludzi. Opisujemy wyłącznie zachowania, które mogą stać się sygnałami dla systemu rekomendacyjnego.</p></section><fieldset class="m1v3-fieldset" data-feed-cards><legend>Przypisz najbardziej prawdopodobny strumień</legend>${cards.map((card,i)=>`<label class="m1v3-row" data-feed-card="${i}"><p>${card.text}</p><select name="card${i}" required><option value="">Wybierz</option><option value="A">Osoba A</option><option value="B">Osoba B</option></select><span class="m1v3-item-feedback" data-card-feedback="${i}" aria-live="polite"></span></label>`).join('')}</fieldset><fieldset class="m1v3-fieldset" data-signal-group><legend>Sygnały personalizacji</legend><p>Zaznacz sygnały, które platforma może wykorzystać do przewidywania kolejnych zainteresowań.</p><div class="m1v3-options is-grid">${signals.map((s,i)=>option(String(i),s,'signals','checkbox')).join('')}</div><span class="m1v3-item-feedback" data-signal-feedback aria-live="polite"></span></fieldset><fieldset class="m1v3-fieldset" data-conclusion-group><legend>Najlepszy wniosek</legend><div class="m1v3-options">${option('full','Strumień osoby A pokazuje pełny i obiektywny obraz.','conclusion')}${option('majority','Strumień osoby B dowodzi opinii większości.','conclusion')}${option('partial','Oba strumienie mogą wynikać z wcześniejszych zachowań i nie pokazują całego obrazu.','conclusion')}${option('false','Algorytm zawsze promuje fałsz.','conclusion')}</div><span class="m1v3-item-feedback" data-conclusion-feedback aria-live="polite"></span></fieldset><div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź symulację</button></div><aside class="m1v3-retry-choice" data-retry-choice aria-live="polite" hidden><strong>Nie wszystkie odpowiedzi są trafne. Co chcesz zrobić?</strong><p>Możesz zachować swoje odpowiedzi i spróbować je poprawić albo odsłonić rozwiązania wraz z pełnym wyjaśnieniem.</p><div class="m1v3-actions"><button class="m1v3-button" data-try-again type="button">Spróbuję jeszcze raz</button><button class="m1v3-button is-secondary" data-show-answers type="button">Pokaż poprawne odpowiedzi</button></div></aside></form>`;
      host.innerHTML=activityShell('1.5','1.5','Dwie osoby, dwa internety','Przewiduj rekomendacje i rozpoznaj sygnały personalizacji.',body);const form=host.querySelector('form');restoreRecord(host);
      const retryChoice=host.querySelector('[data-retry-choice]');
      let lastResult=null;
      form.addEventListener('submit',e=>{
        e.preventDefault();
        if(!form.reportValidity()||!requireRadios(form,['conclusion']))return;
        const selectedSignals=[...form.querySelectorAll('[name="signals"]:checked')].map(x=>x.value);
        if(!selectedSignals.length){setFeedback(host,'Zaznacz co najmniej jeden sygnał personalizacji.','warning');return;}
        let score=0;
        cards.forEach((card,i)=>{
          const selected=form[`card${i}`].value;
          const ok=selected===card.correct;
          if(ok)score++;
          const row=host.querySelector(`[data-feed-card="${i}"]`);
          row.classList.remove('is-correct','is-incorrect');
          row.classList.add(ok?'is-correct':'is-incorrect');
          const feedback=host.querySelector(`[data-card-feedback="${i}"]`);
          feedback.className=`m1v3-item-feedback ${ok?'is-correct':'is-incorrect'}`;
          feedback.textContent=ok
            ?`Wybrałeś: osoba ${selected}. To trafna odpowiedź. ${card.rationale}`
            :`Wybrałeś: osoba ${selected}. Niezupełnie. ${card.wrong}`;
        });
        const signalOk=selectedSignals.length===signals.length;
        score+=selectedSignals.length;
        const signalGroup=host.querySelector('[data-signal-group]');
        signalGroup.classList.remove('is-correct','is-incorrect');
        signalGroup.classList.add(signalOk?'is-correct':'is-incorrect');
        const missingSignals=signals.filter((_,i)=>!selectedSignals.includes(String(i)));
        const signalFeedback=host.querySelector('[data-signal-feedback]');
        signalFeedback.className=`m1v3-item-feedback ${signalOk?'is-correct':'is-incorrect'}`;
        signalFeedback.textContent=signalOk
          ?'Zaznaczyłeś wszystkie pięć sygnałów. Czas oglądania, wyszukiwanie, reakcje, zapisywanie i pomijanie mogą współtworzyć profil rekomendacji.'
          :`Zaznaczyłeś ${selectedSignals.length} z 5 sygnałów. To niepełna odpowiedź. Pamiętaj, że sygnałem dla systemu może być zarówno działanie, jak i szybkie pominięcie materiału.`;
        const selectedConclusion=form.querySelector('[name="conclusion"]:checked').value;
        const conclusionOk=selectedConclusion==='partial';
        if(conclusionOk)score++;
        const conclusionLabels={full:'Strumień osoby A pokazuje pełny i obiektywny obraz.',majority:'Strumień osoby B dowodzi opinii większości.',partial:'Oba strumienie mogą wynikać z wcześniejszych zachowań i nie pokazują całego obrazu.',false:'Algorytm zawsze promuje fałsz.'};
        const conclusionGroup=host.querySelector('[data-conclusion-group]');
        conclusionGroup.classList.remove('is-correct','is-incorrect');
        conclusionGroup.classList.add(conclusionOk?'is-correct':'is-incorrect');
        const conclusionFeedback=host.querySelector('[data-conclusion-feedback]');
        conclusionFeedback.className=`m1v3-item-feedback ${conclusionOk?'is-correct':'is-incorrect'}`;
        conclusionFeedback.textContent=conclusionOk
          ?`Wybrałeś: ${conclusionLabels[selectedConclusion]} To trafny wniosek. Rekomendacje opisują przewidywanie systemu, a nie pełny obraz informacji.`
          :`Wybrałeś: ${conclusionLabels[selectedConclusion]} Niezupełnie. Ten wniosek traktuje spersonalizowany strumień jak dowód dotyczący całego internetu, opinii większości albo stałego działania algorytmu.`;
        lastResult={selectedSignals,missingSignals,signalOk,conclusionOk,selectedConclusion,wrongCards:cards.map((card,i)=>form[`card${i}`].value===card.correct?null:i).filter(i=>i!==null)};
        retryChoice.hidden=score===10;
        finish(host,form,score,10,'Częste występowanie danego typu treści w strumieniu nie dowodzi opinii większości ani jakości dowodów.',score===10?'success':'warning');
      });
      host.querySelector('[data-try-again]').addEventListener('click',()=>{
        retryChoice.hidden=true;
        const firstWrong=host.querySelector('.m1v3-row.is-incorrect select, .m1v3-fieldset.is-incorrect input, .m1v3-fieldset.is-incorrect select');
        firstWrong?.focus();
        setFeedback(host,'<strong>Spróbuj ponownie</strong>Zachowaliśmy Twoje odpowiedzi. Zmień te, które po ponownym przeczytaniu opisów osoby A i B wydają Ci się mniej prawdopodobne, a następnie jeszcze raz sprawdź symulację.','warning');
      });
      host.querySelector('[data-show-answers]').addEventListener('click',()=>{
        if(!lastResult)return;
        lastResult.wrongCards.forEach(i=>{
          const feedback=host.querySelector(`[data-card-feedback="${i}"]`);
          feedback.textContent=`Poprawna odpowiedź: osoba ${cards[i].correct}. ${cards[i].rationale}`;
          feedback.className='m1v3-item-feedback is-revealed';
        });
        if(!lastResult.signalOk){
          const signalFeedback=host.querySelector('[data-signal-feedback]');
          signalFeedback.textContent=`Pełna odpowiedź obejmuje: ${signals.join(', ')}. Czasem nawet pominięcie materiału albo brak dalszej reakcji pomaga systemowi przewidywać kolejne rekomendacje.`;
          signalFeedback.className='m1v3-item-feedback is-revealed';
        }
        if(!lastResult.conclusionOk){
          const conclusionFeedback=host.querySelector('[data-conclusion-feedback]');
          conclusionFeedback.textContent=`Poprawny wniosek: ${conclusionLabels.partial} Rekomendacje są przewidywaniem opartym na sygnałach, a nie pomiarem opinii większości ani pełnym obrazem internetu.`;
          conclusionFeedback.className='m1v3-item-feedback is-revealed';
        }
        retryChoice.hidden=true;
        setFeedback(host,'<strong>Poprawne odpowiedzi zostały odsłonięte</strong>Porównaj je ze swoimi wyborami. Odsłonięcie rozwiązania nie zmienia zaznaczonych odpowiedzi — możesz je poprawić i wykonać zadanie ponownie.','warning');
      });
      form.addEventListener('change',()=>{retryChoice.hidden=true;});
    },
    '1.6'(host) {
      const cases=[
        {text:'Po obejrzeniu kilku filmów krytykujących wykorzystanie AI użytkownik widzi niemal wyłącznie podobne materiały od różnych autorów. Nie wiemy, czy należy do zamkniętej grupy.',correct:'bubble',rationale:'Opis wskazuje na automatyczną selekcję treści na podstawie wcześniejszej aktywności. Nie ma informacji o grupie, która społecznie wyklucza odmienne głosy.'},
        {text:'W zamkniętej grupie członkowie stale przesyłają sobie te same tezy, a osoby podające inne dane są wyśmiewane lub usuwane. Nie wiadomo, jak platforma dobiera rekomendacje.',correct:'echo',rationale:'Mechanizm powstaje wewnątrz grupy: podobne przekonania są powtarzane, a odmienne głosy tracą możliwość udziału.'},
        {text:'Algorytm poleca użytkownikowi grupę zgodną z jego wcześniejszymi reakcjami. W grupie te same twierdzenia są wielokrotnie potwierdzane, a krytyczne komentarze znikają.',correct:'both',rationale:'Występują jednocześnie dwa poziomy: automatyczna rekomendacja grupy oraz społeczne wzmacnianie przekonań wewnątrz niej.'},
        {text:'Osoba przeczytała jeden artykuł przesłany przez znajomego. Nie wiemy, co wcześniej oglądała, jakie treści poleca jej platforma ani jak reaguje jej grupa.',correct:'unknown',rationale:'Jeden kontakt z artykułem nie pozwala stwierdzić ani trwałej selekcji algorytmicznej, ani społecznego wzmacniania przekonań.'}
      ];
      const cats=[['bubble','bańka filtrująca'],['echo','komora pogłosowa'],['both','oba mechanizmy'],['unknown','brak wystarczających danych']];
      const labels=Object.fromEntries(cats);
      const selectedMeaning={bubble:'Bańka filtrująca wymaga śladów automatycznego doboru i zawężania strumienia treści.',echo:'Komora pogłosowa wymaga społecznego powtarzania przekonań oraz ograniczania odmiennych głosów.',both:'Oba mechanizmy można wskazać dopiero wtedy, gdy w opisie występuje selekcja technologiczna i społeczne wzmacnianie.',unknown:'Brak danych jest właściwy wtedy, gdy opis nie pozwala potwierdzić ani działania rekomendacji, ani presji grupy.'};
      const body=`<form>${cases.map((item,i)=>`<fieldset class="m1v3-fieldset" data-case="${i}"><legend>Sytuacja ${i+1}</legend><p>${item.text}</p><div class="m1v3-options is-grid">${cats.map(x=>option(x[0],x[1],`q${i}`)).join('')}</div><span class="m1v3-item-feedback" data-item-feedback="${i}" aria-live="polite"></span></fieldset>`).join('')}<div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź rozróżnienie</button></div></form>`;
      host.innerHTML=activityShell('1.6','1.6','Bańka czy komora?','Rozpoznaj, czy opis dotyczy doboru technologicznego, wpływu grupy, obu mechanizmów czy sytuacji bez wystarczających danych.',body);const form=host.querySelector('form');restoreRecord(host);
      let wrongCases=[];
      const secondChance=setupSecondChance(host,{
        onRetryFocus:()=>host.querySelector('.m1v3-fieldset.is-incorrect input')?.focus(),
        onReveal:()=>wrongCases.forEach(i=>{
          const feedback=host.querySelector(`[data-item-feedback="${i}"]`);
          feedback.className='m1v3-item-feedback is-revealed';
          feedback.textContent=`Poprawna odpowiedź: ${labels[cases[i].correct]}. ${cases[i].rationale}`;
        })
      });
      form.addEventListener('submit',e=>{
        e.preventDefault();
        const names=cases.map((_,i)=>`q${i}`);
        if(!requireRadios(form,names)){setFeedback(host,'Odpowiedz na wszystkie cztery sytuacje.','warning');return;}
        let score=0;
        wrongCases=[];
        cases.forEach((item,i)=>{
          const selected=form.querySelector(`[name="q${i}"]:checked`).value;
          const ok=selected===item.correct;
          if(ok)score++;else wrongCases.push(i);
          const fieldset=host.querySelector(`[data-case="${i}"]`);
          fieldset.classList.remove('is-correct','is-incorrect');
          fieldset.classList.add(ok?'is-correct':'is-incorrect');
          const feedback=host.querySelector(`[data-item-feedback="${i}"]`);
          feedback.className=`m1v3-item-feedback ${ok?'is-correct':'is-incorrect'}`;
          feedback.textContent=ok
            ?`Wybrałeś: ${labels[selected]}. To trafna odpowiedź. ${item.rationale}`
            :`Wybrałeś: ${labels[selected]}. Niezupełnie. ${selectedMeaning[selected]}`;
        });
        finish(host,form,score,4,'Każdą sytuację oceniaj na podstawie dwóch osobnych pytań: czy treści zawęża system rekomendacyjny oraz czy podobne przekonania wzmacnia grupa.',score===4?'success':'warning');
        if(score<4)secondChance.show();else secondChance.hide();
      });
    },
    '1.7'(host) {
      const cases=[
        {text:'AI przygotowała projekt komunikatu o terminie naboru.',correct:'verify',options:[['publish','Opublikować bez zmian, skoro tekst brzmi profesjonalnie'],['verify','Sprawdzić daty, warunki i podstawę informacji przed publikacją'],['style','Poprawić wyłącznie styl i długość']],rationale:'Profesjonalny język nie potwierdza dat ani warunków. Osoba publikująca odpowiada za zgodność komunikatu z dokumentem źródłowym.'},
        {text:'AI streściła 60-stronicowy raport do pięciu punktów.',correct:'original',options:[['original','Porównać najważniejsze liczby i zastrzeżenia z raportem'],['repeat','Poprosić AI o ponowne streszczenie'],['trust','Uznać skrót za wystarczający, jeśli jest spójny']],rationale:'Streszczenie może pominąć warunki, ograniczenia albo wyjątki. Najważniejsze liczby i zastrzeżenia trzeba porównać z raportem, a nie tylko z kolejną odpowiedzią AI.'},
        {text:'Po obejrzeniu jednego alarmującego filmu platforma pokazuje serię podobnych materiałów.',correct:'outside',options:[['majority','Uznać, że większość osób podziela ten pogląd'],['more','Obejrzeć kolejne materiały z tej samej serii'],['outside','Wyjść poza rekomendacje i samodzielnie porównać źródła']],rationale:'Seria podobnych poleceń pokazuje działanie rekomendacji, nie opinię większości. Samodzielne wyszukanie innych źródeł pozwala wyjść poza zawężony strumień.'}
      ];
      const body=`<form>${cases.map((item,i)=>`<fieldset class="m1v3-fieldset" data-case="${i}"><legend>Przypadek ${i+1}</legend><p>${item.text}</p><div class="m1v3-options">${item.options.map(([value,label])=>option(value,label,`ai${i}`)).join('')}</div><span class="m1v3-item-feedback" data-item-feedback="${i}"></span></fieldset>`).join('')}<div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź decyzje</button></div></form>`;
      host.innerHTML=activityShell('1.7','1.7','Gdzie potrzebna jest kontrola człowieka?','W trzech konkretnych sytuacjach wybierz działanie, które ogranicza ryzyko błędu.',body);const form=host.querySelector('form');restoreRecord(host);
      let wrongCases=[];
      const secondChance=setupSecondChance(host,{
        onRetryFocus:()=>host.querySelector('.m1v3-fieldset.is-incorrect input')?.focus(),
        onReveal:()=>wrongCases.forEach(i=>{
          const labels=Object.fromEntries(cases[i].options);
          const feedback=host.querySelector(`[data-item-feedback="${i}"]`);
          feedback.className='m1v3-item-feedback is-revealed';
          feedback.textContent=`Poprawna odpowiedź: ${labels[cases[i].correct]}. ${cases[i].rationale}`;
        })
      });
      form.addEventListener('submit',e=>{
        e.preventDefault();
        const names=cases.map((_,i)=>`ai${i}`);
        if(!requireRadios(form,names)){setFeedback(host,'Wybierz działanie w każdym z trzech przypadków.','warning');return;}
        let score=0;
        wrongCases=[];
        cases.forEach((item,i)=>{
          const selected=form.querySelector(`[name="ai${i}"]:checked`)?.value;
          const ok=selected===item.correct;
          if(ok)score++;else wrongCases.push(i);
          const labels=Object.fromEntries(item.options);
          const fieldset=host.querySelector(`[data-case="${i}"]`);
          fieldset.classList.remove('is-correct','is-incorrect');
          fieldset.classList.add(ok?'is-correct':'is-incorrect');
          const feedback=host.querySelector(`[data-item-feedback="${i}"]`);
          feedback.className=`m1v3-item-feedback ${ok?'is-correct':'is-incorrect'}`;
          feedback.textContent=ok
            ?`Wybrałeś: ${labels[selected]}. To trafna odpowiedź. ${item.rationale}`
            :`Wybrałeś: ${labels[selected]}. Niezupełnie. To działanie nie prowadzi do niezależnego sprawdzenia źródła, danych ani sposobu doboru rekomendacji.`;
        });
        finish(host,form,score,3,'Kontrola człowieka zależy od roli AI: tekst trzeba sprawdzić przed publikacją, streszczenie porównać z oryginałem, a rekomendacje uzupełnić samodzielnym wyszukiwaniem.',score===3?'success':'warning');
        if(score<3)secondChance.show();else secondChance.hide();
      });
    },
    '1.8'(host) {
      const stages=[['search','Wyszukiwanie','Sformułuję drugie zapytanie i otworzę materiał pierwotny.'],['selection','Wybór','Porównam źródło spoza mojego zwykłego strumienia.'],['summary','Streszczenie','Sprawdzę w oryginale ważne twierdzenie i zastrzeżenie.'],['interpretation','Interpretacja','Oddzielę odpowiedź narzędzia od dowodów.'],['creation','Tworzenie','Przeczytam, poprawię i zweryfikuję materiał przed publikacją.'],['sharing','Udostępnienie','Zachowam ręczne zatwierdzenie przed wysłaniem.']];
      const body=`<form><label class="m1v3-control">Etap, na którym najczęściej korzystam z pomocy narzędzia<select name="stage" required><option value="">Wybierz etap</option>${stages.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select></label><label class="m1v3-control">Proponowany krok — pojawi się po wyborze etapu<select name="step" required><option value="">Najpierw wybierz etap</option></select></label><label class="m1v3-control">Własna notatka – opcjonalnie<textarea name="note" maxlength="300"></textarea></label><div class="m1v3-actions"><button class="m1v3-button" type="submit">Zapisz refleksję</button><button class="m1v3-button is-secondary" type="button" data-skip>Pomiń</button></div></form>`;
      host.innerHTML=activityShell('1.8','1.8','Na którym etapie polegam na narzędziu?','Refleksja MAIL/AILit bez punktacji.',body);const form=host.querySelector('form');
      const update=()=>{const found=stages.find(x=>x[0]===form.stage.value);form.step.innerHTML=found?`<option value="${esc(found[2])}">${found[2]}</option>`:'<option value="">Najpierw wybierz etap</option>';};
      form.stage.addEventListener('change',update); restoreRecord(host); update(); const rec=state.activities['1.8']; if(rec?.values?.step)form.step.value=rec.values.step;
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;finish(host,form,null,null,'Oddanie części zadania narzędziu nie jest samo w sobie błędem. Zachowaj kontrolę nad decyzjami wymagającymi źródła i odpowiedzialności.');});
      host.querySelector('[data-skip]').addEventListener('click',()=>finish(host,form,null,null,'Refleksja została świadomie pominięta.'));
    },
    '1.9'(host) {
      const channels=['Samodzielne wyszukiwanie lub bezpośrednie wejście','Wiadomość od innej osoby','Treść polecona przez platformę','Treść utworzona lub przetworzona przez AI','Telewizja, radio lub prasa','Podcast lub newsletter'];
      const sources=['Oficjalne strony i dokumenty','Profesjonalne redakcje','Źródła naukowe, eksperckie lub branżowe','Media społecznościowe i twórcy','Komunikatory i zamknięte grupy','Wyszukiwarki','Narzędzia AI','Podcasty i newslettery'];
      const habits=['Czytam cały materiał zamiast poprzestawać na nagłówku.','Sprawdzam autora i datę.','Porównuję wiadomość z niezależnym źródłem.','Otwieram dokument lub komunikat pierwotny.','Szukam perspektywy innej niż dominująca w moim strumieniu.','Sprawdzam, czy AI mogła stworzyć lub przetworzyć treść.'];
      const blind=['Treść przesłana przez zaufaną osobę','Treść zgodna z moimi przekonaniami','Treść wywołująca strach lub oburzenie','Profesjonalny wygląd materiału','Wysoka liczba reakcji','Pewna i konkretna odpowiedź AI','Nie potrafię jeszcze wskazać'];
      const freqOpts='<option value="">Wybierz</option><option value="0">ani razu</option><option value="1">sporadycznie</option><option value="2">kilka razy</option><option value="3">często</option>';
      const scaleOpts='<option value="">Wybierz</option>'+[1,2,3,4,5].map(n=>`<option value="${n}">${n}</option>`).join('');
      const body=`<form><fieldset class="m1v3-fieldset"><legend>A. Kanały z ostatnich 24 godzin</legend><div class="m1v3-options is-grid">${channels.map((x,i)=>option(String(i),x,'channels','checkbox')).join('')}</div></fieldset><fieldset class="m1v3-fieldset"><legend>B. Kto najczęściej decydował o widoczności?</legend>${[['self','Ja – aktywny wybór'],['person','Inna osoba'],['platform','Platforma'],['ai','AI']].map(x=>`<label class="m1v3-row"><p>${x[1]}</p><select name="freq_${x[0]}" required>${freqOpts}</select></label>`).join('')}</fieldset><fieldset class="m1v3-fieldset"><legend>C. Mój ekosystem źródeł</legend><div class="m1v3-options is-grid">${sources.map((x,i)=>option(String(i),x,'sources','checkbox')).join('')}</div></fieldset><fieldset class="m1v3-fieldset"><legend>D. Nawyki weryfikacyjne (1 – prawie nigdy, 5 – prawie zawsze)</legend>${habits.map((x,i)=>`<label class="m1v3-row"><p>${x}</p><select name="habit${i}" required>${scaleOpts}</select></label>`).join('')}</fieldset><fieldset class="m1v3-fieldset"><legend>E. Możliwa ślepa plamka</legend><div class="m1v3-options">${blind.map((x,i)=>option(String(i),x,'blind')).join('')}</div></fieldset><div class="m1v3-actions"><button class="m1v3-button" type="submit">Pokaż mój punkt wyjścia</button><button class="m1v3-button is-secondary" type="button" data-skip>Pomiń diagnozę</button></div></form>`;
      host.innerHTML=activityShell('1.9','1.9','Mój punkt wyjścia','Neutralna diagnoza kanałów, źródeł i nawyków.',body);const form=host.querySelector('form');restoreRecord(host);
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity()||!requireRadios(form,['blind'])){setFeedback(host,'Uzupełnij pola albo wybierz „Pomiń diagnozę”.','warning');return;}const ch=[...form.querySelectorAll('[name="channels"]:checked')];const src=[...form.querySelectorAll('[name="sources"]:checked')];if(!ch.length||!src.length){setFeedback(host,'Zaznacz co najmniej jeden kanał i jedną grupę źródeł.','warning');return;}const active=Number(form.freq_self.value);const passive=Number(form.freq_person.value)+Number(form.freq_platform.value)+Number(form.freq_ai.value);const avg=habits.reduce((sum,_,i)=>sum+Number(form[`habit${i}`].value),0)/habits.length;const blindText=blind[Number(form.querySelector('[name="blind"]:checked').value)];let route=active>passive/3?'Często samodzielnie wybierasz temat lub źródło.':'Wiele informacji dociera przez osoby, platformy lub AI; warto zauważać drogę dotarcia.';let diversity=src.length<=2?'Twój zestaw typów źródeł jest dość wąski.':src.length<=4?'Korzystasz z kilku grup źródeł.':'Korzystasz z wielu grup źródeł; sprawdzaj ich niezależność.';let habitsText=avg>=4?'Większość nawyków weryfikacyjnych deklarujesz jako częste.':avg>=2.7?'Nawyki stosujesz nieregularnie – wybierz jeden krok do utrwalenia.':'Największą przestrzeń do praktyki stanowi regularne docieranie do źródła i porównanie.';const summary=`${route} ${diversity} ${habitsText} Punkt obserwacji: ${blindText}.`;finish(host,form,null,null,summary,'success',{diagnosis:{channels:ch.map(x=>x.value),sources:src.map(x=>x.value),average:avg,blind:blindText}});});
      host.querySelector('[data-skip]').addEventListener('click',()=>finish(host,form,null,null,'Diagnoza została świadomie pominięta. Możesz wrócić do niej później.'));
    },
    '1.10'(host) {
      const body=`<form><label class="m1v3-control">Dokończ zdanie: „Największą zmianą w moim rozumieniu obiegu informacji jest…”<textarea name="reflection" minlength="20" maxlength="500" required></textarea></label><details class="m1v3-reference"><summary>Potrzebuję inspiracji</summary><ul><li>Zauważyłem, że treść nie trafia do mnie neutralnym kanałem, ponieważ…</li><li>Najbardziej zaskoczyła mnie rola…</li><li>Od tej pory częściej zapytam…</li><li>Wcześniej nie brałem pod uwagę, że AI może…</li></ul></details><div class="m1v3-actions"><button class="m1v3-button" type="submit">Zapisz refleksję</button><button class="m1v3-button is-secondary" type="button" data-skip>Pomiń</button></div></form>`;
      host.innerHTML=activityShell('1.10','1.10','Największa zmiana w moim rozumieniu','Refleksja końcowa bez punktacji.',body);const form=host.querySelector('form');restoreRecord(host);
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;finish(host,form,null,null,'Odpowiedź została zapisana lokalnie. W Module 2 sprawdzisz, dlaczego emocje, niepewność i powtarzanie mogą przyspieszać ocenę informacji.');});
      host.querySelector('[data-skip]').addEventListener('click',()=>finish(host,form,null,null,'Refleksja została świadomie pominięta.'));
    }
  };

  hosts.forEach(host => {
    const renderer = renderers[host.dataset.m1v3Activity];
    if (renderer) renderer(host);
    else host.innerHTML = '<p>Nie udało się załadować aktywności.</p>';
  });
})();
