(function () {
	'use strict';

	const exercise = new ReactiveVar(null), result = new ReactiveVar(null);
	const executionResults = new ReactiveVar([]), blacklist = new ReactiveVar(null), blacklistMatches = new ReactiveVar([]);

	Progressor.initaliseTemplate(Template.programmingSolve, function () {
		let _exercise = Progressor.exercises.findOne(), _result = Progressor.results.findOne();
		exercise.set(!_exercise && _result ? _result.exercise : _exercise);
		result.set(!_exercise ? _result : null);
		executionResults.set(!_exercise && _result ? _result.results : null);
	});

	Template.programmingSolve.onRendered(function () {
		let _result = result.get() || Progressor.results.findOne();
		if (_result)
			$('#textarea-fragment').val(_result.fragment);
		else
			Meteor.call('getFragment', exercise.get().programmingLanguage, exercise.get(), function (error, result) {
				let $fragment = $('#textarea-fragment');
				if (!error && !$fragment.val().length)
					$fragment.val(result);
			});
	});

	Template.programmingSolve.helpers(
		{
			safeExercise: () => exercise.get(),
			isResult: () => !!result.get(),
			exerciseSearchData: () => ({ _id: exercise.get().programmingLanguage }),
			exerciseSolveData: () => ({ _id: result.get() ? result.get().exercise_id : exercise.get()._id }),
			i18nProgrammingLanguage: () => i18n.getProgrammingLanguage(exercise.get().programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nCategoryDescription: i18n.getDescription,
			i18nExerciseName: i18n.getName,
			i18nExerciseDescription: i18n.getDescription,
			i18nDifficulty: i18n.getDifficulty,
			i18nResultDateTime: () => i18n.formatDate(result.get().solved, 'L LT'),
			blackListMessage: () => blacklistMatches.get().length ? i18n('exercise.blacklistMatch', blacklistMatches.get().join(', ')) : null,
			testCaseSignature: c => Progressor.getTestCaseSignature(exercise.get(), c),
			testCaseExpectedOutput: c => Progressor.getExpectedTestCaseOutput(exercise.get(), c),
			testCasesEvaluated: () => Progressor.isExerciseEvaluated(exercise.get(), executionResults.get()),
			testCaseSuccess: c => Progressor.isTestCaseSuccess(exercise.get(), c, executionResults.get()),
			testCaseActualOutput: c => Progressor.getActualTestCaseOutput(exercise.get(), c, executionResults.get()),
			invisibleTestCases: () => Progressor.hasInvisibleTestCases(exercise.get()),
			invisibleTestCasesSuccess: () => Progressor.isInvisibleSuccess(exercise.get(), executionResults.get()),
			executionFatal: () => Progressor.isExecutionFatal(exercise.get(), executionResults.get())
		});

	Template.programmingSolve.events(
		{
			'click #button-execute'() {
				let fragment = $('#textarea-fragment').val(), $result = $('#table-testcases').css('opacity', 0.333);
				Meteor.call('execute', exercise.get().programmingLanguage, exercise.get(), fragment, (error, result) => {
					executionResults.set(!error ? result : null);
					$result.css('opacity', 1);
				});
			},
			'click #button-solution': () => $('#textarea-fragment').val(exercise.get().solution),
			'keyup #textarea-fragment': _.throttle(function () {
				if (!blacklist.get()) {
					blacklist.set([]);
					Meteor.call('getBlacklist', exercise.get().programmingLanguage, (error, result) => blacklist.set(!error ? result : null));
				} else {
					let fragment = $('#textarea-fragment').val();
					blacklistMatches.set(_.filter(blacklist.get(), blk => fragment.indexOf(blk) >= 0));
					$('#button-execute').prop('disabled', blacklistMatches.get().length);
				}
			}, 500)
		});

})();
