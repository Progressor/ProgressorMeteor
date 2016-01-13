(function () {
	'use strict';

	i18n.map('de', {
		layout: {
			homeTitle: 'Startseite',
			programmingLanguagesTitle: 'Programmiersprachen',
			createExerciseTitle: 'Aufgabe erstellen',
			dataLoading: 'Daten werden geladen...'

		}, account: {
			title: 'Mein Konto',
			loginTitle: 'Anmelden',
			loginButton: 'anmelden',
			registerButton: 'registrieren',
			logoutButton: 'abmelden',
			logoutOtherClientsButton: 'andere Geräte abmelden'

		}, exercise: {
			title: 'Aufgabe',
			searchTitle: '{$1} Aufgaben',
			searchSubtitle: 'Suche',
			categoryDescriptionSubtitle: 'Hilfestellung für {$1} Aufgaben',
			exercise: 'Aufgabe',
			exercises: 'Aufgaben',
			upcoming: 'demnächst verfügbar...',
			nameLabel: 'Name',
			difficultyLabel: 'Schwierigkeit',
			categoryLabel: 'Kategorie',
			codeFragmentLabel: 'Programmcode',
			solvedLabel: 'Gelöst',
			executeTestsButton: 'Testfälle überprüfen',
			testCase: {
				success: 'OK',
				missing: 'N/A',
				descriptionLabel: 'Testfall',
				expectedOutputLabel: 'Erwartete Rückgabe',
				resultLabel: 'Resultat'
			}

		}, form: {
			filterAll: 'alle',
			textFilter: 'nach Text filtern',
			search: 'suchen',
			noResults: 'Es wurden keine Suchresultate gefunden.'

		}, error: {
			404: {
				title: 'Fehler: HTTP 404',
				message: 'Die aufgerufene Seite konnte nicht gefunden werden.'
			}

		}, programmingLanguages: {
			java: {
				description: 'Java ist eine objektorientierte Programmiersprache und eine eingetragene Marke des Unternehmens Sun Microsystems (2010 von Oracle aufgekauft).'
			},
			cpp: {
				description: 'C++ ist eine von der ISO genormte Programmiersprache. C++ ermöglicht sowohl die effiziente und maschinennahe Programmierung als auch eine Programmierung auf hohem Abstraktionsniveau.'
			},
			csharp: {
				description: 'C# (englisch cee sharp) ist eine vom Softwarehersteller Microsoft im Rahmen seiner .NET-Strategie entwickelte Programmiersprache. C# ist bei ECMA und ISO als Standard registriert.'
			},
			python: {
				description: 'Python ist eine universelle, üblicherweise interpretierte höhere Programmiersprache. Ihre Entwurfsphilosophie betont Programmlesbarkeit, ausserdem ist Python-Code im Vergleich mit anderssprachigem Code teilweise deutlich kürzer.'
			},
			vbnet: {
				description: 'Visual Basic .NET (Abk. VB.NET) ist eine Programmiersprache, die auf dem Microsoft .NET Framework aufbaut. Sie wurde 2002 publiziert und ist keine einfache Weiterentwicklung des Vorgängers Visual Basic 6, sondern wurde in weiten Teilen neu konzipiert.'
			},
			javascript: {
				description: 'JavaScript (kurz JS) ist eine Skriptsprache, die ursprünglich für dynamisches HTML in Webbrowsern entwickelt wurde, um Benutzerinteraktionen auszuwerten, Inhalte zu verändern, nachzuladen oder zu generieren und so die Möglichkeiten von HTML und CSS zu erweitern.'
			},
			perl: {
				description: 'Perl ist eine freie, plattformunabhängige und interpretierte Programmiersprache (Skriptsprache), die mehrere Programmierparadigmen unterstützt.'
			}

		}, difficulty: {
			1: 'Anfänger',
			2: 'Fortgeschritten',
			3: 'Kenner',
			4: 'Experte'
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

	moment.locale('de', {
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
