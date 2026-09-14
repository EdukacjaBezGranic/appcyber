# Raport zmian V193 — podgląd danych z CMS

## Naprawiony problem

Przycisk podglądu otwierał wcześniej zwykłą stronę startową, która korzystała z niezmienionego pliku danych na dysku. Zmiany zapisane w pamięci CMS-u nie mogły być na niej widoczne przed eksportem nowego ZIP-a.

## Wprowadzone rozwiązanie

- przycisk otrzymał jednoznaczną nazwę „Podgląd zapisów”;
- podgląd otwiera stronę `zapisy.html`;
- CMS przesyła do otwartego podglądu bieżący zestaw danych;
- lista szkoleń i osadzony kalendarz ponownie renderują się po otrzymaniu danych;
- zapis kolejnej zmiany automatycznie aktualizuje już otwarte okno podglądu;
- zmiana daty, statusu „Zapisy otwarte” oraz opcji „Brak wolnych miejsc” jest widoczna bez eksportowania paczki.

Zmiany są nadal zapisywane trwale w plikach projektu dopiero po wybraniu „Eksportuj projekt ZIP”. Podgląd służy do sprawdzenia bieżącej wersji roboczej.
