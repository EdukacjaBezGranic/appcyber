# V116 — audyt wersji angielskiej i stron polityk

Baza: V115.

## Strony polityk
- zmniejszono logotypy w stopkach stron Polityki prywatności i Polityki cookies;
- desktop: projekt 132 px / UE ok. 172 px / WUP ok. 158 px szerokości, max 42 px wysokości;
- mobile: projekt 96 px / pozostałe maks. 150 px, max ok. 34-40 px wysokości;
- brak poziomego overflow w izolowanym teście 390 px i 1440 px.

## Audyt PL/EN
- zredagowano angielskie CTA i etykiety zgodnie z faktycznym procesem zapisów (brak formularza online);
- `Training registration` zastąpiono kontekstowo przez `Training dates`;
- `View registration` -> `View training dates`;
- `Cooperation` w CTA -> `Work with us`;
- poprawiono tłumaczenia dotyczące public employment services, pośredników pracy, komunikacji, gamifikacji i opisów projektu;
- zachowano British English: programme, organise, labour;
- oficjalny tytuł projektu `Kierunek Kompetencje 4.0` zachowany z objaśnieniem `(Skills 4.0)`;
- usunięto niezgodność na stronie Start: wzmiankę o formularzach zapisów, których portal nie używa;
- hero strony Start ma kontekstowy angielski układ: `Future skills / for work and life / in practice`.

## QA
- 46 HTML;
- 47 JS — wszystkie przechodzą `node --check`;
- 699 lokalnych odwołań w głównych HTML — 0 braków;
- 228 grafik;
- audyt widocznych treści głównych stron PL/EN: 0 polskich fragmentów pozostawionych bez tłumaczenia poza treściami celowo niezmienianymi (np. nazwy/marki angielskie już w źródle).

Pełny lokalny `page.goto()` Chromium jest blokowany przez politykę środowiska. Stopkę polityk sprawdzono w izolowanym renderze Chromium z rzeczywistymi wymiarami komponentów.
