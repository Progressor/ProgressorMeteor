(function () {
	'use strict';

	let isResult, validationResult, evaluationResult;

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
			return evaluationResult.get();
	}

	Template.textSolve.onCreated(function () {
		isResult = new ReactiveVar(false);
		validationResult = new ReactiveVar(null);
		evaluationResult = new ReactiveVar(null);
	});

	Template.textSolve.onRendered(function () {
		this.autorun(function () {
			const result = Progressor.results.findOne(), exercise = Tracker.nonreactive(getExercise);
			if (result)
				validationResult.set(new RegExp(`^${exercise.pattern}$`).test(result.answer));
		});
	});

	Template.textSolve.helpers(
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
			answer()  {
				const result = Progressor.results.findOne();
				if (result)
					return result.answer;
			},
			validation() {
				if (Progressor.isExerciseEvaluated(getExercise(), getEvaluationResults()))
					return `has-${Progressor.isExerciseSuccess(getExercise(), getEvaluationResults()) ? 'success' : 'error'}`;
				else if (validationResult.get() === false)
					return 'has-error';
			},
			resultEvaluation() {
				if (Progressor.isExerciseEvaluated(getExercise(), getEvaluationResults()))
					return `glyphicon glyphicon-${Progressor.isExerciseSuccess(getExercise(), getEvaluationResults()) ? 'ok' : 'remove'}`;
			}
		});

	Template.textSolve.events(
		{
			'submit #form-answer': ev => ev.preventDefault(),
			'change .control-answer': () => validationResult.set($('.control-answer')[0].checkValidity()),
			'click #button-save-answer'() {
				const $control = $('.control-answer');
				if ($control[0].checkValidity()) {
					Meteor.call('evaluateFreeText', getExercise(), $control.val(), Progressor.handleError(function (err, res) {
						evaluationResult.set(!err ? res : []);
						if (!err && !res.length)
							Progressor.showAlert(i18n('exercise.saveSuccessfulMessage'), 'info');
					}));
				}
			}
		});

})();
