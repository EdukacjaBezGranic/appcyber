# R5 - głębia treści, ćwiczenia i kompaktowe media

## Główna zmiana
R5 rozwija R4 bez powrotu do układu 125 sekcji. Zachowano 5 modułów i 47 wymaganych lekcji, ale przywrócono większą głębię merytoryczną z materiału źródłowego, pisząc rozwinięcia na nowo w jednej narracji.

## Objętość
- Moduł 1: ok. 3 629 słów PL
- Moduł 2: ok. 2 075 słów PL
- Moduł 3: ok. 2 544 słów PL
- Moduł 4: ok. 2 533 słów PL
- Moduł 5: ok. 2 262 słowa PL
- Łącznie główna treść PL: ok. 13 043 słów
- Dodatkowo: filmy, case studies, gry, 15 ćwiczeń i 5 testów po 8 pytań.

## Ćwiczenia
Łącznie 15 ćwiczeń. Zachowano AFP, Demagog, Polska-Czechy, SIFT i dotychczasowe dobre zadania. Dodano m.in.:
- clickbait: nagłówek vs wniosek z treści,
- ten sam fakt w dwóch ramach interpretacyjnych,
- rozpoznawanie podszywania się,
- praktykę 4O,
- ćwiczenie z danymi: co naprawdę oznacza 64%,
- czytanie fact-checku przez dowód rozstrzygający,
- debunking,
- phishing.

Każde nowe ćwiczenie dostarcza danych potrzebnych do odpowiedzi i posiada feedback wyjaśniający, dlaczego odpowiedź jest poprawna lub błędna.

## Media i gry
- Zmniejszono maksymalny rozmiar ilustracji w lekcjach.
- Screenshoty i materiały dowodowe mają osobny, węższy wariant.
- Gry mają kompaktową kartę: treść + przycisk + mała grafika.
- Cyfrowy Detektyw korzysta z istniejącego coveru gry zamiast dużego pustego bloku.
- Na telefonie karty przechodzą do jednej kolumny.

## Zachowane zasoby
- przypadki AFP,
- materiały Demagoga,
- case Polska-Czechy 2026 wraz z memami i reakcją społeczności,
- gry Rozpoznaj profil i Cyfrowy Detektyw,
- animowane infografiki/filmy,
- 4O, SIFT, Google Lens,
- postęp, testy, karty osiągnięć, dyplom, PL/EN.

## QA
- 5 modułów,
- 47 wymaganych lekcji,
- 15 ćwiczeń,
- 24 pytania wewnątrz ćwiczeń - każde ma oznaczoną odpowiedź poprawną,
- 0 zduplikowanych ID,
- 0 brakujących lokalnych zasobów,
- `course-r5.js` przechodzi `node --check`,
- ZIP przechodzi test integralności.

Automatyczny render Playwright/Chromium nie jest możliwy w tym środowisku: lokalne adresy HTTP są blokowane przez `ERR_BLOCKED_BY_ADMINISTRATOR`. Nie deklarowano więc pełnego screenshot-QA.
