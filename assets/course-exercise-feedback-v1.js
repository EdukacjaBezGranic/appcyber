(() => {
  'use strict';

  const profiles = {
    'm2-6-wyzwalacze-emocjonalne-w-przekazach-manipulacyjnych': [
      ['m2-e1-missing', 'all', 'W poście brakuje źródła nagrania, daty, miejsca, dowodów na oskarżenie i pełnego kontekstu. Wybór jednego braku nie oddaje skali problemu.'],
      ['m2-e1-action', 'pause', 'Silna emocja jest sygnałem do zatrzymania reakcji. Dopiero po sprawdzeniu materiału można zdecydować, czy i jak odpowiadać.']
    ],
    'm2-extension-inne-heurystyki': [
      ['m2-e2-correction', 'study', 'Post powołuje się na badanie, więc pierwszym krokiem jest odnalezienie publikacji i sprawdzenie metody, a nie popularności posta ani kolejnych wypowiedzi tej samej osoby.'],
      ['m2-e2-check', 'all', 'Wynik 40% może znaczyć coś innego w zależności od próby, rodzaju zadań, sposobu pomiaru oraz interesu autorów lub finansujących badanie.']
    ],
    'm3-6-fakty-opinie-interpretacje-i-zalozenia': [
      ['m3-e31-1', 'fact', 'To sprawdzalne twierdzenie o liczbie i zmianie procentowej. Zanim uznamy je za prawdziwe, trzeba odnaleźć raport i sposób liczenia.'],
      ['m3-e31-2', 'interpretation', 'Wzrost liczby wniosków online nie dowodzi jeszcze preferencji wszystkich mieszkańców. To możliwe wyjaśnienie danych, czyli interpretacja.'],
      ['m3-e31-3', 'opinion', 'Ocena, że usługa jest niepotrzebna, zależy od przyjętych kryteriów i sytuacji różnych użytkowników. Nie wynika wprost z jednej liczby.'],
      ['m3-e31-4', 'prediction', 'Zdanie dotyczy przyszłości. Bez decyzji, harmonogramu lub dokumentu pozostaje przewidywaniem.']
    ],
    'm2-12-stronniczosc-w-wiadomosciach-i-tresciach-cyfrowych': [
      ['m2-e4-frame-a', 'current', 'Słowa „gwałtowny wzrost” kierują uwagę na ostatnią zmianę, bez pokazania dłuższego trendu.'],
      ['m2-e4-frame-b', 'longterm', 'Drugi nagłówek umieszcza ostatni wzrost w perspektywie pięciu lat i podkreśla trend wieloletni.'],
      ['m2-e4-emotion', 'a', 'Nagłówek A silniej alarmuje przez słowo „gwałtowny” i brak szerszego punktu odniesienia.'],
      ['m2-e4-data', 'all', 'Do uczciwej oceny potrzebne są liczby bezwzględne, kilka okresów, metoda liczenia i dane dla odpowiednich grup. Każdy z tych elementów odpowiada na inne pytanie.']
    ],
    'm3-10-narracje-i-ramy-interpretacyjne': [
      ['m3-e34-first', 'benefit', 'Pierwszy nagłówek pokazuje rejestrację jako usprawnienie: krótsze kolejki i uporządkowaną obsługę.'],
      ['m3-e34-second', 'exclusion', 'Drugi nagłówek kieruje uwagę na barierę dla osób wykluczonych cyfrowo.'],
      ['m3-e34-context', 'all', 'Bez informacji o alternatywach, czasie obsługi i wsparciu pracowników nie da się ocenić ani obietnicy usprawnienia, ani ryzyka wykluczenia.']
    ],
    'm4-5-narracje-medialne-i-ramy-interpretacyjne': [
      ['m4-e41-a', 'service', 'Nagłówek A przedstawia centrum przez pryzmat usług i pomocy rodzinom w załatwianiu formalności.'],
      ['m4-e41-b', 'cost', 'Wyrażenie „kolejne wydatki” ustawia temat jako koszt i obciążenie jeszcze przed poznaniem danych.'],
      ['m4-e41-emotion', 'b', 'Nagłówek B silniej uruchamia emocję przez wartościujące słowo „kolejne” i przeciwstawienie wydatków określonej grupie.'],
      ['m4-e41-data', 'all', 'Koszt, źródło finansowania, liczba użytkowników, ich potrzeby i efekty działania opisują różne strony tej samej decyzji.']
    ],
    'm4-7-migracja-uchodzcy-i-sposob-przedstawiania-ludzi': [
      ['m4-e42-fact', 'one', 'Można sprawdzić konkretne zdarzenie dotyczące konkretnej osoby. Pozostałe odpowiedzi są szerokimi wnioskami wymagającymi danych.'],
      ['m4-e42-general', 'oneToGroup', 'Post przenosi zachowanie jednej osoby na całą grupę osób objętych ochroną międzynarodową.'],
      ['m4-e42-assumption', 'several', 'W zdaniu ukryto kilka założeń: pojedyncze zdarzenie ma reprezentować grupę, a samo współwystępowanie ma dowodzić przyczyny.'],
      ['m4-e42-data', 'all', 'Potrzebne są porównywalne wskaźniki, dłuższy okres, liczebność grup i analiza innych przyczyn. Dopiero taki zestaw pozwala budować ostrożny wniosek.']
    ],
    'm4-8-wojna-konflikt-i-wiarygodnosc-informacji': [
      ['m4-e43-known', 'video', 'Na tym etapie wiemy tylko, że istnieje nagranie przedstawiające niejasne zdarzenie. Atak, miejsce, data i autor nie zostały potwierdzone.'],
      ['m4-e43-verify', 'all', 'Metadane, analiza kadrów, wyszukiwanie wsteczne i wiarygodne źródła wzajemnie się uzupełniają. Żadna pojedyncza metoda nie daje tu pełnej pewności.'],
      ['m4-e43-harm', 'yes', 'Widoczne twarze, tablice i otoczenie mogą ujawnić tożsamość lub lokalizację ludzi, dlatego ryzyko szkody jest realne.'],
      ['m4-e43-alternative', 'safer', 'Jeśli materiał może ujawniać tożsamość lub lokalizację osób, samo pytanie „czy to prawda?” nie wystarcza. Trzeba również poszukać zweryfikowanego źródła, które nie zwiększa niepotrzebnie ryzyka szkody.'],
      ['m4-e43-decision', 'verify', 'Przed potwierdzeniem miejsca, czasu i zdarzenia nie należy zwiększać zasięgu nagrania. Najpierw potrzebna jest weryfikacja i ocena ryzyka dla widocznych osób.']
    ],
    'm3-9-dane-i-statystyki': [
      ['m3-e33-alt', 'several', 'Wzrost liczby skarg może wynikać z pogorszenia usługi, łatwiejszego zgłaszania, większej liczby użytkowników albo zmiany sposobu liczenia. Sam procent nie rozstrzyga przyczyny.'],
      ['m3-e33-conclusion', 'unknown', 'Bez wartości początkowej, liczby użytkowników, okresu i metody nie można ocenić, czy system działa lepiej lub gorzej. Nie ma też podstaw, aby uznać dane za fałszywe.']
    ],
    'm2-16-praktyczny-przyklad-do-analizy': [
      ['m2-p16-source', 'no', 'Post nie podaje autora fotografii, dokładnego miejsca ani daty wykonania zdjęcia.'],
      ['m2-p16-evidence', 'caption-only', 'Opis opiera się wyłącznie na podpisie osoby publikującej post. Nie pokazano metadanych, źródła pierwotnego ani niezależnej relacji.'],
      ['m2-p16-emotion', 'false-context', 'Najważniejszy problem to przypisanie fotografii do niepotwierdzonego miejsca i czasu. Dopiero weryfikacja może pokazać, czy zdjęcie jest także stare lub pochodzi z innego wydarzenia.'],
      ['m2-p16-manipulation', 'no', 'Fotografia może pokazywać prawdziwą powódź, ale sama nie potwierdza miejsca, daty ani związku z opisywaną ulewą.'],
      ['m2-p16-action', 'verify', 'Wyszukiwanie obrazem i dotarcie do najwcześniejszej publikacji pozwalają sprawdzić pochodzenie zdjęcia przed reakcją.']
    ],
    'm3-16-studium-przypadku-falszywa-porada-zdrowotna': [
      ['m3-h16-author', 'unknown', 'W poście nie podano informacji pozwalających potwierdzić kwalifikacje autora. Nie należy automatycznie zakładać ani ich posiadania, ani braku.'],
      ['m3-h16-evidence', 'anecdote', 'Autor opisuje własne doświadczenie. Taka historia może być szczera, ale nie pokazuje skuteczności ani bezpieczeństwa metody u innych osób.'],
      ['m3-h16-risk', 'no', 'Post nie podaje dawkowania, przeciwwskazań, możliwych interakcji ani ryzyka rezygnacji z leczenia.'],
      ['m3-h16-language', 'several', 'Post jednocześnie używa anegdoty, sugeruje, że „naturalne” znaczy bezpieczne, i uogólnia wynik jednej osoby na wszystkich.'],
      ['m3-h16-action', 'verify', 'Poradę zdrowotną trzeba porównać z uznanymi zaleceniami i w razie potrzeby skonsultować ze specjalistą. Sama odpowiedź AI nie jest potwierdzeniem medycznym.']
    ],
    'm4-16-praktyczny-przyklad-do-analizy': [
      ['m4-p16-data', 'no', 'Post podaje procent i ogólny okres, ale nie wskazuje źródła ani wartości bezwzględnych. Nie spełnia więc całego zestawu warunków.'],
      ['m4-p16-group', 'generalises', 'Dane o zatrzymaniach zostają przeniesione na ocenę całej grupy cudzoziemców. Post nie rozróżnia osób, zdarzeń ani możliwych przyczyn.'],
      ['m4-p16-emotion', 'several', 'Jednocześnie pojawia się procent bez wartości bazowej, uogólnienie na grupę i sugestia związku przyczynowego.'],
      ['m4-p16-missing', 'all', 'Do oceny potrzebne są liczby bezwzględne, definicje, wielkość populacji, porównywalne okresy i analiza innych przyczyn.'],
      ['m4-p16-action', 'verify', 'Odpowiedzialna reakcja polega na sprawdzeniu pełnych statystyk i metody, a nie na dopisywaniu kolejnych przypuszczeń o grupie.']
    ],
    'm3-21-praktyczny-przyklad-do-analizy': [
      ['m3-p21-study', 'producer', 'Post wprost informuje, że ankietę przeprowadził producent ocenianego narzędzia. To nie unieważnia danych, ale wymaga sprawdzenia konfliktu interesów.'],
      ['m3-p21-experts', 'none', 'Nie podano liczebności, doboru próby, treści pytań ani warunków korzystania z narzędzia.'],
      ['m3-p21-language', 'self-report', 'Respondenci zadeklarowali, że pracują szybciej. To samoocena, a nie pomiar rzeczywistych wyników pracy.'],
      ['m3-p21-conclusion', 'both', 'Wniosek rozszerza wynik jednej ankiety na każdego pracownika i jednocześnie pomija interes producenta w korzystnej interpretacji wyniku.'],
      ['m3-p21-action', 'verify', 'Przed wdrożeniem trzeba sprawdzić pełną metodę, warunki badania, wyniki dla różnych zadań i niezależne źródła.']
    ],
    'm5-8-od-reakcji-do-odpowiedzi': [
      ['m5-e53-emotion', 'several', 'Pozorną wiarygodność budują razem: powołanie na osobę „z urzędu”, konkretny termin i apel o ostrzeżenie innych. Żaden z tych elementów nie jest oficjalnym źródłem.'],
      ['m5-e53-check', 'official', 'Twierdzenie dotyczy sposobu działania urzędu, więc pierwszym miejscem sprawdzenia są jego oficjalna strona i potwierdzone kanały.'],
      ['m5-e53-response', 'good', 'Ta odpowiedź nie oskarża rozmówcy, prosi o źródło i proponuje wspólne sprawdzenie informacji przed dalszym przekazaniem.']
    ],
    'm5-11-dialog-spor-i-obywatelstwo-cyfrowe': [
      ['m5-e54-best', 'a', 'Odpowiedź oddziela osobę od twierdzenia i przenosi rozmowę na elementy możliwe do sprawdzenia: źródło, okres i sposób liczenia.']
    ],
    'm5-18-przyklad-do-dyskusji': [
      ['m5-p18-emotion', 'several', 'Post przenosi jeden wynik lokalny na cały kraj, przypisuje spadkowi jedną przyczynę i wyprowadza z niego wniosek o bezsensie głosowania.'],
      ['m5-p18-evidence', 'single', 'Przedstawiono jedną wartość dotyczącą jednej gminy. Nie ma danych krajowych, porównania okresów ani informacji o innych gminach.'],
      ['m5-p18-democracy', 'discourage', 'Kategoryczny wniosek o bezsensie głosowania może zniechęcać do udziału na podstawie zbyt słabego dowodu.'],
      ['m5-p18-response', 'verify', 'Trzeba porównać dane lokalne i krajowe oraz sprawdzić możliwe przyczyny. Przyjęcie lub odrzucenie statystyki bez analizy prowadzi do równie pochopnego wniosku.'],
      ['m5-p18-action', 'all', 'Potrzebny jest trend krajowy, lokalne przyczyny i porównanie z podobnymi gminami. Dopiero połączenie tych informacji daje użyteczny kontekst.']
    ]
  };

  const checkboxProfiles = {
    'm2-6-wyzwalacze-emocjonalne-w-przekazach-manipulacyjnych': [{
      keys: ['m2-e1-trigger1', 'm2-e1-trigger2', 'm2-e1-trigger3', 'm2-e1-trigger4'],
      hint: 'Przeczytaj ponownie cały post i zaznacz każdy zwrot, który wzmacnia alarm, troskę o bliskich, presję działania albo wrażenie, że treść zaraz zniknie.',
      explanation: 'Każdy z czterech zwrotów pełni inną funkcję: „szokujący” wzmacnia alarm, „naszym dzieciom” uruchamia troskę o bliskich, „udostępnij natychmiast” tworzy presję działania, a „zostanie usunięte” sugeruje pośpiech i spisek.'
    }],
    'm2-extension-inne-heurystyki': [{
      keys: ['m2-e2-number', 'm2-e2-study', 'm2-e2-expert', 'm2-e2-popularity'],
      hint: 'Poszukaj wszystkich elementów, które mogą wywołać szybkie zaufanie jeszcze przed otwarciem badania i sprawdzeniem jego metody.',
      explanation: 'Wszystkie cztery elementy mogą przyspieszać zaufanie: precyzyjna liczba, słowo „badanie”, autorytet eksperta i popularność społeczna. Żaden z nich sam nie pokazuje źródła ani jakości metody.'
    }],
    'm3-9-dane-i-statystyki': [{
      keys: ['m3-e33-base', 'm3-e33-users', 'm3-e33-period', 'm3-e33-method', 'm3-e33-change'],
      hint: 'Zastanów się, czego potrzebujesz, aby ocenić zarówno skalę wzrostu, jak i możliwość, że zmienił się sposób korzystania z systemu lub rejestrowania skarg.',
      explanation: 'Każda informacja odpowiada na inne pytanie o wynik 50%: skala początkowa, liczba użytkowników, porównywalny okres, sposób rejestracji i możliwa zmiana dostępności zgłaszania.'
    }]
  };

  const optionLabel = (select, value) => {
    const option = [...select.options].find(item => item.value === value);
    return option ? option.textContent.trim() : value;
  };

  const ensureFeedback = field => {
    let feedback = field.querySelector(':scope > .exercise-field-feedback');
    if (!feedback) {
      feedback = document.createElement('p');
      feedback.className = 'exercise-field-feedback';
      feedback.setAttribute('aria-live', 'polite');
      field.append(feedback);
    }
    return feedback;
  };

  Object.entries(profiles).forEach(([sectionId, questions]) => {
    const section = document.getElementById(sectionId);
    const exercise = section?.querySelector('.exercise-compact') || section?.querySelector('.course-section-body');
    if (!exercise || exercise.querySelector('[data-exercise-feedback-check]')) return;

    const actions = document.createElement('div');
    actions.className = 'exercise-review-actions';
    actions.innerHTML = '<button class="exercise-review-button" data-exercise-feedback-check type="button">Sprawdź odpowiedzi i wyjaśnienia</button><p class="exercise-review-summary" data-exercise-feedback-summary aria-live="polite"></p>';
    const details = exercise.querySelector('details.exercise-feedback');
    if (details) details.insertAdjacentElement('beforebegin', actions);
    else exercise.append(actions);
    const retryChoice = document.createElement('aside');
    retryChoice.className = 'exercise-retry-choice';
    retryChoice.hidden = true;
    retryChoice.setAttribute('aria-live', 'polite');
    retryChoice.innerHTML = '<strong>Nie wszystkie odpowiedzi są trafne. Co chcesz zrobić?</strong><p>Możesz zachować zaznaczenia i spróbować je poprawić albo odsłonić rozwiązania wraz z pełnym wyjaśnieniem.</p><div class="exercise-retry-buttons"><button class="exercise-review-button" data-exercise-try-again type="button">Spróbuję jeszcze raz</button><button class="exercise-review-button is-secondary" data-exercise-show-answers type="button">Pokaż poprawne odpowiedzi</button></div>';
    actions.insertAdjacentElement('afterend', retryChoice);
    let lastReview = null;

    questions.forEach(([key]) => {
      const select = exercise.querySelector(`[data-save-key="${key}"]`);
      select?.addEventListener('change', () => {
        const field = select.closest('label') || select.parentElement;
        field?.classList.remove('exercise-feedback-correct', 'exercise-feedback-incorrect');
        const feedback = field?.querySelector(':scope > .exercise-field-feedback');
        if (feedback) feedback.textContent = '';
        retryChoice.hidden = true;
      });
    });
    (checkboxProfiles[sectionId] || []).forEach(group => {
      group.keys.forEach(key => {
        const input = exercise.querySelector(`[data-save-key="${key}"]`);
        input?.addEventListener('change', () => {
          const label = input.closest('label') || input.parentElement;
          label?.classList.remove('exercise-feedback-correct', 'exercise-feedback-incorrect');
          const feedback = exercise.querySelector('.exercise-checkbox-feedback');
          if (feedback) feedback.textContent = '';
          retryChoice.hidden = true;
        });
      });
    });

    actions.querySelector('[data-exercise-feedback-check]').addEventListener('click', () => {
      let answered = 0;
      let correctCount = 0;
      const checkboxGroups = checkboxProfiles[sectionId] || [];
      lastReview = {selects: [], groups: []};
      questions.forEach(([key, expected, explanation]) => {
        const select = exercise.querySelector(`[data-save-key="${key}"]`);
        if (!select) return;
        const field = select.closest('label') || select.parentElement;
        const feedback = ensureFeedback(field);
        field.classList.remove('exercise-feedback-correct', 'exercise-feedback-incorrect');
        if (!select.value) {
          feedback.textContent = 'Najpierw wybierz odpowiedź.';
          return;
        }
        answered += 1;
        const accepted = Array.isArray(expected) ? expected : [expected];
        const ok = accepted.includes(select.value);
        if (ok) correctCount += 1;
        field.classList.add(ok ? 'exercise-feedback-correct' : 'exercise-feedback-incorrect');
        const selectedText = optionLabel(select, select.value);
        const expectedText = accepted.map(value => optionLabel(select, value)).join(' lub ');
        lastReview.selects.push({select, field, feedback, ok, selectedText, expectedText, explanation});
        feedback.textContent = ok
          ? `Wybrałeś: ${selectedText}. To trafna odpowiedź. ${explanation}`
          : `Wybrałeś: ${selectedText}. Niezupełnie. ${explanation}`;
      });
      checkboxGroups.forEach((group, groupIndex) => {
        const inputs = group.keys.map(key => exercise.querySelector(`[data-save-key="${key}"]`)).filter(Boolean);
        if (!inputs.length) return;
        answered += 1;
        const allChecked = inputs.every(input => input.checked);
        if (allChecked) correctCount += 1;
        inputs.forEach(input => {
          const label = input.closest('label') || input.parentElement;
          label.classList.remove('exercise-feedback-correct', 'exercise-feedback-incorrect');
          label.classList.add(input.checked ? 'exercise-feedback-correct' : 'exercise-feedback-incorrect');
        });
        const container = inputs.map(input => input.closest('.choice-grid, .compact-check-grid, fieldset')).find(Boolean) || inputs[0].parentElement;
        let groupFeedback = container.parentElement?.querySelector(`:scope > [data-checkbox-feedback="${groupIndex}"]`);
        if (!groupFeedback) {
          groupFeedback = document.createElement('p');
          groupFeedback.className = 'exercise-checkbox-feedback';
          groupFeedback.dataset.checkboxFeedback = String(groupIndex);
          groupFeedback.setAttribute('aria-live', 'polite');
          container.insertAdjacentElement('afterend', groupFeedback);
        }
        const allLabels = inputs.map(input => input.closest('label')?.textContent.trim()).filter(Boolean);
        const selectedLabels = inputs.filter(input => input.checked).map(input => input.closest('label')?.textContent.trim()).filter(Boolean);
        lastReview.groups.push({inputs, groupFeedback, allChecked, allLabels, selectedLabels, group});
        groupFeedback.className = `exercise-checkbox-feedback ${allChecked ? 'is-correct' : 'is-incorrect'}`;
        groupFeedback.textContent = allChecked
          ? `Zaznaczyłeś: ${selectedLabels.join(', ')}. To pełna odpowiedź. ${group.explanation}`
          : `Zaznaczyłeś: ${selectedLabels.length ? selectedLabels.join(', ') : 'żaden element'}. To niepełna odpowiedź. ${group.hint}`;
      });
      const totalQuestions = questions.length + checkboxGroups.length;
      const summary = actions.querySelector('[data-exercise-feedback-summary]');
      if (answered < totalQuestions) {
        summary.className = 'exercise-review-summary is-warning';
        summary.textContent = `Odpowiedz na wszystkie pytania objęte sprawdzeniem (${answered}/${totalQuestions}).`;
      } else {
        summary.className = `exercise-review-summary ${correctCount === totalQuestions ? 'is-success' : 'is-warning'}`;
        summary.textContent = correctCount === totalQuestions
          ? `Wszystkie odpowiedzi są trafne (${correctCount}/${totalQuestions}). Przeczytaj uzasadnienia - pokazują, na jakie szczegóły zwracać uwagę w podobnych sytuacjach.`
          : `Trafne odpowiedzi: ${correctCount} z ${totalQuestions}. Przeczytaj wyjaśnienia, a następnie zdecyduj, czy próbujesz ponownie, czy odsłaniasz rozwiązania.`;
      }
      retryChoice.hidden = answered < totalQuestions || correctCount === totalQuestions;
    });

    retryChoice.querySelector('[data-exercise-try-again]').addEventListener('click', () => {
      retryChoice.hidden = true;
      const firstWrong = exercise.querySelector('.exercise-feedback-incorrect select, .exercise-feedback-incorrect input');
      firstWrong?.focus();
      const summary = actions.querySelector('[data-exercise-feedback-summary]');
      summary.className = 'exercise-review-summary is-warning';
      summary.textContent = 'Zachowaliśmy Twoje odpowiedzi. Zmień te, które po ponownym przeczytaniu przykładu wydają Ci się mniej trafne, i sprawdź zadanie jeszcze raz.';
    });

    retryChoice.querySelector('[data-exercise-show-answers]').addEventListener('click', () => {
      if (!lastReview) return;
      lastReview.selects.filter(item => !item.ok).forEach(item => {
        item.feedback.className = 'exercise-field-feedback is-revealed';
        item.feedback.textContent = `Poprawna odpowiedź: ${item.expectedText}. ${item.explanation}`;
      });
      lastReview.groups.filter(item => !item.allChecked).forEach(item => {
        item.groupFeedback.className = 'exercise-checkbox-feedback is-revealed';
        item.groupFeedback.textContent = `Pełna odpowiedź obejmuje: ${item.allLabels.join(', ')}. ${item.group.explanation}`;
      });
      retryChoice.hidden = true;
      const summary = actions.querySelector('[data-exercise-feedback-summary]');
      summary.className = 'exercise-review-summary is-warning';
      summary.textContent = 'Poprawne odpowiedzi zostały odsłonięte. Zaznaczenia nie zostały zmienione - możesz je poprawić i wykonać zadanie ponownie.';
    });
  });
})();
