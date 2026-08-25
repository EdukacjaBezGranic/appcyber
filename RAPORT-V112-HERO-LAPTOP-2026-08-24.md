# V112 — subtelna korekta hero na laptopie / desktopie

Baza: V111.

Zakres zmian:
- wyłącznie strona Start (`index.html`) + nowy arkusz `assets/v112-laptop-hero-balance-20260824.css`;
- zmiany aktywne wyłącznie od szerokości 1181 px;
- `column-gap` hero ograniczony do 56–76 px;
- kolumna zdjęcia ma 107% dotychczasowej szerokości i jest przesunięta o 6,55% własnej szerokości w lewo, co daje ok. 7% dotychczasowej szerokości zdjęcia;
- dzięki tej kombinacji prawa krawędź zdjęcia pozostaje praktycznie w tym samym miejscu, a dodatkowa szerokość rośnie w kierunku tekstu;
- blok tekstowy, wysokość hero, tablet i mobile pozostają bez zmian.

QA:
- 44 pliki HTML;
- 46 plików JS, wszystkie przechodzą `node --check`;
- 947 odwołań lokalnych przeanalizowanych; jedyny wynik `${c.image}` jest dynamicznym szablonem JS, nie brakującym plikiem;
- porównanie V111 → V112: zmieniony tylko `index.html`, dodany tylko arkusz V112;
- próba pełnego headless renderu Chromium w środowisku wykonawczym przekroczyła limit czasu, dlatego nie deklarowano pełnego browser-render QA.
