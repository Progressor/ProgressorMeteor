(function () {
	'use strict';

	Template.exerciseSearch.helpers(
		{
			exerciseSearchData: exc => ({ _id: exc.programmingLanguage }),
			i18nProgrammingLanguage: excs => i18n.getProgrammingLanguage(excs[0].programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty
		});

	Template.exerciseSearch.events({});

})();
