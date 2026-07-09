const projectLogo = 'grafiki/logo-projektu-symbol-transparent.png';
const competencesLogo = 'grafiki/kierunek-kompetencje.png';

const trainingEvents = [
  {
    id: 'fake-news',
    source: 'Projekt Edukacja bez granic',
    title: 'Myślenie krytyczne, dezinformacja i manipulacja',
    shortTitle: 'Myślenie krytyczne',
    date: '2026-09-08',
    time: '9:00-13:00',
    place: 'Wojewódzki Urząd Pracy w Katowicach',
    description: [
      'Szkolenie pomaga rozpoznawać fałszywe i manipulacyjne treści, oceniać wiarygodność źródeł oraz odróżniać fakty od opinii i emocjonalnych przekazów.',
      'Uczestnicy poznają praktyczne metody weryfikowania informacji, zdjęć i internetowych publikacji. Uczą się także, jak spokojnie reagować na niepewne treści i wspierać innych w podejmowaniu decyzji na podstawie sprawdzonych danych.'
    ],
    audience: 'Pracownicy instytucji publicznych, doradcy zawodowi, edukatorzy i osoby pracujące z informacją.',
    color: '#d4a017',
    tone: 'gold',
    logo: projectLogo,
    link: 'https://forms.gle/KzJmaQr8hvH5dkGM8',
    button: 'Zapisz się - formularz Google',
    open: true
  },
  {
    id: 'komunikacja',
    source: 'Projekt Edukacja bez granic',
    title: 'Wystąpienia publiczne i storytelling',
    shortTitle: 'Wystąpienia',
    date: '2026-09-15',
    time: '9:00-13:00',
    place: 'Termin i miejsce do potwierdzenia',
    description: [
      'Szkolenie rozwija umiejętność jasnego, uporządkowanego i przekonującego przekazywania informacji podczas spotkań, prezentacji oraz pracy z grupą.',
      'Uczestnicy uczą się budować strukturę wypowiedzi, wykorzystywać storytelling, pracować głosem i mową ciała, a także spokojnie reagować na pytania i dopasowywać przekaz do odbiorców.'
    ],
    audience: 'Osoby prowadzące spotkania, warsztaty, prezentacje i rozmowy z klientami lub partnerami.',
    color: '#0f5132',
    tone: 'green',
    logo: projectLogo,
    open: false
  },
  {
    id: 'grywalizacja',
    source: 'Projekt Edukacja bez granic',
    title: 'Grywalizacja, uczenie przez gry i doświadczenie',
    shortTitle: 'Grywalizacja',
    date: '2026-09-22',
    time: '9:00-13:00',
    place: 'Termin i miejsce do potwierdzenia',
    description: [
      'Szkolenie pokazuje, jak wykorzystywać gry, wyzwania i mechanizmy motywacyjne w edukacji dorosłych, aby zwiększać zaangażowanie i ułatwiać naukę przez działanie.',
      'Uczestnicy uczą się projektować praktyczne aktywności, jasno określać cele i zasady, wykorzystywać informację zwrotną oraz tworzyć bezpieczną przestrzeń do testowania nowych rozwiązań.'
    ],
    audience: 'Edukatorzy, trenerzy, doradcy zawodowi i osoby projektujące aktywności rozwojowe.',
    color: '#0b2e59',
    tone: 'blue',
    logo: projectLogo,
    open: false
  },
  {
    id: 'ai',
    source: 'Kierunek Kompetencje 4.0',
    title: 'Praktyczne wykorzystanie sztucznej inteligencji',
    shortTitle: 'AI w praktyce',
    date: '2026-09-24',
    time: '10:00-14:00',
    place: 'Termin i miejsce do potwierdzenia',
    description: [
      'Szkolenie pokazuje, jak korzystać z narzędzi AI w pracy zawodowej i edukacyjnej.',
      'Uczy tworzenia treści, przygotowywania materiałów, automatyzacji prostych zadań, pracy z promptami oraz bezpiecznego i odpowiedzialnego korzystania z AI.'
    ],
    audience: 'Pracownicy instytucji publicznych, edukatorzy, trenerzy oraz osoby zainteresowane praktycznym użyciem AI.',
    color: '#0e7490',
    tone: 'cyan',
    logo: competencesLogo,
    open: false
  },
  {
    id: 'sel',
    source: 'Kierunek Kompetencje 4.0',
    title: 'Social and Emotional Learning',
    shortTitle: 'SEL',
    date: '2026-09-29',
    time: '10:00-14:00',
    place: 'Termin i miejsce do potwierdzenia',
    description: [
      'Szkolenie poświęcone jest rozwojowi kompetencji społecznych i emocjonalnych.',
      'Uczy lepszej komunikacji, samoświadomości, empatii, współpracy, radzenia sobie z emocjami i budowania relacji w grupie.'
    ],
    audience: 'Osoby pracujące z grupami, klientami, uczącymi się dorosłymi oraz zespołami.',
    color: '#0f8f68',
    tone: 'green',
    logo: competencesLogo,
    open: false
  },
  {
    id: 'cyber',
    source: 'Program mobilności',
    title: 'Cyberbezpieczeństwo',
    shortTitle: 'Cyberbezpieczeństwo',
    date: '2026-10-06',
    time: '10:00-14:00',
    place: 'Termin i miejsce do potwierdzenia',
    description: [
      'Szkolenie pomaga bezpieczniej korzystać z poczty elektronicznej, stron internetowych, urządzeń i usług cyfrowych wykorzystywanych w codziennej pracy.',
      'Uczestnicy uczą się rozpoznawać phishing, podejrzane linki i załączniki, chronić dane oraz właściwie reagować na sytuacje, które mogą prowadzić do incydentu bezpieczeństwa.'
    ],
    audience: 'Pracownicy korzystający z narzędzi cyfrowych, poczty elektronicznej i systemów informacyjnych.',
    color: '#2563eb',
    tone: 'blue',
    logo: projectLogo,
    open: false
  },
  {
    id: 'mindfulness',
    source: 'Program mobilności',
    title: 'Mindfulness',
    shortTitle: 'Mindfulness',
    date: '2026-10-13',
    time: '10:00-14:00',
    place: 'Termin i miejsce do potwierdzenia',
    description: [
      'Szkolenie pokazuje, jak świadomie zarządzać uwagą, napięciem i własnymi reakcjami w wymagającym środowisku pracy.',
      'Uczestnicy poznają proste praktyki wspierające koncentrację, równowagę emocjonalną, spokojniejszą komunikację oraz lepsze rozpoznawanie własnych potrzeb i granic.'
    ],
    audience: 'Osoby zainteresowane spokojniejszą pracą, lepszą koncentracją i dbaniem o własne zasoby.',
    color: '#64748b',
    tone: 'slate',
    logo: projectLogo,
    open: false
  }
];

const minMonth = { year: 2026, month: 8 };
const maxMonth = { year: 2027, month: 11 };
const monthNames = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];

let currentYear = 2026;
let currentMonth = 8;
let selectedEventId = 'fake-news';

const detailPanel = document.querySelector('.calendar-details');
const calendarGrid = document.querySelector('[data-calendar-grid]');
const calendarList = document.querySelector('[data-calendar-list]');
const calendarTitle = document.querySelector('[data-calendar-title]');
const prevButton = document.querySelector('[data-calendar-prev]');
const nextButton = document.querySelector('[data-calendar-next]');
const nearestButton = document.querySelector('[data-calendar-nearest]');
const calendarModeButtons = document.querySelectorAll('[data-calendar-mode]');
const calendarViews = document.querySelectorAll('[data-calendar-view]');

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function monthIndex(year, month) {
  return year * 12 + month;
}

function formatMonth(year, month) {
  return `${monthNames[month][0].toUpperCase()}${monthNames[month].slice(1)} ${year}`;
}

function formatFullDate(value) {
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(parseDate(value));
}

function eventsInMonth(year, month) {
  return trainingEvents
    .filter(event => {
      const eventDate = parseDate(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    })
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));
}

function eventById(id) {
  return trainingEvents.find(event => event.id === id) || trainingEvents[0];
}

function setText(selector, value) {
  const element = detailPanel?.querySelector(selector);
  if (element) element.textContent = value;
}

function setDescription(paragraphs) {
  const container = detailPanel?.querySelector('[data-detail-description]');
  if (!container) return;
  container.innerHTML = '';
  paragraphs.forEach(paragraph => {
    const item = document.createElement('p');
    item.textContent = paragraph;
    container.append(item);
  });
}

function renderAction(event) {
  const action = detailPanel?.querySelector('[data-detail-action]');
  if (!action) return;

  if (event.open && event.link) {
    action.innerHTML = `<a class="public-btn calendar-form-btn" href="${event.link}" target="_blank" rel="noopener noreferrer">${event.button || 'Zapisz się'}</a>`;
    return;
  }

  action.innerHTML = '<span class="public-btn signup-btn-disabled" aria-disabled="true">Zapisy wkrótce</span>';
}

function renderDetailLogo(event) {
  const logo = detailPanel?.querySelector('[data-detail-logo]');
  const logoWrap = detailPanel?.querySelector('[data-detail-icon]');
  if (!logo || !logoWrap) return;

  logo.src = event.logo || projectLogo;
  logoWrap.style.setProperty('--detail-color', event.color);
}

function selectEvent(id) {
  const event = eventById(id);
  selectedEventId = event.id;

  setText('[data-detail-source]', event.source);
  setText('[data-detail-title]', event.title);
  setText('[data-detail-date]', formatFullDate(event.date));
  setText('[data-detail-time]', event.time);
  setText('[data-detail-place]', event.place);
  setText('[data-detail-audience]', event.audience);
  setDescription(event.description);
  renderDetailLogo(event);
  renderAction(event);

  document.querySelectorAll('[data-event-id]').forEach(item => {
    item.classList.toggle('is-active', item.dataset.eventId === event.id);
  });
}

function makeEventButton(event) {
  const button = document.createElement('button');
  button.className = `calendar-event ${event.open ? 'is-open' : 'is-waiting'} is-${event.tone}`;
  button.type = 'button';
  button.dataset.eventId = event.id;
  button.innerHTML = `<small>${event.time}</small>${event.shortTitle}`;
  return button;
}

function renderMonth() {
  if (!calendarGrid || !calendarTitle) return;

  calendarTitle.textContent = formatMonth(currentYear, currentMonth);
  calendarGrid.innerHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(currentYear, currentMonth, 1 - startOffset);
  const monthEvents = eventsInMonth(currentYear, currentMonth);

  for (let index = 0; index < 42; index += 1) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + index);

    const day = document.createElement('div');
    day.className = 'calendar-day';
    if (cellDate.getMonth() !== currentMonth) day.classList.add('is-muted');

    const dayNumber = document.createElement('span');
    dayNumber.textContent = String(cellDate.getDate());
    day.append(dayNumber);

    const events = monthEvents.filter(event => {
      const eventDate = parseDate(event.date);
      return eventDate.toDateString() === cellDate.toDateString();
    });

    events.forEach(event => day.append(makeEventButton(event)));
    calendarGrid.append(day);
  }

  renderList(monthEvents);
  updateMonthButtons();
  selectEvent(selectedEventId);
}

function renderList(monthEvents) {
  if (!calendarList) return;
  calendarList.innerHTML = '';

  if (!monthEvents.length) {
    const empty = document.createElement('p');
    empty.className = 'calendar-empty';
    empty.textContent = 'W tym miesiącu nie ma jeszcze opublikowanych terminów szkoleń.';
    calendarList.append(empty);
    return;
  }

  monthEvents.forEach(event => {
    const button = document.createElement('button');
    button.className = 'calendar-list-item';
    button.type = 'button';
    button.dataset.eventId = event.id;
    button.innerHTML = `<span><strong>${formatFullDate(event.date)}</strong><small>${event.time}</small></span><b>${event.title}</b>`;
    calendarList.append(button);
  });
}

function updateMonthButtons() {
  const current = monthIndex(currentYear, currentMonth);
  const min = monthIndex(minMonth.year, minMonth.month);
  const max = monthIndex(maxMonth.year, maxMonth.month);

  if (prevButton) prevButton.disabled = current <= min;
  if (nextButton) nextButton.disabled = current >= max;
}

function changeMonth(delta) {
  const next = new Date(currentYear, currentMonth + delta, 1);
  const nextIndex = monthIndex(next.getFullYear(), next.getMonth());
  const min = monthIndex(minMonth.year, minMonth.month);
  const max = monthIndex(maxMonth.year, maxMonth.month);

  if (nextIndex < min || nextIndex > max) return;

  currentYear = next.getFullYear();
  currentMonth = next.getMonth();

  const monthEvents = eventsInMonth(currentYear, currentMonth);
  if (monthEvents.length) selectedEventId = monthEvents[0].id;
  renderMonth();
}

function goToNearestEvent() {
  const firstEvent = trainingEvents[0];
  const date = parseDate(firstEvent.date);
  currentYear = date.getFullYear();
  currentMonth = date.getMonth();
  selectedEventId = firstEvent.id;
  renderMonth();
}

document.addEventListener('click', event => {
  const item = event.target.closest('[data-event-id]');
  if (!item) return;
  selectEvent(item.dataset.eventId);
});

prevButton?.addEventListener('click', () => changeMonth(-1));
nextButton?.addEventListener('click', () => changeMonth(1));
nearestButton?.addEventListener('click', goToNearestEvent);

calendarModeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selectedMode = button.dataset.calendarMode;

    calendarModeButtons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });

    calendarViews.forEach(view => {
      view.classList.toggle('is-active', view.dataset.calendarView === selectedMode);
    });
  });
});

document.querySelector('.calendar-close')?.addEventListener('click', () => {
  selectEvent(selectedEventId);
});

renderMonth();
