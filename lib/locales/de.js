
i18n.map('de', {
  layout: {
    // title
    // logo
    // explanation
    homeTitle: 'Startseite',
    programmingLanguagesTitle: 'Programmiersprachen',
    // adminTitle
    // mongoDBAdminTitle
    toggleNavigationButton: 'Navigation ein/ausblenden',
    unexpectedErrorMessage: 'Ein unerwarteter Fehler ist aufgetreten.\n{$1}',
  },
  account: {
    title: 'Mein Konto',
    loginTitle: 'Anmelden',
    solvedExercisesSubtitle: 'Meine gelösten Aufgaben',
    createdExercisesSubtitle: 'Meine erstellten Aufgaben',
    createdExaminationsSubtitle: 'Meine erstellten Prüfungen',
    createdExecutionSubtitle: 'Meine erstellten Prüfungsdurchführungen',
    archiveSubtitle: 'Mein Archiv',
    accountSettingsSubtitle: 'Kontoeinstellungen',
    adminSettingsSubtitle: 'Administratoreinstellungen',
    emailLabel: 'E-Mail Adresse',
    nameLabel: 'Echter Name',
    makeAdminLabel: 'zu berecht. Benutzer',
    archiveButton: 'archivieren',
    unarchiveButton: 'wiederherstellen',
    loginButton: 'anmelden',
    registerButton: 'registrieren',
    logoutButton: 'abmelden',
    logoutOtherClientsButton: 'andere Geräte abmelden',
    makeAdminButton: 'erteile Administratorenrechte',
    isAdminMessage: 'Sie sind ein autorisierter Administrator.',
    verificationSuccessMessage: 'Ihre E-Mail Adresse wurde erfolgreich verifiziert.\nSie wurden automatisch eingeloggt.',
    verificationErrorMessage: 'Die Verifizierung der E-Mail Adresse schlug fehl.\nBitte versuchen Sie es erneut.',
    passwordResetSuccessMessage: 'Ihr Passwort wurde erfolgreich zurückgesetzt.',
    passwordMismatchMessage: 'Die eingegebenen Passwörter stimmen nicht überein.',
    passwordResetErrorMessage: 'Die Zurücksetzung Ihres Passwort schlug fehl.\nBitte versuche Sie es erneut; Sie können sich auch einen neuen Link zusenden lassen.',
  },
  category: {
    createTitle: 'Erstelle Kategorie',
    editTitle: "Bearbeite Kategorie '{$1}'",
    editBreadcrumb: 'Bearbeite Kategorie',
    createButton: 'erstelle Kategorie',
    editButton: 'bearbeite Kategorie',
    isNotValidMessage: 'Diese Kategorie ist nicht gültig und kann nicht gespeichert werden.\nFüllen Sie alle obligatorischen Felder (Sprache, Name/n, Beschreibung/en) aus.',
  },
  exercise: {
    title: 'Aufgabe',
    searchTitle: '{$1} Aufgaben',
    createTitle: 'Erstelle Aufgabe',
    editTitle: "Bearbeite Aufgabe '{$1}'",
    releaseTitle: 'Aufgabe Freigeben',
    searchSubtitle: 'Suche',
    exerciseSubtitle: 'Aufgabenstellung',
    categoryDescriptionSubtitle: 'Hilfestellung für {$1} Aufgaben',
    functionsSubtitle: 'Funktionen',
    testCasesSubtitle: 'Testfälle',
    solutionSubtitle: 'Lösung',
    optionsSubtitle: 'Antwortmöglichkeiten',
    releaseRequestedSubtitle: 'Freigabe beantragt',
    releasedSubtitle: 'Freigabe genehmigt',
    editBreadcrumb: 'Bearbeite Aufgabe',
    exercise: 'Aufgabe',
    exercises: 'Aufgaben',
    upcoming: 'demnächst verfügbar...',
    nameLabel: 'Name',
    descriptionLabel: 'Beschreibung',
    typeLabel: 'Typ',
    typeToCreateLabel: 'Typ der zu erstellenden Aufgabe',
    programmingLanguageLabel: 'Programmiersprache',
    categoryLabel: 'Kategorie',
    difficultyLabel: 'Schwierigkeit',
    codeFragmentLabel: 'Programmcode',
    templateFragmentLabel: 'Programmcode Vorlage',
    solutionFragmentLabel: 'Programmcode Beispiellösung',
    solvedLabel: 'Gelöst',
    answerLabel: 'Ihre Antwort',
    solutionPatternLabel: 'Lösungs-Muster (RegExp)',
    solutionLabel: 'Lösung',
    // codeMirrorThemeLabel
    releaseRequestedAtLabel: 'Freigabe beantragt am',
    releaseRequestNotifiedAtLabel: 'Informiert am',
    releasedByLabel: 'Freigabe genehmigt von',
    releasedAtLabel: 'Freigabe genehmigt um',
    multipleSolutionsLabel: 'mehrere Antworten zulässig',
    weightLabel: 'Gewichtung',
    showSolutionLabel: 'Beispiellösung anzeigen',
    showReleasedLabel: 'zeige veröffentlichte Aufgaben',
    showUnreleasedLabel: 'zeige private Aufgaben',
    // blacklistLabel
    editButton: 'bearbeite Aufgabe',
    duplicateButton: 'duplizieren',
    releaseRequestButton: 'Freigabe beantragen',
    releaseButton: 'freigeben',
    unreleaseButton: 'verstecken',
    executeTestsButton: 'Testfälle überprüfen',
    saveAnswerButton: 'Antwort speichern',
    showSolutionButton: 'Beispiellösung anzeigen',
    closeButton: 'Schliessen',
    blacklistMatchMessage: 'Validierungsfehler, illegaler Ausdruck: {$1}',
    releasedMessage: 'Diese Aufgabe wurde öffentlich freigeben.',
    releaseRequestedMessage: 'Diese Aufgabe wurde zur Freigabe angemeldet.',
    successMessage: 'Diese Aufgabe wurde korrekt gelöst.',
    failureMessage: 'Diese Aufgabe konnte nicht korrekt gelöst werden.',
    unevaluatedMessage: 'Diese Aufgabe muss von Hand korrigiert werden.',
    executionSuccessMessage: 'Die Testfälle wurden erfolgreich ausgeführt.',
    executionFailureMessage: 'Nicht alle Testfälle konnten erfolgreich ausgeführt werden.',
    changedMessage: 'Diese Aufgabe wurde abgeändert, nachdem Sie sie gelöst haben. Sie möchten vielleicht die aktuelle Version anschauen.',
    isNotValidMessage: 'Diese Aufgabe ist nicht gültig und kann nicht gespeichert werden.\nFüllen Sie alle obligatorischen Felder (Sprache, Kategorie, Schwierigkeit, Name/n, Beschreibung/en, Funktion/en, Testfall/fälle) aus.\n'
    + 'Wenn Sie eine Aufgabe freigeben möchten, stellen Sie sicher, dass Sie nicht Ihre private Kategorie ausgewählt haben..\nÜberprüfen Sie, ob alle eigegebenen Werte gültig sind.',
    isNotTestedMessage: 'Diese Aufgabe kann nicht veröffentlicht werden, da Sie nicht getestet ist.',
    function: {
      nameLabel: 'Funktionsname',
      namePlaceholder: 'Funktionsname',
      returnTypeLabel: 'Rückgabetyp',
      returnTypePlaceholder: 'Rückgabetyp',
      parameterNameLabel: 'Parametername',
      parameterNamePlaceholder: 'Parametername',
      parameterTypeLabel: 'Parametertyp',
      parameterTypePlaceholder: 'Parametertyp',
    },
    testCase: {
      // success
      others: 'andere Testfälle',
      descriptionLabel: 'Testfall',
      functionLabel: 'Funktion',
      inputLabel: 'Argumente',
      expectedOutputLabel: 'Erwartete Rückgabe',
      visibleLabel: 'Sichtbar',
      resultLabel: 'Tatsächliches Resultat / Fehler',
      successMessage: 'Der Testfall wurde erfolgreich ausgeführt.',
      failureMessage: 'Der Testfall konnte nicht erfolgreich ausgeführt werden.',
    },
    option: {
      descriptionLabel: 'Beschreibung',
      correctLabel: 'richtig',
      wrongLabel: 'falsch',
    },
    help: {
      title: 'Gebrauchsanweisung',
      showButton: 'Gebrauchsanweisung anzeigen',
      types: 'Für Typen geben Sie bitte einen der folgenden Werte ein. Typenparameter können wiederum durch einen Typ ersetzt werden.',
      values: 'Für Werte geben Sie bitte einen gültigen Wert gemäss den folgenden Anweisungen und Beispielen ein. Für Texte und Zahlen, geben Sie einfach den Wert ohne Anführungszeichen ein. '
      + 'Für Kollektionen geben Sie die Elemente mit Kommata getrennt ein. Für Assoziationen geben Sie bitte Schlüssel und Wert durch ein Doppelpunkt getrennt und die einzelnen Paare durch Kommata getrennt ein.',
      blacklist: 'Die folgenden Begriffe dürfen nirgends im Programmcode vorkommen.',
      testCaseVisibleMessage: 'Ob der Testfall den Studenten angezeigt werden soll.',
      solutionVisibleMessage: 'Ob die Beispiellösung den Studenten angezeigt werden soll.',
      versionInformationMessage: 'Sprachversion: {$1}, Kompiler: {$2} v{$3}, Kompilierplattform: {$4} v{$5} ({$6})',
    },
    type: {
      1: 'Programmierung',
      // 2
      3: 'Freitext',
    },
    difficulty: {
      1: 'Einsteiger/in',
      2: 'Aufsteiger/in',
      3: 'Fortgeschrittene/r',
      4: 'Experte/in',
    },
  },
  examination: {
    createTemplateTitle: 'Prüfung erstellen',
    createExecutionTitle: 'Erstelle Durchführung',
    editTemplateTitle: "Prüfung '{$1}' bearbeiten",
    editExecutionTitle: "Durchführung '{$1}' bearbeiten",
    configureExaminationSubtitle: 'Prüfung konfigurieren',
    configureExecutionSubtitle: 'Durchführung konfigurieren',
    overviewTitle: "Prüfungsübersicht '{$1}'",
    selectExercisesSubtitle: 'Aufgaben für Prüfung auswählen',
    exercisesSubtitle: 'Aufgaben in Prüfung',
    examineesSubtitle: 'Teilnehmende',
    templateType: 'Prüfung',
    executionType: 'Prüfungsdurchführung',
    startTimeLabel: 'Startzeit',
    endTimeLabel: 'Endzeit',
    durationLabel: 'Dauer',
    // durationUnitLabel
    examineesLabel: 'Teilnehmende',
    examineeViewLabel: 'Link für Teilnehmende',
    progressLabel: 'Fortschritt',
    totalWeightLabel: 'Summe der Gewichtungen',
    numberOfExamineesLabel: 'Anzahl Teilnehmende',
    numberOfExercisesLabel: 'Anzahl Aufgaben',
    logEvaluationsLabel: 'Evaluationen',
    logActivityLabel: 'Aktionen',
    logDifferenceLabel: 'Zeichen',
    createExecutionButton: 'Durchführung erstellen',
    startExecutionButton: 'Durchführung starten',
    overviewButton: 'Prüfungsübersicht',
    extendDurationButton: 'Dauer erhöhen',
    addExerciseButton: 'Aufgabe zu Prüfung hinzufügen',
    addExamineeButton: 'Teilnehmer/in hinzufügen',
    exportPDFEmptyButton: 'als PDF exportieren (leer)',
    exportPDFSolvedButton: 'als PDF exportieren (inkl. Antworten)',
    exportCSVButton: 'Resultate als CSV exportieren',
    cannotEditMessage: 'Sie können eine gestartete Prüfung nicht mehr bearbeiter.',
    templateIsNotValidMessage: 'Diese Prüfung ist nicht gültig und kann nicht gespeichert werden.\nFüllen Sie alle obligatorischen Felder (Name/n, Dauer, Aufgaben inkl. Gewichtung) aus.',
    executionIsNotValidMessage: 'Diese Durchführung ist nicht gültig und kann nicht gespeichert werden. \n Füllen Sie alle obligatorischen Felder (Name/n, Beschreibungen, Dauer, Übungen inkl. Gewichtung) aus.',
    help: {
      progressTitle: 'Erklärungen zur Fortschrittsanzeige',
      logOverviewTitle: 'Erklärungen zum Logging',
      examinees: 'Werden keine Teilnehmenden ausgewählt, wird die Durchführung für alle durchführbar sein.',
      progress: 'Rot: Noch nicht beantwortet\nGelb: Teilweise gelöst\nGrün: Korrekt gelöst\nBlau: Beantwortet (keine automatische / sichtbare Korrektur)',
      logOverview: 'Evaluationen: Anzahl der Evaluationen (Speichern / Kompilieren) in den letzten {$1} Minuten\nAktionen: Durschnittliche Anzahl der Aktionen (Tastenanschlag / Mausklick) pro Sekunde\n'
      + 'Zeichen: Durschnittliche Anzahl eingetippte Zeichen pro Sekunde (negative Zahl: mehr Zeichen gelöscht als eingetippt)\nRotes Kreuz: Keine Aktivität seit mindestens {$2} Minute',
    },
  },
  form: {
    // notAvailable
    selectAll: 'alle',
    selectPleaseChoose: 'bitte wählen Sie eine Option aus',
    textFilter: 'nach Text filtern',
    minLength: 'Sie müssen mindestens {$1} Zeichen eingeben.',
    supportsMarkdown: 'Dieses Feld unterstützt Markdown.',
    createdBy: 'erstellt von',
    editedBy: 'zuletzt bearbeitet von',
    actionAt: 'um',
    createdByLabel: 'erstellt von',
    editedByLabel: 'zuletzt bearbeitet von',
    editedAtLabel: 'zuletzt bearbeitet um',
    searchButton: 'suchen',
    saveButton: 'speichern',
    cancelButton: 'abbrechen',
    deleteButton: 'löschen',
    addButton: 'neues Element einfügen',
    moveUpButton: 'Übung nach oben',
    moveDownButton: 'Übung nach unten',
    removeButton: 'dieses Element entfernen',
    togglePanelButton: 'Felddarstellung umschalten',
    previousButton: 'zurück',
    nextButton: 'weiter',
    cannotSaveMessage: 'Sie sind nicht berechtigt, dieses Dokument zu speichern.',
    documentChangedMessage: 'Das geöffnete Dokument wurde gerade verändert.\nFalls Sie fortfahren, werden Sie die Änderungen überschreiben. Eventuell möchten Sie es stattdessen neu laden.',
    noFilterMessage: 'Sie müssen mindestens ein Suchkriterium angeben um zu suchen.',
    noResultsMessage: 'Es wurden keine Resultate gefunden.',
    noSelectionMessage: 'Sie haben kein Element ausgewählt.',
    saveSuccessfulMessage: 'Ihre Eingaben wurden erfolgreich gespeichert.',
  },
  email: {
    greeting: 'Freundliche Grüsse',
    footer: 'Progressor - The Programming Professor\nBerner Fachhochschule - Departement Technik und Informatik\nQuellgasse 21 - CH-2501 Biel/Bienne - Schweiz',
    releaseNotifier: {
      subject: 'Progressor - Neue Anfragen zur Freigabe von Aufgaben',
      title: 'Neue Anfragen zur Freigabe von Aufgaben',
      intro: 'Hallo {$1}\nEs sind neue {$2}Anfragen zur Freigabe von Aufgaben{$3} eingegangen.\nBitte überprüfen Sie diese offenen Anfragen.',
    },
    verifyEmail: {
      subject: 'Progressor - E-Mail-Adressen-Verifizierung',
      title: 'E-Mail-Adressen-Verifizierung ',
      intro: 'Hallo {$1}\nWillkommen bei {$2}Progressor - The Programming Professor.{$3}\nUm Ihre E-Mail-Adresse zu verifizieren, klicken Sie bitte auf den untenstehenden Link.',
      info: 'Sie können auf der Kontoseite auch Ihren {$1}richtigen Namen{$2} angeben.\nAb sofort können Sie loslegen und bestehende Aufgaben lösen.\nSie können auch Ihre eigenen Aufgaben erstellen und mit Ihren Freunden teilen.',
      motivation: 'Viel Spass beim Programmieren lernen! :-)',
    },
    resetPassword: {
      subject: 'Progressor - Passwort zurücksetzen',
      title: 'Passwort zurücksetzen',
      intro: 'Hallo {$1}\nUm Ihr Passwort zurückzusetzen, klicken Sie bitte auf den untenstehenden Link und geben Sie ein neues Passwort ein.',
    },
  },
  programmingLanguages: {
    java: {
      // name
      description: 'ist eine objektorientierte Programmiersprache und eine eingetragene Marke des Unternehmens Sun Microsystems (2010 von Oracle aufgekauft).',
    },
    cpp: {
      // name
      description: 'ist eine von der ISO genormte Programmiersprache. C++ ermöglicht sowohl die effiziente und maschinennahe Programmierung als auch eine Programmierung auf hohem Abstraktionsniveau.',
    },
    csharp: {
      // name
      description: '(englisch cee sharp) ist eine vom Softwarehersteller Microsoft im Rahmen seiner .NET-Strategie entwickelte Programmiersprache. C# ist bei ECMA und ISO als Standard registriert.',
    },
    python: {
      // name
      description: 'ist eine universelle, üblicherweise interpretierte höhere Programmiersprache. Ihre Entwurfsphilosophie betont Programmlesbarkeit, ausserdem ist Python-Code im Vergleich mit anderssprachigem Code teilweise deutlich kürzer.',
    },
    javascript: {
      // name
      description: 'ist eine Skriptsprache, die ursprünglich für dynamisches HTML in Webbrowsern entwickelt wurde, um Benutzerinteraktionen auszuwerten, Inhalte zu verändern, nachzuladen oder zu generieren und so die Möglichkeiten von HTML und CSS zu erweitern.',
    },
    php: {
      // name
      description: 'ist eine Skriptsprache mit einer an C und Perl angelehnten Syntax, die hauptsächlich zur Erstellung dynamischer Webseiten oder Webanwendungen verwendet wird.',
    },
    kotlin: {
      // name
      description: '(benannt nach einer Insel nahe St. Petersburg) ist eine statisch typisierte Programmiersprache, die in Bytecode für die Java Virtual Machine übersetzt wird, aber auch in JavaScript-Quellcode transformiert werden kann. Die Sprache ist so gestaltet, dass sie mit Java-Code interoperieren kann.',
    },
    vbnet: {
      // name
      description: 'ist eine Programmiersprache, die auf dem Microsoft .NET Framework aufbaut. Sie wurde 2002 publiziert und ist keine einfache Weiterentwicklung des Vorgängers Visual Basic 6, sondern wurde in weiten Teilen neu konzipiert.',
    },
    upcoming: {
      name: 'Weitere',
      description: 'Programmier- oder Abfragesprachen können implementiert werden. Aber wir brauchen Ihre Wünsche und Ihre Unterstützung. Bringen Sie sich ein!',
    },
  },
  error: {
    403: {
      // name
      message: 'Sie sind nicht berechtigt, auf die aufgerufene Seite zuzugreifen.',
    },
    404: {
      // name
      message: 'Die aufgerufene Seite konnte nicht gefunden werden.',
    },
    notAuthenticated: {
      message: 'Sie müssen angemeldet sein, um diese Aktion durchführen zu können.',
    },
    notAdmin: {
      message: 'Sie müssen ein Administrator sein, um diese Aktion durchführen zu können.',
    },
    notAuthor: {
      message: 'Sie müssen der Ersteller dieses Elements sein, um diese Aktion durchführen zu können.',
    },
    locked: {
      message: 'Dieses Dokument ist gesperrt.',
    },
  },
});

function processRelativeTime(number, withoutSuffix, key) {
  const format = {
    m: ['eine Minute', 'einer Minute'],
    h: ['eine Stunde', 'einer Stunde'],
    d: ['ein Tag', 'einem Tag'],
    dd: [`${number} Tage`, `${number} Tagen`],
    M: ['ein Monat', 'einem Monat'],
    MM: [`${number} Monate`, `${number} Monaten`],
    y: ['ein Jahr', 'einem Jahr'],
    yy: [`${number} Jahre`, `${number} Jahren`],
  };
  return withoutSuffix ? format[key][0] : format[key][1];
}

moment.defineLocale('de', {
  months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
  monthsShort: 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
  monthsParseExact: true,
  weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
  weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
  weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D. MMMM YYYY',
    LLL: 'D. MMMM YYYY HH:mm',
    LLLL: 'dddd, D. MMMM YYYY HH:mm',
  },
  calendar: {
    sameDay: '[heute um] LT [Uhr]',
    sameElse: 'L',
    nextDay: '[morgen um] LT [Uhr]',
    nextWeek: 'dddd [um] LT [Uhr]',
    lastDay: '[gestern um] LT [Uhr]',
    lastWeek: '[letzten] dddd [um] LT [Uhr]',
  },
  relativeTime: {
    future: 'in %s',
    past: 'vor %s',
    s: 'ein paar Sekunden',
    m: processRelativeTime,
    mm: '%d Minuten',
    h: processRelativeTime,
    hh: '%d Stunden',
    d: processRelativeTime,
    dd: processRelativeTime,
    M: processRelativeTime,
    MM: processRelativeTime,
    y: processRelativeTime,
    yy: processRelativeTime,
  },
  ordinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
});
