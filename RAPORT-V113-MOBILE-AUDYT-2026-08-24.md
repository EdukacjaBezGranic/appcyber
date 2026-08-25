# V113 — audyt i poprawki mobilne

Baza: V112.

## Wprowadzone poprawki
- usunięto przypadkową klasę `is-open` z nawigacji na stronie Kontakt;
- dodano regułę bezpieczeństwa: mobilna nawigacja bez `.is-open` pozostaje ukryta;
- poprawiono sterowanie terminarzem: „Najbliższy termin” + dwie strzałki są w jednym rzędzie;
- zresetowano starą regułę `grid-column: 1 / -1` z wcześniejszego arkusza;
- doprecyzowano szerokości kontrolek kalendarza dla 360–430 px;
- dodano zabezpieczenie mediów i CTA przed wychodzeniem poza viewport;
- dodano zapas dolny w kursie pod stałą belkę mobilną;
- pozostawiono bez zmian desktopowy/laptopowy hero z V112.

## QA mobilne
Testowane szerokości: 360 px, 390 px, 430 px.
Sprawdzone: Start, Nasze szkolenia, Zapisy, Kontakt, Kursy online, kurs Media Literacy.

- dokument: brak poziomego overflow na wszystkich sprawdzonych stronach;
- Kontakt: menu startuje zamknięte;
- terminarz: 3 kontrolki w jednym rzędzie przy 390 px;
- kurs: 67 elementów odpowiedzi wygenerowanych przez JS, brak overflow w ćwiczeniu;
- JS: 46 plików, 0 błędów składni;
- lokalne referencje HTML: 414, 0 braków.

Pełna nawigacja po `file://`/localhost jest blokowana administracyjnie w środowisku, dlatego QA wykonano poprzez renderowanie dokumentów z inline CSS/JS w Chromium.
