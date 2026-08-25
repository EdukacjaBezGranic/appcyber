# V111 - poprawki mobilne

Baza: V108.

## Zakres
- naprawa pól radio i checkbox w ćwiczeniach kursu; brak pionowego łamania odpowiedzi,
- reset historycznych przesunięć CMS na telefonie/tablecie,
- stabilne marginesy i szerokości sekcji publicznych,
- mniejsza, kontrolowana typografia nagłówków mobilnych,
- poprawa sekcji Kontakt / Zapytanie o organizację szkolenia,
- poprawa sekcji Kompetencje potrzebne dziś i w przyszłości,
- poprawa CTA Chcesz zorganizować szkolenie,
- poprawa terminarza i jego kontrolek,
- bardziej zwarta stopka mobilna.

## QA
Pełne otwarcie lokalnego serwera w Chromium jest blokowane przez politykę środowiska (`ERR_BLOCKED_BY_ADMINISTRATOR`).
Wykonano izolowane rendery Chromium 390 px dla komponentów problemowych:
- ćwiczenie 1.1: każda odpowiedź 306 px, brak overflow i pionowego łamania,
- Contact grid: 358/358 px scrollWidth/clientWidth,
- Training CTA: 358/358 px,
- Training topics: 390/390 px,
- Calendar section: 358/358 px.
