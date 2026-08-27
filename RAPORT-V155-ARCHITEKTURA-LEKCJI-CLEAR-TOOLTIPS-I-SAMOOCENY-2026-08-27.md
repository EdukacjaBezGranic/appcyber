# RAPORT V155 — architektura lekcji, CLEAR, tooltips i samooceny

**Data:** 27.08.2026  
**Baza:** V154  
**Zakres:** kurs online `kurs-fake-news.html`

## Zasada redakcyjna

V155 **nie skraca treści merytorycznej kursu**. Zmiany dotyczą architektury, kolejności, progresywnego ujawniania treści oraz sposobu prezentacji ćwiczeń i definicji. W miejscach wymagających lepszego przejścia dodano krótkie fragmenty narracyjne w istniejącym stylu kursu.

Kontrola objętości głównej treści:
- V154: ok. **39 131 słów**,
- V155: ok. **39 880 słów**,
- liczba sekcji kursu: **125 → 125**.

## 1. Krótsze lekcje wewnątrz istniejących modułów

Nie utworzono nowych modułów zaliczeniowych. Kurs nadal ma **5 modułów, 5 testów i dotychczasową logikę dyplomu**.

### Moduł 3
- **Lekcja 3A — Jak zbudowany jest zmanipulowany przekaz**
- **Lekcja 3B — Jak manipulacja działa w tematach wrażliwych**

### Moduł 4
- **Lekcja 4A — Od twierdzenia do dowodów**
- **Lekcja 4B — Od kontekstu do udokumentowanego wniosku**

### Moduł 5
- **Lekcja 5A — Od wyniku weryfikacji do decyzji**
- **Lekcja 5B — Jak reagować bez wzmacniania dezinformacji**
- **Lekcja 5C — Odporność informacyjna i odpowiedzialne uczestnictwo**

W planie kursu lekcje są zwijanymi grupami. Dzięki temu Moduł 5 nie otwiera jednocześnie pełnej listy kilkudziesięciu tematów.

## 2. CLEAR przeniesiony do Modułu 5

Do Modułu 5 przeniesiono cały logiczny blok „od dowodu do decyzji”:
- CLEAR — wprowadzenie,
- zastosowanie CLEAR,
- AI jako wsparcie decyzji,
- MAIL w praktyce decyzji,
- AILit w praktyce decyzji,
- checklistę przed decyzją lub udostępnieniem,
- przykład decyzji opartej na dowodach,
- słownik dotyczący decyzji,
- refleksję „moja zasada przed decyzją”.

Moduł 4 kończy się dzięki temu na pytaniu: **„co wynika z dowodów?”**, a Moduł 5 przejmuje pytanie: **„co rozsądnie zrobić z tym wynikiem?”**.

Samoocena Modułu 4 pozostała w Module 4 i została skupiona na zachowaniach związanych z weryfikacją źródeł i dowodów.

## 3. MAIL i AILit — „Dla dociekliwych”

Treści MAIL i AILit nie zostały usunięte ani skrócone. Zostały umieszczone w rozwijanych blokach **„Dla dociekliwych”**, aby nazwy ram nie konkurowały z główną osią kursu.

Główna ścieżka pozostaje oparta na praktycznym rozumowaniu i na końcowym skrócie:
**Zatrzymaj → Sprawdź → Zareaguj**.

## 4. Inteligentny słownik i tooltips

Pełne słowniki zachowano, ale umieszczono w rozwijanych blokach **„Słownik podręczny”**.

W treści dodano tooltips dla wybranych pojęć, m.in.:
- czytanie lateralne,
- triangulacja,
- cross-check,
- fact-check,
- deepfake,
- debunking,
- prebunking,
- doomscrolling.

Obsługa:
- laptop/desktop — najechanie kursorem,
- klawiatura — fokus,
- urządzenie dotykowe — dotknięcie elementu.

## 5. Moduł 1 — ekonomia uwagi

Nie usunięto ani nie skrócono 25-minutowej sekcji. Istniejący podział został wyraźniej oznaczony:
- **Część I — Uwaga ma wartość — ok. 12 min**,
- **Część II — Po pierwszym kliknięciu — ok. 13 min**.

Dzięki temu uczestnik widzi dwa krótsze etapy bez utraty ciągłości treści i bez zmiany mechaniki ukończenia sekcji.

## 6. Nowa mini-symulacja „popularność ≠ prawdziwość”

W Module 1 dodano post z:
- 24,8 tys. polubień,
- 8,1 tys. udostępnień,
- 1,7 tys. komentarzy.

Uczestnik odpowiada, co można wywnioskować wyłącznie z tych danych. Poprawny wniosek: **duże zaangażowanie nie potwierdza prawdziwości twierdzenia**.

Ćwiczenie ma przycisk sprawdzenia odpowiedzi i informację zwrotną w wersji polskiej i angielskiej.

## 7. Behawioralne samooceny

Samooceny w Modułach 2, 4 i 5 zostały przepisane z deklaracji typu „rozpoznaję / rozumiem / potrafię” na opis konkretnych zachowań.

Skala otrzymała znaczenie częstotliwości:
**1 — nigdy · 2 — rzadko · 3 — czasami · 4 — często · 5 — prawie zawsze**.

Przykładowe zachowania:
- pauza przed reakcją na silną emocję,
- sprawdzanie źródła przy presji czasu,
- szukanie dowodów przeciwnych własnemu przekonaniu,
- wychodzenie poza stronę nadawcy podczas oceny źródła,
- samodzielne sprawdzanie źródeł wskazanych przez AI,
- zatrzymanie przewijania przy przeciążeniu,
- odnoszenie się do twierdzenia zamiast atakowania osoby.

## 8. Matryca „technologia + psychologia + relacje”

Tabela w Module 2 została zmieniona w trzykolumnową infografikę systemową. **Wszystkie treści z tabeli zachowano**. Dodano tylko zdanie podsumowujące zależność między trzema warstwami.

Na urządzeniach mobilnych infografika przechodzi do układu jednokolumnowego.

## 9. Spójność techniczna

Zweryfikowano:
- 125 sekcji przed i po zmianie,
- zgodność `data-module-number` z nowym przypisaniem,
- numerację sekcji po przeniesieniu,
- zgodność odnośników planu kursu z identyfikatorami sekcji,
- obecność wszystkich lokalnych plików wskazanych w HTML,
- składnię nowych skryptów JavaScript,
- brak zmiany mechaniki 5 testów i warunku dyplomu.

## Nowe pliki

- `assets/v155-learning-architecture-20260827.css`
- `assets/v155-learning-architecture-20260827.js`
- `assets/v155-learning-architecture-i18n-20260827.js`
- `RAPORT-V155-ARCHITEKTURA-LEKCJI-CLEAR-TOOLTIPS-I-SAMOOCENY-2026-08-27.md`

