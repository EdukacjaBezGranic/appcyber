# V171 - Studium przypadku Polska-Czechy (28.08.2026)

## Zakres
- Zastąpiono fikcyjny „Praktyczny przykład do analizy” w Module 3 rzeczywistym studium przypadku z sierpnia 2026.
- Zachowano identyfikator sekcji, numer 17 oraz logikę postępu - liczba sekcji kursu nie zmienia się.
- Wykorzystano 6 zrzutów ekranu przekazanych przez użytkownika.
- Studium pokazuje sekwencję: materiały dezinformacyjne -> pozorne potwierdzenia -> transgraniczny charakter operacji -> reakcja mediów i fact-checkerów -> społeczna kontrreakcja i memy.
- Atrybucja została opisana ostrożnie: rosyjski trop był wskazywany, lecz publiczne źródła nie potwierdzają jednoznacznie sprawcy.
- Dodano jedno pytanie kontrolne o pozór niezależnych potwierdzeń.
- Dodano krytyczny komentarz, że kontrnarracja może sama przenosić polaryzację na inną grupę.
- Dodano wersję angielską nowych tekstów w słowniku kursu.

## Źródła publiczne użyte do redakcji
- Seznam Zprávy, 25.08.2026.
- Demagog, 26.08.2026.
- iROZHLAS, 25.08.2026.
- CyberDefence24, 17 i 27.08.2026.

## UX
- Galeria ma 2 kolumny na desktopie i 1 kolumnę na telefonie.
- Różne proporcje screenshotów są wyświetlane przez `object-fit: contain`, bez przycinania treści.
- Kółka numeracji w mechanizmie mają wymuszony jasny tekst na ciemnozielonym tle.

## QA
- 125 sekcji / 125 unikalnych identyfikatorów - bez zmiany logiki postępu.
- 6/6 nowych obrazów istnieje lokalnie i jest podłączonych do sekcji.
- 0 brakujących lokalnych odwołań w głównym HTML.
- Nowy JavaScript oraz główny słownik i18n przechodzą `node --check`.
- Wszystkie nowe radio-buttony mają etykiety.
- W nowych tekstach nie użyto długiego myślnika.
- Próba automatycznego renderu przez lokalny Chromium zawiesiła się w środowisku wykonawczym; nie deklarowano więc pełnego screenshot-QA.
