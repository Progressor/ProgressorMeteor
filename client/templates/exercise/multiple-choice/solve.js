(function () {
	'use strict';

	let isResult, evaluationResults;

	function getExercise(forceRefresh = false) {
		return isResult.get() && !forceRefresh ? Progressor.results.findOne().exercise : Progressor.exercises.findOne();
	}

	function getResult() {
		if (isResult.get())
			return Progressor.results.findOne();
	}

	function getEvaluationResults() {
		if (isResult.get() || (Progressor.results.find().count() && Progressor.exercises.findOne().lastEdited.getTime() === Progressor.results.findOne().exercise.lastEdited.getTime()))
			return Progressor.results.findOne().results;
		else
			return evaluationResults.get();
	}

	Template.multipleSolve.onCreated(function () {
		isResult = new ReactiveVar(false);
		evaluationResults = new ReactiveVar([]);
	});

	Template.multipleSolve.helpers(
		{
			safeExercise(exerciseOrResult) {
				isResult.set(exerciseOrResult.exercise_id);
				return exerciseOrResult.exercise_id ? exerciseOrResult.exercise : exerciseOrResult;
			},
			isResult: () => isResult.get(),
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
			exerciseSolveData: () => ({ _id: getResult() ? getResult().exercise_id : getExercise()._id }),
			changedAfterSolved: () => getExercise(true) && getResult() && getExercise(true).lastEdited > getResult().solved,
			resultSolved: () => getResult().solved,
			questionType: () => !getExercise().multipleSolutions ? 'radio' : 'checkbox',
			resultEvaluation(index) {
				const status = Progressor.getResultStatus(getExercise(), index, getEvaluationResults());
				if (status !== 0)
					return `has-${status > 0 ? 'success' : 'error'}`;
			},
			checkedStatus(index) {
				const result = Progressor.results.findOne();
				if (result && result.results && result.results[index] && result.results[index].checked)
					return 'checked';
			}
		});

	Template.multipleSolve.events(
		{
			'click #button-solution': () => $('.input-option').each((i, o) => $(o).prop('checked', _.contains(getExercise().solution, i))),
			'click #button-save-answer': () => Meteor.call('evaluateMultipleChoice', getExercise(), $('.input-option:checked').map((i, e) => parseInt($(e).val())).get(), Progressor.handleError((err, res) => evaluationResults.set(!err ? res : [])))
		});

})();
