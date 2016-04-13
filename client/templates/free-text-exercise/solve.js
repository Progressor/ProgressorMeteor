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
				return exerciseOrResult.exercise_id ? exerciseOrResult.exercise : exerciseOrResult;
			},
			getResult: () => getResult(),
			isResult: () => isResult.get(),
			resultSolved: () => getResult().solved,
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
			exerciseSolveData: () => ({ _id: getResult() ? getResult().exercise_id : getExercise()._id }),
			changedAfterSolved: () => getExercise(true) && getResult() && getExercise(true).lastEdited > getResult().solved,
			savedAnswer: () => {
				if (getResult()) return getResult().answer;
			},
			resultFeedback: () => {
				const result = getResult();
				if (result && getExercise().solutionVisible)
					return result.success ? 'has-success' : 'has-error';
			},
			glyphiconFeedback: () => getResult().success ? 'ok' : 'remove'
		});

	Template.textSolve.events(
		{
			'click #button-save-answer'() {
				const $input = $('.exercise-input');
				if ($input[0].checkValidity()) {
					Meteor.call('evaluateFreeText', getExercise(), $input.val(), Progressor.handleError(function (res) {
						if (res !== true && res !== false)
							Progressor.showAlert(i18n('exercise.saveSuccessfulMessage'), 'info');
					}, false));
				}
			},
			'submit #form-answer': ev => ev.preventDefault()
		});

})();
