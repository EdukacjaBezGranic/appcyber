# V168 - pozycja etykiety poprawnej i błędnej odpowiedzi

## Problem
W komponentach opartych na dwukolumnowym gridzie `[kontrolka | tekst]` etykieta `✓ Poprawna odpowiedź` / `✕ Błędna odpowiedź` była dodawana jako trzeci element labela. Algorytm gridu umieszczał ją w kolejnym wierszu pod pierwszą kolumną, przez co komunikat pojawiał się przy lewej krawędzi kafla.

## Zmiana
- badge jest teraz dodawany do spana zawierającego tekst odpowiedzi;
- pojawia się pod tekstem odpowiedzi, w tej samej kolumnie;
- rozwiązanie obejmuje CLEAR, SHARE, SIFT, ćwiczenia V155/V163/V166 oraz testy modułowe;
- dodano fallback dla nietypowych etykiet bez osobnego spana tekstowego;
- zachowano zielony/czerwony stan całego kafla i komunikat tekstowy, więc wynik nie opiera się tylko na kolorze.

## Zakres
Zmiana wyłącznie UI. Bez zmian w treści, poprawnych odpowiedziach, punktacji, postępie i warunkach zaliczenia.
