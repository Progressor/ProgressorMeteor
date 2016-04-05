(function () {
	'use strict';

	function getExercise(forceRefresh) {
		return isResult.get() && !forceRefresh ? Progressor.results.findOne().exercise : Progressor.exercises.findOne();
	}
	
	Template.textSolve.helpers(
		{
			i18nProgrammingLanguage: () => i18n.getProgrammingLanguage(getExercise().programmingLanguage),
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
			i18nCategoryName: i18n.getName,
			i18nCategoryDescription: i18n.getDescription,
			i18nExerciseName: i18n.getName,
			i18nExerciseDescription: i18n.getDescription,
			i18nDifficulty: i18n.getDifficulty,
		});

	Template.textSolve.events(
		{
			
			
		});
})();
