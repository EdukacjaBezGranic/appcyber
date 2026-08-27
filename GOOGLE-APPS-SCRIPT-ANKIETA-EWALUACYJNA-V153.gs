/**
 * EDUKACJA BEZ GRANIC — anonimowa ankieta ewaluacyjna kursu
 * Wersja V153, 27.08.2026
 *
 * Uruchom funkcję createCourseEvaluationForms() na oficjalnym koncie Google.
 * Skrypt tworzy:
 *  - formularz PL,
 *  - formularz EN,
 *  - jeden arkusz Google Sheets na odpowiedzi obu formularzy,
 *  - kartę START z linkami i checklistą prywatności,
 *  - kartę WSKAŹNIKI z definicjami prostych miar ewaluacyjnych.
 *
 * ANONIMOWOŚĆ:
 *  - zbieranie e-maili: WYŁĄCZONE,
 *  - ograniczenie do jednej odpowiedzi: WYŁĄCZONE,
 *  - brak pytań o imię, nazwisko, stanowisko, jednostkę lub inne dane identyfikacyjne.
 *
 * UWAGA DLA GOOGLE WORKSPACE:
 * Administrator domeny może narzucać ograniczenia dostępu respondentów.
 * Po utworzeniu formularza sprawdź ręcznie ustawienia publikacji/odpowiadania i upewnij się,
 * że formularz nie wymaga logowania oraz jest dostępny dla właściwej grupy odbiorców.
 */

function createCourseEvaluationForms() {
  const spreadsheet = SpreadsheetApp.create('Ewaluacja kursu Media Literacy — odpowiedzi anonimowe');
  const startSheet = spreadsheet.getSheets()[0];
  startSheet.setName('START');

  const pl = buildEvaluationForm_('pl', spreadsheet.getId());
  const en = buildEvaluationForm_('en', spreadsheet.getId());

  writeStartSheet_(startSheet, pl, en, spreadsheet.getUrl());
  writeMetricsSheet_(spreadsheet);
  SpreadsheetApp.flush();

  Logger.log('=== GOTOWE ===');
  Logger.log('Arkusz odpowiedzi: ' + spreadsheet.getUrl());
  Logger.log('PL — link dla uczestnika: ' + pl.publishedUrl);
  Logger.log('PL — link do edycji: ' + pl.editUrl);
  Logger.log('EN — link dla uczestnika: ' + en.publishedUrl);
  Logger.log('EN — link do edycji: ' + en.editUrl);
  Logger.log('');
  Logger.log('WAŻNE: ręcznie sprawdź w obu formularzach, czy konto Workspace nie wymusza logowania lub ograniczenia do domeny.');

  return {
    spreadsheetUrl: spreadsheet.getUrl(),
    pl: pl,
    en: en
  };
}

function buildEvaluationForm_(language, spreadsheetId) {
  const t = SURVEY_TEXT_[language];
  const form = FormApp.create(t.title, false);

  form
    .setDescription(t.description)
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setAllowResponseEdits(false)
    .setPublishingSummary(false)
    .setShowLinkToRespondAgain(false)
    .setShuffleQuestions(false)
    .setProgressBar(true)
    .setIsQuiz(false)
    .setConfirmationMessage(t.confirmation);

  form.addSectionHeaderItem().setTitle(t.section1Title).setHelpText(t.section1Help);

  addScale_(form, t.qKnowledgeBefore, t.lowKnowledge, t.highKnowledge, true);
  addScale_(form, t.qKnowledgeAfter, t.lowKnowledge, t.highKnowledge, true);
  addScale_(form, t.qKnowledgeExpanded, t.disagree, t.agree, true);
  addScale_(form, t.qConfidence, t.notAtAll, t.veryMuch, true);
  addScale_(form, t.qBehaviour, t.disagree, t.agree, true);

  form.addPageBreakItem().setTitle(t.section2Title).setHelpText(t.section2Help);

  addScale_(form, t.qMotivationBefore, t.lowMotivation, t.highMotivation, true);
  addScale_(form, t.qMotivationAfter, t.lowMotivation, t.highMotivation, true);
  addScale_(form, t.qMotivationIncreased, t.disagree, t.agree, true);

  form.addCheckboxItem()
    .setTitle(t.qTopics)
    .setChoiceValues(t.topicChoices)
    .showOtherOption(true)
    .setRequired(false);

  form.addPageBreakItem().setTitle(t.section3Title).setHelpText(t.section3Help);

  form.addGridItem()
    .setTitle(t.qExperienceGrid)
    .setRows(t.experienceRows)
    .setColumns(['1', '2', '3', '4', '5'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle(t.qMostUseful)
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle(t.qImprove)
    .setRequired(false);

  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheetId);

  if (form.supportsAdvancedResponderPermissions()) {
    form.setPublished(true);
  } else {
    form.setAcceptingResponses(true);
  }

  verifyAnonymousSettings_(form, language);

  return {
    language: language.toUpperCase(),
    formId: form.getId(),
    publishedUrl: form.getPublishedUrl(),
    editUrl: form.getEditUrl(),
    collectsEmail: form.collectsEmail(),
    limitOneResponse: form.hasLimitOneResponsePerUser()
  };
}

function addScale_(form, title, lowLabel, highLabel, required) {
  form.addScaleItem()
    .setTitle(title)
    .setBounds(1, 5)
    .setLabels(lowLabel, highLabel)
    .setRequired(required);
}

function verifyAnonymousSettings_(form, language) {
  if (form.collectsEmail()) {
    throw new Error('Formularz ' + language.toUpperCase() + ' zbiera adresy e-mail. Przerwano tworzenie.');
  }
  if (form.hasLimitOneResponsePerUser()) {
    throw new Error('Formularz ' + language.toUpperCase() + ' ogranicza odpowiedzi do jednej na użytkownika. Przerwano tworzenie.');
  }
}

function writeStartSheet_(sheet, pl, en, spreadsheetUrl) {
  const rows = [
    ['ANKIETA EWALUACYJNA — START', ''],
    ['Arkusz odpowiedzi', spreadsheetUrl],
    ['', ''],
    ['PL — link dla uczestnika', pl.publishedUrl],
    ['PL — edycja formularza', pl.editUrl],
    ['EN — link dla uczestnika', en.publishedUrl],
    ['EN — edycja formularza', en.editUrl],
    ['', ''],
    ['CHECKLISTA ANONIMOWOŚCI', ''],
    ['Zbieranie adresów e-mail', 'WYŁĄCZONE przez skrypt'],
    ['Ograniczenie do jednej odpowiedzi', 'WYŁĄCZONE przez skrypt'],
    ['Pytania o dane identyfikacyjne', 'BRAK'],
    ['Ręczna kontrola Workspace', 'Sprawdź, czy formularz nie wymaga logowania i czy ustawienia organizacji nie ograniczają respondentów do domeny.'],
    ['', ''],
    ['LINKI DO KURSU', 'Wklej publishedUrl PL i EN do pliku assets/v153-evaluation-config-20260827.js w paczce kursu.']
  ];
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet.getRange('A1:B1').setFontWeight('bold');
  sheet.getRange('A9:B9').setFontWeight('bold');
  sheet.setColumnWidth(1, 270);
  sheet.setColumnWidth(2, 700);
  sheet.setFrozenRows(1);
  sheet.getDataRange().setWrap(true).setVerticalAlignment('top');
}

function writeMetricsSheet_(spreadsheet) {
  const sheet = spreadsheet.insertSheet('WSKAŹNIKI');
  const rows = [
    ['WSKAŹNIK', 'JAK CZYTAĆ WYNIK'],
    ['Deklarowane poszerzenie wiedzy', 'Odsetek odpowiedzi 4–5 przy stwierdzeniu „Kurs poszerzył moją wiedzę…” oraz różnica między samooceną wiedzy po kursie i przed kursem.'],
    ['Wzrost motywacji do dalszej nauki', 'Odsetek osób, u których ocena motywacji po kursie jest wyższa niż retrospektywna ocena motywacji przed kursem; dodatkowo odsetek odpowiedzi 4–5 przy stwierdzeniu o zwiększeniu chęci dalszego zgłębiania tematu.'],
    ['Pewność weryfikacji', 'Średnia i odsetek odpowiedzi 4–5 przy pytaniu o pewność podczas sprawdzania źródła, kontekstu, zdjęcia lub nagrania.'],
    ['Deklarowana zmiana zachowania', 'Odsetek odpowiedzi 4–5 przy stwierdzeniu o zatrzymaniu się przed udostępnieniem lub wykorzystaniem niesprawdzonej informacji.'],
    ['Jakość doświadczenia kursu', 'Dla czterech wierszy siatki policz średnią oraz odsetek ocen 4–5.'],
    ['Uwagi jakościowe', 'Odpowiedzi otwarte grupuj tematycznie: najbardziej użyteczne elementy oraz propozycje zmian.'],
    ['', ''],
    ['UWAGA METODOLOGICZNA', 'Pytania „przed kursem” są retrospektywną samooceną wypełnianą po kursie. Pokazują deklarowaną zmianę, a nie obiektywny wynik pre-test/post-test. Wynik testów modułowych należy analizować osobno.']
  ];
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet.getRange('A1:B1').setFontWeight('bold');
  sheet.getRange('A9:B9').setFontWeight('bold');
  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 780);
  sheet.getDataRange().setWrap(true).setVerticalAlignment('top');
}

const SURVEY_TEXT_ = {
  pl: {
    title: 'Podsumowanie kursu — Media Literacy, Fake News i Krytyczne Myślenie',
    description: 'Dziękujemy za ukończenie kursu. Ankieta jest anonimowa: nie zbieramy adresu e-mail, imienia, nazwiska, stanowiska ani nazwy jednostki. Odpowiedzi wykorzystamy do oceny efektów kursu i dalszego rozwijania materiałów. W odpowiedziach otwartych nie wpisuj danych osobowych. Wypełnienie zajmuje około 3 minut.',
    confirmation: 'Dziękujemy. Twoja anonimowa odpowiedź została zapisana. Wróć do karty z kursem — możesz przejść do ekranu ukończenia i dyplomu.',
    section1Title: '1. Co zmienił kurs?',
    section1Help: 'Spójrz z perspektywy końca kursu na swoją wiedzę i sposób reagowania na informacje.',
    qKnowledgeBefore: 'Z perspektywy końca kursu: jak oceniasz swoją wiedzę o dezinformacji, media literacy i krytycznej ocenie informacji PRZED rozpoczęciem kursu?',
    qKnowledgeAfter: 'Jak oceniasz swoją wiedzę o tych zagadnieniach TERAZ, po ukończeniu kursu?',
    qKnowledgeExpanded: 'Kurs poszerzył moją wiedzę o dezinformacji, media literacy i krytycznej ocenie informacji.',
    qConfidence: 'Na ile czujesz się teraz pewniej, gdy trzeba sprawdzić źródło, kontekst, zdjęcie, nagranie lub inne twierdzenie?',
    qBehaviour: 'Po kursie częściej zatrzymam się przed udostępnieniem lub wykorzystaniem informacji, której jeszcze nie sprawdziłem/am.',
    section2Title: '2. Czy chcesz zgłębiać temat dalej?',
    section2Help: 'Interesuje nas nie tylko to, co wiesz teraz, lecz także czy kurs uruchomił ciekawość i chęć dalszej nauki.',
    qMotivationBefore: 'Z perspektywy końca kursu: jak duża była Twoja chęć dalszego zgłębiania tematu dezinformacji i krytycznej oceny informacji PRZED kursem?',
    qMotivationAfter: 'Jak duża jest Twoja chęć dalszego zgłębiania tych tematów TERAZ?',
    qMotivationIncreased: 'Kurs zwiększył moją chęć dalszego zgłębiania dezinformacji, fact-checkingu i krytycznego myślenia.',
    qTopics: 'Które zagadnienia chciał(a)byś poznać dokładniej? Możesz zaznaczyć kilka odpowiedzi.',
    topicChoices: [
      'Fact-checking i narzędzia weryfikacji',
      'Manipulacja, framing i narracje',
      'Algorytmy i media społecznościowe',
      'AI, deepfake i treści syntetyczne',
      'Psychologia podatności na dezinformację',
      'Reagowanie na dezinformację i komunikacja instytucjonalna',
      'Odporność informacyjna i higiena uwagi',
      'Na razie nie planuję pogłębiać tych tematów'
    ],
    section3Title: '3. Jak pracowało Ci się z kursem?',
    section3Help: 'Skala 1–5: 1 oznacza „zdecydowanie się nie zgadzam”, a 5 — „zdecydowanie się zgadzam”.',
    qExperienceGrid: 'Oceń poniższe stwierdzenia.',
    experienceRows: [
      'Treści były zrozumiałe i napisane przystępnym językiem.',
      'Przykłady pomagały mi zrozumieć omawiane mechanizmy.',
      'Ćwiczenia pomagały przełożyć wiedzę na praktykę.',
      'Sposób prowadzenia kursu ułatwiał przechodzenie między kolejnymi tematami.'
    ],
    qMostUseful: 'Który element kursu był dla Ciebie najbardziej użyteczny? Jeśli chcesz, napisz krótko dlaczego.',
    qImprove: 'Co powinniśmy poprawić, wyjaśnić lepiej albo rozwinąć w kolejnej wersji kursu?',
    lowKnowledge: 'Bardzo mała',
    highKnowledge: 'Bardzo duża',
    lowMotivation: 'Bardzo mała',
    highMotivation: 'Bardzo duża',
    disagree: 'Zdecydowanie się nie zgadzam',
    agree: 'Zdecydowanie się zgadzam',
    notAtAll: 'Wcale',
    veryMuch: 'Zdecydowanie'
  },
  en: {
    title: 'Course reflection — Media Literacy, Fake News and Critical Thinking',
    description: 'Thank you for completing the course. This survey is anonymous: it does not collect your email address, name, job title or organisation. Responses will be used to evaluate the course and improve future materials. Please do not enter personal data in the open-ended responses. It takes about 3 minutes.',
    confirmation: 'Thank you. Your anonymous response has been recorded. Return to the course tab to continue to the completion screen and diploma.',
    section1Title: '1. What changed after the course?',
    section1Help: 'Looking back from the end of the course, reflect on your knowledge and the way you respond to information.',
    qKnowledgeBefore: 'Looking back from the end of the course: how would you rate your knowledge of disinformation, media literacy and critical evaluation of information BEFORE starting the course?',
    qKnowledgeAfter: 'How would you rate your knowledge of these topics NOW, after completing the course?',
    qKnowledgeExpanded: 'The course broadened my knowledge of disinformation, media literacy and critical evaluation of information.',
    qConfidence: 'How much more confident do you now feel when checking a source, context, image, recording or other claim?',
    qBehaviour: 'After the course, I will be more likely to pause before sharing or using information that I have not yet checked.',
    section2Title: '2. Do you want to explore the topic further?',
    section2Help: 'We are interested not only in what you know now, but also in whether the course increased your curiosity and motivation to keep learning.',
    qMotivationBefore: 'Looking back from the end of the course: how strong was your motivation to explore disinformation and critical evaluation of information further BEFORE the course?',
    qMotivationAfter: 'How strong is your motivation to explore these topics further NOW?',
    qMotivationIncreased: 'The course increased my motivation to explore disinformation, fact-checking and critical thinking further.',
    qTopics: 'Which topics would you like to explore in more depth? You may select more than one.',
    topicChoices: [
      'Fact-checking and verification tools',
      'Manipulation, framing and narratives',
      'Algorithms and social media',
      'AI, deepfakes and synthetic content',
      'Psychology of vulnerability to disinformation',
      'Responding to disinformation and institutional communication',
      'Information resilience and attention hygiene',
      'I do not currently plan to explore these topics further'
    ],
    section3Title: '3. How did the course work for you?',
    section3Help: 'Scale 1–5: 1 means “strongly disagree” and 5 means “strongly agree”.',
    qExperienceGrid: 'Rate the statements below.',
    experienceRows: [
      'The content was clear and written in accessible language.',
      'The examples helped me understand the mechanisms discussed.',
      'The exercises helped me apply the knowledge in practice.',
      'The way the course was guided made it easier to move between topics.'
    ],
    qMostUseful: 'Which part of the course was most useful to you? If you wish, briefly explain why.',
    qImprove: 'What should we improve, explain more clearly or develop further in the next version of the course?',
    lowKnowledge: 'Very low',
    highKnowledge: 'Very high',
    lowMotivation: 'Very low',
    highMotivation: 'Very high',
    disagree: 'Strongly disagree',
    agree: 'Strongly agree',
    notAtAll: 'Not at all',
    veryMuch: 'Very much'
  }
};
