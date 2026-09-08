(function () {
  const data = window.portalSiteData || {};
  const trainings = Array.isArray(data.trainings) ? data.trainings : [];
  const groups = {
    new: document.querySelector('[data-training-group="new"]'),
    other: document.querySelector('[data-training-group="other"]')
  };

  if (!groups.new && !groups.other) return;

  Object.values(groups).forEach((container) => {
    if (container) container.innerHTML = '';
  });

  const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));

  const formatDate = (value) => {
    if (!value) return 'Termin wkrótce';
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return 'Termin wkrótce';
    return new Intl.DateTimeFormat('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const seriesKey = (training) => String(training.series || training.id || '')
    .replace(/-\d{4}-\d{2}-\d{2}$/, '');

  const nearestUpcoming = (baseTraining, now = new Date()) => {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const key = seriesKey(baseTraining);
    const upcoming = trainings
      .filter((training) => seriesKey(training) === key && training.date)
      .map((training) => ({ training, date: new Date(`${training.date}T12:00:00`) }))
      .filter(({ date }) => !Number.isNaN(date.getTime()) && date >= today)
      .sort((a, b) => a.date - b.date);

    if (upcoming.length) return { ...baseTraining, ...upcoming[0].training, calendarOnly: false };
    return { ...baseTraining, date: '', time: '', place: '', open: false, link: '', calendarOnly: false };
  };

  const asDescription = (description) => {
    if (Array.isArray(description)) return description;
    if (!description) return [];
    return String(description).split('\n').map((line) => line.trim()).filter(Boolean);
  };

  const colorToRgb = (value) => {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(value || ''));
    if (!match) return '14,116,144';
    return `${parseInt(match[1], 16)},${parseInt(match[2], 16)},${parseInt(match[3], 16)}`;
  };

  const renderAction = (training) => {
    if (training.registrationClosed) {
      return '<span class="signup-status is-closed">Zapisy zakończone</span>';
    }
    const label = training.open ? 'Zapisz się' : 'Termin zostanie ogłoszony';
    if (training.open && training.link) {
      return `
        <span class="signup-status is-open">Zapisy otwarte</span>
        <a class="public-btn" href="${escapeHtml(training.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>
      `;
    }
    return `
      <a class="signup-status signup-calendar-link" href="#terminarz">Sprawdź terminarz</a>
    `;
  };

  const renderCard = (training) => {
    const color = training.color || '#0e7490';
    const image = training.image || 'grafiki/projekt-hero.png';
    const title = training.title || 'Szkolenie';
    const descriptions = asDescription(training.description);
    const meta = [formatDate(training.date), training.date ? training.time : '', training.place].filter(Boolean).join(' · ');
    const accentRgb = colorToRgb(color);

    return `
      <article class="signup-training-card" style="--signup-accent:${escapeHtml(color)};--signup-accent-rgb:${accentRgb};">
        <figure class="signup-training-media">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">
        </figure>
        <div class="signup-training-content">
          <span class="signup-training-source">${escapeHtml(training.source || '')}</span>
          <h3>${escapeHtml(title)}</h3>
          ${meta ? `<p class="signup-training-meta">${escapeHtml(meta)}</p>` : ''}
          <div class="signup-training-copy">
            ${descriptions.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
          </div>
          <div class="signup-training-action">
            ${renderAction(training)}
          </div>
        </div>
      </article>
    `;
  };

  trainings.filter((training) => !training.calendarOnly).map((training) => nearestUpcoming(training)).forEach((training) => {
    const groupKey = training.group === 'new' ? 'new' : 'other';
    const container = groups[groupKey];
    if (container) container.insertAdjacentHTML('beforeend', renderCard(training));
  });
})();
