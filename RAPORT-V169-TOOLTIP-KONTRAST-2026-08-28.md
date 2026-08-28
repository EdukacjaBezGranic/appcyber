# V169 - poprawa kontrastu tooltipow

- Naprawiono globalnie kontrast tekstu w tooltipach terminologicznych.
- Tooltip zachowuje ciemne tlo `#17231e` oraz bialy tekst niezaleznie od szerokich regul typografii komponentow.
- Dodano jawny `-webkit-text-fill-color:#fff`, aby Safari/iOS nie dziedziczyl koloru z elementu nadrzednego.
- Zachowano obecne zachowanie: hover/focus na laptopie oraz tooltip przy dolnej krawedzi na telefonie i tablecie.
- Test CSS cascade: desktop i mobile daja `color: rgb(255,255,255)` oraz `background: rgb(23,35,30)`.
