# V146 — flow Modułu 4, logika, redundancja i EN

Data: 26.08.2026
Baza: V145
Zakres zmian: wyłącznie kurs online, przede wszystkim Moduł 4 oraz jego warstwa tłumaczeń EN. Nie zmieniano publicznych stron portalu ani funkcjonalności zapisu postępu, testów, certyfikatów i panelu trenera.

## 1. Cel redakcyjny

Moduł 4 został uporządkowany według pełnego skryptu szkolenia stacjonarnego. Główny problem poprzedniej wersji polegał na tym, że mapa „10 kroków” mieszała właściwe etapy fact-checkingu z narzędziami i ścieżkami pomocniczymi. Powodowało to konkurencję kilku modeli zamiast jednej czytelnej osi.

Przyjęto zasadę ciągłości rozumowania: uczestnik powinien w każdym momencie wiedzieć:
1. co aktualnie sprawdza,
2. dlaczego wykonuje właśnie ten krok,
3. do czego nawiązuje bieżąca sekcja,
4. jaki wniosek z niej wynika,
5. dlaczego kolejna sekcja pojawia się właśnie teraz.

## 2. Nowy rdzeń Modułu 4 — 7 etapów

Główną osią weryfikacji jest teraz siedem etapów:
1. wybór i precyzyjne sformułowanie sprawdzalnego twierdzenia,
2. dotarcie do źródła pierwotnego i pierwotnego kontekstu,
3. sprawdzenie nadawcy, konta lub strony, również poza ich własnym opisem,
4. porównanie niezależnych źródeł i dowodów,
5. weryfikacja zdjęcia, filmu, dźwięku lub grafiki, jeżeli claim na nich się opiera,
6. sformułowanie wniosku proporcjonalnego do dowodów,
7. cross-check i możliwość korekty.

Mapa jest wyraźnie opisana jako rdzeń procesu, a nie lista wszystkich narzędzi.

## 3. Rozdzielenie funkcji modeli i narzędzi

- SIFT — szybki triage przed pełną weryfikacją; nie zastępuje siedmiu etapów.
- Gotowy fact-check — ścieżka pomocnicza do już zebranych dowodów; nie jest etapem obowiązkowym ani autorytetem zastępującym analizę.
- CLEAR — model porządkowania decyzji po weryfikacji, a nie konkurencyjna procedura ustalania prawdziwości.
- PISA 2029 MAIL i AILit — ramy kompetencji, nie dodatkowe etapy fact-checkingu.
- Detektory AI, reverse image search i inne narzędzia techniczne — pomagają dotrzeć do materiału dowodowego, ale same nie wydają werdyktu.

## 4. Poprawki logiki i ciągłości

- Otwarcie Modułu 4 jawnie wyjaśnia, dlaczego wraca fikcyjny komunikat o likwidacji urzędów pracy: w Module 2 służył analizie emocji, tutaj służy analizie dowodów.
- Sekcje o krytycznym myśleniu i celach modułu prowadzą teraz jawnie do mapy siedmiu etapów.
- Rozróżnienie fakt/opinia/interpretacja z Modułu 3 jest wykorzystywane praktycznie, a nie definiowane drugi raz.
- Dane i statystyki są oznaczone jako rozwinięcie etapu 4, ponieważ dotyczą jakości i interpretacji dowodów liczbowych.
- Data, miejsce, cytat i pełny opis są przygotowaniem do etapu 5, a nie osobnym konkurencyjnym krokiem.
- AI/deepfake jest rozwinięciem etapu 5. Jawnie wyjaśniono różnicę funkcji względem Modułu 3: tam AI było techniką manipulacji do rozpoznania, tutaj jest przedmiotem weryfikacji.
- Weryfikacja gotowego fact-checku została oznaczona jako ścieżka pomocnicza.
- Sekcja zamykająca przed grą nie udaje już końca modułu. Najpierw zapowiada ćwiczenie, a właściwe przejście do Modułu 5 pojawia się dopiero po grze „Cyfrowy Detektyw”.

## 5. Audyt redundancji

Zastosowano zasadę: tekst wyjaśnia, grafika modeluje, tabela porównuje lub operacjonalizuje, ćwiczenie wymaga zastosowania.

Najważniejsze decyzje:
- usunięto powtórne mini-wyjaśnienie czytania lateralnego w sekcji SIFT; zamiast niego jest jawne odwołanie do etapu 3,
- w CLEAR pozostawiono infografikę jako model wizualny oraz jedną tabelę z pytaniami prowadzącymi; usunięto drugą tabelę dublującą tę samą treść,
- powrót do przykładu o likwidacji urzędów pracy został jawnie opisany jako „ten sam komunikat, inna funkcja”,
- przykład fałszywego kontekstu jest opisany jako zastosowanie techniki poznanej w Module 3, a nie ponowne definiowanie pojęcia,
- końcowa checklista nie powtarza siedmiu etapów, lecz sprawdza gotowość do decyzji lub udostępnienia po wykonanej weryfikacji.

## 6. Audyt EN

Dodano warstwę:
`assets/v146-module4-flow-i18n-20260826.js`

Skrypt jest ładowany po V145, dzięki czemu nowe i zmienione teksty mają pierwszeństwo bez naruszania istniejącego mechanizmu PL/EN.

Po audycie uzupełniono także starsze elementy Modułu 4, które mogły pozostawać po polsku, m.in.:
- instrukcje dwóch ćwiczeń praktycznych,
- pytania do analizy claimu i reklamy sponsorowanej,
- opisy po analizie,
- podpisy/alt materiałów archiwalnych,
- placeholder „Np. wyszukiwanie obrazem”,
- alt infografiki CLEAR.

Automatyczna kontrola tekstów i kluczowych atrybutów Modułu 4 nie wykazała pozostawionych kandydatów PL bez mapowania EN.

## 7. Walidacja techniczna

- Moduł 1: 10 sekcji
- Moduł 2: 16 sekcji
- Moduł 3: 21 sekcji
- Moduł 4: 34 sekcje
- Moduł 5: 44 sekcje
- Łącznie: 125 sekcji
- brak starych nagłówków „10 kroków” i kroków 8–10,
- CLEAR: 1 infografika + 1 tabela o odrębnych funkcjach,
- brak zduplikowanego nagłówka „Czytanie boczne” w SIFT,
- brak brakujących lokalnych odwołań do plików,
- `node --check assets/v146-module4-flow-i18n-20260826.js` — OK,
- parser HTML (lxml) — OK,
- tymczasowe pliki `_qa_en.html` i `_qa_en_dump.html` usunięto z paczki publikacyjnej.

## 8. Co pozostawiono bez zmian

Nie zmieniono struktury pozostałych modułów, logiki testów, zapisu postępu, eksportu/importu, kart osiągnięć, dyplomu, panelu trenera, nawigacji publicznej ani innych stron portalu.
