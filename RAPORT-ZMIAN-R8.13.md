# Raport zmian R8.13

Naprawiono krytyczny błąd układu strony głównej w sekcji „Jak działa projekt”. Przyczyną były zapisane bezpośrednio w HTML ręczne przesunięcia, szerokości i wysokości CMS dla kilku różnych rozmiarów ekranu. W określonych szerokościach nakładały się one na reguły responsywne, ściskały tekst do bardzo wąskiej kolumny i przesuwały logotyp UE.

Usunięto te historyczne ustawienia z elementów sekcji i dodano końcową regułę stabilizującą siatkę, naturalne zawijanie tekstu oraz skalowanie logotypu na laptopie, tablecie, telefonie i w orientacji poziomej.
