(() => {
  const STORAGE_KEY = 'wup-training-cms-data-v1';
  const sourceData = JSON.parse(JSON.stringify(window.portalSiteData || { contact: {}, trainings: [] }));
  const templates = buildTemplates(sourceData.trainings || []);
  let data = loadLocalData() || JSON.parse(JSON.stringify(sourceData));
  let toastTimer;

  const $ = (id) => document.getElementById(id);
  const form = $('eventForm');
  const templateSelect = $('trainingTemplate');
  const eventsList = $('eventsList');
  const editIndex = $('editIndex');

  function buildTemplates(trainings) {
    const map = new Map();
    trainings.forEach(item => {
      const baseId = String(item.id || '').replace(/-\d{4}-\d{2}-\d{2}(?:-\d+)?$/, '');
      if (!map.has(baseId)) map.set(baseId, { ...item, id: baseId, date: '', time: '', open: false, link: '' });
    });
    return [...map.values()];
  }

  function loadLocalData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed?.trainings) ? parsed : null;
    } catch { return null; }
  }

  function saveLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    render();
  }

  function toast(message) {
    const node = $('cmsToast');
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('is-visible'), 2600);
  }

  function slugDate(value) { return value || 'do-ustalenia'; }
  function uniqueId(baseId, date, excludedIndex = -1) {
    let candidate = `${baseId}-${slugDate(date)}`;
    let counter = 2;
    while (data.trainings.some((item, index) => index !== excludedIndex && item.id === candidate)) candidate = `${baseId}-${slugDate(date)}-${counter++}`;
    return candidate;
  }

  function formatDate(value) {
    if (!value) return 'Termin do ustalenia';
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  }

  function fillTemplates() {
    templateSelect.innerHTML = templates.map((item, index) => `<option value="${index}">${escapeHtml(item.title)}</option>`).join('');
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  function resetForm() {
    editIndex.value = '';
    form.reset();
    $('eventPlace').value = 'Wojewódzki Urząd Pracy w Katowicach, ul. Sokolska 29';
    $('saveEvent').textContent = 'Dodaj termin';
    $('duplicateEvent').disabled = true;
    templateSelect.disabled = false;
  }

  function editEvent(index) {
    const item = data.trainings[index];
    if (!item) return;
    const baseId = String(item.id || '').replace(/-\d{4}-\d{2}-\d{2}(?:-\d+)?$/, '').replace(/-do-ustalenia(?:-\d+)?$/, '');
    const templateIndex = Math.max(0, templates.findIndex(t => t.id === baseId || t.title === item.title));
    templateSelect.value = String(templateIndex);
    $('eventDate').value = item.date || '';
    $('eventTime').value = item.time || '';
    $('eventPlace').value = item.place || '';
    $('eventLink').value = item.link || '';
    $('eventOpen').checked = Boolean(item.open);
    editIndex.value = String(index);
    $('saveEvent').textContent = 'Zapisz zmiany';
    $('duplicateEvent').disabled = false;
    templateSelect.disabled = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function readForm() {
    const template = templates[Number(templateSelect.value)];
    if (!template) throw new Error('Wybierz szkolenie.');
    const date = $('eventDate').value;
    const time = $('eventTime').value.trim();
    const place = $('eventPlace').value.trim();
    const link = $('eventLink').value.trim();
    const open = $('eventOpen').checked;
    if (open && !link) throw new Error('Przy aktywnych zapisach dodaj link do formularza.');
    return { template, date, time, place, link, open };
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const values = readForm();
      const currentIndex = editIndex.value === '' ? -1 : Number(editIndex.value);
      const original = currentIndex >= 0 ? data.trainings[currentIndex] : null;
      const item = {
        ...values.template,
        ...(original || {}),
        id: uniqueId(values.template.id, values.date, currentIndex),
        date: values.date,
        time: values.time,
        place: values.place,
        open: values.open,
        link: values.open ? values.link : values.link,
        button: values.open ? 'Zapisz się' : 'Zapisy wkrótce'
      };
      if (currentIndex >= 0) data.trainings[currentIndex] = item;
      else data.trainings.push(item);
      sortTrainings();
      saveLocal();
      resetForm();
      toast(currentIndex >= 0 ? 'Termin został zaktualizowany.' : 'Termin został dodany.');
    } catch (error) { toast(error.message); }
  });

  $('duplicateEvent').addEventListener('click', () => {
    const index = Number(editIndex.value);
    if (!Number.isInteger(index) || !data.trainings[index]) return;
    const copy = JSON.parse(JSON.stringify(data.trainings[index]));
    copy.id = uniqueId(String(copy.id).replace(/-\d{4}-\d{2}-\d{2}(?:-\d+)?$/, ''), copy.date);
    data.trainings.push(copy);
    sortTrainings();
    saveLocal();
    resetForm();
    toast('Utworzono kopię terminu.');
  });

  function sortTrainings() {
    data.trainings.sort((a, b) => {
      if (!a.date && !b.date) return String(a.title).localeCompare(String(b.title), 'pl');
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time));
    });
  }

  function removeEvent(index) {
    const item = data.trainings[index];
    if (!item) return;
    if (!confirm(`Usunąć termin: ${item.title} — ${formatDate(item.date)}?`)) return;
    data.trainings.splice(index, 1);
    saveLocal();
    resetForm();
    toast('Termin został usunięty.');
  }

  function render() {
    $('eventCount').textContent = String(data.trainings.length);
    if (!data.trainings.length) {
      eventsList.innerHTML = '<div class="cms-empty">Nie ma jeszcze żadnych terminów. Dodaj pierwszy termin w formularzu powyżej.</div>';
      return;
    }
    eventsList.innerHTML = data.trainings.map((item, index) => `
      <article class="cms-event" style="--event-color:${escapeHtml(item.color || '#167252')}">
        <span class="cms-event-accent"></span>
        <div class="cms-event-main">
          <h3>${escapeHtml(item.title)}</h3>
          <div class="cms-event-meta">
            <span>📅 ${escapeHtml(formatDate(item.date))}</span>
            ${item.time ? `<span>🕒 ${escapeHtml(item.time)}</span>` : ''}
            ${item.place ? `<span>📍 ${escapeHtml(item.place)}</span>` : ''}
            <span class="cms-status ${item.open ? 'is-open' : ''}">${item.open ? 'Zapisy aktywne' : 'Zapisy nieaktywne'}</span>
          </div>
        </div>
        <div class="cms-event-actions">
          <button class="cms-icon-btn" type="button" data-edit="${index}">Edytuj</button>
          <button class="cms-icon-btn is-danger" type="button" data-remove="${index}">Usuń</button>
        </div>
      </article>`).join('');
  }

  eventsList.addEventListener('click', event => {
    const edit = event.target.closest('[data-edit]');
    const remove = event.target.closest('[data-remove]');
    if (edit) editEvent(Number(edit.dataset.edit));
    if (remove) removeEvent(Number(remove.dataset.remove));
  });

  $('resetForm').addEventListener('click', resetForm);
  $('restoreSource').addEventListener('click', () => {
    if (!confirm('Wczytać ponownie dane zapisane w portalu? Lokalne zmiany zostaną zastąpione.')) return;
    data = JSON.parse(JSON.stringify(sourceData));
    saveLocal(); resetForm(); toast('Wczytano dane z portalu.');
  });
  $('removeAllDates').addEventListener('click', () => {
    if (!confirm('Ustawić wszystkie terminy jako „do ustalenia” i wyłączyć zapisy?')) return;
    data.trainings = data.trainings.map(item => ({ ...item, date: '', time: '', open: false, link: '', button: 'Zapisy wkrótce' }));
    saveLocal(); resetForm(); toast('Wszystkie terminy ustawiono jako „do ustalenia”.');
  });

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  $('downloadJs').addEventListener('click', () => {
    download('site-data.js', `window.portalSiteData = ${JSON.stringify(data, null, 2)};\n`, 'text/javascript;charset=utf-8');
    toast('Pobrano plik site-data.js.');
  });
  $('downloadJson').addEventListener('click', () => {
    download('site-data.json', `${JSON.stringify(data, null, 2)}\n`, 'application/json;charset=utf-8');
    toast('Pobrano kopię JSON.');
  });

  fillTemplates(); sortTrainings(); render(); resetForm();
})();
