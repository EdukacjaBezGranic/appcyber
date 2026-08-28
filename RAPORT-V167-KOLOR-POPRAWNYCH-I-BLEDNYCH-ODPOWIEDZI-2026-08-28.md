# V167 - wizualny stan poprawnych i błędnych odpowiedzi

Data: 2026-08-28

## Zmiana
Po kliknięciu przycisku sprawdzającego zaznaczona odpowiedź otrzymuje jednoznaczny stan:
- poprawna - jasne zielone tło, zielone obramowanie i etykieta „✓ Poprawna odpowiedź”;
- błędna - jasne czerwone tło, czerwone obramowanie i etykieta „✕ Błędna odpowiedź”.

Kolor nie jest jedynym sygnałem wyniku. Zachowane pozostają dotychczasowe uzasadnienia tekstowe, a przy zaznaczonej odpowiedzi pojawia się również tekstowa etykieta stanu.

## Objęte mechanizmy
- mini-symulacja popularność ≠ prawdziwość w Module 1;
- symulacja SIFT;
- scenariusze V163;
- pojedyncze decyzje CLEAR i SHARE;
- testy modułowe;
- starsze ćwiczenia korzystające z `exercise-feedback-correct/incorrect`;
- ćwiczenia Modułu 1 korzystające z `is-correct/is-incorrect`.

## Zachowanie po zmianie wyboru
Po zmianie zaznaczonej odpowiedzi stary zielony/czerwony stan jest usuwany. Nowy stan pojawia się dopiero po ponownym użyciu przycisku sprawdzającego.

## UX
Użyto jasnych, nienachalnych teł zamiast pełnych ciemnych powierzchni, aby dłuższe odpowiedzi pozostały łatwe do czytania na telefonach i tabletach.
