Progressor = (function () {
	'use strict';

	const programmingLanguages = [
			{ _id: 'java', devicon: 'devicon-java-plain-wordmark' }, //source: http://devicon.fr/ or https://github.com/konpa/devicon,
			{ _id: 'kotlin', devicon: 'devicon-java-plain' },
			{ _id: 'cpp', devicon: 'devicon-cplusplus-plain' },
			{ _id: 'csharp', devicon: 'devicon-csharp-plain' }
		],
		programmingLanguagesUpcoming = [
			{ _id: 'python', devicon: 'devicon-python-plain-wordmark' },
			{ _id: 'php', devicon: 'devicon-php-plain' },
			{ _id: 'javascript', devicon: 'devicon-javascript-plain' },
			{ _id: 'vbnet', devicon: 'devicon-dot-net-plain-wordmark' }
		],
		difficulties = [1, 2, 3, 4];

	return {
		getProgrammingLanguages: () => programmingLanguages,
		getProgrammingLanguagesUpcoming: () => programmingLanguagesUpcoming,
		getDifficulties: () => difficulties
	};

})();
