# V122 — UI polish + Panel trenera w nawigacji

Baza: V121.

Zmiany:
- Panel trenera przeniesiony do górnej nawigacji bezpośrednio po Kontakt.
- Usunięto duplikat odnośnika Panel trenera ze stopki.
- Numeracja 01/02/03 na stronie Kontakt nie ma już pełnych niebieskich belek; pozostał numer i cienka linia.
- Poprawiono kontrast etykiet/overline na ciemnych sekcjach, w tym „ZAKRES TEMATYCZNY”.
- Rozbudowano ekran hasła Panelu trenera o profesjonalne wyjaśnienie przeznaczenia strefy oraz trzy grupy materiałów.
- Dodano angielskie tłumaczenia nowych treści Panelu trenera.
- Zachowano wszystkie poprawki kursu, PL/EN, mobile i hero z V121.

QA:
- panel hasła renderowany izolowanie w 1200×800 oraz 390×844 bez poziomego overflow;
- etykieta „ZAKRES TEMATYCZNY” na ciemnym tle: rgba(255,255,255,.76);
- wszystkie lokalne pliki JS przeszły `node --check`;
- lokalne odwołania HTML: jedyny raportowany brak to dynamiczny `${c.image}` w grze, nie jest to rzeczywisty brak pliku.
- pełne otwieranie lokalnego serwisu w Chromium jest blokowane w środowisku (ERR_BLOCKED_BY_ADMINISTRATOR), dlatego zastosowano izolowane renderowanie komponentów.
