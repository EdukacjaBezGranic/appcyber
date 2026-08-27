# V153 — uruchomienie anonimowej ankiety Google Forms

## 1. Utwórz formularze na oficjalnym koncie
1. Zaloguj się na oficjalne konto Google, na którym mają znajdować się formularze i odpowiedzi.
2. Otwórz `script.google.com` i utwórz nowy projekt Apps Script.
3. Usuń przykładową zawartość pliku `Code.gs`.
4. Wklej zawartość pliku `GOOGLE-APPS-SCRIPT-ANKIETA-EWALUACYJNA-V153.gs`.
5. Uruchom funkcję `createCourseEvaluationForms()`.
6. Przy pierwszym uruchomieniu zaakceptuj wymagane uprawnienia Google Forms i Google Sheets.

Skrypt utworzy dwa formularze — PL i EN — oraz jeden arkusz odpowiedzi. Linki znajdziesz w dzienniku wykonania i w karcie `START` arkusza.

## 2. Sprawdź anonimowość
Skrypt ustawia:
- zbieranie adresów e-mail — wyłączone,
- limit jednej odpowiedzi na użytkownika — wyłączony,
- brak pytań o imię, nazwisko, stanowisko i jednostkę,
- brak możliwości edycji odpowiedzi po wysłaniu,
- brak publicznego podsumowania odpowiedzi.

**Google Workspace może mieć własne reguły organizacji.** Otwórz oba formularze i ręcznie sprawdź ustawienia dostępu dla respondentów. Formularz przeznaczony dla anonimowych uczestników nie powinien wymagać logowania ani ograniczać dostępu wyłącznie do użytkowników domeny, chyba że organizacja świadomie zdecyduje inaczej.

## 3. Podepnij formularze do kursu
Otwórz:

`assets/v153-evaluation-config-20260827.js`

Wklej linki respondentów w dwóch polach:

```js
const FORM_URLS={
  pl:"TU_WKLEJ_LINK_PL",
  en:"TU_WKLEJ_LINK_EN"
};
```

Użyj linków do **wypełniania** formularza (`.../viewform` lub `forms.gle/...`), nie linków kończących się na `/edit`.

Po zapisaniu pliku przycisk w ekranie „Podsumuj kurs, zanim przejdziesz do dyplomu” uaktywni się automatycznie.

## 4. Jak czytać wyniki
Arkusz `WSKAŹNIKI` zawiera prostą instrukcję interpretacji:
- deklarowane poszerzenie wiedzy,
- wzrost motywacji do dalszego zgłębiania tematu,
- wzrost pewności podczas weryfikacji,
- deklarowaną zmianę zachowania,
- ocenę przystępności, przykładów, ćwiczeń i sposobu prowadzenia kursu.

Pytania „przed kursem” mają charakter **retrospektywnej samooceny wypełnianej po kursie**. Nie zastępują obiektywnego pre-testu/post-testu. Wyniki quizów modułowych należy analizować osobno.
