(function () {
	'use strict';

	let isResult, executionStatus, executionResults, blacklist, blacklistMatches;

	function getExercise(forceRefresh = false) {
		return isResult.get() && !forceRefresh ? Progressor.results.findOne().exercise : Progressor.exercises.findOne();
	}

	function getResult() {
		if (isResult.get())
			return Progressor.results.findOne();
	}

	function getExecutionResults() {
		if (isResult.get() || (Progressor.results.find().count() && Progressor.exercises.findOne().lastEdited.getTime() === Progressor.results.findOne().exercise.lastEdited.getTime()))
			return Progressor.results.findOne().results;
		else
			return executionResults.get();
	}

	Template.programmingSolve.onCreated(function () {
		isResult = new ReactiveVar(false);
		executionStatus = new ReactiveVar(0x0);
		executionResults = new ReactiveVar([]);
		blacklist = new ReactiveVar(null);
		blacklistMatches = new ReactiveVar([]);
		Session.set('fragment', null);
	});

	Template.programmingSolve.onRendered(function () {
		//$('body').tooltip({ selector: '[data-toggle="tooltip"]' });

		this.autorun(function () {
			const result = Progressor.results.findOne(), exercise = Tracker.nonreactive(getExercise);
			if (result)
				Session.set('fragment', result.fragment);
			else if (exercise && exercise.fragment)
				Session.set('fragment', exercise.fragment);
			else
				Meteor.call('getFragment', getExercise().programmingLanguage, getExercise(), Progressor.handleError((err, res) => Session.set('fragment', !err ? res : null)));
		});
	});

	Template.programmingSolve.helpers(
		{
			safeExercise(exerciseOrResult) {
				isResult.set(!!exerciseOrResult.exercise_id);
				return exerciseOrResult.exercise_id ? exerciseOrResult.exercise : exerciseOrResult;
			},
			isResult: () => isResult.get(),
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
			exerciseSolveData: () => ({ _id: getResult() ? getResult().exercise_id : getExercise()._id }),
			changedAfterSolved: () => getExercise(true) && getResult() && getExercise(true).lastEdited > getResult().solved,
			resultSolved: () => getResult().solved,
			codeMirrorThemes() {
				const user = Meteor.user(), userTheme = user && user.profile && user.profile.codeMirrorTheme ? user.profile.codeMirrorTheme : Progressor.getCodeMirrorDefaultTheme();
				return _.map(Progressor.getCodeMirrorThemes(), theme => ({ _id: theme, isActive: theme === userTheme }));
			},
			codeMirrorOptions() {
				const programmingLanguage = Progressor.getProgrammingLanguage(getExercise().programmingLanguage);
				return _.extend({}, Progressor.getCodeMirrorConfiguration(), { //https://codemirror.net/doc/manual.html
					autofocus: true,
					readOnly: isResult.get() ? 'nocursor' : false,
					mode: programmingLanguage ? programmingLanguage.codeMirror : 'text/plain'
				});
			},
			executionDisabled: () => executionStatus.get() !== 0x0,
			blackListMessage: () => blacklistMatches.get().length ? i18n('exercise.blacklistMatchMessage', blacklistMatches.get().join(', ')) : null,
			testCaseSignature: c => Progressor.getTestCaseSignature(getExercise(), c),
			testCaseExpectedOutput: c => Progressor.getExpectedTestCaseOutput(getExercise(), c),
			testCasesEvaluated: () => Progressor.isExerciseEvaluated(getExercise(), getExecutionResults()),
			testCaseSuccess: c => Progressor.isTestCaseSuccess(getExercise(), c, getExecutionResults()),
			testCaseActualOutput: c => Progressor.getActualTestCaseOutput(getExercise(), c, getExecutionResults()),
			invisibleTestCases: () => Progressor.hasInvisibleTestCases(getExercise()),
			invisibleTestCasesSuccess: () => Progressor.isInvisibleSuccess(getExercise(), getExecutionResults()),
			executionFatal: () => Progressor.isExerciseFatal(getExercise(), getExecutionResults())
		});

	Template.programmingSolve.events(
		{
			'click #button-execute'() {
				const $result = $('#table-testcases').css('opacity', 1 / 3);
				executionStatus.set(executionStatus.get() | 0x1);
				Meteor.call('execute', getExercise().programmingLanguage, getExercise(), Session.get('fragment'), Progressor.handleError(function (err, res) {
					if (!err)
						executionResults.set(res);
					$result.css('opacity', 1);
					executionStatus.set(executionStatus.get() & ~0x1);
				}));
			},
			'click #button-solution': () => Session.set('fragment', getExercise().solution),
			'keyup .CodeMirror': _.throttle(function () {
				if (!blacklist.get()) {
					blacklist.set([]);
					Meteor.call('getBlacklist', getExercise().programmingLanguage, Progressor.handleError((err, res) => blacklist.set(!err ? res : null)));
				} else {
					const fragment = Session.get('fragment');
					blacklistMatches.set(_.filter(blacklist.get(), blk => fragment.indexOf(blk) >= 0));
					executionStatus.set(blacklistMatches.get().length ? executionStatus.get() | 0x2 : executionStatus.get() & ~0x2);
				}
			}, 500),
			'change #select-codemirror-themes' (ev) {
				const theme = $(ev.currentTarget).val();
				$('.CodeMirror')[0].CodeMirror.setOption('theme', theme);
				Meteor.users.update(Meteor.userId(), { $set: { 'profile.codeMirrorTheme': theme } });
			}
		});

})();
