(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8');
  const PUBLIC_PAGES = [
    ['index.html', 'Start'],
    ['nasze-szkolenia.html', 'Nasze szkolenia'],
    ['zapisy.html', 'Zapisy na szkolenia'],
    ['kursy-online.html', 'Kursy online'],
    ['kontakt.html', 'Kontakt'],
    ['zapisy-kalendarz.html', 'Kalendarz szkoleń'],
    ['panel-trenera.html', 'Panel trenera'],
    ['polityka-prywatnosci.html', 'Polityka prywatności'],
    ['polityka-cookies.html', 'Polityka cookies']
  ];

  const state = {
    zip: null,
    root: '',
    sourceName: '',
    sourceKind: '',
    fileCount: 0,
    data: { trainings: [] },
    settings: { version: 205, outputBase: 'appcyber-main', compression: 'DEFLATE' },
    view: 'dashboard',
    selectedTraining: null,
    selectedEvent: null,
    selectedPage: null,
    selectedBlock: 0,
    selectedMedia: null,
    pageDocs: new Map(),
    changedPages: new Set(),
    objectUrls: new Set(),
    dirty: false,
    draftKey: '',
    previewWindow: null
  };

  const els = {
    importScreen: $('#importScreen'), app: $('#app'), workspace: $('#workspace'),
    projectName: $('#projectName'), fileCount: $('#fileCount'), saveState: $('#saveState'),
    zipInput: $('#zipInput'), openZipBtn: $('#openZipBtn'), openFolderBtn: $('#openFolderBtn'),
    dropZone: $('#dropZone'), exportBtn: $('#exportBtn'), previewBtn: $('#previewBtn'),
    modal: $('#modal'), modalTitle: $('#modalTitle'), modalBody: $('#modalBody'),
    modalCancel: $('#modalCancel'), modalConfirm: $('#modalConfirm'), toastRegion: $('#toastRegion')
  };

  const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[ch]));
  const stripHtml = (html = '') => {
    const box = document.createElement('div'); box.innerHTML = html; return box.textContent.trim();
  };
  const pathInZip = path => `${state.root}${path}`;
  const unique = values => [...new Set(values.filter(Boolean))];
  const trainingKey = item => item.series || item.slug || String(item.title || '').toLowerCase().trim();
  const parseDate = value => value ? new Date(`${value}T12:00:00`) : null;
  const formatDate = value => {
    const date = parseDate(value);
    return date && !Number.isNaN(date.valueOf()) ? new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' }).format(date) : 'Brak daty';
  };
  const slugify = value => String(value || 'szkolenie').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const fileExt = name => (name.split('.').pop() || '').toLowerCase();
  const descriptionPart = (item, index) => Array.isArray(item?.description) ? (item.description[index] || '') : (index === 0 ? (item?.description || '') : (item?.description2 || ''));

  function toast(message, type = 'success') {
    const node = document.createElement('div');
    node.className = `toast ${type === 'error' ? 'is-error' : ''}`;
    node.innerHTML = `${icon(type === 'error' ? 'alert' : 'check')}<span>${escapeHtml(message)}</span>`;
    els.toastRegion.append(node);
    requestAnimationFrame(() => node.classList.add('is-visible'));
    setTimeout(() => { node.classList.remove('is-visible'); setTimeout(() => node.remove(), 250); }, 3200);
  }

  function setBusy(message) {
    els.modalTitle.textContent = message;
    els.modalBody.innerHTML = '<div class="busy"><span class="spinner"></span><p>To może potrwać chwilę przy dużych plikach wideo.</p><progress id="busyProgress" max="100" value="0"></progress></div>';
    els.modalCancel.hidden = true; els.modalConfirm.hidden = true; els.modal.hidden = false;
  }
  function closeModal() { els.modal.hidden = true; els.modalCancel.hidden = false; els.modalConfirm.hidden = false; }
  function confirmDialog(title, html, confirmText = 'Potwierdź') {
    return new Promise(resolve => {
      els.modalTitle.textContent = title; els.modalBody.innerHTML = html;
      els.modalCancel.hidden = false; els.modalConfirm.hidden = false; els.modalConfirm.textContent = confirmText;
      els.modal.hidden = false;
      const finish = result => { els.modalCancel.onclick = null; els.modalConfirm.onclick = null; closeModal(); resolve(result); };
      els.modalCancel.onclick = () => finish(false); els.modalConfirm.onclick = () => finish(true);
    });
  }

  function clearObjectUrls() { state.objectUrls.forEach(URL.revokeObjectURL); state.objectUrls.clear(); }
  function blobUrl(blob) { const url = URL.createObjectURL(blob); state.objectUrls.add(url); return url; }

  async function readText(path) {
    const file = state.zip.file(pathInZip(path));
    if (!file) return '';
    return file.async('string');
  }

  function detectRoot(zip) {
    const files = Object.keys(zip.files).filter(name => !zip.files[name].dir);
    if (files.includes('assets/site-data.js') || files.includes('index.html')) return '';
    const candidates = unique(files.map(name => name.includes('/') ? `${name.split('/')[0]}/` : ''));
    return candidates.find(prefix => files.includes(`${prefix}index.html`) || files.includes(`${prefix}assets/site-data.js`)) || '';
  }

  function parseData(text) {
    if (!text.trim()) return { trainings: [] };
    try { return JSON.parse(text); } catch (_) {}
    const match = text.match(/(?:window\.)?[A-Za-z0-9_$]+\s*=\s*([\s\S]*?);?\s*$/);
    if (match) {
      try { return JSON.parse(match[1]); } catch (_) {
        try { return Function(`"use strict";return (${match[1]})`)(); } catch (_) {}
      }
    }
    throw new Error('Nie udało się odczytać danych szkoleń.');
  }

  async function importZip(file) {
    if (!window.JSZip) throw new Error('Brakuje biblioteki JSZip w projekcie.');
    setBusy('Wczytywanie projektu');
    try {
      const zip = await JSZip.loadAsync(file);
      await initializeProject(zip, file.name, 'ZIP');
      closeModal(); toast('Projekt został wczytany.');
    } catch (error) { closeModal(); toast(error.message || 'Nie udało się otworzyć ZIP-u.', 'error'); }
  }

  async function directoryToZip(handle) {
    const zip = new JSZip();
    async function walk(dir, prefix = '') {
      for await (const [name, entry] of dir.entries()) {
        const path = `${prefix}${name}`;
        if (entry.kind === 'directory') await walk(entry, `${path}/`);
        else zip.file(path, await (await entry.getFile()).arrayBuffer());
      }
    }
    await walk(handle); return zip;
  }

  async function openFolder() {
    if (!window.showDirectoryPicker) { toast('Ta przeglądarka nie obsługuje wyboru folderu. Użyj pliku ZIP.', 'error'); return; }
    try {
      const handle = await showDirectoryPicker({ mode: 'read' }); setBusy('Wczytywanie folderu');
      const zip = await directoryToZip(handle); await initializeProject(zip, handle.name, 'folder');
      closeModal(); toast('Folder projektu został wczytany.');
    } catch (error) { closeModal(); if (error.name !== 'AbortError') toast('Nie udało się otworzyć folderu.', 'error'); }
  }

  async function initializeProject(zip, name, kind) {
    clearObjectUrls();
    state.zip = zip; state.root = detectRoot(zip); state.sourceName = name; state.sourceKind = kind;
    state.fileCount = Object.values(zip.files).filter(file => !file.dir).length;
    const json = await readText('data/site-data.json');
    const js = json || await readText('assets/site-data.js');
    state.data = parseData(js || '{}');
    if (!Array.isArray(state.data.trainings)) state.data.trainings = [];
    state.settings.outputBase = (state.root.replace(/\/$/, '') || name.replace(/\.zip$/i, '') || 'appcyber-main').replace(/-V\d+$/i, '');
    state.pageDocs.clear(); state.changedPages.clear(); state.selectedTraining = trainingGroups()[0]?.key || null;
    state.selectedEvent = state.data.trainings.find(item => item.date)?.id || null;
    state.selectedPage = availablePages()[0]?.[0] || null; state.selectedBlock = 0; state.selectedMedia = null;
    state.draftKey = `edukacja-cms:${state.sourceName}:${state.fileCount}`;
    restoreDraft(); state.dirty = false; updateChrome();
    els.importScreen.hidden = true; els.app.hidden = false; navigate('dashboard');
  }

  function updateChrome() {
    els.projectName.textContent = state.sourceName || 'Projekt';
    els.fileCount.textContent = `${state.fileCount} plików · ${state.sourceKind}`;
    els.saveState.textContent = state.dirty ? 'Niezapisane zmiany' : 'Zapisano lokalnie';
    els.saveState.classList.toggle('is-dirty', state.dirty);
  }

  function markDirty() {
    state.dirty = true; updateChrome(); clearTimeout(markDirty.timer);
    markDirty.timer = setTimeout(saveDraft, 550);
    setTimeout(sendPreviewData, 0);
  }
  function saveDraft() {
    if (!state.draftKey) return;
    const pages = {};
    state.changedPages.forEach(path => { const doc = state.pageDocs.get(path); if (doc) pages[path] = '<!doctype html>\n' + doc.documentElement.outerHTML; });
    try {
      localStorage.setItem(state.draftKey, JSON.stringify({ data: state.data, settings: state.settings, pages, savedAt: Date.now() }));
      state.dirty = false; updateChrome();
    } catch (_) { els.saveState.textContent = 'Projekt jest za duży na kopię lokalną'; }
  }
  function restoreDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem(state.draftKey) || 'null');
      if (!saved) return;
      if (saved.data) state.data = saved.data;
      if (saved.settings) state.settings = { ...state.settings, ...saved.settings };
      Object.entries(saved.pages || {}).forEach(([path, html]) => { state.pageDocs.set(path, new DOMParser().parseFromString(html, 'text/html')); state.changedPages.add(path); });
      toast('Przywrócono lokalną kopię roboczą.');
    } catch (_) {}
  }

  function trainingGroups() {
    const map = new Map();
    state.data.trainings.forEach((item, index) => {
      const key = trainingKey(item) || `szkolenie-${index}`;
      if (!map.has(key)) map.set(key, { key, item, count: 0 });
      map.get(key).count += 1;
      if (!item.calendarOnly && map.get(key).item.calendarOnly) map.get(key).item = item;
    });
    return [...map.values()];
  }
  function selectedGroup() { return trainingGroups().find(group => group.key === state.selectedTraining) || trainingGroups()[0]; }
  function events() { return state.data.trainings.filter(item => item.date).sort((a, b) => String(a.date).localeCompare(String(b.date))); }
  function availablePages() { return PUBLIC_PAGES.filter(([path]) => state.zip?.file(pathInZip(path))); }
  function mediaFiles() {
    if (!state.zip) return [];
    return Object.keys(state.zip.files).filter(name => !state.zip.files[name].dir && name.startsWith(state.root) && /^(grafiki|videos|pliki|assets\/images)\//.test(name.slice(state.root.length))).map(name => name.slice(state.root.length)).sort();
  }

  function navigate(view) {
    state.view = view; $$('.nav-item').forEach(node => node.classList.toggle('is-active', node.dataset.view === view));
    render();
  }

  function render() {
    const renderers = { dashboard: renderDashboard, trainings: renderTrainings, calendar: renderCalendar, pages: renderPages, media: renderMedia, settings: renderSettings };
    (renderers[state.view] || renderDashboard)();
    els.workspace.scrollTop = 0;
  }

  function pageHeading(kicker, title, description = '', actions = '') {
    return `<header class="page-heading"><div><span class="eyebrow">${escapeHtml(kicker)}</span><h1>${escapeHtml(title)}</h1>${description ? `<p>${escapeHtml(description)}</p>` : ''}</div>${actions ? `<div class="heading-actions">${actions}</div>` : ''}</header>`;
  }

  function renderDashboard() {
    const groups = trainingGroups(), allEvents = events(), future = allEvents.filter(item => parseDate(item.date) >= new Date(new Date().toDateString()));
    const media = mediaFiles();
    els.workspace.innerHTML = `${pageHeading('Panel projektu', 'Dzień dobry', 'Wszystkie najważniejsze elementy strony w jednym miejscu.')}
      <section class="stats-grid">
        <button class="stat-card" data-go="trainings"><span class="stat-icon">${icon('book')}</span><strong>${groups.length}</strong><span>szkoleń w ofercie</span></button>
        <button class="stat-card" data-go="calendar"><span class="stat-icon">${icon('calendar')}</span><strong>${future.length}</strong><span>nadchodzących terminów</span></button>
        <button class="stat-card" data-go="pages"><span class="stat-icon">${icon('page')}</span><strong>${availablePages().length}</strong><span>stron do edycji</span></button>
        <button class="stat-card" data-go="media"><span class="stat-icon">${icon('image')}</span><strong>${media.length}</strong><span>plików multimedialnych</span></button>
      </section>
      <section class="dashboard-grid">
        <article class="panel"><div class="panel-head"><div><span class="eyebrow">Najbliższe terminy</span><h2>Kalendarz szkoleń</h2></div><button class="text-button" data-go="calendar">Zobacz wszystkie ${icon('arrow')}</button></div>
          <div class="event-list">${future.slice(0, 5).map(item => `<button class="event-row" data-event="${escapeHtml(item.id)}"><time><strong>${String(parseDate(item.date)?.getDate() || '').padStart(2, '0')}</strong><span>${parseDate(item.date)?.toLocaleString('pl-PL', { month: 'short' }) || ''}</span></time><span><strong>${escapeHtml(item.shortTitle || item.title)}</strong><small>${escapeHtml(item.time || '')}${item.place ? ` · ${escapeHtml(item.place)}` : ''}</small></span><span class="status ${item.open === false ? 'status--muted' : ''}">${item.open === false ? 'zamknięte' : 'zapisy'}</span></button>`).join('') || '<p class="empty">Brak nadchodzących terminów.</p>'}</div>
        </article>
        <article class="panel quick-panel"><span class="eyebrow">Szybkie działania</span><h2>Co chcesz zmienić?</h2>
          <button class="quick-action" data-go="trainings">${icon('edit')}<span><strong>Opis szkolenia</strong><small>Tytuł, opis, odbiorcy i grafika</small></span>${icon('arrow')}</button>
          <button class="quick-action" data-action="new-event">${icon('plus')}<span><strong>Dodaj termin</strong><small>Uzupełnij datę i informacje o zapisach</small></span>${icon('arrow')}</button>
          <button class="quick-action" data-go="pages">${icon('page')}<span><strong>Treść strony</strong><small>Edytuj nagłówki i akapity</small></span>${icon('arrow')}</button>
          <button class="quick-action" data-go="media">${icon('image')}<span><strong>Dodaj plik</strong><small>Grafika, film albo dokument</small></span>${icon('arrow')}</button>
        </article>
      </section>`;
    $$('[data-go]', els.workspace).forEach(node => node.onclick = () => navigate(node.dataset.go));
    $$('[data-event]', els.workspace).forEach(node => node.onclick = () => { state.selectedEvent = node.dataset.event; navigate('calendar'); });
    $('[data-action="new-event"]', els.workspace).onclick = () => { state.selectedEvent = null; navigate('calendar'); };
  }

  function renderTrainings() {
    const groups = trainingGroups(); if (!state.selectedTraining && groups[0]) state.selectedTraining = groups[0].key;
    const group = selectedGroup(), item = group?.item || {};
    els.workspace.innerHTML = `${pageHeading('Treści', 'Szkolenia', 'Zmieniaj opisy widoczne na stronie zapisów.', `<button class="button button--secondary" id="addTraining">${icon('plus')} Dodaj szkolenie</button>`)}
      <div class="editor-layout">
        <aside class="record-list"><div class="list-search">${icon('search')}<input id="trainingSearch" type="search" placeholder="Szukaj szkolenia"></div><div id="trainingItems">${trainingListHtml(groups)}</div></aside>
        <section class="editor-panel">${group ? trainingFormHtml(item, group.count) : '<div class="empty-state"><h2>Brak szkoleń</h2><p>Dodaj pierwsze szkolenie do oferty.</p></div>'}</section>
        <aside class="preview-panel">${trainingPreviewHtml(item, group?.count || 0)}</aside>
      </div>`;
    $('#addTraining').onclick = addTraining;
    $('#trainingSearch').oninput = event => { $('#trainingItems').innerHTML = trainingListHtml(groups.filter(g => (g.item.title || '').toLowerCase().includes(event.target.value.toLowerCase()))); bindTrainingList(); };
    bindTrainingList(); if (group) bindTrainingForm(group);
  }
  function trainingListHtml(groups) {
    return groups.map((group, index) => `<button class="record-item ${group.key === state.selectedTraining ? 'is-active' : ''}" data-training="${escapeHtml(group.key)}"><span class="record-index">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(group.item.shortTitle || group.item.title || 'Bez tytułu')}</strong><small>${group.count} ${group.count === 1 ? 'termin' : 'terminów'}</small></span>${icon('arrow')}</button>`).join('') || '<p class="empty">Nie znaleziono szkoleń.</p>';
  }
  function bindTrainingList() { $$('[data-training]', els.workspace).forEach(node => node.onclick = () => { state.selectedTraining = node.dataset.training; renderTrainings(); }); }
  function trainingFormHtml(item, count) {
    return `<div class="editor-title"><div><span class="eyebrow">Edycja szkolenia</span><h2>${escapeHtml(item.shortTitle || item.title || 'Nowe szkolenie')}</h2></div><span class="status">${count} ${count === 1 ? 'termin' : 'terminów'}</span></div>
      <form id="trainingForm" class="form-stack">
        <label>Pełna nazwa<input name="title" value="${escapeHtml(item.title || '')}" required></label>
        <div class="field-grid"><label>Krótka nazwa<input name="shortTitle" value="${escapeHtml(item.shortTitle || '')}"></label><label>Kolor szkolenia<input name="color" type="color" value="${escapeHtml(/^#[0-9a-f]{6}$/i.test(item.color || '') ? item.color : '#16877f')}"></label></div>
        <label>Wprowadzenie<textarea name="description" rows="5">${escapeHtml(descriptionPart(item, 0))}</textarea><small>Krótko wyjaśnij, czego uczestnik nauczy się podczas szkolenia.</small></label>
        <label>Drugi akapit<textarea name="description2" rows="5">${escapeHtml(descriptionPart(item, 1))}</textarea></label>
        <label>Dla kogo jest szkolenie?<textarea name="audience" rows="3">${escapeHtml(item.audience || '')}</textarea></label>
        <label>Źródło lub autor materiału<input name="source" value="${escapeHtml(item.source || '')}"></label>
        <label>Grafika lub film<div class="media-field"><input name="image" value="${escapeHtml(item.image || item.video || '')}" placeholder="grafiki/nazwa.webp"><button type="button" class="button button--small button--secondary" id="chooseMedia">Wybierz</button></div></label>
        <div class="form-actions"><button type="button" class="button button--ghost" id="duplicateTraining">Duplikuj</button><button class="button button--primary">${icon('check')} Zapisz zmiany</button></div>
      </form>`;
  }
  function trainingPreviewHtml(item, count) {
    return `<div class="preview-head"><span class="eyebrow">Podgląd karty</span><span class="preview-dot">na żywo</span></div><article class="training-preview"><div class="preview-media" id="trainingMediaPreview">${icon('image')}</div><div class="preview-content"><span class="preview-label">Szkolenie</span><h3>${escapeHtml(item.title || 'Nazwa szkolenia')}</h3><p>${escapeHtml(descriptionPart(item, 0) || 'Tutaj pojawi się krótki opis szkolenia.')}</p><div class="preview-meta"><span>${icon('calendar')} ${count} ${count === 1 ? 'termin' : 'terminów'}</span><span>${icon('users')} ${escapeHtml(item.audience || 'dla uczestników')}</span></div><span class="fake-button">Sprawdź terminy ${icon('arrow')}</span></div></article><p class="preview-note">Tak karta będzie wyglądała w ofercie. Układ strony może nieznacznie różnić się zależnie od szerokości ekranu.</p>`;
  }
  async function updateTrainingMediaPreview(path) {
    const box = $('#trainingMediaPreview'); if (!box) return;
    const file = state.zip.file(pathInZip(path));
    if (!file) { box.innerHTML = icon('image'); return; }
    const blob = await file.async('blob'); const url = blobUrl(blob);
    if (/\.(mp4|webm|mov)$/i.test(path)) box.innerHTML = `<video src="${url}" muted></video>`;
    else box.innerHTML = `<img src="${url}" alt="">`;
  }
  function bindTrainingForm(group) {
    const form = $('#trainingForm'); updateTrainingMediaPreview(form.elements.image.value);
    form.oninput = () => {
      const preview = $('.training-preview'); if (!preview) return;
      $('h3', preview).textContent = form.elements.title.value || 'Nazwa szkolenia';
      $('p', preview).textContent = form.elements.description.value || 'Tutaj pojawi się krótki opis szkolenia.';
    };
    form.elements.image.onchange = () => updateTrainingMediaPreview(form.elements.image.value);
    form.onsubmit = event => {
      event.preventDefault(); const values = Object.fromEntries(new FormData(form));
      const description = [values.description, values.description2].filter(Boolean); delete values.description2;
      state.data.trainings.forEach(item => { if (trainingKey(item) === group.key) Object.assign(item, values, { description }); });
      const nextKey = trainingKey({ ...group.item, ...values }); state.selectedTraining = nextKey;
      markDirty(); toast('Opis szkolenia zapisano.'); renderTrainings();
    };
    $('#duplicateTraining').onclick = () => duplicateTraining(group.item);
    $('#chooseMedia').onclick = () => openMediaPicker(path => { form.elements.image.value = path; updateTrainingMediaPreview(path); });
  }
  function addTraining() {
    const seed = { id: `nowe-${Date.now()}`, series: `nowe-${Date.now()}`, title: 'Nowe szkolenie', shortTitle: 'Nowe szkolenie', description: ['', ''], audience: '', color: '#16877f', date: '', time: '09:00 - 14:15', open: false };
    state.data.trainings.push(seed); state.selectedTraining = trainingKey(seed); markDirty(); renderTrainings();
  }
  function duplicateTraining(item) {
    const copy = structuredClone(item); const stamp = Date.now(); copy.id = `${slugify(item.shortTitle || item.title)}-kopia-${stamp}`; copy.series = `${trainingKey(item)}-kopia-${stamp}`; copy.title = `${item.title || 'Szkolenie'} – kopia`; copy.shortTitle = `${item.shortTitle || 'Szkolenie'} – kopia`; copy.date = ''; copy.open = false;
    state.data.trainings.push(copy); state.selectedTraining = copy.series; markDirty(); toast('Utworzono kopię szkolenia.'); renderTrainings();
  }

  function renderCalendar() {
    const list = events(); let item = list.find(event => event.id === state.selectedEvent);
    if (!item && state.selectedEvent !== null) item = list[0];
    els.workspace.innerHTML = `${pageHeading('Organizacja', 'Kalendarz i zapisy', 'Dodawaj terminy oraz kontroluj dostępność zapisów.', `<button class="button button--primary" id="addEvent">${icon('plus')} Dodaj termin</button>`)}
      <div class="calendar-layout"><section class="panel calendar-list"><div class="panel-head"><div><span class="eyebrow">Wszystkie terminy</span><h2>${list.length} wydarzeń</h2></div></div><div class="table-wrap"><table><thead><tr><th>Data</th><th>Szkolenie</th><th>Godziny</th><th>Status</th></tr></thead><tbody>${list.map(event => `<tr data-event="${escapeHtml(event.id)}" class="${event.id === item?.id ? 'is-active' : ''}"><td><strong>${escapeHtml(formatDate(event.date))}</strong></td><td>${escapeHtml(event.shortTitle || event.title)}</td><td>${escapeHtml(event.time || '—')}</td><td><span class="status ${event.open === false ? 'status--muted' : ''}">${event.open === false ? 'zamknięte' : 'zapisy'}</span></td></tr>`).join('') || '<tr><td colspan="4" class="empty">Brak terminów.</td></tr>'}</tbody></table></div></section>
        <aside class="panel event-editor">${eventFormHtml(item)}</aside></div>`;
    $('#addEvent').onclick = () => { state.selectedEvent = null; renderCalendar(); };
    $$('tr[data-event]', els.workspace).forEach(row => row.onclick = () => { state.selectedEvent = row.dataset.event; renderCalendar(); });
    bindEventForm(item);
  }
  function eventFormHtml(item) {
    const groups = trainingGroups(); const selectedKey = item ? trainingKey(item) : (state.selectedTraining || groups[0]?.key);
    return `<div class="editor-title"><div><span class="eyebrow">${item ? 'Edycja terminu' : 'Nowy termin'}</span><h2>${item ? escapeHtml(item.shortTitle || item.title) : 'Dodaj wydarzenie'}</h2></div></div><form id="eventForm" class="form-stack">
      <label>Szkolenie<select name="series" ${item ? 'disabled' : ''}>${groups.map(group => `<option value="${escapeHtml(group.key)}" ${group.key === selectedKey ? 'selected' : ''}>${escapeHtml(group.item.shortTitle || group.item.title)}</option>`).join('')}</select></label>
      <div class="field-grid"><label>Data<input type="date" name="date" value="${escapeHtml(item?.date || '')}" required></label><label>Godziny<input name="time" value="${escapeHtml(item?.time || '09:00 - 14:15')}"></label></div>
      <label>Miejsce lub forma<input name="place" value="${escapeHtml(item?.place || '')}" placeholder="np. online lub Katowice"></label>
      <label>Link do formularza<input type="url" name="link" value="${escapeHtml(item?.link || '')}" placeholder="https://..."></label>
      <label class="toggle-row"><span><strong>Zapisy otwarte</strong><small>Termin będzie można wybrać na stronie zapisów.</small></span><input type="checkbox" name="open" ${item?.open !== false ? 'checked' : ''}></label>
      <label class="toggle-row"><span><strong>Brak wolnych miejsc</strong><small>Pokaż uczestnikom informację o zamknięciu zapisów.</small></span><input type="checkbox" name="registrationClosed" ${item?.registrationClosed ? 'checked' : ''}></label>
      <div class="form-actions">${item ? '<button type="button" class="button button--danger" id="deleteEvent">Usuń</button>' : ''}<button class="button button--primary">${icon('check')} ${item ? 'Zapisz termin' : 'Dodaj termin'}</button></div></form>`;
  }
  function bindEventForm(item) {
    const form = $('#eventForm'); if (!form) return;
    form.onsubmit = event => {
      event.preventDefault(); const raw = Object.fromEntries(new FormData(form)); raw.open = form.elements.open.checked; raw.registrationClosed = form.elements.registrationClosed.checked;
      if (item) Object.assign(item, raw);
      else {
        const group = trainingGroups().find(g => g.key === raw.series); if (!group) return;
        const copy = structuredClone(group.item); const idBase = `${slugify(group.key)}-${raw.date}`; let id = idBase, n = 2;
        while (state.data.trainings.some(entry => entry.id === id)) id = `${idBase}-${n++}`;
        Object.assign(copy, raw, { id, series: group.key }); state.data.trainings.push(copy); state.selectedEvent = id;
      }
      markDirty(); toast('Termin został zapisany.'); renderCalendar();
    };
    const deleteButton = $('#deleteEvent'); if (deleteButton) deleteButton.onclick = async () => {
      if (!await confirmDialog('Usunąć termin?', `<p>Termin <strong>${escapeHtml(formatDate(item.date))}</strong> zniknie z kalendarza po eksporcie projektu.</p>`, 'Usuń termin')) return;
      state.data.trainings = state.data.trainings.filter(entry => entry !== item); state.selectedEvent = events()[0]?.id || null; markDirty(); toast('Termin usunięto.'); renderCalendar();
    };
  }

  async function getPageDoc(path) {
    if (state.pageDocs.has(path)) return state.pageDocs.get(path);
    const html = await readText(path); const doc = new DOMParser().parseFromString(html, 'text/html'); state.pageDocs.set(path, doc); return doc;
  }
  function editableBlocks(doc) {
    const main = doc.querySelector('main') || doc.body;
    return $$('h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption', main).filter(node => !node.closest('script,style,noscript,nav,footer') && stripHtml(node.innerHTML).length > 1);
  }
  function selectedOption(value, expected) { return String(value || '') === String(expected) ? 'selected' : ''; }
  function checked(value) { return value ? 'checked' : ''; }
  function colorToHex(value, fallback) {
    if (/^#[0-9a-f]{6}$/i.test(value || '')) return value;
    if (/^#[0-9a-f]{3}$/i.test(value || '')) return `#${value.slice(1).split('').map(char => char + char).join('')}`;
    const channels = String(value || '').match(/[\d.]+/g)?.slice(0, 3).map(Number);
    return channels?.length === 3 ? `#${channels.map(channel => Math.max(0, Math.min(255, channel)).toString(16).padStart(2, '0')).join('')}` : fallback;
  }
  function knownFont(value) {
    const font = String(value || '').toLowerCase();
    if (font.includes('georgia')) return "Georgia, 'Times New Roman', serif";
    if (font.includes('times new roman')) return "'Times New Roman', Times, serif";
    if (font.includes('verdana')) return 'Verdana, Geneva, sans-serif';
    if (font.includes('arial')) return 'Arial, Helvetica, sans-serif';
    return 'default';
  }
  function blockFormat(node) {
    const style = node.style;
    return {
      align: style.textAlign || 'default',
      width: node.dataset.cmsWidth || 'default',
      font: knownFont(style.fontFamily),
      size: parseInt(style.fontSize, 10) || '',
      weight: style.fontWeight || 'default',
      lineHeight: style.lineHeight || 'default',
      textColor: colorToHex(style.color, '#17252a'),
      textColorEnabled: Boolean(style.color),
      backgroundColor: colorToHex(style.backgroundColor, '#ffffff'),
      backgroundColorEnabled: Boolean(style.backgroundColor),
      marginTop: parseInt(style.marginTop, 10) || 0,
      marginBottom: parseInt(style.marginBottom, 10) || 0,
      padding: parseInt(style.padding, 10) || 0
    };
  }
  function formatPanelHtml(format) {
    return `<section class="format-panel" aria-labelledby="formatTitle">
      <div class="format-panel__head"><div><span class="eyebrow">Wygląd fragmentu</span><h3 id="formatTitle">Układ i typografia</h3></div><button type="button" class="text-button" id="resetFormat">Przywróć domyślne</button></div>
      <div class="format-section"><span class="format-label">Wyrównanie tekstu</span><div class="segmented" role="group" aria-label="Wyrównanie tekstu">
        <button type="button" data-align="left" class="${format.align === 'left' || format.align === 'default' ? 'is-active' : ''}" title="Do lewej">${icon('align-left')}<span>Lewo</span></button>
        <button type="button" data-align="center" class="${format.align === 'center' ? 'is-active' : ''}" title="Wyśrodkuj">${icon('align-center')}<span>Środek</span></button>
        <button type="button" data-align="right" class="${format.align === 'right' ? 'is-active' : ''}" title="Do prawej">${icon('align-right')}<span>Prawo</span></button>
        <button type="button" data-align="justify" class="${format.align === 'justify' ? 'is-active' : ''}" title="Od krawędzi do krawędzi">${icon('align-justify')}<span>Justuj</span></button>
      </div></div>
      <div class="format-grid">
        <label>Szerokość bloku<select id="blockWidth"><option value="default" ${selectedOption(format.width, 'default')}>Domyślna strony</option><option value="narrow" ${selectedOption(format.width, 'narrow')}>Wąska - 52 znaki</option><option value="reading" ${selectedOption(format.width, 'reading')}>Czytelna - 70 znaków</option><option value="wide" ${selectedOption(format.width, 'wide')}>Szeroka - 1100 px</option><option value="full" ${selectedOption(format.width, 'full')}>Pełna szerokość kolumny</option></select></label>
        <label>Krój pisma<select id="fontFamily"><option value="default" ${selectedOption(format.font, 'default')}>Domyślny strony</option><option value="Arial, Helvetica, sans-serif" ${selectedOption(format.font, 'Arial, Helvetica, sans-serif')}>Arial</option><option value="Verdana, Geneva, sans-serif" ${selectedOption(format.font, 'Verdana, Geneva, sans-serif')}>Verdana</option><option value="Georgia, 'Times New Roman', serif" ${selectedOption(format.font, "Georgia, 'Times New Roman', serif")}>Georgia</option><option value="'Times New Roman', Times, serif" ${selectedOption(format.font, "'Times New Roman', Times, serif")}>Times New Roman</option></select></label>
        <label>Rozmiar tekstu <span class="field-unit">px</span><input id="fontSize" type="number" min="12" max="96" step="1" value="${format.size}" placeholder="domyślny"></label>
        <label>Grubość<select id="fontWeight"><option value="default" ${selectedOption(format.weight, 'default')}>Domyślna</option><option value="400" ${selectedOption(format.weight, '400')}>Zwykła</option><option value="500" ${selectedOption(format.weight, '500')}>Średnia</option><option value="600" ${selectedOption(format.weight, '600')}>Półgruba</option><option value="700" ${selectedOption(format.weight, '700')}>Gruba</option><option value="800" ${selectedOption(format.weight, '800')}>Bardzo gruba</option></select></label>
        <label>Interlinia<select id="lineHeight"><option value="default" ${selectedOption(format.lineHeight, 'default')}>Domyślna</option><option value="1.2" ${selectedOption(format.lineHeight, '1.2')}>Zwarta</option><option value="1.4" ${selectedOption(format.lineHeight, '1.4')}>Standardowa</option><option value="1.6" ${selectedOption(format.lineHeight, '1.6')}>Wygodna</option><option value="1.8" ${selectedOption(format.lineHeight, '1.8')}>Luźna</option></select></label>
        <label>Odstęp nad <span class="field-unit">px</span><input id="marginTop" type="number" min="0" max="160" step="4" value="${format.marginTop}"></label>
        <label>Odstęp pod <span class="field-unit">px</span><input id="marginBottom" type="number" min="0" max="160" step="4" value="${format.marginBottom}"></label>
        <label>Wewnętrzny odstęp <span class="field-unit">px</span><input id="blockPadding" type="number" min="0" max="80" step="4" value="${format.padding}"></label>
      </div>
      <div class="color-grid">
        <label class="color-control"><span><input id="textColorEnabled" type="checkbox" ${checked(format.textColorEnabled)}> Własny kolor tekstu</span><input id="textColor" type="color" value="${escapeHtml(format.textColor)}"></label>
        <label class="color-control"><span><input id="backgroundColorEnabled" type="checkbox" ${checked(format.backgroundColorEnabled)}> Tło fragmentu</span><input id="backgroundColor" type="color" value="${escapeHtml(format.backgroundColor)}"></label>
      </div>
      <p class="format-help">Zmiany widać od razu w podglądzie. Zostaną zapisane w stronie po kliknięciu „Zapisz fragment”.</p>
    </section>`;
  }
  function applyFormatFromControls(target) {
    const value = id => $(`#${id}`)?.value;
    const style = target.style;
    const setStyle = (property, nextValue) => nextValue ? style.setProperty(property, nextValue, 'important') : style.removeProperty(property);
    const align = $('.segmented [data-align].is-active')?.dataset.align || 'left';
    setStyle('text-align', align === 'left' ? 'left' : align);
    setStyle('font-family', value('fontFamily') === 'default' ? '' : value('fontFamily'));
    setStyle('font-size', value('fontSize') ? `${Math.max(12, Math.min(96, Number(value('fontSize'))))}px` : '');
    setStyle('font-weight', value('fontWeight') === 'default' ? '' : value('fontWeight'));
    setStyle('line-height', value('lineHeight') === 'default' ? '' : value('lineHeight'));
    setStyle('color', $('#textColorEnabled')?.checked ? value('textColor') : '');
    setStyle('background-color', $('#backgroundColorEnabled')?.checked ? value('backgroundColor') : '');
    setStyle('margin-top', Number(value('marginTop')) ? `${Number(value('marginTop'))}px` : '');
    setStyle('margin-bottom', Number(value('marginBottom')) ? `${Number(value('marginBottom'))}px` : '');
    setStyle('padding', Number(value('blockPadding')) ? `${Number(value('blockPadding'))}px` : '');
    setStyle('box-sizing', Number(value('blockPadding')) ? 'border-box' : '');
    const width = value('blockWidth') || 'default';
    delete target.dataset.cmsReset;
    target.dataset.cmsWidth = width;
    setStyle('width', width === 'default' ? '' : '100%');
    setStyle('max-width', width === 'narrow' ? '52ch' : width === 'reading' ? '70ch' : width === 'wide' ? '1100px' : width === 'full' ? 'none' : '');
    setStyle('margin-left', ['narrow', 'reading', 'wide'].includes(width) ? 'auto' : '');
    setStyle('margin-right', ['narrow', 'reading', 'wide'].includes(width) ? 'auto' : '');
    if (width === 'default') delete target.dataset.cmsWidth;
  }
  function protectShortWords(root) {
    if (!root) return;
    const pattern = /(^|[\s([{„“"'])([aAiIoOuUwWzZ])[ \t]+(?=\S)/g;
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('script,style,noscript,textarea,pre,code,[contenteditable="true"],[data-no-polish-spacing]')) continue;
      node.nodeValue = node.nodeValue.replace(pattern, '$1$2\u00a0');
    }
  }
  async function renderPages() {
    const pages = availablePages(); if (!state.selectedPage && pages[0]) state.selectedPage = pages[0][0];
    els.workspace.innerHTML = `${pageHeading('Treści', 'Edycja stron', 'Kliknij fragment tekstu, aby zmienić go bez pracy w kodzie.')}
      <div class="pages-layout"><aside class="page-list">${pages.map(([path, label]) => `<button data-page="${path}" class="${path === state.selectedPage ? 'is-active' : ''}">${icon('page')}<span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(path)}</small></span>${icon('arrow')}</button>`).join('')}</aside><section class="panel page-editor"><div class="loading"><span class="spinner"></span>Wczytywanie strony…</div></section><aside class="panel page-preview"><div class="preview-head"><span class="eyebrow">Podgląd strony</span><button class="icon-button" id="refreshPreview" title="Odśwież">${icon('refresh')}</button></div><iframe id="pageFrame" title="Podgląd strony"></iframe></aside></div>`;
    $$('[data-page]', els.workspace).forEach(node => node.onclick = () => { state.selectedPage = node.dataset.page; state.selectedBlock = 0; renderPages(); });
    if (!state.selectedPage) return;
    const doc = await getPageDoc(state.selectedPage), blocks = editableBlocks(doc); renderPageEditor(doc, blocks); updatePagePreview(doc);
  }
  function renderPageEditor(doc, blocks) {
    const panel = $('.page-editor'); const selected = blocks[state.selectedBlock] || blocks[0];
    const format = selected ? blockFormat(selected) : null;
    panel.innerHTML = `<div class="editor-title"><div><span class="eyebrow">Fragmenty strony</span><h2>${escapeHtml(PUBLIC_PAGES.find(([path]) => path === state.selectedPage)?.[1] || state.selectedPage)}</h2></div><span class="status">${blocks.length} elementów</span></div><div class="block-list">${blocks.map((node, index) => `<button data-block="${index}" class="${index === state.selectedBlock ? 'is-active' : ''}"><span>${node.tagName}</span><strong>${escapeHtml(stripHtml(node.innerHTML).slice(0, 88))}</strong></button>`).join('')}</div>${selected ? `<div class="rich-editor"><div class="editor-toolbar" aria-label="Formatowanie zaznaczonego tekstu"><button type="button" data-command="bold" title="Pogrubienie"><strong>B</strong></button><button type="button" data-command="italic" title="Kursywa"><em>I</em></button><button type="button" data-command="underline" title="Podkreślenie">${icon('underline')}</button><span class="toolbar-divider"></span><button type="button" data-command="createLink" title="Dodaj link">${icon('link')}</button><button type="button" data-command="unlink" title="Usuń link">${icon('unlink')}</button></div><div id="richText" contenteditable="true" spellcheck="true" style="${escapeHtml(selected.getAttribute('style') || '')}"${selected.dataset.cmsWidth ? ` data-cms-width="${escapeHtml(selected.dataset.cmsWidth)}"` : ''}>${selected.innerHTML}</div>${formatPanelHtml(format)}<div class="form-actions form-actions--sticky"><span class="unsaved-note" id="blockState">Wybierz ustawienia i sprawdź podgląd</span><button class="button button--primary" id="saveBlock">${icon('check')} Zapisz fragment</button></div></div>` : '<p class="empty">Na tej stronie nie znaleziono prostych bloków tekstu.</p>'}`;
    $$('[data-block]', panel).forEach(node => node.onclick = () => { state.selectedBlock = Number(node.dataset.block); renderPageEditor(doc, blocks); });
    $$('[data-command]', panel).forEach(button => button.onclick = () => { const command = button.dataset.command; const value = command === 'createLink' ? prompt('Podaj adres linku:', 'https://') : null; if (command !== 'createLink' || value) document.execCommand(command, false, value); $('#richText').focus(); setTimeout(previewDraft, 0); });
    const richText = $('#richText');
    const previewDraft = () => { applyFormatFromControls(richText); $('#blockState').textContent = 'Zmiany oczekują na zapis'; updatePagePreview(doc, richText); };
    richText?.addEventListener('input', previewDraft);
    $$('.format-panel input,.format-panel select', panel).forEach(control => control.addEventListener('input', previewDraft));
    $$('[data-align]', panel).forEach(button => button.onclick = () => { $$('[data-align]', panel).forEach(item => item.classList.toggle('is-active', item === button)); previewDraft(); });
    const reset = $('#resetFormat'); if (reset) reset.onclick = () => {
      richText.removeAttribute('style'); delete richText.dataset.cmsWidth; richText.dataset.cmsReset = 'true';
      $('#blockWidth').value = 'default'; $('#fontFamily').value = 'default'; $('#fontSize').value = '';
      $('#fontWeight').value = 'default'; $('#lineHeight').value = 'default'; $('#marginTop').value = 0;
      $('#marginBottom').value = 0; $('#blockPadding').value = 0; $('#textColorEnabled').checked = false; $('#backgroundColorEnabled').checked = false;
      $$('[data-align]', panel).forEach(item => item.classList.toggle('is-active', item.dataset.align === 'left'));
      $('#blockState').textContent = 'Domyślne ustawienia oczekują na zapis'; updatePagePreview(doc, richText);
      toast('Przywrócono domyślne ustawienia. Kliknij „Zapisz fragment”, aby je zachować.');
    };
    const save = $('#saveBlock'); if (save) save.onclick = () => {
      if (richText.dataset.cmsReset === 'true') { richText.removeAttribute('style'); delete richText.dataset.cmsWidth; delete richText.dataset.cmsReset; }
      else applyFormatFromControls(richText);
      selected.innerHTML = richText.innerHTML;
      if (richText.getAttribute('style')) selected.setAttribute('style', richText.getAttribute('style')); else selected.removeAttribute('style');
      if (richText.dataset.cmsWidth) selected.dataset.cmsWidth = richText.dataset.cmsWidth; else delete selected.dataset.cmsWidth;
      state.changedPages.add(state.selectedPage); markDirty(); updatePagePreview(doc); toast('Treść i wygląd fragmentu zapisano.'); const nextBlocks = editableBlocks(doc); renderPageEditor(doc, nextBlocks);
    };
  }
  function updatePagePreview(doc, draft = null) {
    const clone = doc.cloneNode(true); $$('script', clone).forEach(node => node.remove());
    if (draft) {
      const target = editableBlocks(clone)[state.selectedBlock];
      if (target) {
        target.innerHTML = draft.innerHTML;
        if (draft.getAttribute('style')) target.setAttribute('style', draft.getAttribute('style')); else target.removeAttribute('style');
        if (draft.dataset.cmsWidth) target.dataset.cmsWidth = draft.dataset.cmsWidth; else delete target.dataset.cmsWidth;
      }
    }
    protectShortWords(clone.body);
    let base = clone.querySelector('base'); if (!base) { base = clone.createElement('base'); clone.head.prepend(base); } base.href = '../';
    const frame = $('#pageFrame'); if (frame) frame.srcdoc = '<!doctype html>\n' + clone.documentElement.outerHTML;
  }

  function renderMedia() {
    const files = mediaFiles(); if (!state.selectedMedia || !files.includes(state.selectedMedia)) state.selectedMedia = files[0] || null;
    const selected = state.selectedMedia;
    els.workspace.innerHTML = `${pageHeading('Pliki', 'Biblioteka mediów', 'Zarządzaj grafikami i filmami używanymi na stronie.', `<label class="button button--primary upload-button">${icon('upload')} Dodaj pliki<input id="mediaUpload" type="file" multiple accept="image/*,video/*,.pdf"></label>`)}
      <div class="media-layout"><section class="panel media-browser"><div class="list-search">${icon('search')}<input id="mediaSearch" type="search" placeholder="Szukaj pliku"></div><div class="media-grid" id="mediaGrid">${mediaGridHtml(files)}</div></section><aside class="panel media-details" id="mediaDetails">${selected ? '<div class="loading"><span class="spinner"></span></div>' : '<div class="empty-state"><h2>Brak plików</h2><p>Dodaj pierwszą grafikę lub film.</p></div>'}</aside></div>`;
    bindMediaItems(); $('#mediaSearch').oninput = event => { const term = event.target.value.toLowerCase(); $('#mediaGrid').innerHTML = mediaGridHtml(files.filter(path => path.toLowerCase().includes(term))); bindMediaItems(); };
    $('#mediaUpload').onchange = event => addMediaFiles([...event.target.files]); if (selected) renderMediaDetails(selected);
  }
  function mediaGridHtml(files) {
    return files.map(path => `<button class="media-item ${path === state.selectedMedia ? 'is-active' : ''}" data-media="${escapeHtml(path)}"><span class="media-thumb">${/\.(png|jpe?g|webp|gif|svg)$/i.test(path) ? icon('image') : /\.(mp4|webm|mov)$/i.test(path) ? icon('play') : icon('page')}</span><span><strong>${escapeHtml(path.split('/').pop())}</strong><small>${escapeHtml(path.split('/').slice(0, -1).join('/'))}</small></span></button>`).join('') || '<p class="empty">Nie znaleziono plików.</p>';
  }
  function bindMediaItems() { $$('[data-media]', els.workspace).forEach(node => node.onclick = () => { state.selectedMedia = node.dataset.media; renderMedia(); }); }
  async function renderMediaDetails(path) {
    const file = state.zip.file(pathInZip(path)); if (!file) return;
    const blob = await file.async('blob'), url = blobUrl(blob), ext = fileExt(path); const size = blob.size;
    let preview = icon('page');
    if (['png','jpg','jpeg','webp','gif','svg'].includes(ext)) preview = `<img src="${url}" alt="">`;
    else if (['mp4','webm','mov'].includes(ext)) preview = `<video src="${url}" controls></video>`;
    else if (ext === 'pdf') preview = `<iframe src="${url}" title="Podgląd PDF"></iframe>`;
    $('#mediaDetails').innerHTML = `<div class="media-preview">${preview}</div><span class="eyebrow">Wybrany plik</span><h2>${escapeHtml(path.split('/').pop())}</h2><dl><div><dt>Ścieżka</dt><dd>${escapeHtml(path)}</dd></div><div><dt>Rozmiar</dt><dd>${(size / 1024 / 1024).toFixed(2)} MB</dd></div><div><dt>Typ</dt><dd>${escapeHtml(ext.toUpperCase())}</dd></div></dl><div class="form-actions"><button class="button button--ghost" id="copyMedia">Kopiuj ścieżkę</button><button class="button button--danger" id="deleteMedia">Usuń plik</button></div>`;
    $('#copyMedia').onclick = async () => { await navigator.clipboard.writeText(path); toast('Skopiowano ścieżkę.'); };
    $('#deleteMedia').onclick = async () => { if (!await confirmDialog('Usunąć plik?', `<p>Plik <strong>${escapeHtml(path)}</strong> zostanie pominięty w nowym ZIP-ie. Upewnij się, że żadna strona już go nie używa.</p>`, 'Usuń plik')) return; state.zip.remove(pathInZip(path)); state.selectedMedia = null; state.fileCount -= 1; markDirty(); updateChrome(); renderMedia(); toast('Plik usunięto.'); };
  }
  async function addMediaFiles(files) {
    for (const file of files) {
      const folder = file.type.startsWith('video/') ? 'videos/cms' : file.type === 'application/pdf' ? 'pliki/cms' : 'grafiki/cms';
      let name = file.name.replace(/[^a-zA-Z0-9._-]/g, '-'), path = `${folder}/${name}`, n = 2;
      while (state.zip.file(pathInZip(path))) { const dot = name.lastIndexOf('.'); const stem = dot > -1 ? name.slice(0, dot) : name, ext = dot > -1 ? name.slice(dot) : ''; path = `${folder}/${stem}-${n++}${ext}`; }
      state.zip.file(pathInZip(path), await file.arrayBuffer()); state.fileCount += 1; state.selectedMedia = path;
    }
    markDirty(); updateChrome(); renderMedia(); toast(`Dodano ${files.length} ${files.length === 1 ? 'plik' : 'pliki'}.`);
  }
  function openMediaPicker(onSelect) {
    const files = mediaFiles().filter(path => /\.(png|jpe?g|webp|gif|svg|mp4|webm|mov)$/i.test(path));
    els.modalTitle.textContent = 'Wybierz grafikę lub film'; els.modalBody.innerHTML = `<div class="picker-grid">${files.map(path => `<button data-pick="${escapeHtml(path)}">${/\.(mp4|webm|mov)$/i.test(path) ? icon('play') : icon('image')}<span>${escapeHtml(path.split('/').pop())}</span></button>`).join('') || '<p class="empty">Brak dostępnych plików.</p>'}</div>`; els.modalCancel.hidden = false; els.modalConfirm.hidden = true; els.modal.hidden = false;
    $$('[data-pick]', els.modalBody).forEach(button => button.onclick = () => { onSelect(button.dataset.pick); closeModal(); }); els.modalCancel.onclick = closeModal;
  }

  function renderSettings() {
    els.workspace.innerHTML = `${pageHeading('Projekt', 'Ustawienia eksportu', 'Zdecyduj, jak będzie nazywała się gotowa paczka.')}
      <div class="settings-layout"><form id="settingsForm" class="panel form-stack"><div class="editor-title"><div><span class="eyebrow">Dane i eksport</span><h2>Ustawienia projektu</h2></div></div><div class="field-grid"><label>Adres e-mail<input name="email" type="email" value="${escapeHtml(state.data.contact?.email || '')}"></label><label>Telefon<input name="phone" value="${escapeHtml(state.data.contact?.phone || '')}"></label></div><label>Nazwa projektu<input name="outputBase" value="${escapeHtml(state.settings.outputBase)}" required></label><label>Numer wersji<input name="version" type="number" min="1" step="1" value="${escapeHtml(state.settings.version)}" required></label><label>Metoda kompresji<select name="compression"><option value="DEFLATE" ${state.settings.compression === 'DEFLATE' ? 'selected' : ''}>Standardowa – mniejszy plik</option><option value="STORE" ${state.settings.compression === 'STORE' ? 'selected' : ''}>Bez kompresji – szybszy eksport</option></select></label><div class="output-example"><span>Gotowa nazwa</span><strong id="outputExample">${escapeHtml(outputFilename())}</strong></div><button class="button button--primary">${icon('check')} Zapisz ustawienia</button></form>
        <aside class="panel project-info"><span class="eyebrow">Wczytany projekt</span><h2>${escapeHtml(state.sourceName)}</h2><dl><div><dt>Źródło</dt><dd>${escapeHtml(state.sourceKind)}</dd></div><div><dt>Pliki</dt><dd>${state.fileCount}</dd></div><div><dt>Katalog główny</dt><dd>${escapeHtml(state.root || '(bez katalogu nadrzędnego)')}</dd></div><div><dt>Szkolenia</dt><dd>${trainingGroups().length}</dd></div><div><dt>Terminy</dt><dd>${events().length}</dd></div></dl><button class="button button--ghost" id="clearDraft">Usuń lokalną kopię roboczą</button></aside></div>`;
    const form = $('#settingsForm'); form.oninput = () => { $('#outputExample').textContent = `${form.elements.outputBase.value || 'projekt'}-V${form.elements.version.value || '1'}.zip`; };
    form.onsubmit = event => { event.preventDefault(); const values = Object.fromEntries(new FormData(form)); state.data.contact = { ...(state.data.contact || {}), email: values.email, phone: values.phone }; delete values.email; delete values.phone; state.settings = { ...state.settings, ...values, version: Number(values.version) }; markDirty(); toast('Ustawienia zapisano.'); renderSettings(); };
    $('#clearDraft').onclick = async () => { if (!await confirmDialog('Usunąć kopię roboczą?', '<p>Zmiany w bieżącym widoku pozostaną, ale po zamknięciu przeglądarki nie będzie można ich automatycznie przywrócić.</p>', 'Usuń kopię')) return; localStorage.removeItem(state.draftKey); toast('Lokalną kopię roboczą usunięto.'); };
  }
  function outputFilename() { return `${state.settings.outputBase || 'appcyber-main'}-V${state.settings.version || 1}.zip`; }

  function serializeData() {
    const json = JSON.stringify(state.data, null, 2) + '\n';
    state.zip.file(pathInZip('data/site-data.json'), json);
    state.zip.file(pathInZip('assets/site-data.js'), `window.portalSiteData = ${json.trim()};\n`);
    return json;
  }
  async function exportProject() {
    if (!state.zip) return; saveDraft(); setBusy('Tworzenie pełnej paczki ZIP');
    try {
      serializeData();
      for (const path of state.changedPages) {
        const doc = state.pageDocs.get(path); if (doc) state.zip.file(pathInZip(path), '<!doctype html>\n' + doc.documentElement.outerHTML);
      }
      const version = state.settings.version || 1;
      for (const path of ['zapisy.html', 'zapisy-kalendarz.html']) {
        const current = await readText(path); if (current) state.zip.file(pathInZip(path), current.replace(/(assets\/site-data\.js)(?:\?v=[^"']*)?/g, `$1?v=${version}`));
      }
      const blob = await state.zip.generateAsync({ type: 'blob', compression: state.settings.compression || 'DEFLATE', compressionOptions: { level: 6 }, streamFiles: true }, metadata => { const progress = $('#busyProgress'); if (progress) progress.value = metadata.percent; });
      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = outputFilename(); document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(link.href), 60000);
      closeModal(); state.dirty = false; updateChrome(); toast(`Gotowe: ${outputFilename()}`);
    } catch (error) { closeModal(); toast(error.message || 'Nie udało się utworzyć ZIP-u.', 'error'); }
  }

  els.openZipBtn.onclick = () => els.zipInput.click(); els.zipInput.onchange = event => event.target.files[0] && importZip(event.target.files[0]);
  els.openFolderBtn.onclick = openFolder; els.exportBtn.onclick = exportProject;
  function sendPreviewData() {
    if (!state.previewWindow || state.previewWindow.closed) return;
    state.previewWindow.postMessage({ type: 'ebg-cms-preview', data: structuredClone(state.data) }, '*');
  }
  function openLivePreview() {
    state.previewWindow = window.open('../zapisy.html?cmsPreview=1', 'ebgCmsPreview');
    if (!state.previewWindow) { toast('Przeglądarka zablokowała okno podglądu. Zezwól na wyskakujące okna dla tego pliku.', 'error'); return; }
    [250, 700, 1400].forEach(delay => setTimeout(sendPreviewData, delay));
  }
  els.previewBtn.onclick = openLivePreview;
  $$('.nav-item').forEach(node => node.onclick = () => navigate(node.dataset.view));
  ['dragenter', 'dragover'].forEach(type => els.dropZone.addEventListener(type, event => { event.preventDefault(); els.dropZone.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach(type => els.dropZone.addEventListener(type, event => { event.preventDefault(); els.dropZone.classList.remove('is-over'); }));
  els.dropZone.addEventListener('drop', event => { const file = [...event.dataTransfer.files].find(file => file.name.toLowerCase().endsWith('.zip')); if (file) importZip(file); else toast('Upuść plik projektu w formacie ZIP.', 'error'); });
  document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveDraft(); toast('Kopia robocza została zapisana.'); } });
  window.addEventListener('message', event => { if (event.data?.type === 'ebg-cms-preview-ready') sendPreviewData(); });
  $$('[data-close-modal]').forEach(node => node.onclick = closeModal);
  window.addEventListener('beforeunload', event => { if (state.dirty) { event.preventDefault(); event.returnValue = ''; } });
})();
