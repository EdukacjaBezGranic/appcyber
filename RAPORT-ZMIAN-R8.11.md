# Raport zmian R8.11

## K jak kompetencje

Do katalogu dodano pełną kartę szkolenia „K jak kompetencje – wsparcie w rozwoju kluczowych kompetencji społecznych i przedsiębiorczych”. Karta zawiera opis celu, kompetencji, metod pracy i odbiorców oraz odsyła do informacji o zapisach i kontaktu.

Na stronie zapisów udostępniono sekcję pozostałych szkoleń i dodano rozbudowaną kartę nowej propozycji. Ponieważ plakat nie zawiera potwierdzonych w treści strony danych o terminie, miejscu i warunkach udziału, nie zostały one dopisane. Kod QR został celowo pominięty zgodnie z decyzją użytkownika.

## Responsywność

Nowa sekcja ma osobny układ dla dużych ekranów, tabletów i telefonów. Na mniejszych ekranach kolumny przechodzą w jeden ciąg, grafika traci pozycję przyklejoną, przyciski zajmują pełną szerokość, a w poziomym widoku o małej wysokości proporcje kolumn są ograniczone.

## Kontrola

- składnia `assets/site-data.js` sprawdzona przez Node.js,
- zweryfikowano obecność obrazu i lokalnych odnośników,
- paczka ZIP sprawdzona poleceniem `unzip -t`,
- bezpośredni podgląd w przeglądarce chmurowej był blokowany dla adresu lokalnego, dlatego wykonano kontrolę statyczną struktury i reguł responsywnych.
