(function () {
	'use strict';

	let isResult;

	function getExercise(forceRefresh) {
		return isResult.get() && !forceRefresh ? Progressor.results.findOne().exercise : Progressor.exercises.findOne();
	}

	function getResult() {
		return Progressor.results.findOne();
	}

	Template.textSolve.onCreated(function () {
		isResult = new ReactiveVar(false);
	});

	Template.textSolve.helpers(
		{
			safeExercise(exerciseOrResult) {
				isResult.set(exerciseOrResult.exercise_id);
				return getExercise();
			},
			resultSolved: () => getResult().solved,
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage })
		});

})();
