# RAPORT V150
## Narracyjne prowadzenie użytkownika i redakcja przejść w Modułach 1–5

**Data:** 27.08.2026  
**Baza:** V149  
**Zakres:** `kurs-fake-news.html`, nowa warstwa CSS i i18n  
**Struktura kursu:** 10 + 16 + 21 + 34 + 44 = **125 sekcji**

---

## 1. Cel V150

V150 dodaje do kursu warstwę narracyjnego prowadzenia odbiorcy bez zmiany jego rdzenia merytorycznego i bez tworzenia jednego powtarzalnego szablonu.

Przyjęto cztery zasady redakcyjne:

1. **Narrator pojawia się tylko wtedy, gdy coś wnosi** — przy otwarciu perspektywy, zmianie poziomu analizy, trudnym przejściu albo domknięciu większego wątku.
2. **Przejście wynika z treści**, a nie z technicznej potrzeby zapowiedzenia kolejnej sekcji.
3. **Język pozostaje lekki i naturalny**, ale nie spłaszcza merytoryki.
4. **Rytm się zmienia** — raz pojawia się sytuacja z życia, raz kontrast, pytanie, krótka obserwacja albo rzeczowy most proceduralny.

Warstwa V150 została napisana zgodnie z ustalonym filtrem humanizacji: bez sztucznego języka AI, bez pustych wzmacniaczy, bez marketingowego tonu i bez mechanicznego powtarzania konstrukcji zdań.

---

## 2. Co zmieniono

### Narrator

Dodano **31 bloków narracyjnych**:

- Moduł 1 — 5,
- Moduł 2 — 5,
- Moduł 3 — 5,
- Moduł 4 — 7,
- Moduł 5 — 9.

Łącznie narrator zawiera **62 krótkie akapity**. Wszystkie są unikalne.

Narrator nie jest oznaczany powtarzalnym nagłówkiem typu „Narrator”, „Zanim przejdziesz dalej” albo „Krok dalej”. Ma być odczuwany jako część tekstu, a nie osobna warstwa techniczna.

### Przejścia

Przeredagowano **79 przejść** między sekcjami. Zamiast zapowiedzi w rodzaju „w następnej sekcji…” przejścia częściej wynikają z wniosku właśnie wyprowadzonego w tekście.

Usunięto z warstwy prowadzącej:

- `Zanim przejdziesz dalej` — **0 wystąpień**,
- `Krok dalej` — **0 wystąpień**.

Różnorodność pierwszych trzech słów przejść: **78 unikalnych początków na 79 przejść**. Dzięki temu warstwa nie wpada w jeden rytm redakcyjny.

---

## 3. Przykładowy kierunek narracyjny modułów

### Moduł 1

Kurs zaczyna się od zwykłego doświadczenia: porannego kontaktu z telefonem i informacji, których część została wybrana przez użytkownika, a część dotarła do niego przez innych ludzi lub systemy. Dopiero z tej sytuacji przechodzimy do edukacji medialnej, obiegu informacji, ekonomii uwagi, personalizacji i AI.

### Moduł 2

Punkt ciężkości przesuwa się z otoczenia na odbiorcę. Narracja nie przedstawia podatności jako słabości człowieka. Pokazuje zwykłe sytuacje: pośpiech, zmęczenie, wiadomość alarmującą, potrzebę odzyskania pewności i znajomość wynikającą z powtarzania.

### Moduł 3

Perspektywa zmienia się ponownie — z reakcji odbiorcy na konstrukcję przekazu. Zachowano poprawioną w V149 logikę sekcji o narracji: **rama → narracja → ćwiczenie → propagandowe zastosowanie 4D**. Warstwa V150 nie nadpisuje tej logiki, lecz wygładza wejścia i przejścia wokół niej.

### Moduł 4

Narrator jest bardziej rzeczowy, ponieważ moduł ma charakter proceduralny. Zamiast literackich ozdobników pojawiają się krótkie sytuacje pokazujące sens kolejnych etapów: błędny start od narzędzia, liczba bez kontekstu, gotowy fact-check użyty jak etykieta, uczciwy wynik nierozstrzygnięty oraz granica między weryfikacją a decyzją.

### Moduł 5

Narracja nie traci poziomu w końcowej części kursu. Zaczyna się od konkretnego dylematu po udanej weryfikacji i prowadzi przez reakcję, rozmowę, zgłaszanie, komunikację instytucjonalną, odporność, krytyczne zaufanie i uczestnictwo w przestrzeni publicznej. Finał wraca do obrazu telefonu z początku kursu i domyka całość przez **Zatrzymaj – Sprawdź – Zareaguj**.

---

## 4. Styl i humanizacja

W nowej warstwie kontrolowano:

- naturalną długość zdań i akapitów;
- ograniczenie konstrukcji bezosobowych;
- brak sztucznej formalności;
- brak jednego powtarzalnego układu narracyjnego;
- prosty język przy zachowaniu pełnego sensu;
- konkretne sytuacje zamiast abstrakcyjnych ogólników;
- brak automatycznego upraszczania trudnych mechanizmów.

Automatyczny skan nowej warstwy nie wykazał zwrotów zakazanych w przyjętym promptcie redakcyjnym, m.in. „w dzisiejszym świecie”, „należy zauważyć”, „warto podkreślić”, „kluczowy”, „istotny”, „synergia”, „holistyczne podejście” ani podobnych formuł.

---

## 5. Warstwa wizualna

Dodano:

- `assets/v150-narrative-flow-20260827.css`
- `assets/v150-narrative-flow-i18n-20260827.js`

Narrator nie jest kolejną ciężką kartą. Ma lekki układ redakcyjny: tekst, subtelna linia akcentowa i większy oddech. Przejścia również zostały wizualnie wyciszone, żeby nie wyglądały jak mechaniczne CTA między ekranami.

Zachowano zasadę kontrastu: jasne powierzchnie używają ciemnego tekstu.

---

## 6. Tłumaczenie EN

Nowa warstwa V150 zawiera **143 statyczne polskie węzły tekstowe**, które wymagają własnego mapowania EN.

Wynik testu:

- mapowanie PL → EN: **143/143**,
- brakujące wpisy: **0**,
- nowy skrypt i18n przechodzi `node --check`.

---

## 7. Testy końcowe

Wykonano 30 testów statycznych i redakcyjnych:

- 125 sekcji — OK,
- moduły 10 / 16 / 21 / 34 / 44 — OK,
- brak duplikatów ID — OK,
- `data-total-sections=125` — OK,
- zgodność `id` i `data-course-section` — OK,
- kolejność nawigacji wszystkich pięciu modułów — OK,
- 31 bloków narratora — OK,
- narrator obecny w każdym module — OK,
- `Zanim przejdziesz dalej` — 0,
- `Krok dalej` — 0,
- różnorodność początków przejść — 78/79,
- powtórzone akapity narratora — 0,
- zakazane zwroty w warstwie V150 — 0,
- oba nowe zasoby V150 istnieją i są podłączone dokładnie raz,
- brak brakujących lokalnych `src` / `href`,
- brak brakujących kotwic,
- 38 plików JavaScript — `node --check` bez błędów,
- 72 arkusze CSS — poprawny bilans bloków,
- PL → EN dla nowej warstwy — 143/143,
- testy modułowe — dokładnie 5 × 8 pytań, każde z 4 odpowiedziami i poprawnym indeksem odpowiedzi,
- logika M3: rama → ćwiczenie → 4D — poprawna,
- finał M5: „Jedna droga przez całe szkolenie” przed „Zatrzymaj – Sprawdź – Zareaguj” — poprawny.

**Wynik:** 30 OK / 0 FAIL.

### HTTP

Lokalny serwer zwrócił HTTP 200 dla:

- `kurs-fake-news.html`,
- `assets/v150-narrative-flow-20260827.css`,
- `assets/v150-narrative-flow-i18n-20260827.js`.

### Test renderowania Chromium

Podjęto próbę automatycznego renderowania przez Playwright/Chromium. Środowisko blokuje nawigację zarówno do `127.0.0.1`, jak i do lokalnego `file://` błędem `ERR_BLOCKED_BY_ADMINISTRATOR`. Test wizualny nie jest więc przedstawiany jako wykonany. Pozostałe testy strukturalne, językowe, i18n, CSS, JS i HTTP zakończyły się poprawnie.

---

## 8. Wynik redakcyjny

V150 nie zmienia kursu w opowiadanie i nie dokłada narratora do każdego ekranu. Warstwa działa punktowo. Jej zadaniem jest sprawić, aby uczestnik czuł ciąg myślowy i miał powód, by przejść dalej, zamiast widzieć serię autonomicznych kart.

Zachowano pełną merytorykę V149. Zmiana dotyczy sposobu prowadzenia odbiorcy, rytmu tekstu i jakości przejść.
