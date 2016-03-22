(function () {
	'use strict';

	let blacklist, blacklistMatches;

	function getExercise() {
		return Progressor.exercises.findOne() || Progressor.results.findOne().exercise;
	}

	function getResult() {
		if (!Progressor.exercises.find().count())
			return Progressor.results.findOne();
	}

	function getExecutionResults() {
		if (!Progressor.exercises.find().count() || (Progressor.results.find().count() && Progressor.exercises.findOne().lastEdited.getTime() === Progressor.results.findOne().exercise.lastEdited.getTime()))
			return Progressor.results.findOne().results;
	}

	Template.programmingSolve.onCreated(function () {
		blacklist = new ReactiveVar(null);
		blacklistMatches = new ReactiveVar([]);
	});

	Template.programmingSolve.onRendered(function () {
		let result = getResult() || Progressor.results.findOne();
		if (result)
			$('#textarea-fragment').val(result.fragment);
		else
			Meteor.call('getFragment', getExercise().programmingLanguage, getExercise(), function (error, result) {
				let $fragment = $('#textarea-fragment');
				if (!error && !$fragment.val().length)
					$fragment.val(result);
			});
	});

	Template.programmingSolve.helpers(
		{
			safeExercise: () => getExercise(),
			isResult: () => !!getResult(),
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
			exerciseSolveData: () => ({ _id: getResult() ? getResult().exercise_id : getExercise()._id }),
			i18nProgrammingLanguage: () => i18n.getProgrammingLanguage(getExercise().programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nCategoryDescription: i18n.getDescription,
			i18nExerciseName: i18n.getName,
			i18nExerciseDescription: i18n.getDescription,
			i18nDifficulty: i18n.getDifficulty,
			i18nResultDateTime: () => i18n.formatDate(getResult().solved, 'L LT'),
			blackListMessage: () => blacklistMatches.get().length ? i18n('exercise.blacklistMatch', blacklistMatches.get().join(', ')) : null,
			testCaseSignature: c => Progressor.getTestCaseSignature(getExercise(), c),
			testCaseExpectedOutput: c => Progressor.getExpectedTestCaseOutput(getExercise(), c),
			testCasesEvaluated: () => Progressor.isExerciseEvaluated(getExercise(), getExecutionResults()),
			testCaseSuccess: c => Progressor.isTestCaseSuccess(getExercise(), c, getExecutionResults()),
			testCaseActualOutput: c => Progressor.getActualTestCaseOutput(getExercise(), c, getExecutionResults()),
			invisibleTestCases: () => Progressor.hasInvisibleTestCases(getExercise()),
			invisibleTestCasesSuccess: () => Progressor.isInvisibleSuccess(getExercise(), getExecutionResults()),
			executionFatal: () => Progressor.isExecutionFatal(getExercise(), getExecutionResults())
		});

	Template.programmingSolve.events(
		{
			'click #button-execute'() {
				let $fragment = $('#textarea-fragment'), $result = $('#table-testcases').css('opacity', 1 / 3);
				Meteor.call('execute', getExercise().programmingLanguage, getExercise(), $fragment.val(), () => $result.css('opacity', 1));
			},
			'click #button-solution': () => $('#textarea-fragment').val(getExercise().solution),
			'keyup #textarea-fragment': _.throttle(function () {
				if (!blacklist.get()) {
					blacklist.set([]);
					Meteor.call('getBlacklist', getExercise().programmingLanguage, (error, result) => blacklist.set(!error ? result : null));
				} else {
					let fragment = $('#textarea-fragment').val();
					blacklistMatches.set(_.filter(blacklist.get(), blk => fragment.indexOf(blk) >= 0));
					$('#button-execute').prop('disabled', blacklistMatches.get().length);
				}
			}, 500)
		});

})();
