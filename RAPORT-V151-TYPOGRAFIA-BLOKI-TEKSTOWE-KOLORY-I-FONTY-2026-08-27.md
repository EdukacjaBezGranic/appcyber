# V151 — typografia, bloki tekstowe, kolory i fonty kursu

**Data:** 27.08.2026  
**Baza:** V150  
**Zakres:** kurs online `kurs-fake-news.html`; bez zmian merytorycznych w Modułach 1–5 i bez przebudowy publicznych stron portalu.

## 1. Cel etapu

V151 porządkuje sposób, w jaki tekst jest składany i czytany na ekranie. Nie chodziło o ujednolicenie wszystkiego do jednego kroju i jednego koloru. Celem było stworzenie spójnego systemu, w którym różnice wizualne mają konkretną funkcję.

Najważniejsze problemy przed zmianą:
- jednoliterowe polskie wyrazy, np. „i”, „w”, „z”, „o”, mogły pozostawać na końcu wiersza;
- część nagłówków i akapitów miała przypadkowy rytm łamania;
- kilka historycznych warstw CSS pozostawiało niebiesko-szare kolory tekstu na jasnych komponentach, mimo że nowsza wersja kursu używa już innej palety;
- narrator, treść merytoryczna, formularze, tabele i samooceny nie miały jeszcze jednego jasno opisanego porządku typograficznego;
- na telefonie dłuższe tytuły sekcji były zbyt mocno ściskane przez numer i oznaczenie modułu.

## 2. Polski skład tekstu

Dodano `assets/v151-polish-typography-20260827.js`.

Skrypt chroni jednoliterowe polskie wyrazy przed pozostawaniem na końcu wiersza, używając spacji nierozdzielającej tam, gdzie jest to potrzebne. Nie wykonuje prostego, trwałego `replace` w HTML. Dzięki temu nie uszkadza mechanizmu tłumaczeń PL/EN i może ponownie zastosować skład po zmianie języka.

Obejmuje zwykły tekst kursu, a pomija m.in. kod, pola edycyjne, `textarea`, `select` oraz elementy oznaczone `data-no-typography`.

## 3. Rytm bloków tekstowych

Dodano `assets/v151-typography-and-color-system-20260827.css`.

Zmiany obejmują:
- `text-wrap: balance` dla nagłówków i `text-wrap: pretty` dla tekstu ciągłego jako progresywne ulepszenie;
- brak automatycznego dzielenia wyrazów w głównych nagłówkach;
- spokojniejszą interlinię i bardziej przewidywalny rytm akapitów;
- maksymalną szerokość tekstu ciągłego ok. 78 znaków typograficznych (`ch`) na szerokim ekranie;
- ujednolicone odstępy między akapitami i elementami list;
- czytelniejszy skład podpisów, przypisów i bibliografii;
- równą geometrię kart w obrębie jednej siatki bez wymuszania identycznej wysokości całych sekcji.

Nie zastosowano justowania tekstu do obu krawędzi. W kursie internetowym powodowałoby ono zbyt nierówne odstępy między słowami, szczególnie na telefonie.

## 4. System fontów

V151 używa dwóch funkcjonalnych rodzin krojów:

1. **Helvetica Neue / Helvetica / Arial / system-ui / sans-serif** — treść merytoryczna, interfejs, formularze, tabele, quizy, nawigacja i większość komponentów.
2. **Georgia / Times New Roman / serif** — wyłącznie wybrane fragmenty narratora, klasyczne otwarcie i cytaty.

Drugi krój jest akcentem redakcyjnym. Nie konkuruje z podstawowym systemem interfejsu.

## 5. Kolory

Nie spłaszczono kursu do jednej barwy. Zachowano kolory modułów i akcenty funkcjonalne, ponieważ pomagają orientować się w materiale.

Porządek jest następujący:
- neutralny ciemny kolor — zwykła treść i nagłówki na jasnych powierzchniach;
- jaśniejszy neutralny kolor — tekst pomocniczy i opisy drugiego poziomu;
- mint / amber / coral / green / cream — identyfikacja modułów, wybrane callouty i stany komponentów;
- zielony, bursztynowy i koralowy pozostają przy stanach, które coś oznaczają, np. ukończenie, częściowy wynik lub ostrzeżenie;
- usunięto z widocznych jasnych komponentów przypadkową historyczną niebieską typografię tam, gdzie nie miała już funkcji.

Samooceny otrzymały neutralną bazę wizualną. Kolory statusu pozostawiono tylko przy stanach, które wymagają rozróżnienia.

## 6. Nagłówki i układ mobilny

Na ekranach do 700 px nagłówek sekcji działa w dwóch wierszach:
- pierwszy wiersz: numer sekcji + oznaczenie modułu,
- drugi wiersz: tytuł na pełnej szerokości.

Dzięki temu dłuższe tytuły nie są ściskane do wąskiej kolumny. Na tabletach i desktopie zachowano istniejącą hierarchię i proporcje.

## 7. Tabele, quizy i formularze

Uporządkowano:
- kolor tekstu i obramowań,
- odstępy komórek,
- pionowe wyrównanie treści,
- stany `focus`,
- wygląd zaznaczonej odpowiedzi w quizie,
- tekst pytań w formularzach,
- samooceny i diagnozy.

Ćwiczenia nadal mogą używać innych kolorów niż zwykły tekst, ale kolor ma informować o funkcji elementu, a nie wynikać ze starszego arkusza CSS.

## 8. Test wizualny i responsywny

Kontrolę wykonano na trzech szerokościach:
- desktop: **1440 px**,
- tablet: **820 px**,
- telefon: **390 px**.

Najpierw sprawdzono reprezentatywne sekcje z początku, środka i końca kursu, w tym długi tytuł, narratora, zwykłe akapity, pytanie prowadzące, formularz ćwiczenia, model 4D oraz finał „Zatrzymaj – Sprawdź – Zareaguj”.

Następnie uruchomiono pełną kontrolę wszystkich **125 ekranów na każdej z trzech szerokości**, czyli **375 kontroli układu**. Wynik:
- poziome rozsuwanie dokumentu: **0 przypadków**;
- sekcje wychodzące poza obszar widoku: **0**;
- błędy wykonania strony w teście: **0**.

Po korektach formularzy osobno sprawdzono mobilną samoocenę i tabletowe karty odpowiedzi. Długie odpowiedzi nie wypychają już kart, a ukryte kontrolki radiowe nie poszerzają dokumentu.

Kontrola kontrastu w pełnym renderze wszystkich sekcji objęła odpowiednio **3594 / 3594 / 3576 widocznych elementów tekstowych** na desktopie, tablecie i telefonie. Test nie wykazał elementów poniżej przyjętego progu kontrastu.

## 9. Walidacja techniczna

Końcowa kontrola V151 po wszystkich poprawkach:
- Moduł 1: **10 sekcji**;
- Moduł 2: **16 sekcji**;
- Moduł 3: **21 sekcji**;
- Moduł 4: **34 sekcje**;
- Moduł 5: **44 sekcje**;
- łącznie: **125 sekcji**;
- zduplikowane identyfikatory HTML: **0**;
- kolejność nawigacji w M1–M5: **zgodna z kolejnością sekcji**;
- lokalne odwołania `href` / `src` / `poster` sprawdzone w kursie: **150**, brakujących: **0**;
- brakujące kotwice lokalne: **0**;
- aktywne arkusze CSS kursu: **44**, błędy bilansu bloków CSS: **0**;
- aktywne lokalne skrypty JS kursu: **28**, błędy `node --check`: **0**;
- quizy: **5 × 8 pytań × 4 odpowiedzi**, indeksy poprawnych odpowiedzi mieszczą się w prawidłowym zakresie;
- V151 CSS podłączony: **1 raz**;
- V151 JS podłączony: **1 raz**;
- test typografii **PL → EN → PL**: **OK**; po jednoliterowych polskich wyrazach objętych regułą pozostaje **0 zwykłych spacji** wymagających korekty;
- po powrocie do PL nagłówki i tekst narratora wracają do pierwotnej treści; błędy JS w teście językowym: **0**;
- audyt stylów objął **4275 elementów tekstowych**: **4191** korzysta z podstawowego kroju bezszeryfowego, **84** z kroju szeryfowego używanego jako akcent narracyjny;
- pozostałości audytowanych starych niebieskich kolorów tekstu: **0**;
- zachowana struktura i treść Modułów 1–5 oraz mechanika postępu, testów, kart osiągnięć i dyplomu.

## 10. Pliki V151

Nowe pliki:
- `assets/v151-typography-and-color-system-20260827.css`
- `assets/v151-polish-typography-20260827.js`
- `RAPORT-V151-TYPOGRAFIA-BLOKI-TEKSTOWE-KOLORY-I-FONTY-2026-08-27.md`

Zmienione:
- `kurs-fake-news.html`
- `WERSJA.txt`


## 11. Walidacja wydania

Paczka publikacyjna została utworzona z katalogu V151 z wyłączeniem roboczego katalogu `v149_release`. Po spakowaniu wykonano pełny test wydania:
- `unzip -tq`: **OK — brak błędów w danych skompresowanych**;
- ponowne rozpakowanie paczki do osobnego katalogu kontrolnego: **OK**;
- ponowna walidacja struktury i lokalnych zasobów po rozpakowaniu: **19 OK / 0 FAIL**;
- aktywne JS po rozpakowaniu: **28 plików, 0 błędów składni**;
- aktywne CSS po rozpakowaniu: **44 pliki, 0 błędów struktury**;
- quizy po rozpakowaniu: **5 × 8 × 4 — zachowane**;
- roboczy katalog `v149_release` w paczce publikacyjnej: **nieobecny**.

Wydanie V151 jest gotowe do bezpośredniego wdrożenia na GitHub Pages.
