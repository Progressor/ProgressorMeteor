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

	function getExecutionResults() {
		if (tmpl().isResult.get() || (Progressor.results.find().count() && Progressor.exercises.findOne().lastEdited.getTime() === Progressor.results.findOne().exercise.lastEdited.getTime()))
			return Progressor.results.findOne().results;
		else
			return tmpl().executionResults.get();
	}

	Template.programmingSolve.onCreated(function () {
		this.isResult = new ReactiveVar(false);
		this.executionStatus = new ReactiveVar(0x0);
		this.executionResults = new ReactiveVar([]);
		this.blacklist = new ReactiveVar(null);
		this.blacklistMatches = new ReactiveVar([]);
		this.showSolution = new ReactiveVar(false);
		Session.set('fragment', null);
		Session.set('solution', null);
	});

	Template.programmingSolve.onRendered(function () {
		this.autorun(() => {
			const result = Progressor.results.findOne(), exercise = Tracker.nonreactive(getExercise);
			if (result)
				Session.set('fragment', result.fragment);
			else if (exercise && exercise.fragment)
				Session.set('fragment', exercise.fragment);
			else
				Meteor.call('getFragment', getExercise().programmingLanguage, { _id: getExercise()._id }, Progressor.handleError((e, r) => Session.set('fragment', !e ? r : null)));
		});
	});

	function getExecutionExercise(offset) {
		const execution = Progressor.executions.findOne();
		let exerciseIndex = -1;
		if (execution && _.any(execution.exercises, (e, i) => (exerciseIndex = e.exercise_id === getExercise()._id ? i : exerciseIndex) >= 0) && execution.exercises[exerciseIndex + offset])
			return { _id: execution.exercises[exerciseIndex + offset].exercise_id };
	}

	Template.programmingSolve.helpers(
		{
			safeExercise(exerciseOrResult) {
				tmpl().isResult.set(!!exerciseOrResult.exercise_id);
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
			codeMirrorThemes() {
				const user = Meteor.user(), userTheme = user && user.profile && user.profile.codeMirrorTheme ? user.profile.codeMirrorTheme : Progressor.getCodeMirrorDefaultTheme();
				return _.map(Progressor.getCodeMirrorThemes(), theme => ({ _id: theme, isActive: theme === userTheme }));
			},
			codeMirrorOptions(isSolution = false) {
				const programmingLanguage = Progressor.getProgrammingLanguage(getExercise().programmingLanguage);
				return _.extend({}, Progressor.getCodeMirrorConfiguration(), { //https://codemirror.net/doc/manual.html
					autofocus: true,
					readOnly: tmpl().isResult.get() || isSolution ? 'nocursor' : false,
					mode: programmingLanguage ? programmingLanguage.codeMirror : 'text/plain'
				});
			},
			executionDisabled: () => tmpl().executionStatus.get() !== 0x0,
			blackListMessage: () => tmpl().blacklistMatches.get().length ? i18n('exercise.blacklistMatchMessage', tmpl().blacklistMatches.get().join(', ')) : null,
			testCaseSignature: c => Progressor.getTestCaseSignature(getExercise(), c),
			testCaseExpectedOutput: c => Progressor.getExpectedTestCaseOutput(getExercise(), c),
			testCasesEvaluated: () => Progressor.isExerciseEvaluated(getExercise(), getExecutionResults()),
			testCaseSuccess: c => Progressor.isTestCaseSuccess(getExercise(), c, getExecutionResults()),
			testCaseActualOutput: c => Progressor.getActualTestCaseOutput(getExercise(), c, getExecutionResults()),
			testCaseExecutionTime: c => Progressor.getTestCaseExecutionTime(getExercise(), c, getExecutionResults()),
			executionFatal: () => Progressor.isExerciseFatal(getExercise(), getExecutionResults()),
			showSolution: () => getExercise().solutionVisible && tmpl().showSolution.get()
		});

	Template.programmingSolve.events(
		{
			'click #button-execute'(event, template) {
				template.showSolution.set(false);
				const exercise = getExercise();
				setTimeout(() => template.$('.execute-result').css('opacity', 1 / 3), 1);
				template.executionStatus.set(template.executionStatus.get() | 0x1);
				Meteor.call('execute', exercise.programmingLanguage, { _id: exercise._id }, Session.get('fragment'), Progressor.handleError((error, result) => {
					template.executionResults.set(!error ? result : []);
					template.$('.execute-result').css('opacity', 1);
					template.executionStatus.set(template.executionStatus.get() & ~0x1);
				}));
			},
			'click #button-solution'(event, template)  {
				Session.set('solution', getExercise().solution);
				template.showSolution.set(true);
			},
			'click #button-close'(event, template)  {
				template.showSolution.set(false);
			},
			'keyup .CodeMirror': _.throttle(function (event, template) {
				if (!template.blacklist.get()) {
					template.blacklist.set([]);
					Meteor.call('getBlacklist', getExercise().programmingLanguage, Progressor.handleError((e, r) => template.blacklist.set(!e ? r : null)));
				} else {
					const fragment = Session.get('fragment');
					template.blacklistMatches.set(_.filter(template.blacklist.get(), blk => fragment.indexOf(blk) >= 0));
					template.executionStatus.set(template.blacklistMatches.get().length ? template.executionStatus.get() | 0x2 : template.executionStatus.get() & ~0x2);
				}
			}, 500),
			'change #select-codemirror-themes'(event, template) {
				const theme = $(event.currentTarget).val();
				template.$('.CodeMirror')[0].CodeMirror.setOption('theme', theme);
				Meteor.users.update(Meteor.userId(), { $set: { 'profile.codeMirrorTheme': theme } });
			}
		});

})();
