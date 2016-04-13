(function () {
	'use strict';

	i18n.map('de', {
		layout: {
			//title: 'Progressor',
			//logo: '<{Progressor}>',
			//explanation: 'The Programming Professor',
			homeTitle: 'Startseite',
			programmingLanguagesTitle: 'Programmiersprachen',
			//mongoDBAdminTitle: 'MongoDB Admin',
			toggleNavigationButton: 'Navigation ein/ausblenden',
			unexpectedErrorMessage: 'Ein unerwarteter Fehler ist aufgetreten!\n{$1}'

		}, account: {
			title: 'Mein Konto',
			loginTitle: 'Anmelden',
			solvedExercisesPanel: 'Meine gelösten Aufgaben',
			createdExercisesPanel: 'Erstellte Aufgaben',
			archivedExercisesPanel: 'Archivierte Aufgaben',
			accountSettingsPanel: 'Kontoeinstellungen',
			emailLabel: 'E-Mail Adresse',
			nameLabel: 'Echter Name',
			loginButton: 'anmelden',
			registerButton: 'registrieren',
			logoutButton: 'abmelden',
			logoutOtherClientsButton: 'andere Geräte abmelden'

		}, category: {
			createTitle: 'Erstelle Kategorie',
			editTitle: "Bearbeite Kategorie '{$1}'",
			editBreadcrumb: 'Bearbeite Kategorie',
			createButton: 'erstelle Kategorie',
			editButton: 'bearbeite Kategorie',
			isNotValidMessage: 'Diese Kategorie is nicht gültig und kann nicht gespeichert werden.\nFüllen Sie alle obligatorischen Felder (Sprache, Name/n, Beschreibung/en) aus.'

		}, exercise: {
			title: 'Aufgabe',
			searchTitle: '{$1} Aufgaben',
			createTitle: 'Erstelle Aufgabe',
			editTitle: "Bearbeite Aufgabe '{$1}'",
			searchSubtitle: 'Suche',
			exerciseSubtitle: 'Aufgabenstellung',
			categoryDescriptionSubtitle: 'Hilfestellung für {$1} Aufgaben',
			functionsSubtitle: 'Funktionen',
			testCasesSubtitle: 'Testfälle',
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
			yourSolutionLabel: 'Deine Lösung',
			//codeMirrorThemeLabel: 'Editor Theme',
			editButton: 'bearbeite Aufgabe',
			duplicateButton: 'duplizieren',
			releaseRequestButton: 'Freigabe beantragen',
			releaseButton: 'freigeben',
			unreleaseButton: 'verstecken',
			archiveButton: 'archiviere Aufgabe',
			unarchiveButton: 'stelle Aufgabe wiederher',
			executeTestsButton: 'Testfälle überprüfen',
			saveAnswerButton: 'Antwort speichern',
			showSolutionButton: 'Beispiellösung anzeigen',
			blacklistMatchMessage: 'Validierungsfehler, illegaler Ausdruck: {$1}',
			releasedMessage: 'Diese Aufgabe wurde öffentlich freigeben.',
			releaseRequestedMessage: 'Diese Aufgabe wurde zur Freigabe angemeldet.',
			successMessage: 'Diese Aufgabe wurde korrekt gelöst.',
			failureMessage: 'Diese Aufgabe konnte nicht korrekt gelöst werden.',
			unevaluatedMessage: 'Diese Aufgabe wurde noch nicht bewertet.',
			executionSuccessMessage: 'Die Testfälle wurden erfolgreich ausgeführt.',
			executionFailureMessage: 'Nicht alle Testfälle konnten erfolgreich ausgeführt werden.',
			changedMessage: 'Diese Aufgabe wurde abgeändert, nachdem Sie sie gelöst haben. Sie möchten vielleicht die aktuelle Version anschauen.',
			isNotValidMessage: 'Diese Aufgabe is nicht gültig und kann nicht gespeichert werden.\nFüllen Sie alle obligatorischen Felder (Sprache, Kategorie, Schwierigkeit, Name/n, Beschreibung/en, Funktion/en, Testfall/fälle) aus.\nÜberprüfen Sie, ob alle eigegebenen Werte gültig sind.',
			isNotTestedMessage: 'Diese Aufgabe kann nicht veröffentlicht werden, da Sie nicht getestet ist.',
			saveSuccessfulMessage: 'Deine Antwort wurde erfolgreich gespeichert!',
			'function': {
				nameLabel: 'Funktionsname',
				namePlaceholder: 'Funktionsname',
				returnTypeLabel: 'Rückgabetyp',
				returnTypePlaceholder: 'Rückgabetyp',
				parameterNameLabel: 'Parametername',
				parameterNamePlaceholder: 'Parametername',
				parameterTypeLabel: 'Parametertyp',
				parameterTypePlaceholder: 'Parametertyp'
			}, testCase: {
				success: 'OK',
				missing: 'N/A',
				others: 'andere Testfälle',
				descriptionLabel: 'Testfall',
				functionLabel: 'Funktion',
				inputLabel: 'Attributwerte',
				expectedOutputLabel: 'Erwartete Rückgabe',
				visibleLabel: 'Sichtbar',
				resultLabel: 'Tatsächliches Resultat / Fehler',
				successMessage: 'Der Testfall wurde erfolgreich ausgeführt.',
				failureMessage: 'Der Testfall konnte nicht erfolgreich ausgeführt werden.'
			}, help: {
				title: 'Gebrauchsanweisung',
				showButton: 'Gebrauchsanweisung anzeigen',
				types: 'Für Typen geben Sie bitte einen der folgenden Werte ein. Typenparameter können wiederum durch einen Typ ersetzt werden.',
				values: 'Für Werte geben Sie bitte einen gültigen Wert gemäss den folgenden Anweisungen und Beispielen ein. Für Texte und Zahlen, geben Sie einfach den Wert ohne Anführungszeichen ein. '
								+ 'Für Kollektionen geben Sie die Elemente mit Kommata getrennt ein. Für Assoziationen geben Sie bitte Schlüssel und Wert durch ein Doppelpunkt getrennt und die einzelnen Paare durch Kommata getrennt ein.'

			}, type: {
				1: 'Programmierung',
				2: 'Multiple Choice',
				3: 'Freitext'
			}, difficulty: {
				1: 'Einsteiger/in',
				2: 'Aufsteiger/in',
				3: 'Fortgeschrittene/r',
				4: 'Experte/in'
			}

		}, form: {
			selectAll: 'alle',
			selectPleaseChoose: 'bitte wählen Sie eine Option aus',
			textFilter: 'nach Text filtern',
			minLength: 'Sie müssen mindestens {$1} Zeichen eingeben.',
			supportsMarkdown: 'Dieses Feld unterstützt Markdown.',
			createdBy: 'erstellt von',
			editedBy: 'zuletzt bearbeitet von',
			actionAt: 'um',
			editedByLabel: 'Zuletzt Bearbeitet Von',
			editedAtLabel: 'Zuletzt Bearbeitet Um',
			searchButton: 'suchen',
			saveButton: 'speichern',
			cancelButton: 'abbrechen',
			deleteButton: 'löschen',
			addButton: 'neues Element einfügen',
			removeButton: 'dieses Element entfernen',
			togglePanelButton: 'Felddarstellung umschalten',
			cannotSaveMessage: 'Sie sind nicht berechtigt, dieses Dokument zu speichern.',
			documentChangedMessage: 'Das geöffnete Dokument wurde gerade verändert.\nFalls Sie fortfahren, werden Sie die Änderungen überschreiben. Eventuell möchten Sie es stattdessen neu laden.',
			noFilterMessage: 'Sie müssen mindestens ein Suchkriterium angeben.',
			noResultsMessage: 'Es wurden keine Suchresultate gefunden.'

		}, programmingLanguages: {
			java: {
				//name: 'Java',
				description: 'ist eine objektorientierte Programmiersprache und eine eingetragene Marke des Unternehmens Sun Microsystems (2010 von Oracle aufgekauft).'
			}, kotlin: {
				//name: 'Kotlin',
				description: '(benannt nach einer Insel nahe St. Petersburg) ist eine statisch typisierte Programmiersprache, die in Bytecode für die Java Virtual Machine übersetzt wird, aber auch in JavaScript-Quellcode transformiert werden kann. Die Sprache ist so gestaltet, dass sie mit Java-Code interoperieren kann.'
			}, cpp: {
				//name: 'C/C++',
				description: 'ist eine von der ISO genormte Programmiersprache. C++ ermöglicht sowohl die effiziente und maschinennahe Programmierung als auch eine Programmierung auf hohem Abstraktionsniveau.'
			}, csharp: {
				//name: 'C#',
				description: '(englisch cee sharp) ist eine vom Softwarehersteller Microsoft im Rahmen seiner .NET-Strategie entwickelte Programmiersprache. C# ist bei ECMA und ISO als Standard registriert.'
			}, vbnet: {
				//name: 'Visual Basic .NET',
				description: 'ist eine Programmiersprache, die auf dem Microsoft .NET Framework aufbaut. Sie wurde 2002 publiziert und ist keine einfache Weiterentwicklung des Vorgängers Visual Basic 6, sondern wurde in weiten Teilen neu konzipiert.'
			}, python: {
				//name: 'Python',
				description: 'ist eine universelle, üblicherweise interpretierte höhere Programmiersprache. Ihre Entwurfsphilosophie betont Programmlesbarkeit, ausserdem ist Python-Code im Vergleich mit anderssprachigem Code teilweise deutlich kürzer.'
			}, javascript: {
				//name: 'JavaScript',
				description: 'ist eine Skriptsprache, die ursprünglich für dynamisches HTML in Webbrowsern entwickelt wurde, um Benutzerinteraktionen auszuwerten, Inhalte zu verändern, nachzuladen oder zu generieren und so die Möglichkeiten von HTML und CSS zu erweitern.'
			}, php: {
				//name: 'PHP',
				description: 'ist eine Skriptsprache mit einer an C und Perl angelehnten Syntax, die hauptsächlich zur Erstellung dynamischer Webseiten oder Webanwendungen verwendet wird.'
			}

		}, error: {
			403: {
				//name: 'Forbidden',
				message: 'Sie sind nicht berechtigt, auf die aufgerufene Seite zuzugreifen.'
			}, 404: {
				//name: 'Not Found',
				message: 'Die aufgerufene Seite konnte nicht gefunden werden.'
			}
		}
	});

	function processRelativeTime(number, withoutSuffix, key, isFuture) {
		var format = {
			'm': ['eine Minute', 'einer Minute'],
			'h': ['eine Stunde', 'einer Stunde'],
			'd': ['ein Tag', 'einem Tag'],
			'dd': [number + ' Tage', number + ' Tagen'],
			'M': ['ein Monat', 'einem Monat'],
			'MM': [number + ' Monate', number + ' Monaten'],
			'y': ['ein Jahr', 'einem Jahr'],
			'yy': [number + ' Jahre', number + ' Jahren']
		};
		return withoutSuffix ? format[key][0] : format[key][1];
	}

	moment.defineLocale('de', {
		months: 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
		monthsShort: 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
		weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
		weekdaysShort: 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
		weekdaysMin: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
		longDateFormat: {
			LT: 'HH:mm',
			LTS: 'HH:mm:ss',
			L: 'DD.MM.YYYY',
			LL: 'D. MMMM YYYY',
			LLL: 'D. MMMM YYYY HH:mm',
			LLLL: 'dddd, D. MMMM YYYY HH:mm'
		},
		calendar: {
			sameDay: '[heute um] LT [Uhr]',
			sameElse: 'L',
			nextDay: '[morgen um] LT [Uhr]',
			nextWeek: 'dddd [um] LT [Uhr]',
			lastDay: '[gestern um] LT [Uhr]',
			lastWeek: '[letzten] dddd [um] LT [Uhr]'
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
			yy: processRelativeTime
		},
		ordinalParse: /\d{1,2}\./,
		ordinal: '%d.',
		week: {
			dow: 1, // Monday is the first day of the week.
			doy: 4  // The week that contains Jan 4th is the first week of the year.
		}
	});

})();
