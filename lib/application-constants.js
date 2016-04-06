Progressor = (function () {
	'use strict';

	const programmingLanguages = [
			{ _id: 'java', devicon: 'devicon-java-plain-wordmark', codeMirror: 'text/x-java' }, //source: http://devicon.fr/ or https://github.com/konpa/devicon,
			{ _id: 'kotlin', devicon: 'devicon-java-plain', codeMirror: 'text/x-kotlin' },
			{ _id: 'cpp', devicon: 'devicon-cplusplus-plain', codeMirror: 'text/x-c++src' },
			{ _id: 'csharp', devicon: 'devicon-csharp-plain', codeMirror: 'text/x-csharp' }
		],
		programmingLanguagesUpcoming = [
			{ _id: 'python', devicon: 'devicon-python-plain-wordmark' },
			{ _id: 'php', devicon: 'devicon-php-plain' },
			{ _id: 'javascript', devicon: 'devicon-javascript-plain' },
			{ _id: 'vbnet', devicon: 'devicon-dot-net-plain-wordmark' }
		],
		difficulties = [1, 2, 3, 4],
		exerciseTypes = {
			1: 'programming',
			2: 'multiple',
			3: 'text'
		};

	return {
		ROLE_ADMIN: 'admin',

		getProgrammingLanguages: () => programmingLanguages,
		getProgrammingLanguagesUpcoming: () => programmingLanguagesUpcoming,
		getProgrammingLanguage: l => _.chain(programmingLanguages).union(programmingLanguagesUpcoming).find(i => l === i._id).value(),
		getDifficulties: () => difficulties,
		getExerciseTypes: () => exerciseTypes,
		getExerciseType: i => exerciseTypes[i]
	};

})();
