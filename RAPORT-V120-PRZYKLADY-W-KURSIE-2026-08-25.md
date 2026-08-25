# V120 — przykłady w kursie: case studies PL/EN

Baza: V119.

## Dodane przykłady
1. Moduł 2 / „Dlaczego negatywne informacje przyciągają uwagę?” — sponsorowany post z dramatycznym komunikatem (clickbait, szok, niedopowiedzenie).
2. Moduł 2 / „Efekt powtarzania i iluzoryczna prawda” — seria alarmistycznych nagłówków dotyczących migracji.
3. Moduł 3 / „Manipulowanie źródłem i podszywanie się” — materiał stylizowany na przekaz BBC News.
4. Moduł 3 / „Manipulowanie językiem i formą przekazu” — alarmistyczny pasek informacyjny.
5. Moduł 4 / „Krok 1. Wybierz twierdzenie, które można sprawdzić” — archiwalny post z twierdzeniem o śmierci znanej osoby.
6. Moduł 4 / „Krok 3. Sprawdź nadawcę – czytaj lateralnie” — sponsorowana reklama wykorzystująca zdjęcie osoby prowadzonej przez policję.

## Sposób prezentacji
- przykłady nie tworzą nowych tematów i nie zmieniają mechaniki postępu;
- każdy case ma obraz, 3 pytania do analizy, zwijane omówienie i notę edukacyjną;
- materiały polityczne nie są automatycznie oznaczane jako prawda/fałsz — ćwiczenia koncentrują się na metodzie analizy i weryfikacji;
- PL/EN: dodano osobny słownik `course-case-i18n-v120.js`;
- obrazy przekonwertowano do WebP i umieszczono w `assets/img/course-cases/`.

## QA
- 6/6 case studies obecnych w HTML;
- 6/6 obrazów istnieje;
- render izolowany: 390 px i 1200 px bez poziomego overflow;
- wszystkie JS przechodzą `node --check`;
- wszystkie lokalne odwołania HTML sprawdzone bez braków;
- pełna nawigacja strony w lokalnym Chromium jest blokowana polityką środowiska (`ERR_BLOCKED_BY_ADMINISTRATOR`), dlatego QA renderu wykonano na izolowanych komponentach.
