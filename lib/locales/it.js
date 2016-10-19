(function () {
  'use strict';

  i18n.map('it', { //TODO: translate
    layout: {
      title: 'Progressor',
      logo: '<{Progressor}>',
      explanation: 'The Programming Professor',
      homeTitle: 'Home',
      programmingLanguagesTitle: 'Programming Languages',
      mongoDBAdminTitle: 'MongoDB Admin',
      toggleNavigationButton: 'toggle navigation',
      unexpectedErrorMessage: 'Si è verificato un errore inaspettato.\n{$1}'

    }, account: {
      title: 'Mio account',
      loginTitle: 'Accedi',
      solvedExercisesSubtitle: 'I miei esercizi risolti',
      createdExercisesSubtitle: 'I miei esercizi creati',
      createdExaminationsSubtitle: 'I miei esami creati',
      createdExecutionSubtitle: 'Le mie esecuzioni create',
      archiveSubtitle: 'Mio archivio',
      accountSettingsSubtitle: 'Impostazioni account',
      adminSettingsSubtitle: 'Impostazioni amministratore',
      emailLabel: 'Indirizzo email',
      nameLabel: 'Nome',
      makeAdminLabel: 'Autorizza un utente',
      archiveButton: 'archivio',
      unarchiveButton: 'ripristino archivio',
      loginButton: 'accedi',
      registerButton: 'registrati',
      logoutButton: 'esci',
      logoutOtherClientsButton: 'esci altri clienti',
      makeAdminButton: 'rendi questo utente un amministratore',
      isAdminMessage: 'Sei un amministratore autorizzato.',
      verificationSuccessMessage: 'L\'indirizzo email è stato verificato con successo.\nSei stato automaticamente loggato.',
      verificationErrorMessage: 'La verifica dell\'email è fallita.\nRiprova di nuovo.',
      passwordResetSuccessMessage: 'La password è stata resettata con successo.',
      passwordMismatchMessage: 'La password inserita è sbagliata.',
      passwordResetErrorMessage: 'Il reset della password è fallito.\nRiprova; potresti chiedere un nuovo link.'

    }, category: {
      createTitle: 'Crea Categoria',
      editTitle: "Modifica Categoria '{$1}'",
      editBreadcrumb: 'Modifica Categoria',
      createButton: 'Crea Categoria',
      editButton: 'modifica categoria',
      isNotValidMessage: 'Questa categoria non è valida e non può essere salvata.\nCompila i campi obbligatori (lingua, nome(i), descrizione(i)).'

    }, exercise: {
      title: 'Esercizio',
      searchTitle: '{$1} Esercizi',
      createTitle: 'crea Esercizio',
      editTitle: "Modifica Esercizio '{$1}'",
      releaseTitle: 'Rilascia esercizio',
      searchSubtitle: 'Cerca',
      exerciseSubtitle: 'Problema',
      categoryDescriptionSubtitle: 'Istruzione per {$1} Esercizi',
      functionsSubtitle: 'Funzioni',
      testCasesSubtitle: 'Test Cases',
      solutionSubtitle: 'Solutioni',
      optionsSubtitle: 'opzioni',
      releaseRequestedSubtitle: 'Rilascia Richiesta',
      releasedSubtitle: 'Rilascio Confermato',
      editBreadcrumb: 'Modifica Esercizio',
      exercise: 'esercizio',
      exercises: 'esercizi',
      upcoming: 'coming soon...',
      nameLabel: 'Nome',
      descriptionLabel: 'Descrizione',
      typeLabel: 'Tipo',
      typeToCreateLabel: 'Tipo di Esercizio da Creare',
      programmingLanguageLabel: 'Linguaggio di Programmazione',
      categoryLabel: 'Categoria',
      difficultyLabel: 'Difficoltà',
      codeFragmentLabel: 'Soluzione Codice',
      templateFragmentLabel: 'Template Codice',
      solutionFragmentLabel: 'Esempio Soluzione Codice',
      solvedLabel: 'Risolto',
      answerLabel: 'Tu risposta',
      solutionPatternLabel: 'Soluzione Pattern (RegExp)',
      solutionLabel: 'Soluzione',
      codeMirrorThemeLabel: 'Modifca Tema',
      releaseRequestedAtLabel: 'Rilascio Richiesta A',
      releaseRequestNotifiedAtLabel: 'Notificato A',
      releasedByLabel: 'Rilascio Confermato Da',
      releasedAtLabel: 'Rilascio Confermato A',
      multipleSolutionsLabel: 'Permetti Risposte Multiple',
      weightLabel: 'Peso',
      showSolutionLabel: 'Mostra Soluzione Esempio',
      showReleasedLabel: 'Mostra Esercizi Rilasciati',
      showUnreleasedLabel: 'Mostra Esercizi Privati',
      blacklistLabel: 'Blacklist',
      editButton: 'modifica esercizio',
      duplicateButton: 'duplicato',
      releaseRequestButton: 'richiesta rilascio',
      releaseButton: 'rilascio',
      unreleaseButton: 'nascondi',
      executeTestsButton: 'esegui test cases',
      saveAnswerButton: 'salva risposta',
      showSolutionButton: 'mostra soluzione esempio',
      closeButton: 'Chiudi',
      blacklistMatchMessage: 'validazione fallita, termine illegale: {$1}',
      releasedMessage: 'L\'esercizio è stato rilasciato.',
      releaseRequestedMessage: 'Questo esercizio è stato richiesto per essere rilasciato.',
      successMessage: 'Questo esercizio è stato risolto correttamente.',
      failureMessage: 'Questo esercizio non è stato risolto correttamente.',
      unevaluatedMessage: 'Questo esercizio deve essere valutato manualmente.',
      executionSuccessMessage: 'Tutti i test cases sono stati eseguiti con successo.',
      executionFailureMessage: 'Non tutti i test cases sono stati eseguiti con successo.',
      changedMessage: 'Questo esercizio è stato modificato perchè l\'hai risolto.\nPotresti vedere la versione aggiornata.',
      isNotValidMessage: 'Questo esercizio non è valido e non può essere salvato.\nCompila tutti i campi mandatori (lingua, categoria, difficoltà, nome(i), descrizione(i), funzione(i), test case(s)).\n'
                         + 'Se vuoi rilasciare un esercizio, assicurati di non aver selezionato la categoria privata.\nControlla se tutti i valori inseriti sono validi.',
      isNotTestedMessage: 'Questo esericizio non può essere pubblicato perchè non è testato.',
      'function': {
        nameLabel: 'Nome Funzione',
        namePlaceholder: 'nome funzione',
        returnTypeLabel: 'Tipo di Ritorno',
        returnTypePlaceholder: 'tipo di ritorno',
        parameterNameLabel: 'Nome Parametro',
        parameterNamePlaceholder: 'nome parametro',
        parameterTypeLabel: 'Tipo Parametro',
        parameterTypePlaceholder: 'tipo parametro'
      }, testCase: {
        success: 'OK',
        others: 'altri test cases',
        descriptionLabel: 'Test Case',
        functionLabel: 'Funzione',
        inputLabel: 'Argomenti',
        expectedOutputLabel: 'Valore di Ritorno Atteso',
        visibleLabel: 'Visibile',
        resultLabel: 'Risultato Corrente / Errore',
        successMessage: 'Questo test case è stato eseguito con successo.',
        failureMessage: 'Impossibile eseguire con successo il test case.'
      }, option: {
        descriptionLabel: 'Descrizione',
        correctLabel: 'Corretto',
        wrongLabel: 'Sbagliato'
      }, help: {
        title: 'Istruzioni',
        showButton: 'mostra istruzioni',
        types: 'Per i tipi, inserisci uno dei seguenti valori. I tipi di parametri possono essere sostituiti da un tipo.',
        values: 'Per i valori, inserisci un formato valido seguendo le istruzioni e gli esempi seguenti. Per testi e numeri, inserisci semplicemente il valore senze nessun apice. '
                + 'Per le collezioni, inserisci i valori separati dalla virgola. Per le mappe, separa le chiavi e i valori dai due punti e da coppie diverse di virgole.',
        blacklist: 'I seguenti termini sono vietati in qualsiasi parte del codice.',
        testCaseVisibleMessage: 'Se il test case sarà mostrato agli studenti.',
        solutionVisibleMessage: 'Se la soluzione dell\'esempio sarà mostrata agli studenti.',
        versionInformationMessage: 'Versione Lingua: {$1}, Compilatore: {$2} v{$3}, Piattaforma Compilazione: {$4} v{$5} ({$6})'
      }, type: {
        1: 'Programmazione',
        2: 'Scelta Multipla',
        3: 'Testo Libero'
      }, difficulty: {
        1: 'Principiante',
        2: 'Intermedio',
        3: 'Avanzato',
        4: 'Esperto'
      }

    }, examination: {
      createTemplateTitle: 'Crea Esame',
      createExecutionTitle: 'Crea Esecuzione',
      editTemplateTitle: "Modifica Esame '{$1}'",
      editExecutionTitle: "Modifica Esecuzione '{$1}'",
      configureExaminationSubtitle: 'COnfigura Esame',
      configureExecutionSubtitle: 'Configura Esecuzione',
      overviewTitle: "Panoramica Esame '{$1}'",
      selectExercisesSubtitle: 'Seleziona gli esercizi per l\'esame',
      exercisesSubtitle: 'Esercizi nell\'Esame',
      examineesSubtitle: 'Candidati',
      templateType: 'Esame',
      executionType: 'Esecuzione',
      startTimeLabel: 'Ora di inizio',
      endTimeLabel: 'Ora di fine',
      durationLabel: 'Durata',
      durationUnitLabel: 'min',
      examineesLabel: 'Candidati',
      examineeViewLabel: 'Link da dare ai candidati',
      progressLabel: 'Progresso',
      totalWeightLabel: 'Peso totale',
      numberOfExamineesLabel: 'Numero di candidati',
      numberOfExercisesLabel: 'Numero di esercizi',
      logEvaluationsLabel: 'Valutazioni',
      logActivityLabel: 'Azioni',
      logDifferenceLabel: 'Caratteri',
      createExecutionButton: 'creare esecuzione',
      startExecutionButton: 'incomincia esecuzione',
      overviewButton: 'panoramica esame',
      extendDurationButton: 'estendi durata',
      addExerciseButton: 'aggiungi esercizio per l\'esame',
      addExamineeButton: 'aggiunfi candidato',
      exportPDFEmptyButton: 'esporta PDF (vuoto)',
      exportPDFSolvedButton: 'esporta PDF (incl. risposte)',
      exportCSVButton: 'esporta i risultati in CSV',
      cannotEditMessage: 'Non è possibile modificare un esecuzione iniziata.',
      templateIsNotValidMessage: 'Questo esame non è valido e non può essere salvato.\nCompila i campi obbligatori (nome(i), durata, esercizi incl. peso).',
      executionIsNotValidMessage: 'Questa esecuzione non è valida e non può essere salvata.\nCompila tutti i campi obbligatori (nome(i), descrizione(i), durata, esercizi incl. peso).',
      help: {
        progressTitle: 'Spiegazioni Progegressi',
        logOverviewTitle: 'Accedi alle Spiegazioni',
        examinees: 'Se i candidati non vengono scelti, l\'esame sarà pubblico. Nessuno sarà in grado di prendere l\'esame.',
        progress: 'Rosso: Non ancora risposto\nGiallo: Parzialmente risolto\nVerde: Risolto con successo\nBlu: Risposto (no automatico / valutazione visibile)',
        logOverview: 'Valutazioni: Numero di valutazioni (salvate / compila) all\'ultimo {$1} minuto(s)\nAzioni: Media del numero di azioni (battitura / clicchi del mouse) al secondo\n'
                     + 'Caratteri: Numero medio di caratteri inseriti al secondo (numero negativo: più caratteri canccellati che inseriti)\nCroce rossa: Nessuna attività per almeno {$2} minuto(i)'
      }

    }, form: {
      notAvailable: 'n/a',
      selectAll: 'tutti',
      selectPleaseChoose: 'scegli un opzione',
      textFilter: 'filtra testo',
      minLength: 'Devi inserire almenp {$1} caratteri.',
      supportsMarkdown: 'Questo campo supporta i Markdown.',
      createdBy: 'creato da',
      editedBy: 'ultima modifica di',
      actionAt: 'a',
      createdByLabel: 'Creato Da',
      editedByLabel: 'Ultima modifica di',
      editedAtLabel: 'L\'ultima modifica a',
      searchButton: 'cerca',
      saveButton: 'salva',
      cancelButton: 'cancella',
      deleteButton: 'elimina',
      addButton: 'aggiungi un nuovo elemento',
      moveUpButton: 'Sposta l\'eserizio in su',
      moveDownButton: 'Sposta l\'eserizio in giù',
      removeButton: 'rimuovi questo elemento',
      togglePanelButton: 'visibilità toggle panel',
      previousButton: 'precedente',
      nextButton: 'prossimo',
      cannotSaveMessage: 'Non sei autorizzato a salvare questo documento.',
      documentChangedMessage: 'Il documento aperto correntemente è stato cambiato.\nSe continui, sovrascriverai questi cambiamenti. Invece tu potresti ricaricarlo.',
      noFilterMessage: 'Devi specificare almeno un criterio di ricerca.',
      noResultsMessage: 'Nessun risultato è stato trovato.',
      noSelectionMessage: 'Nessun elemento è stato selezionato.',
      saveSuccessfulMessage: 'Il tuo input è stato salvato con successo.'

    }, email: {
      greeting: 'Cordialmente,',
      footer: 'Progressor - The Programming Professor\nBern University of Applied Sciences - Department of Engineering and Information Technology\nQuellgasse 21 - CH-2501 Biel/Bienne - Switzerland',
      releaseNotifier: {
        subject: 'Progressor - Nuove richieste di rilascio',
        title: 'Rilascio Esercizio Notifica Richiesta',
        intro: 'Ciao {$1}\nHai qualche nuove {$2}richieste di rilascio esercizio.{$3}\nSi prega di esaminare le richieste di rilascio in sospeso.'
      },
      verifyEmail: {
        subject: 'Progressor - Verifica Indirizzo Email',
        title: 'Verifica Indirizzo Email',
        intro: 'Ciao {$1}\nBenvenuto in {$2}Progressor - The Programming Professor.{$3}\Per verificare il tuo indirizzo email, clicca sul link qua sotto.',
        info: 'Nella tua pagina account, puoi inserire il tuo {$1}rnome vero{$2}.\nPer incominciare ad utilizzare Progressor, risolvi un esercizio esistente.\nPuoi anche creare i tuoi esericizi personali privati e condividerli con i tuoi amici.',
        motivation: 'Divertiti imparando a programmare! :-)'
      },
      resetPassword: {
        subject: 'Progressor - Reset Password',
        title: 'Reset Password',
        intro: 'Ciao {$1}\nPer resettare la password, clicca sul link qua sotto e inserisci la nuova password.'
      }

    }, programmingLanguages: {
      java: {
        name: 'Java',
        description: 'è un linguaggio di programmazione general-purpose che è, basato su classi ed è orientato agli oggetti.'
      }, cpp: {
        name: 'C/C++',
        description: '(si pronuncia cee plus plus) è un linguaggio di programmazione general-purpose. E\' imperativo, orientato agli oggetti con funzioni di programmazione generiche.'
      }, csharp: {
        name: 'C#',
        description: '(si pronuncia see sharp) è un linguaggio di programmazione multi-paradigma che comprende tipizzazione forte, imperativo, dichiarativo, funzionale, generico, orientato agli oggetti (basato su classi), e component-oriented programming disciplines.'
      }, python: {
        name: 'Python',
        description: 'è un linguaggio general-purpose, ad alto livello. la sua filosofia di design mette in risalto la riutilizzabilità del codice, e la sua sintassi permettte ai programamtori di esprimere concetti in meno righe di codice rispetto ad altri linguaggi come C++ o Java.'
      }, javascript: {
        name: 'JavaScript',
        description: 'è un linguaggio di programmazione ad alto livello, dinamico, non tipato, ed interpretato. Insieme a HTML e CSS, è una delle tre technologie essenziali per produrre i contenuti World Wide Web.'
      }, php: {
        name: 'PHP',
        description: 'è un lingiaggio di script lato server sviluppato per il web ma anche usato come linguaggio di programamzione general-purpose. Originariamente, PHP significava Personal Home Page, ma ora sta per il PHP backronym ricorsivo: Hypertext Preprocessor.'
      }, kotlin: {
        name: 'Kotlin',
        description: '(prende il nome da un\'isola vicino a San Pietroburgo) è un linguaggio di programamzione staticamente tipato che gira su una Java Virtual Machine e può anche essere compilato in codice sorgente JavaScript. Kotlin è sviluppato per interoperare con il codice Java.'
      }, vbnet: {
        name: 'Visual Basic .NET',
        description: 'è un linguaggio di programmazione multi-paradigma, e ad alto livello, implementato sul framework .NET. Microsoft ha lanciato VB.NET nel 2002 come successore del linguaggio originale Visual Basic.'
      }, //ruby: {
      //   name: 'Ruby',
      //   description: 'è un linguaggio di programmazione dinamico, riflessivo, orientato agli oggetti e general-purpose. E' stato sviluppato a metà anni '90 da Yukihiro "Matz" Matsumoto in Giappone.'
      // }, swift: {
      //   name: 'Swift',
      //   description: 'è un linguaggio di programmazione general-purpose, multi paradigma, compilato creato per iOS, OS X, watchOS, tvOS, e Linux sviluppato da Apple Inc.'
      // }, lisp: {
      //   name: 'Lisp',
      //   description: 'è una famiglia di linguaggi di programmazione con una lunga e distinta storia, con notazione prefisso completamente tra parentesi. Originariamente specificato nel 1958, Lisp è il secondo più vecchio linguaggio di programmazione ad alto livello più diffuso ad oggi.'
      // }, sql: {
      //   name: 'SQL',
      //   description: '(Structured Query Language) è un linguaggio di programmazione special-purpose sviluppato per gestire dati in relational database management system (RDBMS), o per stream processing in relational data stream management system (RDSMS).'
      // }
      upcoming: {
        name: 'Più',
        description: 'programmi o query languages possono essere aggiunti. Noi abbiamo bisogno della tua richiesta e supporto. Mettiti in gioco!'
      }

    }, error: {
      403: {
        name: 'Proibito',
        message: 'Non sei autorizzato ad accedere alla pagina richiesta.'
      }, 404: {
        name: 'Non trovato',
        message: 'La pagina richiesta non è stata trovata.'
      },
      notAuthenticated: {
        message: 'Devi essere autenticato per eseguire questa azione.'
      },
      notAdmin: {
        message: 'Devi essere amministratore per eseguire questa azione.'
      },
      notAuthor: {
        message: 'Devi essere il propietario dell\'elemento per eseguire questa azione.'
      },
      locked: {
        message: 'Questo documento è bloccato.'
      }
    }
  });

  moment.defineLocale('it', {
    months: 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
    monthsShort: 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
    weekdays: 'Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato'.split('_'),
    weekdaysShort: 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Me_Gi_Ve_Sa'.split('_'),
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD/MM/YYYY',
      LL: 'D MMMM YYYY',
      LLL: 'D MMMM YYYY HH:mm',
      LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
    calendar: {
      sameDay: '[Oggi alle] LT',
      nextDay: '[Domani alle] LT',
      nextWeek: 'dddd [alle] LT',
      lastDay: '[Ieri alle] LT',
      lastWeek: function () {
        switch (this.day()) {
          case 0:
            return '[la scorsa] dddd [alle] LT';
          default:
            return '[lo scorso] dddd [alle] LT';
        }
      },
      sameElse: 'L'
    },
    relativeTime: {
      future: function (s) {
        return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
      },
      past: '%s fa',
      s: 'alcuni secondi',
      m: 'un minuto',
      mm: '%d minuti',
      h: 'un\'ora',
      hh: '%d ore',
      d: 'un giorno',
      dd: '%d giorni',
      M: 'un mese',
      MM: '%d mesi',
      y: 'un anno',
      yy: '%d anni'
    },
    ordinalParse: /\d{1,2}º/,
    ordinal: '%dº',
    week: {
      dow: 1, // Monday is the first day of the week.
      doy: 4  // The week that contains Jan 4th is the first week of the year.
    }
  });

})();
