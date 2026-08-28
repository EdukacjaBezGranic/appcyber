# V166 - równowaga ćwiczeń, pełny kontekst i kontrast

Data: 28.08.2026  
Baza: V165

## Założenie

Nie cofano całego kursu. Przywrócono prostszą logikę tam, gdzie rozbudowana interakcja zaczęła wymagać od uczestnika zbyt wielu odpowiedzi albo sprawiała wrażenie testu z wiedzy, której scenariusz nie podał.

Zasada po zmianie: **najpierw pełny materiał i dane -> potem jednoznaczne zadanie -> informacja zwrotna**. Modele takie jak CLEAR i SHARE porządkują rozumowanie, ale nie są zestawem pięciu osobnych pytań do zaliczenia.

## Zmiany

### 1. SHARE - Moduł 5, punkt 39
- usunięto sześć osobnych pytań S/H/A/R/E,
- pokazano jawnie fikcyjny post,
- dodano jawny fikcyjny komunikat źródłowy przed pytaniem,
- uczestnik porównuje oba materiały i podejmuje jedną decyzję,
- po odpowiedzi rozwijane podsumowanie pokazuje, jak decyzja odpowiada pięciu elementom SHARE.

Dzięki temu pytanie o Accuracy nie odwołuje się do informacji, której uczestnik miałby się domyślać.

### 2. CLEAR
- pozostawiono przykład narzędzia AI i wszystkie istotne dane,
- C/L/E/A są pokazane jako przepracowany tok analizy,
- uczestnik odpowiada tylko na końcowe R - decyzję,
- model nie udaje quizu z pięciu literek.

### 3. Samooceny M2, M4 i M5
- ograniczono częstotliwościową, silnie behawioralną formę z V155,
- w każdej z trzech samoocen pozostawiono **jedno konkretne stwierdzenie behawioralne**, a pozostałe cztery wróciły do prostszej samooceny typu „rozpoznaję / potrafię / rozumiem”,
- skala 1-5 oznacza stopień zgody/oceny kompetencji, a nie częstotliwość zachowania.

Pozostawione zachowania: M2 - pauza przy silnej emocji; M4 - wyjście poza stronę/profil nadawcy; M5 - sprawdzenie źródła, kontekstu i skutków przed udostępnieniem.

### 4. Elementy pozostawione bez cofania
- SIFT pozostaje w wersji z konkretnymi danymi odsłanianymi krok po kroku,
- przykład zdjęcia w fałszywym kontekście zachowuje Google Lens i praktyczne narzędzia,
- przypadek „64%” pozostaje analityczny, ponieważ wszystkie dane potrzebne do odpowiedzi są podane w scenariuszu,
- pozostałe wcześniejsze, jasne ćwiczenia nie zostały przebudowane tylko dla samej zmiany.

### 5. Kontrast numerów i znaczników
Dodano końcową warstwę CSS wymuszającą jasny tekst wraz z `-webkit-text-fill-color` na ciemnych zielonych/niebieskich znacznikach. Obejmuje to m.in. znaczniki danych w ćwiczeniach, numery kroków i zielony znacznik Modułu 4 w panelu bocznym. Bursztynowy znacznik zachowuje ciemny tekst, ponieważ jego tło jest jasne.

## QA
- zachowano 125 sekcji kursu,
- nie zmieniono logiki 5 testów modułowych ani dyplomu,
- nowe kontrolki mają etykiety i jedną jednoznaczną poprawną odpowiedź,
- treści CLEAR i SHARE nie wymagają informacji spoza pokazanych materiałów,
- dodano tłumaczenia angielskie nowej warstwy,
- skrypty V166 przechodzą `node --check`.

## Audyt pozostałych ćwiczeń pod kątem „czy użytkownik ma z czego odpowiedzieć?”

Przejrzano pozostałe bloki ćwiczeniowe po zmianach V163-V165. Przyjęto kryterium: odpowiedź oceniana jako poprawna nie może wymagać faktu, którego nie ma w treści zadania albo który nie został odsłonięty w poprzednim kroku.

- **SIFT** - pozostaje bez cofania; informacje o profilu, lepszych źródłach i materiale pierwotnym są odsłaniane przed odpowiadającym im pytaniem.
- **Kontekst zdjęcia** - informacje z wyszukiwania obrazem i wcześniejszej publikacji są pokazane przed pytaniami o datę, miejsce i kontekst.
- **„64%”** - liczebność próby, brzmienie pytania i brak pomiaru pre/post są podane jawnie przed czterema pytaniami.
- **Starsze ćwiczenia analityczne** - pozostawiono, ponieważ pracują na materiale pokazanym bezpośrednio w sekcji lub pytają o procedurę sprawdzania, a nie o ukryty wynik sprawdzenia.
- **Ćwiczenia refleksyjne** - pozostają rozpoznawalne jako refleksja/samoocena i nie udają pytań z jedną poprawną odpowiedzią.

Największy problem dotyczył CLEAR i SHARE: zbyt wiele kroków było zamienionych w osobne pytania. W V166 oba modele wracają do roli narzędzia porządkującego, a nie „quizu z akronimu”.
