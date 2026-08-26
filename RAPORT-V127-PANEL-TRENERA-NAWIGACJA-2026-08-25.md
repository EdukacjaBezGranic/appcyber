# V127 — Panel trenera w górnej nawigacji

Naprawiono źródłową przyczynę braku pozycji „Panel trenera”.

`assets/public.js` po załadowaniu strony przebudowywał zawartość `.site-nav` z tablicy `publicNavItems`, w której brakowało Panelu trenera. W efekcie link obecny w HTML był usuwany przez JavaScript.

W V127 `publicNavItems` zawiera kolejno:
1. Start
2. Nasze szkolenia
3. Zapisy na szkolenia
4. Kursy online
5. Kontakt
6. Panel trenera

Panel trenera zachowuje klasę `nav-trainer`, poprawnie otrzymuje `aria-current=page` na swojej stronie i podlega tłumaczeniu PL/EN.
