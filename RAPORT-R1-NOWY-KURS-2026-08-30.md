# R1 - nowa architektura kursu online

Data: 30.08.2026

## Założenie

R1 nie jest kolejną redakcją V176. V176 pozostaje w `archive/kurs-fake-news-v176.html` jako archiwum i biblioteka materiałów. Główna strona `kurs-fake-news.html` została zbudowana od nowa z jednym nowym arkuszem `assets/course-r1.css` i jednym nowym skryptem `assets/course-r1.js`.

## Kręgosłup narracyjny

1. Jak informacja dociera do odbiorcy.
2. Dlaczego reagujemy, zanim sprawdzimy.
3. Jak buduje się manipulację.
4. Jak sprawdzać informacje.
5. Jak reagować i budować odporność.

Ścieżka kursu: **Dociera do mnie -> Reaguję -> Rozpoznaję manipulację -> Sprawdzam -> Decyduję, co robić.**

## Struktura

- 5 modułów.
- 45 wymaganych lekcji: 8 + 8 + 10 + 10 + 9.
- 5 testów modułowych po 8 pytań.
- próg zaliczenia testu: 7/8.
- test odblokowuje się po ukończeniu wszystkich lekcji danego modułu.
- 7 ćwiczeń w głównym przebiegu; ćwiczenia są samowystarczalne i nie wymagają wyszukiwania własnego materiału poza kursem.
- materiały „Dla dociekliwych” i bibliografia nie wpływają na postęp.

## Zachowane i wkomponowane zasoby

- filmy i ilustracje z wcześniejszego kursu;
- przykłady clickbaitu i materiały Demagoga;
- realne przypadki AFP: fałszywe miejsce i fałszywy czas;
- studium przypadku Polska-Czechy 2026 z materiałami użytkownika;
- model 4O;
- SIFT jako szybki tryb sprawdzania;
- Google Lens jako praktyczne narzędzie pomocnicze;
- CERT Polska, phishing, debunking, prebunking, higiena informacyjna;
- bibliografia i źródła do dalszej pracy.

## Mechanika R1

- lokalny zapis postępu w `localStorage` pod nowym kluczem R1;
- ręczne oznaczanie ukończenia lekcji;
- pasek postępu liczony z 45 lekcji + 5 zaliczonych testów;
- przycisk „Kontynuuj kurs” przenosi do pierwszej nieukończonej lekcji lub niezaliczonego testu;
- eksport/import postępu JSON;
- wyszukiwarka w planie kursu;
- PL/EN;
- responsywny wysuwany plan kursu na telefonie/tablecie;
- tooltipy: mały dymek na desktopie, bezpieczny panel dolny na małych ekranach;
- feedback ćwiczeń i testów: zielony/czerwony + tekst, nie tylko kolor;
- karta osiągnięcia PDF po zaliczeniu każdego modułu;
- dyplom PDF po ukończeniu 45/45 lekcji i zaliczeniu 5/5 testów wynikiem co najmniej 7/8;
- opcjonalna ankieta ewaluacyjna nie wpływa na zaliczenie.

## QA statyczne

- 45 wymaganych sekcji / 45 unikalnych ID;
- moduły: 8 / 8 / 10 / 10 / 9 lekcji;
- 5 kontenerów testów;
- 7 ćwiczeń;
- 18 tooltipów terminologicznych;
- wszystkie kontrolki ćwiczeń mają etykiety;
- każde pytanie ćwiczeniowe ma dokładnie jedną poprawną odpowiedź;
- 0 brakujących lokalnych plików obrazów, wideo, CSS i JS używanych przez nową stronę;
- 0 brakujących lokalnych linków HTML;
- brak długich myślników `—` i `–` w nowym HTML/CSS/JS;
- `node --check assets/course-r1.js` - OK.

## Ograniczenie QA renderu

Systemowy Chromium w środowisku wykonawczym zawiesza się przy lokalnym renderowaniu tej strony, więc pełnego automatycznego screenshot-testu Chromium nie uznajemy za wykonany. Warstwa strukturalna, zasoby, składnia i responsywne reguły CSS zostały sprawdzone statycznie. Pierwszy test po publikacji na GitHub Pages powinien objąć 360/390/430 px, 768/820 px, 1024/1194 px oraz desktop.
