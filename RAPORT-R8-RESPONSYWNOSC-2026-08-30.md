# R8 — responsywność telefonu, tabletu i laptopa

Data: 2026-08-30

## Zakres

- dodano wspólną, końcową warstwę responsywną do wszystkich 9 publicznych podstron portalu,
- dodano osobną, końcową warstwę responsywną kursu online,
- usunięto wpływ historycznych przesunięć CMS na geometrię strony,
- zapewniono płynne siatki, zawijanie tekstu, skalowanie multimediów i lokalne przewijanie szerokich tabel,
- dostosowano nagłówek i menu do telefonu oraz tabletu,
- zwiększono wygodę pól formularzy i elementów dotykowych,
- dodano obsługę `prefers-reduced-motion`,
- poprawiono kartę „Gra: Cyfrowy Detektyw”: nagłówek, opis i przycisk tworzą jedną kolumnę, a podgląd gry drugą; na telefonie karta przechodzi do jednego słupka.
- w poprawce R8.1 przebudowano trzy kryteria „Ryzyko / Zasięg / Odbiorca”, aby etykiety nie łamały się litera po literze; zabezpieczono też długie nagłówki lekcji przed poziomym wypychaniem strony.
- w poprawce R8.2 rozbudowano karty osiągnięć PDF o trzy umiejętności właściwe dla każdego modułu oraz stopkę z logotypami projektu „Edukacja bez granic”, Unii Europejskiej i WUP Katowice.

## Punkty przełamania

- do 360–380 px: bardzo wąskie telefony,
- do 640 px: telefon,
- 641–900 px: tablet pionowy,
- 901–1180 px: tablet poziomy i mniejszy laptop,
- powyżej 1180 px: laptop i duży ekran.

## Pliki R8

- `assets/v177-fluid-responsive-20260830.css`
- `assets/course-r8-responsive-20260830.css`

## Kontrola techniczna

- 46 aktywnych plików HTML: wszystkie mają deklarację viewport,
- brak zduplikowanych identyfikatorów w HTML,
- brak brakujących lokalnych odwołań do plików w aktywnych stronach,
- wszystkie pliki JavaScript przechodzą kontrolę składni `node --check`,
- obie nowe warstwy CSS mają zrównoważone bloki, komentarze i cudzysłowy,
- nowe arkusze są dołączone jako ostatnie warstwy CSS odpowiednio w portalu i kursie.

Renderowanie w przeglądarce automatycznej nie było dostępne w środowisku kontroli, dlatego przed publikacją zalecany jest jeszcze krótki smoke test na fizycznym telefonie i tablecie.
