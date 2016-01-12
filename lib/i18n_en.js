(function () {
	'use strict';

	i18n.map('en', {
		layout: {
			title: 'Progressor',
			explanation: 'The Programming Professor',
			homeTitle: 'Home',
			programmingLanguagesTitle: 'Programming Languages',
			createExerciseTitle: 'Create Exercise',
			mongoDBAdminTitle: 'MongoDB Admin',
			dataLoading: 'data is loading...'

		}, account: {
			title: 'My Account',
			loginTitle: 'Login'

		}, exercise: {
			title: 'Exercise',
			searchTitle: '{$1} Exercises',
			difficultiesSubtitle: 'By Difficulties',
			searchSubtitle: 'Search',
			categoryDescriptionSubtitle: 'Instructions for {$1} Exercises',
			exercise: 'exercise',
			exercises: 'exercises',
			nameLabel: 'Name',
			difficultyLabel: 'Difficulty',
			categoryLabel: 'Category',
			codeFragmentLabel: 'Solution Code',
			executeTestsButton: 'execute test cases',
			testCase: {
				success: 'OK',
				missing: 'n/a',
				descriptionLabel: 'Test Case',
				expectedOutputLabel: 'Expected Output',
				resultLabel: 'Result'
			}

		}, form: {
			filterAll: 'all',
			textFilter: 'text filter',
			search: 'search',
			noResults: 'No results could be found.'

		}, error: {
			404: {
				title: 'Error: HTTP 404',
				message: 'The requested page could not be found.'
			}

		}, programmingLanguages: {
			java: {
				name: 'Java',
				description: 'Java is a general-purpose computer programming language that is concurrent, class-based and object-oriented.'
			},
			cpp: {
				name: 'C/C++',
				description: 'C++ (pronounced as cee plus plus) is a general-purpose programming language. It has imperative, object-oriented and generic programming features.'
			},
			csharp: {
				name: 'C#',
				description: 'C# (pronounced as see sharp) is a multi-paradigm programming language encompassing strong typing, imperative, declarative, functional, generic, object-oriented (class-based), and component-oriented programming disciplines.'
			},
			python: {
				name: 'Python',
				description: 'Python is a widely used general-purpose, high-level programming language. Its design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than would be possible in languages such as C++ or Java.'
			},
			vbnet: {
				name: 'Visual Basic .NET',
				description: 'Visual Basic .NET (VB.NET) is a multi-paradigm, high level programming language, implemented on the .NET Framework. Microsoft launched VB.NET in 2002 as the successor to its original Visual Basic language.'
			},
			javascript: {
				name: 'JavaScript',
				description: 'JavaScript is a high-level, dynamic, untyped, and interpreted programming language. Alongside HTML and CSS, it is one of the three essential technologies of World Wide Web content production.'
			},
			perl: {
				name: 'Perl',
				description: 'Perl is a family of high-level, general-purpose, interpreted, dynamic programming languages.'
			}

		}, difficulty: {
			1: 'Beginner',
			2: 'Intermediate',
			3: 'Advanced',
			4: 'Expert'
		}
	});

})();
