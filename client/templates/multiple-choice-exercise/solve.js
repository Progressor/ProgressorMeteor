(function () {
	'use strict';

	let isResult;

	function getExercise(forceRefresh) {
		return isResult.get() && !forceRefresh ? Progressor.results.findOne().exercise : Progressor.exercises.findOne();
	}

	Template.multipleSolve.onCreated(function () {
		isResult = new ReactiveVar(false);
	});

	Template.multipleSolve.helpers(
		{
			safeExercise(exerciseOrResult) {
				isResult.set(exerciseOrResult.exercise_id);
				return exerciseOrResult.exercise_id ? exerciseOrResult.exercise : exerciseOrResult;
			},
			i18nProgrammingLanguage: () => i18n.getProgrammingLanguage(getExercise().programmingLanguage),
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
			i18nCategoryName: i18n.getName,
			i18nCategoryDescription: i18n.getDescription,
			i18nExerciseName: i18n.getName,
			i18nExerciseDescription: i18n.getDescription,
			i18nDifficulty: i18n.getDifficulty,
			i18nOptions: i18n.getOptions,
			questionType: () => getExercise().multipleSolutions !== true ? 'radio' : 'checkbox'
		});

	Template.multipleSolve.events(
		{});
})();
