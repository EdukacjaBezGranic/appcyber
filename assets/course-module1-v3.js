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
        'Wybierz, w jaki sposób informacja pojawiła się bezpośrednio przed Tobą: przez wyszukiwanie, inną osobę, platformę albo AI.',
        'Tak samo odpowiedz na pozostałe cztery sytuacje.',
        'Kliknij „Sprawdź odpowiedzi”.'
      ],
      note: 'Nie oceniasz, czy treść jest prawdziwa. Wskazujesz tylko drogę, którą do Ciebie dotarła.'
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
        'Ułóż pięć wersji wiadomości od najbliższej źródłu do najbardziej skróconej lub uogólnionej.',
        'Numer 1 oznacza pełny materiał najbliższy źródłu. Numer 5 oznacza wersję najbardziej oddaloną od źródła.',
        'Każdego numeru od 1 do 5 użyj dokładnie raz.',
        'Następnie wskaż, między którymi wersjami znika link, zakres, autor oraz dokładna data.',
        'Kliknij „Sprawdź łańcuch”.'
      ],
      note: 'Najpierw ułóż kolejność, a dopiero potem oceniaj moment utraty informacji.'
    },
    '1.4': {
      steps: [
        'W każdym wierszu masz jednego uczestnika obiegu informacji.',
        'W kolumnie „Funkcja” wybierz, co ten uczestnik robi.',
        'W kolumnie „Odpowiedzialność” wybierz, za co powinien odpowiadać.',
        'Uzupełnij oba pola przy wszystkich sześciu uczestnikach.',
        'Pole z krótką refleksją jest opcjonalne. Na końcu kliknij „Sprawdź dopasowanie”.'
      ],
      note: 'Każda funkcja i każda odpowiedzialność pasują do jednego uczestnika.'
    },
    '1.5': {
      steps: [
        'Przypomnij sobie: osoba A częściej wybiera spokojne poradniki i materiały oficjalne. Osoba B częściej ogląda alarmujące materiały o zagrożeniach AI.',
        'Przy każdym z czterech materiałów wybierz osobę, której platforma prawdopodobnie go poleci.',
        'Zaznacz wszystkie sygnały, które mogą wpływać na rekomendacje.',
        'Wybierz najlepszy końcowy wniosek.',
        'Kliknij „Sprawdź symulację”.'
      ],
      note: 'Strumień treści nie pokazuje całego internetu ani opinii większości.'
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
        'Przeczytaj pierwszy przykład użycia AI.',
        'W polu „Rola” wybierz, czy AI tworzy treść, wybiera treść czy ją interpretuje.',
        'W polu „Kontrola człowieka” wybierz najlepszy sposób sprawdzenia wyniku.',
        'Tak samo uzupełnij pozostałe pięć przykładów.',
        'Kliknij „Sprawdź role i kontrolę”.'
      ],
      note: 'W zadaniu wybierasz rolę dominującą, nawet jeśli narzędzie może wykonywać kilka funkcji.'
    },
    '1.8': {
      steps: [
        'Wybierz etap, na którym najczęściej polegasz na narzędziu: wyszukiwanie, wybór, streszczenie, interpretacja, tworzenie albo udostępnienie.',
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
      const cases = [
        ['Wpisujesz w wyszukiwarce „termin składania wniosków szkoleniowych” i otwierasz oficjalny komunikat.','search'],
        ['Koleżanka przesyła w komunikatorze zrzut ekranu z informacją o zmianie godzin pracy urzędu.','person'],
        ['Po obejrzeniu kilku filmów platforma automatycznie uruchamia kolejny materiał o tym samym temacie.','platform'],
        ['Prosisz narzędzie AI o podsumowanie długiego raportu i czytasz przygotowaną odpowiedź.','ai'],
        ['Na stronie głównej serwisu pojawia się materiał dobrany na podstawie wcześniejszych wyszukiwań.','platform']
      ];
      const body = `<form novalidate><p><strong>Polecenie:</strong> wskaż bezpośrednią drogę dotarcia. Nie oceniasz prawdziwości treści.</p>${cases.map((c,i)=>`<fieldset class="m1v3-fieldset"><legend>Sytuacja ${i+1}</legend><p>${c[0]}</p><div class="m1v3-options is-grid">${categoryOptions.map(o=>option(o[0],o[1],`q${i+1}`)).join('')}</div><span class="m1v3-item-feedback" data-item-feedback="${i}"></span></fieldset>`).join('')}<div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź odpowiedzi</button></div></form>`;
      host.innerHTML = activityShell('1.1','1.1','Jak dotarła informacja?','Klasyfikacja pięciu dróg dotarcia informacji.',body);
      const form=host.querySelector('form'); restoreRecord(host);
      form.addEventListener('submit',e=>{
        e.preventDefault();
        const names=cases.map((_,i)=>`q${i+1}`); if(!requireRadios(form,names)){setFeedback(host,'Uzupełnij odpowiedź w każdej sytuacji.','warning');return;}
        let score=0;
        cases.forEach((c,i)=>{const selected=form.querySelector(`[name="q${i+1}"]:checked`).value; const ok=selected===c[1]; if(ok)score++; const fb=host.querySelector(`[data-item-feedback="${i}"]`); fb.className=`m1v3-item-feedback ${ok?'is-correct':'is-incorrect'}`; fb.textContent=ok?'Trafnie rozpoznana droga.':'Spójrz na ostatni etap przed pojawieniem się treści na ekranie.';});
        finish(host,form,score,5,'Kanał może dostarczyć materiał rzetelny albo nierzetelny. Droga dotarcia nie przesądza o prawdziwości.',score===5?'success':'warning');
      });
    },
    '1.2'(host) {
      const questions=['Kto stworzył tę wiadomość?','Dlaczego powstała?','Jakie dowody potwierdzają tezę?','Jaką emocję przekaz próbuje wywołać?','Jakich informacji brakuje?','Kto zyskuje, gdy uwierzę lub udostępnię?','W jaki sposób treść do mnie dotarła?','Czy AI mogła ją wygenerować, zmienić, streścić lub polecić?'];
      const reasons=['Zwykle brakuje mi czasu.','Treść pochodzi od osoby lub źródła, któremu ufam.','Informacja potwierdza to, co już sądzę.','Nie wiem, jak znaleźć odpowiedź.','Skupiam się na treści, a nie na drodze jej dotarcia.','Inny powód.'];
      const body=`<form><label class="m1v3-control">Pytanie, które zadaję najrzadziej<select name="question" required><option value="">Wybierz pytanie</option>${questions.map((q,i)=>`<option value="${i}">${q}</option>`).join('')}</select></label><label class="m1v3-control">Najbliższy powód<select name="reason" required><option value="">Wybierz powód</option>${reasons.map((q,i)=>`<option value="${i}">${q}</option>`).join('')}</select></label><label class="m1v3-control">Własna notatka – opcjonalnie<textarea name="note" maxlength="250"></textarea></label><div class="m1v3-actions"><button class="m1v3-button" type="submit">Zapisz refleksję</button><button class="m1v3-button is-secondary" type="button" data-skip>Pomiń</button></div></form>`;
      host.innerHTML=activityShell('1.2','1.2','Którego pytania zadaję najrzadziej?','Refleksja bez punktacji.',body); const form=host.querySelector('form'); restoreRecord(host);
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const q=questions[Number(form.question.value)];const prompts=['Przy ważnej wiadomości ustal autora i cel przed oceną nagłówka.','Nie chodzi tylko o korzyść finansową: może nią być zasięg, wpływ lub chaos.','Zapytaj, jaki dokument, dane albo pełne nagranie pozwoliłyby to potwierdzić.'];const tip=q.includes('dowody')?prompts[2]:q.includes('zyskuje')?prompts[1]:'Spróbuj użyć tego pytania przy następnej ważnej wiadomości.';finish(host,form,null,null,`${esc(q)} ${tip}`);});
      host.querySelector('[data-skip]').addEventListener('click',()=>finish(host,form,null,null,'Refleksja została świadomie pominięta.'));
    },
    '1.3'(host) {
      const cards=['Pełny komunikat instytucji','Omówienie lokalnego portalu','Zrzut nagłówka bez linku','Wiadomość w komunikatorze','Uogólniona informacja o całym urzędzie'];
      const moments=['2-3','2-3','3-4','4-5'];
      const body=`<form><p><strong>Ułóż kolejność:</strong> 1 oznacza pełny materiał najbliższy źródłu, a 5 — wersję najbardziej skróconą lub uogólnioną. Każdego numeru użyj dokładnie raz.</p>${cards.map((c,i)=>`<label class="m1v3-row"><p><strong>Wersja ${i+1}.</strong> ${c}</p><select name="pos${i}" required><option value="">Pozycja</option>${[1,2,3,4,5].map(n=>`<option>${n}</option>`).join('')}</select></label>`).join('')}<fieldset class="m1v3-fieldset"><legend>Kiedy po raz pierwszy znika informacja?</legend>${['Link do źródła pierwotnego','Pełny zakres zmiany','Autor lub odpowiedzialna instytucja','Precyzyjna data i warunki'].map((x,i)=>`<label class="m1v3-row"><p>${x}</p><select name="loss${i}" required><option value="">Wybierz moment</option><option value="1-2">między 1 i 2</option><option value="2-3">między 2 i 3</option><option value="3-4">między 3 i 4</option><option value="4-5">między 4 i 5</option></select></label>`).join('')}</fieldset><div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź łańcuch</button></div></form>`;
      host.innerHTML=activityShell('1.3','1.3','Łańcuch utraty kontekstu','Ułóż obieg wiadomości i wskaż moment utraty danych.',body);const form=host.querySelector('form');restoreRecord(host);
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const pos=cards.map((_,i)=>Number(form[`pos${i}`].value));if(new Set(pos).size!==5){setFeedback(host,'Każdej pozycji 1–5 użyj dokładnie raz.','warning');return;}const order=pos.map((p,i)=>[p,i]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);let score=0;for(let i=0;i<4;i++)if(order[i]===i&&order[i+1]===i+1)score++;moments.forEach((m,i)=>{if(form[`loss${i}`].value===m)score++;});finish(host,form,score,8,'Zniekształcenie może powstać przez skrócenie, zrzut ekranu i utratę zakresu nawet bez świadomego zamiaru oszustwa.',score===8?'success':'warning');});
    },
    '1.4'(host) {
      const actors=['Instytucja publiczna','Redakcja lub portal','Platforma','System rekomendacyjny','Użytkownik','Fact-checker'];
      const funcs=[['source','tworzy komunikat pierwotny'],['editor','opracowuje materiał dla odbiorców'],['space','zapewnia przestrzeń publikacji i zgłoszeń'],['visibility','porządkuje widoczność'],['engage','czyta, komentuje i udostępnia'],['verify','bada twierdzenie i kontekst']];
      const resp=[['accurate','aktualność, źródło, data i korekta'],['context','zachowanie zakresu i poprawny cytat'],['report','mechanizmy zgłaszania i ograniczanie podszywania'],['transparent','kontrola oraz przejrzystość doboru'],['check','sprawdzenie przed przekazaniem i korekta własnego błędu'],['evidence','pokazanie dowodów i źródła pierwotnego']];
      const keys=[['source','accurate'],['editor','context'],['space','report'],['visibility','transparent'],['engage','check'],['verify','evidence']];
      const opts=(arr)=>`<option value="">Wybierz</option>${arr.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}`;
      const body=`<form>${actors.map((a,i)=>`<div class="m1v3-row is-triple"><p><strong>${a}</strong></p><label>Funkcja<select name="f${i}" required>${opts(funcs)}</select></label><label>Odpowiedzialność<select name="r${i}" required>${opts(resp)}</select></label></div>`).join('')}<label class="m1v3-control">Na którego aktora możesz bezpośrednio wpłynąć jako użytkownik? <textarea name="reflection" maxlength="300"></textarea></label><div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź dopasowanie</button></div></form>`;
      host.innerHTML=activityShell('1.4','1.4','Kto za co odpowiada w ekosystemie?','Dopasuj funkcję i odpowiedzialność sześciu aktorów.',body);const form=host.querySelector('form');restoreRecord(host);
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;let score=0;keys.forEach((k,i)=>{if(form[`f${i}`].value===k[0])score++;if(form[`r${i}`].value===k[1])score++;});finish(host,form,score,12,'Obieg informacji jest siecią odpowiedzialności. Błąd może powstać na kilku etapach, a nie wyłącznie po stronie jednej platformy.',score===12?'success':'warning');});
    },
    '1.5'(host) {
      const cards=[['guide','Długi poradnik: „Jak sprawdzać odpowiedzi AI w pracy urzędowej?”','A'],['alarm','Krótki film: „Za rok większość stanowisk zniknie!”','B'],['privacy','Oficjalny przewodnik o ochronie danych podczas korzystania z AI','A'],['errors','Seria emocjonalnych nagrań o pojedynczych błędach systemów AI','B']];
      const signals=['Czas oglądania','Historia wyszukiwania','Komentarze i reakcje','Zapisywanie i obserwowanie','Pomijanie materiałów'];
      const body=`<form><fieldset class="m1v3-fieldset"><legend>Przypisz najbardziej prawdopodobny strumień</legend>${cards.map((c,i)=>`<label class="m1v3-row"><p>${c[1]}</p><select name="card${i}" required><option value="">Wybierz</option><option value="A">Osoba A</option><option value="B">Osoba B</option></select></label>`).join('')}</fieldset><fieldset class="m1v3-fieldset"><legend>Sygnały personalizacji</legend><div class="m1v3-options is-grid">${signals.map((s,i)=>option(String(i),s,'signals','checkbox')).join('')}</div></fieldset><fieldset class="m1v3-fieldset"><legend>Najlepszy wniosek</legend><div class="m1v3-options">${option('full','Strumień osoby A pokazuje pełny i obiektywny obraz.','conclusion')}${option('majority','Strumień osoby B dowodzi opinii większości.','conclusion')}${option('partial','Oba strumienie mogą wynikać z wcześniejszych zachowań i nie pokazują całego obrazu.','conclusion')}${option('false','Algorytm zawsze promuje fałsz.','conclusion')}</div></fieldset><div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź symulację</button></div></form>`;
      host.innerHTML=activityShell('1.5','1.5','Dwie osoby, dwa internety','Przewiduj rekomendacje i rozpoznaj sygnały personalizacji.',body);const form=host.querySelector('form');restoreRecord(host);
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity()||!requireRadios(form,['conclusion']))return;let score=0;cards.forEach((c,i)=>{if(form[`card${i}`].value===c[2])score++;});const selected=[...form.querySelectorAll('[name="signals"]:checked')].map(x=>x.value);score+=selected.length; if(form.querySelector('[name="conclusion"]:checked').value==='partial')score++;finish(host,form,score,10,'Częste występowanie danego typu treści w strumieniu nie dowodzi opinii większości ani jakości dowodów.',score===10?'success':'warning');});
    },
    '1.6'(host) {
      const cases=[['Platforma coraz częściej pokazuje materiały podobne do wcześniej oglądanych.','bubble'],['W zamkniętej grupie odmienne głosy są wyśmiewane i usuwane.','echo'],['Algorytm poleca zgodną grupę, a aktywność grupy prowadzi do kolejnych rekomendacji.','both'],['Osoba przeczytała jeden artykuł; nie wiadomo, jak został wybrany.','unknown']];
      const cats=[['bubble','bańka filtrująca'],['echo','komora pogłosowa'],['both','oba mechanizmy'],['unknown','brak wystarczających danych']];
      const body=`<form>${cases.map((c,i)=>`<fieldset class="m1v3-fieldset"><legend>Sytuacja ${i+1}</legend><p>${c[0]}</p><div class="m1v3-options is-grid">${cats.map(x=>option(x[0],x[1],`q${i}`)).join('')}</div></fieldset>`).join('')}<div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź rozróżnienie</button></div></form>`;
      host.innerHTML=activityShell('1.6','1.6','Bańka czy komora?','Rozróżnij selekcję technologiczną i społeczne wzmacnianie.',body);const form=host.querySelector('form');restoreRecord(host);
      form.addEventListener('submit',e=>{e.preventDefault();const names=cases.map((_,i)=>`q${i}`);if(!requireRadios(form,names)){setFeedback(host,'Odpowiedz na wszystkie cztery sytuacje.','warning');return;}let score=0;cases.forEach((c,i)=>{if(form.querySelector(`[name="q${i}"]:checked`).value===c[1])score++;});finish(host,form,score,4,'Bańka dotyczy głównie automatycznej selekcji i proporcji treści; komora – społecznego powtarzania i wzajemnego potwierdzania.',score===4?'success':'warning');});
    },
    '1.7'(host) {
      const examples=[
        ['Narzędzie przygotowuje pierwszy projekt komunikatu prasowego.','creator','facts'],
        ['Serwis ustala kolejność wiadomości na stronie głównej.','selector','compare'],
        ['AI streszcza 60-stronicowy raport do pięciu punktów.','interpreter','original'],
        ['Generator tworzy ilustrację fikcyjnego wydarzenia.','creator','label'],
        ['Wyszukiwarka porządkuje wyniki i sugeruje zapytania.','selector','beyond'],
        ['System tłumaczy komunikat administracyjny.','interpreter','terms']
      ];
      const roleOpts=[['creator','twórca'],['selector','selektor'],['interpreter','interpretator']];
      const controls=[['facts','sprawdzenie faktów, języka i danych'],['compare','porównanie innych źródeł'],['original','porównanie skrótu z dokumentem pierwotnym'],['label','oznaczenie syntetycznego charakteru i praw'],['beyond','wyjście poza pierwsze wyniki'],['terms','sprawdzenie terminów i sensu warunków']];
      const opt=(arr)=>`<option value="">Wybierz</option>${arr.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}`;
      const body=`<form>${examples.map((x,i)=>`<div class="m1v3-row is-triple"><p>${x[0]}</p><label>Rola<select name="role${i}" required>${opt(roleOpts)}</select></label><label>Kontrola człowieka<select name="control${i}" required>${opt(controls)}</select></label></div>`).join('')}<div class="m1v3-actions"><button class="m1v3-button" type="submit">Sprawdź role i kontrolę</button></div></form>`;
      host.innerHTML=activityShell('1.7','1.7','Trzy role AI','Rozpoznaj dominującą funkcję AI i adekwatną kontrolę człowieka.',body);const form=host.querySelector('form');restoreRecord(host);
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;let score=0;examples.forEach((x,i)=>{if(form[`role${i}`].value===x[1])score++;if(form[`control${i}`].value===x[2])score++;});finish(host,form,score,12,'Oceniaj nie tylko przekaz, lecz również system, który go stworzył, wybrał, streścił lub przetłumaczył.',score===12?'success':'warning');});
    },
    '1.8'(host) {
      const stages=[['search','Wyszukiwanie','Sformułuję drugie zapytanie i otworzę materiał pierwotny.'],['selection','Wybór','Porównam źródło spoza mojego zwykłego strumienia.'],['summary','Streszczenie','Sprawdzę w oryginale ważne twierdzenie i zastrzeżenie.'],['interpretation','Interpretacja','Oddzielę odpowiedź narzędzia od dowodów.'],['creation','Tworzenie','Przeczytam, poprawię i zweryfikuję materiał przed publikacją.'],['sharing','Udostępnienie','Zachowam ręczne zatwierdzenie przed wysłaniem.']];
      const body=`<form><label class="m1v3-control">Etap, na którym najczęściej oddaję kontrolę<select name="stage" required><option value="">Wybierz etap</option>${stages.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select></label><label class="m1v3-control">Proponowany krok — pojawi się po wyborze etapu<select name="step" required><option value="">Najpierw wybierz etap</option></select></label><label class="m1v3-control">Własna notatka – opcjonalnie<textarea name="note" maxlength="300"></textarea></label><div class="m1v3-actions"><button class="m1v3-button" type="submit">Zapisz refleksję</button><button class="m1v3-button is-secondary" type="button" data-skip>Pomiń</button></div></form>`;
      host.innerHTML=activityShell('1.8','1.8','Gdzie oddaję kontrolę narzędziu?','Refleksja MAIL/AILit bez punktacji.',body);const form=host.querySelector('form');
      const update=()=>{const found=stages.find(x=>x[0]===form.stage.value);form.step.innerHTML=found?`<option value="${esc(found[2])}">${found[2]}</option>`:'<option value="">Najpierw wybierz etap</option>';};
      form.stage.addEventListener('change',update); restoreRecord(host); update(); const rec=state.activities['1.8']; if(rec?.values?.step)form.step.value=rec.values.step;
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;finish(host,form,null,null,'Oddanie części zadania narzędziu nie jest samo w sobie błędem. Kluczowe jest zachowanie kontroli w decyzjach wymagających źródła i odpowiedzialności.');});
      host.querySelector('[data-skip]').addEventListener('click',()=>finish(host,form,null,null,'Refleksja została świadomie pominięta.'));
    },
    '1.9'(host) {
      const channels=['Samodzielne wyszukiwanie lub bezpośrednie wejście','Wiadomość od innej osoby','Treść polecona przez platformę','Treść utworzona lub przetworzona przez AI','Telewizja, radio lub prasa','Podcast lub newsletter'];
      const sources=['Oficjalne strony i dokumenty','Profesjonalne redakcje','Źródła naukowe, eksperckie lub branżowe','Media społecznościowe i twórcy','Komunikatory i zamknięte grupy','Wyszukiwarki','Narzędzia AI','Podcasty i newslettery'];
      const habits=['Czytam cały materiał, a nie tylko nagłówek.','Sprawdzam autora i datę.','Porównuję wiadomość z niezależnym źródłem.','Otwieram dokument lub komunikat pierwotny.','Szukam perspektywy innej niż dominująca w moim strumieniu.','Sprawdzam, czy AI mogła stworzyć lub przetworzyć treść.'];
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
      form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;finish(host,form,null,null,'Odpowiedź została zapisana lokalnie. W Module 2 przejdziesz od pytania „dlaczego widzę tę treść?” do analizy sygnałów manipulacji i metod sprawdzania.');});
      host.querySelector('[data-skip]').addEventListener('click',()=>finish(host,form,null,null,'Refleksja została świadomie pominięta.'));
    }
  };

  hosts.forEach(host => {
    const renderer = renderers[host.dataset.m1v3Activity];
    if (renderer) renderer(host);
    else host.innerHTML = '<p>Nie udało się załadować aktywności.</p>';
  });
})();
