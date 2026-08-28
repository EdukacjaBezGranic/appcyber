# V163 - przebudowa ćwiczeń praktycznych i audyt jasności

Data: 27.08.2026

## Zasada redakcyjna

Ćwiczenie rdzeniowe ma prowadzić uczestnika przez konkretną sytuację: sytuacja -> dane -> działanie -> informacja zwrotna -> model/checklista jako podsumowanie. Nie wymagamy od uczestnika wymyślania materiału tylko po to, aby obsłużyć formularz.

## Przebudowane ćwiczenia

1. **Kontekst materiału: data, miejsce, cytat i pełny opis**
   - usunięto pustą checklistę wymagającą własnego materiału,
   - dodano fikcyjny post o „dzisiejszym proteście w Katowicach”,
   - uczestnik dostaje cztery informacje z weryfikacji i odpowiada na pytania o datę, miejsce, fałszywy kontekst i decyzję,
   - po ćwiczeniu pozostaje statyczne podsumowanie czterech pytań kontrolnych.

2. **SIFT**
   - zachowano przebudowę V161: pięć etapów symulacji, nowe informacje odsłaniane krok po kroku i decyzja dopiero po dotarciu do kontekstu.

3. **Praktyczny przykład: zdjęcie w fałszywym kontekście**
   - zachowano praktyczną podpowiedź użycia Google Lens,
   - zachowano zestaw narzędzi do codziennej weryfikacji: wyszukiwarka, Google Lens, Fact Check Explorer, Wayback Machine, mapy/Street View, źródła pierwotne i AI jako pomocnik.

4. **CLEAR: od dowodu do decyzji**
   - formularz „wybierz własną decyzję” zastąpiono konkretną fikcyjną sytuacją dotyczącą narzędzia AI reklamowanego jako „99% trafności”,
   - uczestnik otrzymuje reklamę, opis dokumentacji, opis testu i niezależną ocenę,
   - przechodzi przez C, L, E, A i R na podstawie podanych danych,
   - każda odpowiedź otrzymuje informację zwrotną.

5. **Checklista przed decyzją lub udostępnieniem**
   - sekcję przemianowano na „Od danych do decyzji: czy dowody wystarczają?”,
   - pustą checklistę zastąpiono fikcyjnym przypadkiem ankiety szkoleniowej „64%”,
   - uczestnik odróżnia deklarowaną opinię od pomiaru kompetencji, wskazuje ograniczenia, dobiera potrzebny dowód i formułuje proporcjonalną decyzję,
   - pełna checklista została zachowana jako rozwijane podsumowanie po wykonaniu ćwiczenia.

6. **SHARE**
   - formularz wymagający własnego posta zastąpiono lokalnym, codziennym scenariuszem o błędnej informacji dotyczącej zamknięcia parkingu,
   - uczestnik przechodzi przez Source, Harm, Accuracy, Reason, Emotion i decyzję,
   - prawidłowa reakcja polega na niepowielaniu błędnego zrzutu i przekazaniu sprawdzonego komunikatu źródłowego.

7. **Rozkładanie narracji na części**
   - pozostawiono narzędzie do pracy własnej, ponieważ taki jest jego cel,
   - dodano gotowy fikcyjny materiał awaryjny dla osoby, która nie ma własnego posta do analizy.

## Ćwiczenia pozostawione jako refleksja / samoocena

Nie przebudowywano samoocen, diagnoz nawyków, planu odporności informacyjnej, zdrowej rutyny medialnej ani ćwiczeń odnoszących się do ostatnich 24 godzin. W tych miejscach praca na własnym zachowaniu jest właściwą mechaniką, a nie brakiem kontekstu.

## Materiały „Dla dociekliwych”

Wszystkie 7 sekcji oznaczonych „Dla dociekliwych” pozostają opcjonalne:
- nie mają przycisku „Oznacz ukończone”,
- nie wpływają na postęp kursu,
- w planie kursu są oznaczone jako opcjonalne.

Bibliografia również nie jest elementem wymaganym do ukończenia; poprawiono jej oznaczenie w planie kursu, aby nie wyświetlała znacznika ukończenia.

## Dodatkowa korekta spójności

Po wcześniejszym przeniesieniu treści pomiędzy modułami poprawiono stare liczby w interfejsie:
- Moduł 4: 25 tematów,
- Moduł 5: 53 tematy.

## QA statyczne

- 125 sekcji kursu - zachowane,
- 117 sekcji wymaganych - zachowane,
- 117 przycisków ukończenia i 117 znaczników ukończenia w nawigacji - zgodne,
- 8 elementów niewymaganych (7 „Dla dociekliwych” + bibliografia),
- wszystkie 125 linków nawigacji prowadzą do istniejących sekcji,
- 4 nowe scenariusze V163 zawierają łącznie 19 pytań; każde ma dokładnie wskazaną poprawną odpowiedź,
- brak brakujących lokalnych plików CSS/JS/obrazów,
- składnia nowych i zmienionych plików JavaScript sprawdzona przez `node --check`,
- przygotowano angielskie tłumaczenia nowych treści i komunikatów.

## Ograniczenie testu renderowanego

Próba uruchomienia automatycznej walidacji renderowanej strony przez lokalny Chromium/Playwright została zablokowana przez politykę środowiska (`ERR_BLOCKED_BY_ADMINISTRATOR`). Wykonano więc pełną walidację struktury HTML, referencji, logiki odpowiedzi i składni JS, ale bez automatycznego zrzutu renderowanego widoku w tym środowisku.
