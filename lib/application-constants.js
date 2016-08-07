/** Contains all constants and functions directly related to the Progressor project. */
Progressor = (function () {
  const programmingLanguages = [
      { _id: 'java', devicon: 'devicon-java-plain-wordmark', codeMirror: 'text/x-java' }, //source: http://devicon.fr/ or https://github.com/konpa/devicon
      { _id: 'cpp', devicon: 'devicon-cplusplus-plain', codeMirror: 'text/x-c++src' },
      { _id: 'csharp', devicon: 'devicon-csharp-plain', codeMirror: 'text/x-csharp' },
      { _id: 'python', devicon: 'devicon-python-plain-wordmark', codeMirror: 'text/x-python', templateOffset: 1 },
      { _id: 'javascript', devicon: 'devicon-javascript-plain', codeMirror: 'text/javascript' },
      { _id: 'php', devicon: 'devicon-php-plain', codeMirror: 'text/x-php' },
      { _id: 'kotlin', devicon: 'logo-kotlin', codeMirror: 'text/x-kotlin' },
      { _id: 'vbnet', devicon: 'devicon-dot-net-plain-wordmark', codeMirror: 'text/x-vb', templateOffset: 1 }
    ],
    programmingLanguagesUpcoming = [
      // { _id: 'ruby', devicon: 'devicon-ruby-plain-wordmark' }, //codeMirror: 'text/x-ruby'
      // { _id: 'swift', devicon: 'logo-swift' }, //codeMirror: 'text/x-swift'
      // { _id: 'lisp', devicon: 'logo-lisp' }, //codeMirror: 'text/x-common-lisp'
      // { _id: 'sql', devicon: 'devicon-mysql-plain-wordmark' } //codeMirror: 'text/x-sql' OR 'text/x-mysql'
      { _id: 'upcoming', devicon: 'logo-upcoming' },
    ],
    difficulties = [1, 2, 3, 4],
    exerciseTypes = [
      { _id: 1, template: 'programming' },
      { _id: 2, template: 'multiple' },
      { _id: 3, template: 'text' },
    ];

  const roles = {
    admin: 'admin',
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
    getExerciseType: type => _.findWhere(exerciseTypes, { _id: type }),
  };
})();
