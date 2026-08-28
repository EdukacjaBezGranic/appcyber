# V165 - kontrast danych projektu i równe karty lekcji

Data: 27.08.2026

## 1. Szczegóły projektu na telefonie

Na mobilnej wersji strony głównej etykiety „Numer projektu”, „Beneficjent” i „Akcja” były widoczne, ale ich wartości mogły znikać na białym tle.

Przyczyna była kaskadowa: starsza warstwa ciemnego hero ustawiała dla wartości jasny kolor i `-webkit-text-fill-color`. Późniejsza poprawka jasnego hero obejmowała desktopowe `.home-rd-meta dd`, ale nie mobilne `.home-rd-meta-mobile dd`.

Przed V165 pomiar dla wartości na szerokości 390 px:

- `color: rgba(255, 255, 255, 0.78)`;
- `-webkit-text-fill-color: rgba(255, 255, 255, 0.78)`.

Po V165:

- wartości: `#171717`;
- etykiety: `#5d625e`;
- jawny reset `-webkit-text-fill-color`;
- `opacity: 1`;
- bezpieczne zawijanie długiego numeru projektu.

## 2. Karty lekcji 3A-5C

Karty lekcji miały różną wysokość zależną od długości tekstu. Na szerokim układzie wyglądało to nierówno.

V165 ustawia dla szerokości od 901 px:

- wspólną minimalną wysokość 226 px;
- jednolity `box-sizing`;
- układ flex dla stabilnej geometrii treści.

Na telefonie i mniejszym tablecie nie jest wymuszana stała wysokość - karta rośnie naturalnie wraz z tekstem.

Pomiar testowy na szerokim układzie:

- 3A: 226 px
- 3B: 226 px
- 4A: 226 px
- 4B: 226 px
- 5A: 226 px
- 5B: 226 px
- 5C: 226 px

## 3. Pliki

Dodano:

- `assets/v165-mobile-project-contrast-and-lesson-cards-20260827.css`

Arkusz jest ładowany na stronie głównej i w kursie online po dotychczasowych warstwach stylistycznych, aby jawnie domknąć kaskadę.

## 4. QA

- potwierdzono źródło błędu kontrastu przez pomiar computed styles przed i po zmianie;
- sprawdzono wszystkie 7 kart lekcji;
- wersja mobilna kart nie otrzymuje sztucznej minimalnej wysokości;
- nie zmieniono treści merytorycznej ani logiki ukończenia kursu.
