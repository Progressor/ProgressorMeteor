/** Contains all constants and functions directly related to the Progressor project. */
Progressor = (function () {
	'use strict';

	const programmingLanguages = [
			{ _id: 'java', devicon: 'devicon-java-plain-wordmark', codeMirror: 'text/x-java' }, //source: http://devicon.fr/ or https://github.com/konpa/devicon
			{ _id: 'cpp', devicon: 'devicon-cplusplus-plain', codeMirror: 'text/x-c++src' },
			{ _id: 'csharp', devicon: 'devicon-csharp-plain', codeMirror: 'text/x-csharp' },
			{ _id: 'python', devicon: 'devicon-python-plain-wordmark', codeMirror: 'text/x-python' },
			{ _id: 'kotlin', devicon: 'logo-kotlin', codeMirror: 'text/x-kotlin' } //alt: devicon-java-plain
		],
		programmingLanguagesUpcoming = [
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

		/**
		 * Gets the name of the administrator role.
		 * @returns {string}
		 */
		get ROLE_ADMIN() {
			return roles.admin;
		},

		/**
		 * Gets information about the the supported programming languages.
		 * @returns {{_id: string, devicon: string, codeMirror: string}[]}
		 */
		getProgrammingLanguages: () => programmingLanguages,

		/**
		 * Gets information about the the upcoming programming languages.
		 * @returns {{_id: string, devicon: string, codeMirror: string}[]}
		 */
		getProgrammingLanguagesUpcoming: () => programmingLanguagesUpcoming,

		/**
		 * Gets information about a specific programming language
		 * @param language identifier of the programming language
		 * @returns {{_id: string, devicon: string, codeMirror: string}}
		 */
		getProgrammingLanguage: language => _.findWhere(programmingLanguages, { _id: language }) || _.findWhere(programmingLanguagesUpcoming, { _id: language }),

		/**
		 * Gets the codes of the pre-configured difficulty level.
		 * @returns {number[]}
		 */
		getDifficulties: () => difficulties,

		/**
		 * Gets information about the supported exercise types.
		 * @returns {{_id: number, template: string}[]}
		 */
		getExerciseTypes: () => exerciseTypes,

		/**
		 * Gets information about a specific exercise type.
		 * @param type
		 * @returns {{_id: number, template: string}}
		 */
		getExerciseType: type => _.findWhere(exerciseTypes, { _id: type })
	};

})();
