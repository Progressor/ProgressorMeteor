Progressor = (function () {
	'use strict';

	var programmingLanguages = ['java'],
		programmingLanguagesUpcoming = ['cpp', 'csharp', 'python', 'vbnet', 'javascript', 'perl'],
		difficulties = [1, 2, 3, 4];

	return {
		getProgrammingLanguages: () => programmingLanguages,
		getProgrammingLanguagesUpcoming: () => programmingLanguagesUpcoming,
		getDifficulties: () => difficulties
	};

})();
