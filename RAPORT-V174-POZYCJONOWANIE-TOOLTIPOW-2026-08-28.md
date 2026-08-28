# RAPORT V174 - pozycjonowanie tooltipów na desktopie

## Problem
Tooltipy terminologiczne na szerokim ekranie były centrowane względem terminu stałą regułą CSS. W tabelach powodowało to powstanie dużego ciemnego prostokąta zasłaniającego znaczną część sąsiedniego wiersza lub kolumny. Przy pojęciach położonych blisko lewej krawędzi głównej treści dymek mógł też optycznie zbliżać się do sidebara.

## Zmiana
Dodano `assets/v174-tooltip-positioning-20260828.css` i `assets/v174-tooltip-positioning-20260828.js`.

Na ekranach powyżej 1200 px tooltip:
- ma kompaktową szerokość maksymalną 300 px;
- jest pozycjonowany względem rzeczywistego położenia terminu;
- jest ograniczany do obszaru głównej treści i krawędzi viewportu;
- domyślnie otwiera się nad terminem, a gdy brakuje miejsca - pod nim;
- ma niewielki grot wskazujący termin;
- aktualizuje pozycję przy przewijaniu i zmianie rozmiaru okna.

Na tabletach i telefonach pozostawiono dotychczasowy dolny panel z V164, ponieważ jest czytelniejszy i stabilniejszy na ekranach dotykowych.

## Zakres
Zmiana działa globalnie dla wszystkich 19 tooltipów terminologicznych. Nie zmieniono treści definicji ani logiki kursu.

## QA
- nowy plik JS przechodzi `node --check`;
- 19 tooltipów pozostaje w dokumencie;
- arkusz i skrypt V174 są podłączone po wcześniejszych warstwach tooltipów;
- zachowano poprawkę kontrastu V169;
- próba automatycznego renderu lokalnego pliku w Chromium zawiesiła się w środowisku wykonawczym, dlatego nie raportowano screenshot-QA jako zakończonego.
