# V154 — aktywne linki anonimowej ankiety Google Forms PL/EN

Data: 27.08.2026  
Baza: V153

## Cel
Podłączyć do końcowego ekranu „Podsumowanie kursu” rzeczywiste formularze Google Forms utworzone na oficjalnym koncie, zachowując automatyczny wybór formularza zgodnie z językiem kursu.

## Podłączone formularze
- PL — `https://docs.google.com/forms/d/e/1FAIpQLScPPHIwXHXyN3Gay4if8j3f4Uixz64qzAqrEvk0Ff5drKvs9w/viewform?usp=dialog`
- EN — `https://docs.google.com/forms/d/e/1FAIpQLScAuYaZnnhjZC5ZuNcaKM-eeZT_kfVm-IagbaYjb9-NRMgSmA/viewform?usp=dialog`

## Zmiany
- dodano `assets/v154-evaluation-config-20260827.js`;
- usunięto pustą konfigurację V153 z aktywnego wydania;
- przycisk ankiety jest aktywny od razu po załadowaniu kursu;
- w wersji PL otwiera formularz polski;
- po zmianie języka na EN otwiera formularz angielski;
- po ponownym przełączeniu na PL wraca do formularza polskiego;
- formularz otwiera się w nowej karcie;
- ankieta pozostaje dobrowolna i nie warunkuje odblokowania dyplomu.

## Prywatność
Konfiguracja kursu nie przekazuje do formularza danych uczestnika ani danych o postępie w kursie. Formularze zostały przygotowane w V153 bez zbierania adresów e-mail i bez pytań identyfikacyjnych. Ustawienia konta Google Workspace należy nadal kontrolować po stronie oficjalnego konta, ponieważ zasady domeny mogą być nadrzędne wobec ustawień formularza.

## Testy wydania
W V154 sprawdzono:
- obecność obu adresów formularzy w aktywnej konfiguracji;
- brak pustych wartości `pl` / `en`;
- zgodność adresów z dozwolonym wzorcem `https://docs.google.com/forms/...`;
- pojedyncze podłączenie konfiguracji V154 w `kurs-fake-news.html`;
- brak aktywnego odwołania do konfiguracji V153;
- zachowanie 125 sekcji kursu: 10 + 16 + 21 + 34 + 44;
- brak zduplikowanych ID;
- kompletność lokalnych zasobów;
- składnię JavaScript;
- strukturę quizów;
- integralność ZIP po ponownym rozpakowaniu.

### Weryfikacja zewnętrzna formularzy
Automatyczne otwarcie stron Google Forms przez używane środowisko webowe nie powiodło się z powodu ograniczenia pobierania strony Google Forms (`Cache miss`). Adresy w wydaniu są więc dokładnie adresami respondentów przekazanymi przez użytkownika; nie oznaczono zewnętrznego testu Google Forms jako wykonanego.
