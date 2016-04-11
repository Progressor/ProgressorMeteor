(function () {
	'use strict';

	let isResult;

	function getExercise(forceRefresh) {
		return isResult.get() && !forceRefresh ? Progressor.results.findOne().exercise : Progressor.exercises.findOne();
	}

	function getResult() {
		return Progressor.results.findOne();
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
			isResult: () => isResult.get(),
			i18nProgrammingLanguage: () => i18n.getProgrammingLanguage(getExercise().programmingLanguage),
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
			exerciseSolveData: () => ({ _id: getResult() ? getResult().exercise_id : getExercise()._id }),
			changedAfterSolved: () => getExercise(true) && getResult() && getExercise(true).lastEdited > getResult().solved,
			i18nCategoryName: i18n.getName,
			i18nCategoryDescription: i18n.getDescription,
			i18nExerciseName: i18n.getName,
			i18nExerciseDescription: i18n.getDescription,
			i18nDifficulty: i18n.getDifficulty,
			i18nOptions: i18n.getOptions,
			questionType: () => getExercise().multipleSolutions !== true ? 'radio' : 'checkbox',
			resultFeedback(index) {
				let result = getResult();
				if (result && getExercise().solutionVisible)
					return result.results[index].success == result.results[index].checked ? 'text-success' : 'text-danger';
			},
			checked(index) {
				let result = getResult();
				if (result && result.results[index].checked === true)
					return 'checked';
			}
		});

	Template.multipleSolve.events(
		{
			'click #button-checkAnswer'() {
				let checked = $('input[name="optionsRadios"]:checked').map(function () {
					return parseInt($(this).val());
				}).get();
				Meteor.call('checkMultipleChoice', getExercise(), checked);
			}
		});
})();
