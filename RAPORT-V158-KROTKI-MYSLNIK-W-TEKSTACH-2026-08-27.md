# V158 - krótki myślnik w tekstach

Data: 2026-08-27

## Zakres

- Długie myślniki w tekstach widocznych dla użytkownika zastąpiono zwykłym znakiem `-`.
- Zmiana objęła polskie i angielskie treści kursu, strony portalu, materiały stacjonarne oraz teksty interaktywne generowane przez JavaScript.
- Łącznie zmieniono 1819 wystąpień w 50 plikach źródłowych.
- Nie zmieniano treści merytorycznej, struktury modułów, testów, postępu ani logiki aplikacji.
- Zachowano techniczne znaki w kodzie, jeżeli są elementem mechanizmu typograficznego lub interfejsu, a nie tekstem dla użytkownika.

## Kontrola

- Sprawdzono składnię wszystkich plików JavaScript.
- Długie myślniki nie występują już w treściach HTML i tekstach generowanych przez skrypty, z wyjątkiem technicznej klasy znaków w mechanizmie typograficznym, która musi rozpoznawać również starszą treść.
