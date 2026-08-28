# V172 - Doprecyzowanie rosyjskiego tropu i usunięcie starej instrukcji (28.08.2026)

## Zmiany merytoryczne
- W studium przypadku Polska-Czechy zastąpiono wcześniejszy ostrożny akapit zaakceptowaną wersją wyjaśniającą, dlaczego sposób prowadzenia operacji silnie sugerował rosyjski trop.
- Dopisano, że analitycy wskazywali na podobieństwo użytych technik do wcześniejszych rosyjskich operacji wpływu.
- Przywołano ocenę Ośrodka Analizy Dezinformacji NASK, że sposób działania odpowiada znanym metodom wykorzystywanym przez stronę rosyjską.
- Zachowano sformułowanie „sugerował rosyjski trop” - tekst nie przedstawia atrybucji jako stuprocentowo rozstrzygniętej.

## Usunięcie niepasującej instrukcji
- Usunięto z `assets/course-instructions-v1.js` dawną instrukcję przypisaną do sekcji `m4-16-praktyczny-przyklad-do-analizy`.
- Instrukcja dotyczyła starego ćwiczenia o procentach, wartościach bezwzględnych, mianowniku i danych bazowych i była po przebudowie case'u Polska-Czechy doklejana dynamicznie do niewłaściwej treści.
- Nie ukrywano jej CSS-em - usunięto samo źródło dynamicznego wstrzykiwania.

## Domknięcie case study
- Dodano krótki blok „Co warto zapamiętać?” podsumowujący mechanizm pozornie niezależnych źródeł.
- Zaktualizowano opis źródła Demagoga w rozwijanej bibliografii case'u.
- Dodano angielskie odpowiedniki nowych tekstów do słownika kursu.

## QA
- 125 sekcji / 125 unikalnych identyfikatorów.
- Stare trzy frazy instrukcji o procentach nie występują już w skrypcie instrukcji dla tego case'u.
- `assets/course-instructions-v1.js` przechodzi `node --check`.
- `assets/course-i18n-v99.js` przechodzi `node --check`.
- Próba headless renderu lokalnym Chromium została przerwana przez ograniczenia środowiska wykonawczego; nie deklarowano screenshot-QA.
