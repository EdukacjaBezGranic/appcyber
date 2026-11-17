(() => {
  'use strict';

  const section = document.querySelector('#m1-9-diagnoza-wejsciowa');
  if (!section) return;

  const exercises = {
    channels: section.querySelector('[data-habit-exercise="channels"]'),
    ecosystem: section.querySelector('[data-habit-exercise="ecosystem"]'),
    plan: section.querySelector('[data-habit-exercise="plan"]')
  };

  const dispatchSave = field => {
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const setSummary = (exercise, text) => {
    const hidden = exercise?.querySelector('[data-habit-summary]');
    if (hidden && hidden.value !== text) {
      hidden.value = text;
      dispatchSave(hidden);
    }
  };

  const setDiagnosisSummary = text => {
    const hidden = section.querySelector('[data-habit-diagnosis-summary]');
    if (hidden && hidden.value !== text) {
      hidden.value = text;
      dispatchSave(hidden);
    }
  };

  const selectedText = select => select?.selectedOptions?.[0]?.textContent?.trim() || '';

  const setStepStatus = (kind, state, text) => {
    const status = section.querySelector(`[data-habit-step-status="${kind}"]`);
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('is-complete', state === 'complete');
    status.classList.toggle('is-partial', state === 'partial');
  };

  const setProfileDetails = (container, intro, details = []) => {
    container.replaceChildren();

    const lead = document.createElement('p');
    lead.className = 'habit-profile-intro';
    lead.textContent = intro;
    container.append(lead);

    if (!details.length) return;

    const list = document.createElement('dl');
    list.className = 'habit-profile-details';
    details.forEach(([label, value]) => {
      const term = document.createElement('dt');
      term.textContent = label;
      const description = document.createElement('dd');
      description.textContent = value;
      list.append(term, description);
    });
    container.append(list);
  };

  const collectChannels = () => {
    const exercise = exercises.channels;
    const all = [...exercise.querySelectorAll('.choice-grid input[type="checkbox"]')];
    const checked = all.filter(input => input.checked);
    const awareness = exercise.querySelector('[data-save-key="m1-e1-awareness"]');
    const share = exercise.querySelector('[data-save-key="m1-e1-active-share"]');
    const active = checked.filter(input => input.dataset.channelKind === 'active').length;
    const passive = checked.filter(input => input.dataset.channelKind === 'passive').length;
    const complete = checked.length > 0 && Boolean(awareness?.value) && Boolean(share?.value);

    let profileName = 'mieszany';
    let description = 'Łączysz samodzielne poszukiwanie z odbieraniem treści poleconych przez ludzi lub narzędzia.';
    let strength = 'Możesz porównywać informacje znalezione celowo z tymi, które pojawiają się w Twoim otoczeniu.';
    if (checked.length >= 4 && active > 0 && passive > 0) {
      profileName = 'wielokanałowy';
      description = 'Informacje docierają do Ciebie wieloma drogami - zarówno wtedy, gdy ich szukasz, jak i wtedy, gdy podsuwa je platforma, inna osoba albo narzędzie AI.';
      strength = 'Masz dostęp do różnych sposobów przedstawiania tego samego tematu i możesz je ze sobą zestawiać.';
    } else if (active > passive || (share?.value === 'most' && active > 0)) {
      profileName = 'oparty na aktywnym wyborze';
      description = 'Częściej samodzielnie wybierasz miejsce i moment szukania informacji, niż odbierasz treści podsunięte przez otoczenie cyfrowe.';
      strength = 'Łatwiej Ci świadomie wrócić do wybranego źródła i porównać materiały.';
    } else if (passive > active || share?.value === 'almost-none') {
      profileName = 'oparty na treściach podsuwanych';
      description = 'Duża część informacji pojawia się dzięki rekomendacjom, wiadomościom od innych osób lub narzędziom AI, zanim rozpoczniesz własne poszukiwanie.';
      strength = 'Szybko zauważasz tematy obecne w Twoim otoczeniu i sieci kontaktów.';
    }

    const awarenessText = {
      always: 'Zwykle rozpoznajesz, kto lub co zdecydowało o pokazaniu treści.',
      often: 'Najczęściej zauważasz, kto lub co zdecydowało o pokazaniu treści.',
      rarely: 'Rzadko zatrzymujesz się, aby sprawdzić, kto lub co zdecydowało o pokazaniu treści.',
      never: 'Nie analizujesz jeszcze, kto lub co zdecydowało o pokazaniu treści.'
    }[awareness?.value] || '';

    return { checked, active, passive, awareness, share, complete, profileName, description, strength, awarenessText };
  };

  const collectEcosystem = () => {
    const exercise = exercises.ecosystem;
    const checked = [...exercise.querySelectorAll('.choice-grid input[type="checkbox"]:checked')];
    const compare = exercise.querySelector('[data-save-key="m1-e2-compare"]');
    const independent = exercise.querySelector('[data-save-key="m1-e2-independent"]');
    const primary = exercise.querySelector('[data-save-key="m1-e2-primary"]');
    const risk = exercise.querySelector('[data-save-key="m1-e2-risk"]');
    const complete = checked.length > 0 && Boolean(compare?.value) && Boolean(independent?.value) && Boolean(primary?.value) && Boolean(risk?.value);

    let diversity = 'Korzystasz z dość wąskiego zestawu źródeł.';
    if (checked.length >= 5) diversity = 'Korzystasz ze wszystkich wymienionych grup źródeł.';
    else if (checked.length >= 3) diversity = 'Korzystasz z kilku różnych grup źródeł.';

    const strong = compare?.value === 'always' && independent?.value === 'yes' && primary?.value === 'usually';
    const weak = compare?.value === 'rarely' || ['no', 'dontknow'].includes(independent?.value) || ['rarely', 'never'].includes(primary?.value);
    let verificationLevel = 'rozwijany';
    let verification = 'Stosujesz część dobrych praktyk weryfikacyjnych, ale nie robisz tego jeszcze regularnie.';
    if (strong) {
      verificationLevel = 'uważny';
      verification = 'Regularnie porównujesz informacje, sprawdzasz niezależność źródeł i docierasz do materiałów pierwotnych.';
    } else if (weak) {
      verificationLevel = 'wymagający wzmocnienia';
      verification = 'Największy obszar do rozwoju to docieranie do źródła pierwotnego i sprawdzanie, czy publikacje są od siebie niezależne.';
    }

    const riskExplanations = {
      social: 'Duża liczba reakcji może tworzyć wrażenie prawdziwości, nawet gdy materiał nie zawiera wiarygodnych dowodów.',
      messages: 'Przesłany zrzut lub wiadomość często odcina treść od autora, daty i pierwotnego kontekstu.',
      headlines: 'Krótka forma może pomijać warunki, skalę zjawiska albo fragment wypowiedzi zmieniający jej znaczenie.',
      ai: 'Odpowiedź AI może brzmieć przekonująco, choć łączy nieaktualne dane, błędne informacje lub nieistniejące źródła.',
      confirmation: 'Treść zgodna z przekonaniami łatwiej przechodzi bez sprawdzenia, ponieważ nie wywołuje naturalnego sprzeciwu.'
    };

    return {
      checked,
      compare,
      independent,
      primary,
      risk,
      complete,
      diversity,
      verificationLevel,
      verification,
      riskText: selectedText(risk),
      riskExplanation: riskExplanations[risk?.value] || ''
    };
  };

  const collectPlan = () => {
    const exercise = exercises.plan;
    const all = [...exercise.querySelectorAll('[data-max-choices] input[type="checkbox"]')];
    const checked = all.filter(input => input.checked);
    const labels = checked
      .map(input => input.closest('.choice-card')?.innerText?.trim())
      .filter(Boolean);
    return { all, checked, labels, complete: checked.length > 0 };
  };

  const enforcePlanLimit = changed => {
    const grid = exercises.plan.querySelector('[data-max-choices]');
    const max = Number(grid?.dataset.maxChoices || 3);
    const all = [...grid.querySelectorAll('input[type="checkbox"]')];
    let checked = all.filter(input => input.checked);
    if (checked.length > max && changed) {
      changed.checked = false;
      checked = all.filter(input => input.checked);
      changed.closest('.choice-card')?.classList.add('is-limit-warning');
      setTimeout(() => changed.closest('.choice-card')?.classList.remove('is-limit-warning'), 900);
    }
    all.forEach(input => {
      input.disabled = checked.length >= max && !input.checked;
    });
  };

  const buildIntegratedConclusion = (channels, ecosystem) => {
    const broadContact = channels.checked.length >= 4;
    const passiveContact = channels.passive > channels.active || channels.share?.value === 'almost-none';
    if (ecosystem.verificationLevel === 'uważny') {
      return broadContact
        ? 'Szeroki kontakt z informacją łączysz z regularnym sprawdzaniem. To mocne połączenie, pod warunkiem że porównywane publikacje rzeczywiście prowadzą do niezależnych źródeł.'
        : 'Twój sposób docierania do informacji jest dość skoncentrowany, ale stosujesz uważną weryfikację. Warto zachować ten nawyk i okresowo poszerzać perspektywę.';
    }
    if (ecosystem.verificationLevel === 'wymagający wzmocnienia') {
      return passiveContact
        ? 'Wiele treści dociera do Ciebie przez rekomendacje lub inne osoby, a sprawdzanie źródeł nie jest jeszcze regularne. W takiej sytuacji powtarzana informacja może łatwo wyglądać na wielokrotnie potwierdzoną.'
        : 'Samodzielnie wybierasz przynajmniej część informacji, ale sam wybór kanału nie zastępuje sprawdzenia źródła pierwotnego i niezależnego potwierdzenia.';
    }
    return broadContact
      ? 'Masz szeroki kontakt z informacją i stosujesz część dobrych praktyk. Największą zmianę przyniesie przekształcenie okazjonalnego sprawdzania w jeden stały, prosty nawyk.'
      : 'Twój kontakt z informacją jest dość uporządkowany, ale weryfikacja zależy od sytuacji. Wybrany plan pomoże Ci ustalić jeden powtarzalny sposób reagowania.';
  };

  let isUpdating = false;
  const updateAll = () => {
    if (isUpdating) return;
    isUpdating = true;

    const channels = collectChannels();
    const ecosystem = collectEcosystem();
    const plan = collectPlan();

    const missingChannels = Number(!channels.checked.length) + Number(!channels.awareness?.value) + Number(!channels.share?.value);
    if (channels.complete) {
      setStepStatus('channels', 'complete', 'Krok 1 z 3 ukończony. Pełna diagnoza pojawi się po Ćwiczeniu 1.3.');
      setSummary(exercises.channels, `Profil kontaktu z informacją: ${channels.profileName}. ${channels.description} ${channels.awarenessText}`);
    } else {
      setStepStatus('channels', channels.checked.length ? 'partial' : 'empty', `Krok 1 z 3 - ${channels.checked.length ? `uzupełnij jeszcze ${missingChannels} ${missingChannels === 1 ? 'odpowiedź' : 'odpowiedzi'}.` : 'zaznacz kanały i odpowiedz na dwa pytania.'}`);
      setSummary(exercises.channels, '');
    }

    const ecosystemAnswers = [ecosystem.compare, ecosystem.independent, ecosystem.primary, ecosystem.risk].filter(select => select?.value).length;
    const missingEcosystem = Number(!ecosystem.checked.length) + (4 - ecosystemAnswers);
    if (ecosystem.complete) {
      setStepStatus('ecosystem', 'complete', 'Krok 2 z 3 ukończony. Teraz wybierz swój plan działania.');
      setSummary(exercises.ecosystem, `${ecosystem.diversity} ${ecosystem.verification} Obszar uwagi: ${ecosystem.riskText}.`);
    } else {
      setStepStatus('ecosystem', ecosystem.checked.length || ecosystemAnswers ? 'partial' : 'empty', `Krok 2 z 3 - ${ecosystem.checked.length || ecosystemAnswers ? `uzupełnij jeszcze ${missingEcosystem} ${missingEcosystem === 1 ? 'odpowiedź' : 'odpowiedzi'}.` : 'zaznacz źródła i odpowiedz na cztery pytania.'}`);
      setSummary(exercises.ecosystem, '');
    }

    const planNote = exercises.plan.querySelector('[data-plan-count]');
    if (planNote) planNote.textContent = `Wybrano ${plan.checked.length} z maksymalnie 3 działań.`;
    if (plan.complete) {
      setStepStatus('plan', 'complete', 'Krok 3 z 3 ukończony. Twoja łączna diagnoza jest gotowa poniżej.');
      setSummary(exercises.plan, `Plan poprawy nawyków medialnych: ${plan.labels.join('; ')}.`);
    } else {
      setStepStatus('plan', 'empty', 'Krok 3 z 3 - wybierz od jednego do trzech działań.');
      setSummary(exercises.plan, '');
    }

    const diagnosis = section.querySelector('[data-habit-diagnosis]');
    const title = diagnosis?.querySelector('[data-habit-diagnosis-title]');
    const copy = diagnosis?.querySelector('[data-habit-diagnosis-copy]');
    if (!diagnosis || !title || !copy) {
      isUpdating = false;
      return;
    }

    const complete = channels.complete && ecosystem.complete && plan.complete;
    if (!complete) {
      const missing = [];
      if (!channels.complete) missing.push('Ćwiczenie 1.1');
      if (!ecosystem.complete) missing.push('Ćwiczenie 1.2');
      if (!plan.complete) missing.push('Ćwiczenie 1.3');
      title.textContent = 'Dokończ trzy ćwiczenia, aby zobaczyć łączną diagnozę.';
      setProfileDetails(copy,
        'Wynik pojawi się w tym miejscu dopiero wtedy, gdy będzie mógł połączyć wszystkie odpowiedzi. Nie będzie oceną ani testem wiedzy.',
        [['Do uzupełnienia', missing.join(', ')]]
      );
      diagnosis.classList.remove('is-complete');
      diagnosis.classList.add('is-partial');
      setDiagnosisSummary('');
      isUpdating = false;
      return;
    }

    const conclusion = buildIntegratedConclusion(channels, ecosystem);
    const planText = plan.labels.join(' • ');
    const firstStep = `W najbliższej ważnej sytuacji zastosuj jedno wybrane działanie: ${plan.labels[0]} Potem oceń, czy pomogło Ci zwolnić lub lepiej sprawdzić informację.`;
    title.textContent = `Twój profil kontaktu z informacją: ${channels.profileName}`;
    setProfileDetails(copy,
      `${conclusion} To diagnoza nawyków opisanych w tych trzech ćwiczeniach, a nie stała etykieta ani ocena Ciebie.`,
      [
        ['Jak docierają informacje', `${channels.description} ${channels.awarenessText}`],
        ['Twoja mocna strona', channels.strength],
        ['Źródła i weryfikacja', `${ecosystem.diversity} ${ecosystem.verification}`],
        ['Najważniejsze ryzyko', `${ecosystem.riskText}. ${ecosystem.riskExplanation}`],
        ['Twój plan', planText],
        ['Od czego zacząć', firstStep]
      ]
    );
    diagnosis.classList.remove('is-partial');
    diagnosis.classList.add('is-complete');
    setDiagnosisSummary(`${title.textContent}. ${conclusion} Jak docierają informacje: ${channels.description} ${channels.awarenessText} Mocna strona: ${channels.strength} Źródła i weryfikacja: ${ecosystem.diversity} ${ecosystem.verification} Najważniejsze ryzyko: ${ecosystem.riskText}. ${ecosystem.riskExplanation} Plan: ${plan.labels.join('; ')}. Pierwszy krok: ${firstStep}`);
    isUpdating = false;
  };

  section.addEventListener('change', event => {
    if (event.target.matches('[data-habit-summary], [data-habit-diagnosis-summary]')) return;
    if (event.target.closest('[data-habit-exercise="plan"]') && event.target.matches('input[type="checkbox"]')) {
      enforcePlanLimit(event.target);
    }
    updateAll();
  });

  section.addEventListener('input', event => {
    if (event.target.matches('[data-habit-summary], [data-habit-diagnosis-summary]')) return;
    updateAll();
  });

  enforcePlanLimit();
  updateAll();
})();
