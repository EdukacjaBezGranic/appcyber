(() => {
  'use strict';

  const ASSESSMENT_COPY = {
    susceptibility: {
      area: 'podatność na manipulację',
      low: 'Warto ćwiczyć rozpoznawanie momentu, w którym emocja, presja czasu, popularność albo zgodność z wcześniejszym przekonaniem przyspieszają ocenę. Najważniejszym nawykiem jest świadoma pauza przed reakcją.',
      mid: 'Rozpoznajesz część mechanizmów podatności, ale nie wszystkie uruchamiają u Ciebie równie wyraźny sygnał ostrzegawczy. Wybierz jeden najsłabiej oceniony obszar i obserwuj go podczas codziennego korzystania z informacji.',
      high: 'Twoje odpowiedzi wskazują na dobrą świadomość emocji, błędów poznawczych, efektu powtarzania i społecznego dowodu słuszności. Utrzymuj ten nawyk szczególnie wtedy, gdy treść wywołuje silny gniew, strach lub presję szybkiej reakcji.'
    },
    critical: {
      area: 'krytyczne myślenie, źródła i decyzje',
      low: 'Wróć do pytań o źródło, dowody, kontekst i cel decyzji. Przed działaniem doprecyzuj, czego naprawdę próbujesz się dowiedzieć i czego nadal nie wiesz.',
      mid: 'Potrafisz stosować część zasad krytycznej oceny, lecz nie wszystkie są jeszcze jednakowo utrwalone. Najwięcej korzyści da regularne porównywanie niezależnych źródeł i sprawdzanie związku między dowodem a wnioskiem.',
      high: 'Twoje odpowiedzi wskazują na dobrze rozwiniętą ocenę źródeł i dowodów oraz świadome podejmowanie decyzji. Utrzymuj ten standard również przy odpowiedziach AI i informacjach zgodnych z Twoim pierwszym przekonaniem.'
    },
    sensitive: {
      area: 'odpowiedzialna komunikacja w tematach wrażliwych',
      low: 'W tematach wrażliwych wracaj do źródła, kontekstu i języka użytego wobec ludzi. Przed udostępnieniem oceń możliwą szkodę oraz sprawdź, czy przekaz nie opiera się na stereotypie, dehumanizacji lub pojedynczym przypadku.',
      mid: 'Rozpoznajesz część ram interpretacyjnych i zagrożeń etycznych. Utrwalaj analizę języka, obrazów, kontekstu oraz możliwych skutków udostępnienia.',
      high: 'Twoje odpowiedzi wskazują na świadome podejście do tematów społecznie wrażliwych. Zachowuj tę ostrożność szczególnie przy drastycznych nagraniach, treściach o grupach społecznych i materiałach generowanych przez AI.'
    },
    resilience: {
      area: 'odporność informacyjna i dobrostan',
      low: 'Warto zacząć od prostych granic: ograniczyć częstotliwość sprawdzania wiadomości, rozpoznawać sygnały przeciążenia i robić przerwę przed reakcją na emocjonalną treść.',
      mid: 'Masz część nawyków wspierających odporność informacyjną, lecz nie są jeszcze stabilne. Wybierz jeden obszar do ćwiczenia przez najbliższy tydzień.',
      high: 'Twoje odpowiedzi wskazują na dobrze rozwinięte nawyki związane z dobrostanem, dialogiem i odpowiedzialnym udostępnianiem. Pilnuj ich zwłaszcza w okresach dużego natężenia wiadomości.'
    }
  };

  const profileFor = score => {
    if (score <= 12) return { label: 'Podstawy do wzmocnienia', band: 'low' };
    if (score <= 19) return { label: 'Umiejętności w rozwoju', band: 'mid' };
    return { label: 'Dobrze rozwinięte kompetencje', band: 'high' };
  };

  const dispatchSave = field => field.dispatchEvent(new Event('input', { bubbles: true }));

  document.querySelectorAll('[data-compact-assessment]').forEach(table => {
    const moduleNumber = Number(table.closest('[data-module-number]')?.dataset.moduleNumber || table.dataset.compactAssessment || 0);
    const profileKey = table.dataset.assessmentProfile || 'resilience';
    const config = ASSESSMENT_COPY[profileKey] || ASSESSMENT_COPY.resilience;
    const result = table.closest('.course-section-body')?.querySelector('[data-assessment-result]') || table.parentElement?.nextElementSibling;
    if (!result) return;

    const rows = [...table.querySelectorAll('tbody tr')];
    const title = result.querySelector('strong');
    const copy = result.querySelector('[data-assessment-copy]');
    const focus = result.querySelector('[data-assessment-focus]');
    const section = table.closest('.course-section');

    const sectionId = section?.dataset.courseSection || `m${moduleNumber}-self-assessment`;
    let summaryField = section?.querySelector('[data-assessment-summary-field]');
    if (!summaryField && section) {
      summaryField = document.createElement('input');
      summaryField.type = 'hidden';
      summaryField.className = 'course-answer';
      summaryField.dataset.assessmentSummaryField = '';
      summaryField.dataset.saveKey = `${sectionId}-summary-v57`;
      summaryField.dataset.workbookLabel = `Samoocena – ${section.querySelector('h2')?.textContent.trim() || `Moduł ${moduleNumber}`}`;
      section.querySelector('.course-section-body')?.append(summaryField);
    }

    const update = () => {
      const items = rows.map((row, index) => {
        const checked = row.querySelector('input[type="radio"]:checked');
        return {
          row,
          index,
          label: row.dataset.assessmentItem || row.querySelector('th[scope="row"]')?.textContent.trim() || `Obszar ${index + 1}`,
          value: checked ? Number(checked.value) : null
        };
      });
      const completed = items.filter(item => Number.isFinite(item.value));
      rows.forEach(row => row.classList.remove('is-assessment-focus'));

      if (completed.length !== rows.length) {
        title.textContent = `${completed.length} z ${rows.length} odpowiedzi`;
        copy.textContent = 'Po zaznaczeniu wszystkich odpowiedzi zobaczysz wynik, opis profilu i obszar wymagający największej uwagi.';
        focus.textContent = '';
        result.classList.remove('is-complete');
        if (summaryField && summaryField.value) {
          summaryField.value = '';
          dispatchSave(summaryField);
        }
        return;
      }

      const score = items.reduce((sum, item) => sum + item.value, 0);
      const profile = profileFor(score);
      const weakestValue = Math.min(...items.map(item => item.value));
      const weakest = items.filter(item => item.value === weakestValue).slice(0, 2);
      weakest.forEach(item => item.row.classList.add('is-assessment-focus'));

      title.textContent = `${score} / 25 – ${profile.label}`;
      copy.textContent = config[profile.band];
      focus.textContent = `Obszar do dalszej pracy: ${weakest.map(item => `${item.label} (${item.value}/5)`).join(' oraz ')}.`;
      result.classList.add('is-complete');

      const summary = `Wynik: ${score}/25. Profil: ${profile.label}. ${config[profile.band]} ${focus.textContent}`;
      if (summaryField && summaryField.value !== summary) {
        summaryField.value = summary;
        dispatchSave(summaryField);
      }
    };

    table.addEventListener('change', event => {
      if (event.target.matches('input[type="radio"]')) update();
    });
    update();
  });
})();
