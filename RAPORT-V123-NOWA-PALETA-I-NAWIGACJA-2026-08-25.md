# V123 — nowa paleta i poprawiona nawigacja

Baza: V122.

## Zakres
- bez zmian treści i struktury stron;
- nowy globalny system kolorystyczny zgodny z paletą użytkownika:
  - #df5258
  - #f39f97
  - #eee5c8
  - #f1b55d
  - #3b8f73
  - #7ac4b7
  - biały i czarny;
- czarny tekst na wszystkich jasnych/kolorowych powierzchniach, gdzie zapewnia wyższy kontrast;
- biała/jasna typografia na czarnych powierzchniach;
- usunięte ostatnie przecieki starej palety Jet/Orange/Moonstone na głównych stronach i kursie;
- Panel trenera pozostaje po Kontakcie w nawigacji i mieści się na laptopie;
- na 1180 px Panel trenera jest widoczny w jednym rzędzie;
- na mobile Panel trenera znajduje się w rozwijanym menu;
- zachowana numeracja Kontakt bez pełnych belek oraz poprawione kontrasty ciemnych etykiet;
- kurs zachowuje semantyczne kolory sukces/błąd, ale shell i akcenty korzystają z nowej palety.

## Kontrast
Dla wszystkich kolorów palety używany jest czarny tekst na kolorowych tłach, ponieważ zapewnia wyższy kontrast niż biały. Na czarnym tle tekst podstawowy jest biały / jasny, a kolorowe akcenty mają kontrast co najmniej odpowiadający czytelnej typografii.

## QA
- izolowany render Chromium wykonany dla 1366 px, 1180 px i 390 px;
- Panel trenera widoczny przy 1366 i 1180 px bez poziomego overflow;
- mobile 390 px: menu może wyświetlić Panel trenera na pełnej szerokości;
- brak starej palety w computed styles na: Start, Nasze szkolenia, Zapisy, Kontakt, Panel trenera i kurs;
- pełne otwarcie serwisu przez localhost jest blokowane w środowisku (`ERR_BLOCKED_BY_ADMINISTRATOR`), dlatego render QA wykonano przez `set_content()` z lokalnie wstrzykniętymi arkuszami CSS.
