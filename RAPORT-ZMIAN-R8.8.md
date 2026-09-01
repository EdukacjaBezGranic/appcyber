# R8.8 — responsywność tabletów i telefonów w poziomie

## Zakres

Poprawiono błędy widoczne na przesłanych zrzutach: pionowe łamanie tekstu w kalendarzu i sekcji finansowania, niekontrolowane skalowanie logotypów oraz zbyt wysoki hero kontaktu.

## Zmiany techniczne

- Dodano końcową warstwę `assets/v178-horizontal-device-fixes-20260831.css` do dziewięciu publicznych stron.
- Dla szerokości do 1180 px kalendarz ma jedną kolumnę, a panel szczegółów znajduje się pod planszą.
- Tekst wydarzeń zachowuje jeden wiersz i korzysta z wielokropka, gdy komórka jest zbyt wąska.
- Sekcja finansowania projektu ignoruje zapisane wcześniej ręczne rozmiary i przesunięcia CMS.
- Stopka oraz logotypy korzystają z ograniczeń `max-width`, `max-height` i `object-fit: contain`.
- Dla ekranów poziomych o małej wysokości hero kontaktu ma układ zależny od dostępnej przestrzeni i naturalną wysokość.

## Weryfikacja

Sprawdzono obecność viewportu i nowego arkusza na wszystkich publicznych stronach, poprawność odwołań lokalnych, bilans nawiasów CSS oraz składnię plików JavaScript.
