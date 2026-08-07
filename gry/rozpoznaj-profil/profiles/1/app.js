(() => {
  'use strict';

  const choices = [...document.querySelectorAll('.choice')];
  const hintButtons = [...document.querySelectorAll('.hint-button')];
  const result = document.querySelector('#result');
  const reset = document.querySelector('#reset');
  const takeaway = document.querySelector('#podsumowanie');

  const messages = {
    human: {
      className: 'incorrect',
      title: 'To nie jest wiarygodny profil dziennikarki obywatelskiej.',
      body: 'Sama emocjonalna tematyka nie przesądza o manipulacji. Decydujący jest cały wzorzec: fikcyjna tożsamość bez historii, dwa materiały z jednego dnia, brak danych źródłowych oraz masowe oznaczanie redakcji w celu wciągnięcia ich w obieg przekazu.'
    },
    operation: {
      className: 'correct',
      title: 'Trafna ocena: konto operacji wpływu.',
      body: 'Natalia jest fikcyjnym polskim wariantem konta „seeder”. Publikuje spreparowane materiały o migracji, a następnie oznacza media i instytucje, by wymusić reakcję, nadać przekazowi wiarygodność i zwiększyć jego zasięg.'
    }
  };

  function choose(answer) {
    choices.forEach((button) => {
      const selected = button.dataset.answer === answer;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    const message = messages[answer];
    result.className = `result ${message.className}`;
    result.innerHTML = `<strong>${message.title}</strong><p>${message.body}</p><a href="#podsumowanie">Przejdź do pełnego omówienia ↓</a>`;
    result.hidden = false;
    if (takeaway) takeaway.hidden = false;
  }

  choices.forEach((button) => button.addEventListener('click', () => choose(button.dataset.answer)));

  hintButtons.forEach((button) => {
    const content = document.querySelector(`#hint-${button.dataset.hint}`);
    button.addEventListener('click', () => {
      const open = content.hidden;
      content.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? `Ukryj wskazówkę ${button.dataset.hint}` : `Pokaż wskazówkę ${button.dataset.hint}`;
    });
  });

  reset.addEventListener('click', () => {
    choices.forEach((button) => {
      button.classList.remove('selected');
      button.setAttribute('aria-pressed', 'false');
    });
    result.hidden = true;
    result.className = 'result';
    result.innerHTML = '';
    if (takeaway) {
      takeaway.hidden = true;
      const master = takeaway.querySelector('.takeaway-master');
      if (master) master.open = false;
    }
    hintButtons.forEach((button) => {
      const content = document.querySelector(`#hint-${button.dataset.hint}`);
      content.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      button.textContent = `Pokaż wskazówkę ${button.dataset.hint}`;
    });
  });


  function enhanceTakeawayAccordions() {
    const section = document.querySelector('#podsumowanie.takeaway');
    if (!section || section.dataset.accordionReady === 'true') return;
    section.dataset.accordionReady = 'true';

    const introNodes = new Set([
      section.querySelector(':scope > .eyebrow'),
      section.querySelector(':scope > h2'),
      section.querySelector(':scope > .takeaway-lead'),
      section.querySelector(':scope > .important-takeaway')
    ].filter(Boolean));

    const labels = new Map([
      ['takeaway-grid', 'Jak działa ten profil?'],
      ['evidence-panel', 'Sygnały widoczne bez specjalistycznych narzędzi'],
      ['revenue-proof', 'Dlaczego ten mechanizm się opłaca?'],
      ['scam-path', 'Jak przebiega oszustwo?'],
      ['polish-context', 'Kontekst polski'],
      ['warning-links', 'Co sprawdzić i gdzie szukać pomocy?'],
      ['sources', 'Źródła i podstawa ćwiczenia'],
      ['scenario-note', 'Nota metodologiczna']
    ]);

    [...section.children].forEach((node) => {
      if (introNodes.has(node)) return;
      const className = [...node.classList].find(name => labels.has(name));
      const details = document.createElement('details');
      details.className = 'takeaway-accordion';
      const summary = document.createElement('summary');
      summary.textContent = className ? labels.get(className) : 'Dalsze omówienie';
      const body = document.createElement('div');
      body.className = 'takeaway-accordion__body';
      node.before(details);
      body.appendChild(node);
      details.append(summary, body);
    });
  }


  function wrapTakeawayMaster() {
    const section = document.querySelector('#podsumowanie.takeaway');
    if (!section || section.dataset.masterReady === 'true') return;
    section.dataset.masterReady = 'true';
    const details = document.createElement('details');
    details.className = 'takeaway-master';
    const summary = document.createElement('summary');
    summary.innerHTML = '<span>Pełne omówienie profilu</span><small>Rozwiń analizę, sygnały, kontekst i źródła</small>';
    const body = document.createElement('div');
    body.className = 'takeaway-master__body';
    while (section.firstChild) body.appendChild(section.firstChild);
    details.append(summary, body);
    section.appendChild(details);
  }

  enhanceTakeawayAccordions();
  wrapTakeawayMaster();

})();
