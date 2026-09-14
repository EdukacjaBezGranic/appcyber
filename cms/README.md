# CMS - edycja zaznaczonego tekstu

## Instalacja
1. Rozpakuj tę paczkę.
2. Skopiuj cały folder `cms` do głównego folderu aktualnego portalu, zastępując poprzedni folder `cms`. Nie zastępuj pozostałych plików strony.
3. Otwórz `cms/index.html` i wczytaj najnowszy ZIP projektu (lub wybierz folder projektu w obsługiwanej przeglądarce).

W paczce jest tylko CMS i jego biblioteka ZIP. Nie zawiera strony, zdjęć, podręcznika ani kursu. Dla podglądu z grafikami CMS powinien znajdować się wewnątrz rozpakowanego projektu.

## Edycja
1. Otwórz „Edycja stron” i wybierz stronę.
2. Kliknij blok na liście albo tekst w podglądzie po prawej.
3. W środkowym polu edycji zaznacz myszą słowa lub zdanie.
4. Na pasku wybierz pogrubienie, kursywę, podkreślenie, przekreślenie, czcionkę, wielkość, kolor, podświetlenie lub link. „Usuń format zaznaczenia” czyści format wybranych słów.
5. Kliknij „Zapisz fragment” lub użyj Ctrl+S / Cmd+S.
6. Wyeksportuj projekt do ZIP. Podmień pliki opublikowanej strony zawartością eksportu.

„Układ i typografia” nadal zmienia cały blok: wyrównanie, szerokość, interlinię i marginesy. Wklejany tekst trafia bez formatowania z Worda czy innej strony.

Eksport zapisuje także aktualnie edytowany fragment. Przy przełączaniu stron lub bloków CMS ostrzega o niezapisanych zmianach. Zapis lokalny jest kopią roboczą w danej przeglądarce; sam nie publikuje strony.

## Zakres
- Edytor wykrywa strony HTML w głównym folderze projektu, także nowo dodane.
- Kursy i lekcje (`kurs-…`, `modul…`, `module…`, `lekcja…`, `lesson…`) nie pojawiają się w edytorze. „Kursy online” jako strona katalogu może być edytowana.
- Treści generowane przez skrypty, np. wpisy aktualności i dane kalendarza, zmieniaj w zakładkach „Aktualności” oraz „Kalendarz i zapisy”. Nie są statycznymi fragmentami HTML.
- Wersja angielska wpisów pozostaje osobną treścią. Edycja polskiego fragmentu nie tłumaczy go automatycznie.
- Podgląd tekstu nie wykonuje skryptów strony i nie służy do wypełniania formularzy.

## Sprawdzenie wydania
Sprawdzono składnię JavaScript, komplet zależności paczki i wyłączenie plików kursu z listy edycji. Interakcje w przeglądarce nie zostały zweryfikowane - dostępny podgląd przeglądarkowy blokuje otwieranie lokalnych plików. Przed publikacją sprawdź zapis i eksport krótkiego fragmentu na kopii projektu.
