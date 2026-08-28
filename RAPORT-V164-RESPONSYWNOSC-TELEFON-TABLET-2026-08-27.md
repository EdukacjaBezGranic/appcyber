# V164 - responsywność telefonu i tabletu

Data: 27.08.2026

## Zakres

Audyt i korekta responsywności `kurs-fake-news.html` po przebudowie ćwiczeń V161-V163. Priorytetem było wykorzystanie szerokości małych ekranów bez pogorszenia czytelności oraz usunięcie nierównych, historycznych reguł CSS dla iPada.

## Wprowadzone zmiany

- telefon 360 px: zewnętrzny gutter 6 px, padding karty 9 px;
- telefon 390-600 px: zewnętrzny gutter 8 px, padding karty 10 px;
- tablet 768-900 px: symetryczny gutter głównego layoutu 14 px i padding sekcji 18 px;
- tablet 1024-1194 px: pełna szerokość obszaru kursu, plan kursu działa jako drawer zamiast stałego sidebara;
- usunięto jednostronne wcięcia 58-60 px pochodzące ze starszych reguł iPad;
- tabletowy i mobilny topbar ma jawny układ siatki: branding / język / plan kursu oraz osobny poziom nawigacji;
- logotypy finansowania nie zajmują miejsca w stałym nagłówku telefonu/tabletu - pozostają w innych częściach strony;
- ujednolicono punkty wyrównania dla calloutów, figur, infografik, ćwiczeń V155/V161/V163, narzędzi, formularzy i sekcji ewaluacyjnej;
- tabele otrzymały lokalne przewijanie poziome zamiast rozszerzania całego dokumentu;
- tooltipy na ekranach <=1200 px są pozycjonowane względem viewportu, aby nie wychodziły poza ekran;
- zmniejszono paddingi nowych ćwiczeń i kart odpowiedzi na telefonach;
- SIFT zachowuje pięć równych kroków na telefonie;
- formularze `input`, `select`, `textarea` mają bezpieczne `max-width:100%`, a na telefonie font 16 px (bez automatycznego zoomu iOS).

## QA

Sprawdzone szerokości viewportu:

- 360 x 800
- 390 x 844
- 430 x 932
- 768 x 1024
- 820 x 1180
- 1024 x 768
- 1194 x 834

Statyczny render pełnego arkusza CSS w Chromium/Playwright po finalnej korekcie V164 wykazał dla każdej szerokości:

- `document.body.scrollWidth == window.innerWidth`;
- `document.documentElement.scrollWidth == window.innerWidth`;
- brak widocznych elementów wychodzących poza viewport poza świadomie przewijanymi kontenerami nawigacji/tabel;
- symetryczne szerokości głównego obszaru i sekcji.

Zmierzona szerokość pierwszej sekcji:

| Viewport | Lewa krawędź | Prawa krawędź | Szerokość sekcji |
| --- | ---: | ---: | ---: |
| 360 | 6 px | 354 px | 348 px |
| 390 | 8 px | 382 px | 374 px |
| 430 | 8 px | 422 px | 414 px |
| 768 | 14 px | 754 px | 740 px |
| 820 | 14 px | 806 px | 792 px |
| 1024 | 23 px | 1001 px | 979 px |
| 1194 | 26 px | 1168 px | 1142 px |

Dodatkowo:

- 125/125 identyfikatorów sekcji jest unikalnych;
- 117 sekcji wymaganych zachowuje kontrolkę ukończenia;
- wszystkie lokalne zasoby CSS/JS/obrazy odwołane z głównych plików HTML istnieją (0 brakujących zasobów w 711 odwołaniach);
- wszystkie pliki JavaScript w `assets/` przechodzą `node --check` bez błędów składni;
- arkusz `assets/v164-phone-tablet-responsive-20260827.css` jest ładowany jako ostatnia warstwa responsywna kursu.

## Ograniczenie testu

Środowisko blokuje bezpośrednią nawigację Playwright/Chromium do `localhost` i `file://` przez politykę administratora. Finalny pomiar layoutu wykonano przez `page.set_content()` z lokalnymi arkuszami CSS wstawionymi inline. Pozwala to wiarygodnie zweryfikować geometrię, media queries, marginesy i overflow, ale nie zastępuje pełnego testu wszystkich interakcji JavaScript w realnej przeglądarce. Składnia JS oraz struktura lokalnych zasobów zostały zweryfikowane osobno.
