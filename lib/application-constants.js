Progressor = (function () {
	'use strict';

	const programmingLanguages = [
			{ _id: 'java', devicon: 'devicon-java-plain-wordmark', codeMirror: 'text/x-java' }, //source: http://devicon.fr/ or https://github.com/konpa/devicon
			{ _id: 'cpp', devicon: 'devicon-cplusplus-plain', codeMirror: 'text/x-c++src' },
			{ _id: 'csharp', devicon: 'devicon-csharp-plain', codeMirror: 'text/x-csharp' },
			{ _id: 'kotlin', devicon: 'logo-kotlin', codeMirror: 'text/x-kotlin' }, //alt: devicon-java-plain
		],
		programmingLanguagesUpcoming = [
			{ _id: 'python', devicon: 'devicon-python-plain-wordmark' },
			{ _id: 'php', devicon: 'devicon-php-plain' },
			{ _id: 'javascript', devicon: 'devicon-javascript-plain' },
			{ _id: 'vbnet', devicon: 'devicon-dot-net-plain-wordmark' }
		],
		difficulties = [1, 2, 3, 4],
		exerciseTypes = [
			{ _id: 1, template: 'programming' },
			{ _id: 2, template: 'multiple' },
			{ _id: 3, template: 'text' }
		];

	const roles = {
		admin: 'admin'
	};

	return {
		get ROLE_ADMIN() {
			return roles.admin;
		},

		getProgrammingLanguages: () => programmingLanguages,
		getProgrammingLanguagesUpcoming: () => programmingLanguagesUpcoming,
		getProgrammingLanguage: l => _.chain(programmingLanguages).union(programmingLanguagesUpcoming).find(i => l === i._id).value(),
		getDifficulties: () => difficulties,
		getExerciseTypes: () => exerciseTypes,
		getExerciseType: i => _.find(exerciseTypes, t => t._id === i)
	};

})();
