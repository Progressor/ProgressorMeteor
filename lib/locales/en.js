(function () {
	'use strict';

	i18n.map('en', {
		layout: {
			title: 'Progressor',
			logo: '<{Progressor}>',
			explanation: 'The Programming Professor',
			homeTitle: 'Home',
			programmingLanguagesTitle: 'Programming Languages',
			mongoDBAdminTitle: 'MongoDB Admin',
			toggleNavigationButton: 'toggle navigation',
			unexpectedErrorMessage: 'An unexpected error occurred.\n{$1}'

		}, account: {
			title: 'My Account',
			loginTitle: 'Login',
			solvedExercisesSubtitle: 'My Solved Exercises',
			createdExercisesSubtitle: 'My Created Exercises',
			archivedExercisesSubtitle: 'Archived Exercises',
			accountSettingsSubtitle: 'Account Settings',
			adminSettingsSubtitle: 'Administrator Settings',
			emailLabel: 'e-Mail Address',
			nameLabel: 'Real Name',
			makeAdminLabel: 'User to Authorise',
			loginButton: 'login',
			registerButton: 'register',
			logoutButton: 'logout',
			logoutOtherClientsButton: 'logout other clients',
			makeAdminButton: 'make this user an administrator',
			isAdminMessage: 'You are an authorised administrator.',
			verificationSuccessMessage: 'The e-Mail address has been verified successfully.\nYou have automatically been logged in.',
			verificationErrorMessage: 'The e-Mail address verification failed.\nPlease try again.',
			passwordResetSuccessMessage: 'The password has successfully been reset.',
			passwordMismatchMessage: 'The entered passwords do not match.',
			passwordResetErrorMessage: 'The password reset failed.\nPlease try again; you may want to request a new link.'

		}, category: {
			createTitle: 'Create Category',
			editTitle: "Edit Category '{$1}'",
			editBreadcrumb: 'Edit Category',
			createButton: 'create category',
			editButton: 'edit category',
			isNotValidMessage: 'This category is not valid and cannot be saved.\nFill in all the mandatory fields (language, name(s), description(s)).'

		}, exercise: {
			title: 'Exercise',
			searchTitle: '{$1} Exercises',
			createTitle: 'Create Exercise',
			editTitle: "Edit Exercise '{$1}'",
			releaseTitle: 'Release Exercise',
			searchSubtitle: 'Search',
			exerciseSubtitle: 'Problem',
			categoryDescriptionSubtitle: 'Instructions for {$1} Exercises',
			functionsSubtitle: 'Functions',
			testCasesSubtitle: 'Test Cases',
			solutionSubtitle: 'Solution',
			optionsSubtitle: 'Options',
			releaseRequestedSubtitle: 'Release Requested',
			releasedSubtitle: 'Release Confirmed',
			editBreadcrumb: 'Edit Exercise',
			exercise: 'exercise',
			exercises: 'exercises',
			upcoming: 'coming soon...',
			nameLabel: 'Name',
			descriptionLabel: 'Description',
			typeLabel: 'Type',
			typeToCreateLabel: 'Type of the Exercise to Create',
			programmingLanguageLabel: 'Programming Language',
			categoryLabel: 'Category',
			difficultyLabel: 'Difficulty',
			codeFragmentLabel: 'Solution Code',
			templateFragmentLabel: 'Template Code',
			solutionFragmentLabel: 'Example Solution Code',
			solvedLabel: 'Solved',
			answerLabel: 'Your Answer',
			solutionPatternLabel: 'Solution Pattern',
			solutionLabel: 'Solution',
			codeMirrorThemeLabel: 'Editor Theme',
			releaseRequestedAtLabel: 'Release Requested At',
			releaseRequestNotifiedAtLabel: 'Notified At',
			releasedByLabel: 'Release Confirmed By',
			releasedAtLabel: 'Release Confirmed At',
			multipleSolutionsLabel: 'Allow Multiple Answers',
			weightLabel: 'Weight',
			showSolutionLabel: 'Show Example Solution',
			showReleasedLabel: 'Show Released Exercises',
			showUnreleasedLabel: 'Show Private Exercises',
			editButton: 'edit exercise',
			duplicateButton: 'duplicate',
			releaseRequestButton: 'request release',
			releaseButton: 'release',
			unreleaseButton: 'hide',
			archiveButton: 'archive exercise',
			unarchiveButton: 'revert archiving of exercise',
			executeTestsButton: 'execute test cases',
			saveAnswerButton: 'save answer',
			showSolutionButton: 'show example solution',
			closeButton: 'Close',
			blacklistMatchMessage: 'validation failed, illegal term: {$1}',
			releasedMessage: 'This exercise has been released.',
			releaseRequestedMessage: 'This exercise has been requested to be released.',
			successMessage: 'This exercise has been solved correctly.',
			failureMessage: 'This exercise has not been solved correctly.',
			unevaluatedMessage: 'This exercise has not yet been evaluated.',
			executionSuccessMessage: 'Successfully executed all test cases.',
			executionFailureMessage: 'Not all test cases executed successfully.',
			changedMessage: 'This exercise has been changed since you solved it.\nYou might want to view the up-to-date version.',
			isNotValidMessage: 'This exercise is not valid and cannot be saved.\nFill in all the mandatory fields (language, category, difficulty, name(s), description(s), function(s), test case(s)).\nCheck if all the entered values are valid.',
			isNotTestedMessage: 'This exercise cannot be published because it is not tested.',
			'function': {
				nameLabel: 'Function Name',
				namePlaceholder: 'function name',
				returnTypeLabel: 'Return Type',
				returnTypePlaceholder: 'return type',
				parameterNameLabel: 'Parameter Name',
				parameterNamePlaceholder: 'parameter name',
				parameterTypeLabel: 'Parameter Type',
				parameterTypePlaceholder: 'parameter type'
			}, testCase: {
				success: 'OK',
				others: 'other test cases',
				descriptionLabel: 'Test Case',
				functionLabel: 'Function',
				inputLabel: 'Arguments',
				expectedOutputLabel: 'Expected Return Value',
				visibleLabel: 'Visible',
				resultLabel: 'Actual Result / Error',
				successMessage: 'This test case has been executed successfully.',
				failureMessage: 'Could not successfully execute test case.'
			}, option: {
				descriptionLabel: 'Description',
				correctLabel: 'Correct',
				wrongLabel: 'Wrong'
			}, help: {
				title: 'Instructions',
				showButton: 'show instructions',
				types: 'For types, please enter one of the following values. The type parameters can themselves be replaced by a type.',
				values: 'For values, please enter a valid format according to the following instructions and examples. For texts and numbers, simply enter the value without any quotation marks. '
								+ 'For collections, enter the values separated by commas.For maps, separate the keys and values by colons and the different pairs by commas.',
				testCaseVisibleMessage: 'Whether or not the test case will be shown to the students.',
				solutionVisibleMessage: 'Whether or not the example solution will be shown to the students.'

			}, type: {
				1: 'Programming',
				2: 'Multiple Choice',
				3: 'Free Text'
			}, difficulty: {
				1: 'Beginner',
				2: 'Intermediate',
				3: 'Advanced',
				4: 'Expert'
			}

		}, examination: {
			createTemplateTitle: 'Create Exam',
			editTemplateTitle: "Edit Exam '{$1}'",
			overviewTitle: 'Exam Overview',
			selectExercisesSubtitle: 'Select Exercises for the Exam',
			configureExaminationSubtitle: 'Configure Exam',
			exercisesSubtitle: 'Exercises in Exam',
			startTime: 'Start time',
			durationLabel: 'Duration',
			durationUnitLabel: 'min',
			totalWeightLabel: 'Total weight',
			progressLabel: 'Progress',
			addExerciseButton: 'add exercise to examination',
			templateIsNotValidMessage: 'This examination is not valid and cannot be saved.\nFill in all the mandatory fields (name(s), description(s), duration, exercises incl. weight).',
			progressInstructionMessage: 'Red: Not answered yet\nYellow: Partially solved\nGreen: Successfully solved\nBlue: Answered (manually evaluated)'

		}, form: {
			notAvailable: 'n/a',
			selectAll: 'all',
			selectPleaseChoose: 'please choose an option',
			textFilter: 'text filter',
			minLength: 'You have to enter at least {$1} characters.',
			supportsMarkdown: 'This field supports Markdown.',
			createdBy: 'created by',
			editedBy: 'last edited by',
			actionAt: 'at',
			createdByLabel: 'Created By',
			editedByLabel: 'Last Edited By',
			editedAtLabel: 'Last Edited At',
			searchButton: 'search',
			saveButton: 'save',
			cancelButton: 'cancel',
			deleteButton: 'delete',
			addButton: 'add a new element',
			removeButton: 'remove this element',
			togglePanelButton: 'toggle panel visibility',
			previousButton: 'previous',
			nextButton: 'next',
			cannotSaveMessage: 'You are not authorised to save this document.',
			documentChangedMessage: 'The currently opened document has been changed.\nIf you continue, you will overwrite these changes. You might want want to reload it instead.',
			noFilterMessage: 'You need to specify at least one search criterion to search.',
			noResultsMessage: 'No results could be found.',
			noSelectionMessage: 'No element was selected.',
			saveSuccessfulMessage: 'Successfully saved your input.'

		}, email: {
			greeting: 'Sincerely yours,',
			footer: 'Progressor - The Programming Professor\nBern University of Applied Sciences - Department of Engineering and Information Technology\nQuellgasse 21 - CH-2501 Biel/Bienne - Switzerland',
			releaseNotifier: {
				subject: 'Progressor - New Release Requests',
				title: 'Exercise Release Request Notifier',
				intro: 'Hello {$1}\nYou have some new {$2}exercise release requests.{$3}\nPlease review the pending release requests.'
			},
			verifyEmail: {
				subject: 'Progressor - eMail Address Verification',
				title: 'eMail Address Verification',
				intro: 'Hello {$1}\nWelcome to {$2}Progressor - The Programming Professor.{$3}\nTo verify your eMail address, please click the link below.',
				info: 'On your account page, you can enter your {$1}real name{$2}.\nTo start using Progressor, simply solve an exising exercise.\nYou can also create your own private exercises and share them with your friends.',
				motivation: 'Have fun learning to program! :-)'
			},
			resetPassword: {
				subject: 'Progressor - Reset Password',
				title: 'Reset Password',
				intro: 'Hello {$1}\nTo reset your password, please click the link below and enter your new password.'
			}

		}, programmingLanguages: {
			java: {
				name: 'Java',
				description: 'is a general-purpose computer programming language that is concurrent, class-based and object-oriented.'
			}, kotlin: {
				name: 'Kotlin',
				description: '(named after an island near St. Petersburg) is a statically-typed programming language that runs on the Java Virtual Machine and also can be compiled to JavaScript source code. Kotlin is designed to interoperate with Java code.'
			}, cpp: {
				name: 'C/C++',
				description: '(pronounced as cee plus plus) is a general-purpose programming language. It has imperative, object-oriented and generic programming features.'
			}, csharp: {
				name: 'C#',
				description: '(pronounced as see sharp) is a multi-paradigm programming language encompassing strong typing, imperative, declarative, functional, generic, object-oriented (class-based), and component-oriented programming disciplines.'
			}, vbnet: {
				name: 'Visual Basic .NET',
				description: 'is a multi-paradigm, high level programming language, implemented on the .NET Framework. Microsoft launched VB.NET in 2002 as the successor to its original Visual Basic language.'
			}, python: {
				name: 'Python',
				description: 'is a widely used general-purpose, high-level programming language. Its design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than would be possible in languages such as C++ or Java.'
			}, javascript: {
				name: 'JavaScript',
				description: 'is a high-level, dynamic, untyped, and interpreted programming language. Alongside HTML and CSS, it is one of the three essential technologies of World Wide Web content production.'
			}, php: {
				name: 'PHP',
				description: 'is a server-side scripting language designed for web development but also used as a general-purpose programming language. PHP originally stood for Personal Home Page, but it now stands for the recursive backronym PHP: Hypertext Preprocessor.'
			}

		}, error: {
			403: {
				name: 'Forbidden',
				message: 'You are not authorised to access the requested page.'
			}, 404: {
				name: 'Not Found',
				message: 'The requested page could not be found.'
			},
			notAuthenticated: {
				message: 'You need to be authenticated to perform this action.'
			},
			notAdmin: {
				message: 'You need to be an administrator to perform this action.'
			},
			notAuthor: {
				message: 'You need to be the owner of the element to perform this action.'
			}
		}
	});

	moment.updateLocale('en', {
		months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
		monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
		weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
		weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
		weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
		longDateFormat: {
			LT: 'HH:mm',
			LTS: 'HH:mm:ss',
			L: 'DD/MM/YYYY',
			LL: 'D MMMM YYYY',
			LLL: 'D MMMM YYYY HH:mm',
			LLLL: 'dddd, D MMMM YYYY HH:mm'
		},
		calendar: {
			sameDay: '[Today at] LT',
			nextDay: '[Tomorrow at] LT',
			nextWeek: 'dddd [at] LT',
			lastDay: '[Yesterday at] LT',
			lastWeek: '[Last] dddd [at] LT',
			sameElse: 'L'
		},
		relativeTime: {
			future: 'in %s',
			past: '%s ago',
			s: 'a few seconds',
			m: 'a minute',
			mm: '%d minutes',
			h: 'an hour',
			hh: '%d hours',
			d: 'a day',
			dd: '%d days',
			M: 'a month',
			MM: '%d months',
			y: 'a year',
			yy: '%d years'
		},
		ordinalParse: /\d{1,2}(st|nd|rd|th)/,
		ordinal: function (number) {
			var b = number % 10,
				output = (~~(number % 100 / 10) === 1) ? 'th' :
								 (b === 1) ? 'st' :
								 (b === 2) ? 'nd' :
								 (b === 3) ? 'rd' : 'th';
			return number + output;
		},
		week: {
			dow: 1, // Monday is the first day of the week.
			doy: 4  // The week that contains Jan 4th is the first week of the year.
		}
	});

})();
