# RAPORT V160 - audyt UI ćwiczeń

**Data:** 27.08.2026  
**Baza:** V159

## Powód audytu

Po dodaniu w V155 mini-symulacji „popularność ≠ prawdziwość” cztery kontrolki `radio` otrzymały klasę `course-answer`. Klasa ta jest przeznaczona głównie dla pól tekstowych i w bazowym CSS nadaje m.in. `width: 100%`, `min-height: 80px`, padding oraz marginesy. W efekcie kontrolka radiowa rozpychała kafel odpowiedzi i powodowała bardzo duże puste pola.

## Zmiany

- usunięto klasę `course-answer` z czterech radio-buttonów mini-symulacji;
- dodano twardy reset wymiarów kontrolek radio w tym ćwiczeniu;
- karty odpowiedzi są zwarte i dopasowują wysokość do tekstu;
- cały kafel pozostaje klikalny;
- zaznaczona odpowiedź otrzymuje subtelne tło i obramowanie zamiast ciężkiego pionowego efektu;
- dodano czytelny `focus-visible` dla klawiatury;
- zachowano obsługę telefonu i tabletu;
- dodano ochronę na wypadek przypadkowego przypisania `course-answer` do radio/checkboxa w typowych komponentach ćwiczeń.

## Audyt kontrolek

W `kurs-fake-news.html` sprawdzono wszystkie kontrolki wyboru:

- radio: 79,
- checkbox: 50,
- kontrolki bez etykiety: 0,
- radio/checkbox z błędną klasą `course-answer` przed poprawką: 4,
- radio/checkbox z błędną klasą `course-answer` po poprawce: 0.

Przejrzano również struktury samoocen M2, M4 i M5 oraz quizów modułowych. Zmiany V155 w samoocenach dotyczyły treści i skali zachowań, a nie konstrukcji kontrolek; nie znaleziono analogicznego konfliktu klas.

## Pliki

- `kurs-fake-news.html`
- `assets/v160-exercise-ui-audit-20260827.css`
- `WERSJA.txt`
