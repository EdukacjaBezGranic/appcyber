# RAPORT V176
## Redukcja powtórzeń i poprawa płynności kursu

**Data:** 30.08.2026  
**Baza:** V175

## Cel zmiany

Kurs zawierał pełną treść merytoryczną, a następnie dodatkową warstwę narracyjną V150: 31 bloków narratora oraz 80 przejść między sekcjami. W wielu punktach warstwa ta streszczała tezę, która chwilę później ponownie pojawiała się w przykładzie, tabeli, wyjaśnieniu albo podsumowaniu. Powodowało to wrażenie krążenia wokół tych samych myśli.

## Zmiana systemowa

- wyciszono dodatkowe bloki narratora V150 w całym kursie;
- wyciszono mechaniczne przejścia umieszczane na końcu niemal każdej sekcji;
- zachowano właściwą treść merytoryczną, przykłady, tabele, infografiki, ćwiczenia, podsumowania modułów i nawigację;
- nie zmieniono identyfikatorów sekcji, warunków zaliczenia ani zapisu postępu;
- zmiana obejmuje równocześnie polską i angielską wersję kursu.

## Redakcja punktowa

W sekcji „Od modelu redakcyjnego do obiegu sieciowego”:

- skrócono ponowne wyjaśnienie modelu redakcyjnego z trzech akapitów do jednego;
- połączono dwa akapity opisujące role użytkownika;
- usunięto jeden z dwóch sąsiadujących bloków podsumowujących tę samą zmianę;
- uproszczono instrukcję ćwiczenia 1.3 i usunięto powtórzenie polecenia nad kartami.

W sekcji „Informacja jako produkt” skrócono zastrzeżenie dotyczące metafory produktu, tak aby nie powtarzało definicji wyświetlanej bezpośrednio przed nim.

## Zasada na dalszą redakcję

Każdy element powinien pełnić inną funkcję:

- przykład otwiera problem;
- wyjaśnienie nazywa mechanizm;
- tabela lub infografika porządkuje zależności;
- ćwiczenie pozwala zastosować wiedzę;
- podsumowanie zostawia jedną zasadę do zapamiętania.

Nie powtarzamy tej samej tezy w osobnym wprowadzeniu, przejściu i dwóch blokach końcowych.

## Skala redukcji

- 31 bloków narratora: 1897 słów wyciszonych;
- 80 przejść między sekcjami: 2129 słów wyciszonych;
- łącznie: 4026 słów mniej w widocznej warstwie kursu;
- sekcja „Od modelu redakcyjnego do obiegu sieciowego”: około 793 → 558 słów tekstu statycznego, bez usuwania ćwiczenia i materiałów wizualnych.

## Kontrola techniczna

- 125/125 sekcji zachowanych;
- duplikaty identyfikatorów: 0;
- brakujące lokalne odwołania do plików: 0;
- składnia wszystkich plików JavaScript: poprawna;
- nowy arkusz CSS i słownik PL/EN podłączone dokładnie raz;
- strona kursu oraz oba nowe zasoby zwracają lokalnie HTTP 200;
- automatyczny podgląd w przeglądarce chmurowej został zablokowany dla adresu lokalnego błędem `ERR_BLOCKED_BY_CLIENT`, dlatego nie jest przedstawiany jako wykonany test wizualny.
