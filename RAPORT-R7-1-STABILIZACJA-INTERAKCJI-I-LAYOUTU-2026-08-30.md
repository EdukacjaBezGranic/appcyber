# R7.1 - stabilizacja interakcji i layoutu

Data: 2026-08-30

## Poprawione problemy

1. Znacznik ukończenia lekcji
- zastąpiono pseudo-element prawdziwym elementem ikony i osobną etykietą;
- przycisk pokazuje `Zaznacz jako ukończone`, po zaznaczeniu `Ukończone`;
- poniżej 980 px przycisk przechodzi do osobnego wiersza nagłówka, dzięki czemu nie nachodzi na tytuł;
- poprawiono wersję mobilną.

2. Interakcje ćwiczeń
- `Sprawdź odpowiedź` i `Wyczyść` korzystają z delegowanej obsługi zdarzeń;
- mechanizm działa niezależnie od przełączania modułów i późniejszych zmian DOM;
- inicjalizacja ćwiczeń wykonywana jest przed pozostałymi modułami interfejsu;
- pozostałe funkcje startowe mają izolację błędów, aby problem w jednym komponencie nie blokował ćwiczeń.

3. Stabilność układu
- naprawiono uszkodzony blok CSS R4, w którym zapisane były literalne sekwencje `\\n`;
- dodano globalne zabezpieczenia przed poziomym overflow;
- główny kontener, moduły, sekcje i ich treść mają jawne `min-width:0` i `max-width:100%`;
- zabezpieczono szerokie elementy wewnątrz lekcji.

## Kontrola
- 47 wymaganych lekcji;
- 47 przycisków ukończenia z ikoną i etykietą;
- 15 ćwiczeń i 15 przycisków `Sprawdź odpowiedź`;
- każde pytanie ćwiczeniowe posiada wskazaną poprawną odpowiedź;
- 0 błędów parsera CSS na poziomie arkusza;
- `course-r7.js` przechodzi `node --check`;
- brak brakujących lokalnych zasobów strony kursu.

## Ograniczenie QA
Środowisko Chromium blokuje lokalne adresy i pliki (`ERR_BLOCKED_BY_ADMINISTRATOR`), dlatego nie wykonano pełnego automatycznego screenshot-testu. Kontrola została wykonana strukturalnie i poprzez parsery HTML/CSS/JS.
