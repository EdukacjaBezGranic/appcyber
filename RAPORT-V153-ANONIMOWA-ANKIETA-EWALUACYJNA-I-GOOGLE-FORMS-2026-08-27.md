# V153 — anonimowa ankieta ewaluacyjna i Google Forms

Data: 27.08.2026  
Baza: V152

## Cel
Dodać na końcu kursu krótkie, anonimowe podsumowanie, które mierzy deklarowane poszerzenie wiedzy, zmianę motywacji do dalszego zgłębiania tematu, pewność podczas weryfikacji oraz ocenę sposobu prowadzenia kursu. Ankieta nie jest testem wiedzy i nie zastępuje quizów modułowych.

## Zmiany w kursie
- zachowano 125 tematów: 10 + 16 + 21 + 34 + 44;
- ekran „Ukończenie kursu i dyplom PDF” przeniesiono z początku Modułu 5 na faktyczny koniec kursu;
- po końcowym teście Modułu 5, a przed ekranem dyplomu dodano blok „Podsumuj kurs, zanim przejdziesz do dyplomu”;
- skrypt quizów został dostosowany tak, aby końcowa kolejność była: bibliografia → test Modułu 5 → ankieta → dyplom;
- blok jasno informuje, że ankieta jest anonimowa, dobrowolna i trwa około 3 minut;
- ankieta nie jest warunkiem zaliczenia kursu ani odblokowania dyplomu;
- przycisk pozostaje nieaktywny, dopóki w pliku konfiguracyjnym nie zostanie wpisany prawdziwy link Google Forms;
- dodano pełne tłumaczenie PL/EN nowego bloku.

## Google Apps Script
Dodano plik:
`GOOGLE-APPS-SCRIPT-ANKIETA-EWALUACYJNA-V153.gs`

Po uruchomieniu na oficjalnym koncie tworzy:
1. formularz PL,
2. formularz EN,
3. jeden arkusz Google Sheets na odpowiedzi obu formularzy,
4. kartę `START` z linkami i checklistą anonimowości,
5. kartę `WSKAŹNIKI` z opisem sposobu interpretacji wyników.

### Ustawienia anonimowości w skrypcie
- `setCollectEmail(false)`;
- `setLimitOneResponsePerUser(false)`;
- brak pytań o imię, nazwisko, stanowisko i jednostkę;
- wyłączone publiczne podsumowanie odpowiedzi;
- wyłączona edycja odpowiedzi po wysłaniu;
- w opisach formularzy znajduje się prośba, aby w odpowiedziach otwartych nie wpisywać danych osobowych.

Konto Google Workspace może mieć dodatkowe zasady organizacji. Po utworzeniu formularzy trzeba ręcznie sprawdzić, czy ustawienia dostępu nie wymuszają logowania lub ograniczenia do domeny.

## Zakres ankiety
- retrospektywna samoocena wiedzy przed kursem i po kursie;
- bezpośrednia deklaracja poszerzenia wiedzy;
- pewność podczas sprawdzania źródła, kontekstu, zdjęcia lub nagrania;
- deklaracja zatrzymania się przed udostępnieniem niesprawdzonej informacji;
- retrospektywna motywacja do dalszej nauki przed kursem i po kursie;
- bezpośrednia deklaracja zwiększenia motywacji;
- tematy, które uczestnik chce zgłębiać dalej;
- ocena przystępności języka, przykładów, ćwiczeń i prowadzenia między tematami;
- dwa opcjonalne pytania otwarte: najbardziej użyteczny element oraz propozycje zmian.

## Uwaga metodologiczna
Pytania „przed kursem” są retrospektywną samooceną udzielaną po ukończeniu kursu. Pokazują deklarowaną zmianę, a nie obiektywny pre-test/post-test. Wyniki quizów modułowych pozostają osobnym źródłem danych.

## Konfiguracja linków
Po utworzeniu formularzy należy wkleić linki respondentów do:
`assets/v153-evaluation-config-20260827.js`

Pola:
- `pl` — formularz polski,
- `en` — formularz angielski.

## Testy
- struktura kursu: 125 tematów — OK;
- moduły: 10 / 16 / 21 / 34 / 44 — OK;
- duplikaty ID: 0;
- blok ewaluacji: dokładnie 1;
- blok dyplomu: dokładnie 1;
- kolejność statyczna: bibliografia → ankieta → dyplom → dolna nawigacja — OK;
- kolejność po dynamicznym wstawieniu testu Modułu 5: test → ankieta → dyplom — zabezpieczona w `course-module-quizzes.js`;
- nowe zasoby CSS/JS: istnieją i są podłączone dokładnie raz;
- lokalne odwołania we wszystkich głównych plikach HTML: 842 sprawdzone, 0 brakujących;
- lokalne kotwice HTML: 0 brakujących;
- składnia wszystkich 42 plików JS w `assets/`: OK;
- składnia Apps Script sprawdzona parserem JavaScript: OK;
- 75 aktywnych plików CSS: balans składniowy OK;
- struktura quizów: 5 modułów × 8 pytań × 4 odpowiedzi, indeksy odpowiedzi poprawnych prawidłowe;
- 16 nowych ciągów PL/EN warstwy ewaluacyjnej: pokrycie tłumaczeń kompletne;
- statyczna kontrola ustawień anonimowości Apps Script: OK.

### Test przeglądarkowy
SKIP. Lokalna nawigacja Chromium jest blokowana przez środowisko komunikatem `ERR_BLOCKED_BY_ADMINISTRATOR`, dlatego nie zaliczono testu wizualnego jako wykonanego.
