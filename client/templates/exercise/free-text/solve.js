(function () {
	'use strict';

	function tmpl() {
		return Template.instance();
	}

	function getExercise(forceRefresh = false) {
		return tmpl().isResult.get() && !forceRefresh ? Progressor.results.findOne().exercise : Progressor.exercises.findOne();
	}

	function getResult() {
		if (tmpl().isResult.get())
			return Progressor.results.findOne();
	}

	function getEvaluationResults() {
		if (tmpl().isResult.get() || (Progressor.results.find().count() && Progressor.exercises.findOne().lastEdited.getTime() === Progressor.results.findOne().exercise.lastEdited.getTime()))
			return Progressor.results.findOne().results;
		else
			return tmpl().evaluationResult.get();
	}

	Template.textSolve.onCreated(function () {
		this.isResult = new ReactiveVar(false);
		this.validationResult = new ReactiveVar(null);
		this.evaluationResult = new ReactiveVar(null);
		this.showSolution = new ReactiveVar(false);
		this.progressUpdateInterval = -1;
		this.progress = { activities: 0, length: 0 };

		this.autorun(() => {
			const result = Progressor.results.findOne(), exercise = Tracker.nonreactive(getExercise);
			if (result && result.answer)
				this.validationResult.set(new RegExp(`^${exercise.pattern}$`).test(result.answer));
		});

		if (!tmpl().isResult.get())
			this.autorun(() => {
				const exercise = getExercise(true);
				if (exercise)
					Meteor.call('openedExercise', exercise, Progressor.handleError());

				Meteor.clearInterval(this.progressUpdateInterval);
				this.progressUpdateInterval = Meteor.setInterval(() => {
					if (exercise) {
						const answer = this.$('.control-answer').val();
						Meteor.call('updateExerciseProgress', exercise, {
							activities: this.progress.activities,
							difference: answer.length - this.progress.length
						}, Progressor.handleError());
						this.progress.activities = 0;
						this.progress.length = answer ? answer.length : 0;
					}
				}, Progressor.RESULT_LOG_PROGRESS_UPDATE_INTERVAL);
			});
	});

	Template.multipleSolve.onDestroyed(function () {
		Meteor.clearInterval(this.progressUpdateInterval);
	});

	function getExecutionExercise(offset) {
		const execution = Progressor.executions.findOne();
		let exerciseIndex = -1;
		if (execution && _.any(execution.exercises, (e, i) => (exerciseIndex = e.exercise_id === getExercise()._id ? i : exerciseIndex) >= 0) && execution.exercises[exerciseIndex + offset])
			return { _id: execution.exercises[exerciseIndex + offset].exercise_id };
	}

	Template.textSolve.helpers(
		{
			safeExercise(exerciseOrResult) {
				tmpl().isResult.set(exerciseOrResult.exercise_id);
				return exerciseOrResult.exercise_id ? exerciseOrResult.exercise : exerciseOrResult;
			},
			isResult: () => tmpl().isResult.get(),
			canEdit: e => !tmpl().isResult.get() && (e.author_id === Meteor.userId() || Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN)),
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
			exerciseSolveData: () => ({ _id: getResult() ? getResult().exercise_id : getExercise()._id }),
			previousExerciseSolveData: () => getExecutionExercise(-1),
			nextExerciseSolveData: () => getExecutionExercise(+1),
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
				else if (tmpl().validationResult.get() === false)
					return 'has-error';
			},
			resultEvaluation() {
				if (Progressor.isExerciseEvaluated(getExercise(), getEvaluationResults()))
					return `glyphicon glyphicon-${Progressor.isExerciseSuccess(getExercise(), getEvaluationResults()) ? 'ok' : 'remove'}`;
			},
			showSolution: () => getExercise().solutionVisible && tmpl().showSolution.get()
		});

	Template.textSolve.events(
		{
			'submit #form-answer': e => e.preventDefault(),
			'keyup .control-answer': (e, t) => t.progress.activities++,
			'change .control-answer': (e, t) => t.validationResult.set(t.$('.control-answer')[0].checkValidity()),
			'click #button-solution': (e, t) => t.showSolution.set(true),
			'click #button-close': (e, t) => t.showSolution.set(false),
			'click #button-save-answer'(event, template) {
				const $control = template.$('.control-answer');
				if ($control[0].checkValidity()) {
					const exercise = getExercise();
					Meteor.call('evaluateFreeText', exercise, $control.val(), Progressor.handleError((error, result) => {
						template.evaluationResult.set(!error ? result : []);
						if (!error && (exercise.execution_id || !result.length))
							Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'info');
					}));
				}
			}
		});

})();
