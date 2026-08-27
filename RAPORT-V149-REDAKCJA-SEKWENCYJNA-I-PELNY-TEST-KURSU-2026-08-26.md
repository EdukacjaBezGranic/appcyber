# RAPORT V149
## Redakcja sekwencyjna Modułów 1–5 i pełny test kursu

**Data:** 26.08.2026  
**Baza:** V148  
**Zakres:** `kurs-fake-news.html` oraz warstwa tłumaczeń i stylów kursu  
**Struktura po zmianach:** 10 + 16 + 21 + 34 + 44 = **125 sekcji**

---

## 1. Cel V149

V149 nie jest kolejnym mechanicznym rozszerzeniem treści. Celem była ręczna redakcja kursu **od Modułu 1 do Modułu 5, w kolejności, w jakiej uczestnik go czyta**, a następnie techniczny i strukturalny test całości.

Przy każdej sekcji kontrolowano przede wszystkim:

- czy uczestnik rozumie, **o czym jest dana część i dlaczego pojawia się właśnie teraz**;
- czy nowe pojęcie jest wyjaśnione **zanim** uczestnik ma użyć go w ćwiczeniu;
- czy przejście do kolejnej sekcji rzeczywiście wynika z poprzedniej;
- czy nie mieszamy poziomów analizy, np. reakcji odbiorcy, konstrukcji przekazu, ramy, narracji i techniki propagandowej;
- czy powrót do pojęcia z wcześniejszego modułu ma nową funkcję, a nie jest ponownym wykładem;
- czy tekst brzmi naturalnie i jest zrozumiały dla osoby o różnym poziomie przygotowania, bez upraszczania merytoryki;
- czy tabela, grafika, przykład i ćwiczenie uzupełniają się zamiast mechanicznie powtarzać tę samą treść.

---

## 2. Zakres redakcji

W porównaniu z V148 zmieniono treść **40 sekcji**:

- Moduł 1 – 5 sekcji,
- Moduł 2 – 3 sekcje,
- Moduł 3 – 8 sekcji,
- Moduł 4 – 9 sekcji,
- Moduł 5 – 15 sekcji.

Łączna zasadnicza treść sekcji wzrosła orientacyjnie z **34 539 do 35 195 słów**. Wzrost jest niewielki względem całego kursu, ponieważ celem nie było dopisywanie tekstu dla objętości, lecz poprawienie miejsc, w których brakowało wyjaśnienia, przykładu, logicznego mostu albo właściwej kolejności.

---

## 3. Najważniejsze korekty logiczne

### Moduł 1

- Doprecyzowano otwarcie kursu: od codziennego doświadczenia informacji do potrzeby edukacji medialnej.
- Uporządkowano przejście od modelu redakcyjnego do obiegu sieciowego.
- Dodano naturalniejsze przykłady pokazujące drogę jednej informacji przez urząd, portal, platformę, komunikator i komentarz użytkownika.
- Metafora „informacji jako produktu” została wyjaśniona tak, aby nie sugerowała, że każda informacja jest towarem.
- MAIL i AILit są przedstawiane jako mapy kompetencji, a nie nazwy do zapamiętania.

### Moduł 2

- Mocniej rozdzielono **mechanizmy po stronie odbiorcy** od **błędów logicznych i chwytów argumentacyjnych po stronie przekazu**.
- Dodano przykład pokazujący, że fałszywa alternatywa i błąd potwierdzenia mogą wystąpić jednocześnie, ale opisują dwa różne poziomy.
- Przed refleksją dodano wyraźne domknięcie: rozpoznanie chwytu nie dowodzi fałszu całej tezy; pokazuje, że uzasadnienie może być niewystarczające.

### Moduł 3

- Rozwinięto sekcje o faktach i kontekście, języku oraz obrazie tak, aby nie działały jak fiszki z terminami.
- Najważniejsza korekta dotyczy sekcji **„Od pojedynczego komunikatu do utrwalonej narracji”**:
  1. najpierw pojawia się konkretna sytuacja;
  2. potem rozróżnienie **rama interpretacyjna ≠ narracja**;
  3. następnie wyjaśnienie, jak wiele różnych zdarzeń może wspierać tę samą opowieść;
  4. dopiero potem ćwiczenie z dwoma nagłówkami;
  5. po ćwiczeniu wyjaśnienie jego sensu;
  6. następnie most do propagandy;
  7. dopiero na końcu model 4D, z jasnym zastrzeżeniem, że nie opisuje czterech rodzajów narracji.
- W teście końcowym wykryto jeszcze **przedwczesną zapowiedź Modułu 4** w sekcji 15. Została zastąpiona przejściem do narzędzia analitycznego i przykładów, które faktycznie następują dalej w Module 3.

### Moduł 4

- Zachowano jako główny rdzeń **7 etapów weryfikacji**.
- SIFT pozostaje szybkim triage'em, a nie konkurencyjną pełną procedurą.
- CLEAR został opisany jako sposób połączenia weryfikacji z decyzją, z wyjaśnieniem miejsc, w których nakłada się na wcześniejsze kroki.
- MAIL i AILit są używane jako zastosowanie do decyzji, a nie ponowny wykład ram.
- Dodano naturalne mosty:
  - od MAIL do sytuacji z udziałem AI;
  - od słownika do refleksji nad własnym sposobem podejmowania decyzji.

### Moduł 5

- Rozdzielono działanie doraźne od długofalowej odporności informacyjnej.
- Wyraźniej pokazano cztery warstwy odporności: uwagę, źródła i metodę, gotowość do korekty oraz relacje/procedury.
- W teście wykryto zbyt ogólne przejście po sekcji o higienie uwagi. Zostało zmienione na konkretny most do **krytycznego zaufania i jakości źródeł**.
- Dodano naturalne przejście od zaangażowania demokratycznego do wartości i odpowiedzialnej komunikacji.
- MAIL i AILit na końcu kursu są jednoznacznie przedstawione jako **sprawdzian zastosowania**, nie nowe checklisty.
- Przed samodzielnym przykładem dodano informację, że uczestnik nie dostaje nowej teorii, tylko ma użyć poznanych narzędzi.

---

## 4. Test ciągłości rozumowania

Sprawdzono sekwencyjnie wszystkie **125 sekcji** oraz połączenia między nimi.

Szczególne testy automatyczne i ręczne obejmowały:

- brak treści merytorycznej po bloku „Krok dalej” – **0 błędów**;
- brak przedwczesnych przejść do kolejnego modułu – **0 błędów po korekcie**;
- kolejność w sekcji o narracjach: **rama → narracja → ćwiczenie → 4D** – poprawna;
- Moduł 4: siedem kroków w kolejności **1 → 7** – poprawne;
- Moduł 5: finał „Zatrzymaj – Sprawdź – Zareaguj” w sekcji 43, bibliografia w sekcji 44 – poprawne;
- siedem dodatkowych mostów logicznych V149 – obecne i osadzone w odpowiednich sekcjach.

---

## 5. Test struktury i funkcjonalności statycznej

Wynik pełnego testu V149:

- **125/125 sekcji** – poprawna struktura;
- `data-total-sections=125` – poprawne;
- duplikaty ID – **0**;
- zgodność `id` / `data-course-section` / `data-module-number` – poprawna;
- nawigacja boczna – **5/5 modułów**, dokładnie ta sama kolejność jak sekcje;
- przyciski ukończenia – **124 sekcje + bibliografia świadomie poza zaliczeniem**;
- 125/125 sekcji ma nagłówek i treść;
- lokalne `src` / `href` w całym pakiecie – **0 brakujących plików**;
- kotwice `#id` – **0 braków**;
- 26 skryptów JS – **0 błędów składni**;
- 42 arkusze CSS – poprawny balans struktur;
- warstwa telefon/iPad – nadal podłączona;
- pola formularzy – **0 duplikatów ID**;
- wszystkie widoczne pola mają etykietę lub `aria`;
- selecty – brak zduplikowanych wartości;
- przyciski w formularzach mają jawny typ;
- testy modułowe – **5 × 8 pytań**, każde pytanie ma 4 odpowiedzi i prawidłowy indeks odpowiedzi poprawnej;
- placeholdery / TODO / śmieci redakcyjne w widocznej treści – **0**;
- identyczne kolejne akapity – **0**.

Dwa obrazy mają pusty `alt` celowo, ponieważ są dekoracyjne i znajdują się w elementach `aria-hidden="true"`.

Ukryte pole importu JSON jest elementem technicznym sterowanym przez interfejs i nie jest widocznym polem formularza.

---

## 6. Tłumaczenie angielskie

Po V149 wykonano ponowny audyt kumulacyjny PL/EN:

- łączny audyt wykrywa **5904 unikalne klucze tłumaczeń** w warstwach i18n kursu;
- statyczne polskie węzły tekstowe bez odpowiednika EN: **0**;
- tytuły sekcji: **125/125** objęte tłumaczeniem;
- testy modułowe: **40 pytań + 160 odpowiedzi** objęte tłumaczeniem;
- nowe lub zmienione węzły tekstowe V149: **157**;
- brak mapowania w V149: **0**;
- finalny patch V149 zawiera **186 wpisów**: 157 nowych/zmienionych węzłów V149 oraz 29 dodatkowych mapowań dla tekstów rozdzielonych przez znaczniki HTML. Skrypt przechodzi `node --check`.

Tytuły bibliograficzne i nazwiska pozostają w oryginalnym brzmieniu tam, gdzie są elementem opisu źródła.

---

## 7. Responsywność i kontrast

Nowe bloki V149 zachowują ustaloną zasadę:

- jasne tło → ciemny tekst;
- ciemne tło → jasny tekst.

Nowe powierzchnie wykorzystują m.in. jasny krem `#f4f1e8` i jasną miętę `#eef6f2` z ciemnym tekstem `#17212b` / `#263440`.

Zachowano wcześniej podłączone warstwy responsywne dla telefonu i iPada. V149 dodaje własny breakpoint mobilny `max-width:700px` dla nowych bloków.

### Ograniczenie testu renderowania

Podjęto próbę uruchomienia lokalnego renderowania w headless Chromium. Chromium w tym środowisku kontenerowym nie startuje prawidłowo z powodu braku działającego DBus / problemu warstwy runtime i kończy próbę timeoutem. **Nie traktowano tego jako zaliczonego testu wizualnego i raport nie twierdzi, że wykonano browser QA.**

Pozostałe testy struktury, odwołań, responsywnego stosu CSS, formularzy, JS, CSS i tłumaczeń zostały wykonane statycznie i zakończyły się bez błędów.

---

## 8. Wynik końcowy

Pełny test V149:

**34 testy: OK**  
**0 testów: FAIL**  
**1 test renderowania Chromium: SKIP z powodu ograniczenia środowiska**

V149 zachowuje strukturę i funkcjonalność poprzedniej wersji, a jednocześnie koryguje wykryte problemy z kolejnością wyjaśnień, przedwczesnymi przejściami, niejasnymi referentami i nierówną funkcją powracających modeli.

---

## 9. Finalizacja paczki publikacyjnej

Przed utworzeniem paczki V149 wykonano dodatkową kontrolę wydania:

- odtworzono pełne drzewo portalu z bazowej paczki V148 i nałożono finalny `kurs-fake-news.html` V149;
- dodano i zweryfikowano `assets/v149-continuity-and-editorial-20260826.css`;
- dodano i zweryfikowano `assets/v149-continuity-editorial-i18n-20260826.js`;
- po końcowym audycie tłumaczeń dodano 29 mapowań dla tekstów rozdzielonych przez znaczniki HTML; jedynymi polskimi kandydatami pozostającymi bez tłumaczenia są celowo zachowane elementy bibliograficzne (autor i polski tytuł źródła);
- pełne drzewo publikacyjne: 10 / 16 / 21 / 34 / 44 sekcje, 125 łącznie;
- duplikaty `id`: 0;
- sprawdzone lokalne odwołania `src` / `href`: brak brakujących plików;
- brakujące kotwice lokalne: 0;
- wszystkie pliki JavaScript w `assets/` przechodzą `node --check`;
- wszystkie arkusze CSS w `assets/` mają poprawny bilans bloków;
- testy modułowe: 5 modułów × 8 pytań × 4 odpowiedzi, indeksy odpowiedzi poprawnych prawidłowe;
- lokalny serwer HTTP: `index.html`, `kurs-fake-news.html` oraz oba nowe zasoby V149 zwracają HTTP 200;
- pliki robocze `_qa_en*` i kopia `kurs-fake-news.V148-backup.html` nie są częścią paczki publikacyjnej.

Test wizualny Chromium pozostaje oznaczony jako **SKIP** z powodów środowiskowych opisanych wcześniej; nie jest przedstawiany jako wykonany.
