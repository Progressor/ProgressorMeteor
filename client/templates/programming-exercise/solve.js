(function () {
	'use strict';

	let exercise, result, exectionResults, blacklist, blacklistMatches;
	const depExecutionResults = new Tracker.Dependency(), depBlacklistMatches = new Tracker.Dependency();

	Template.programmingSolve.onCreated(function () {
		this.autorun(function () {
			exercise = Progressor.exercises.findOne();
			if (exercise) result = null;
			else exercise = (result = Progressor.results.findOne()).exercise;

			exectionResults = result ? result.results : null;
		});
	});

	Template.programmingSolve.onRendered(function () {
		let res = result || Progressor.results.findOne();
		if (res) {
			$('#textarea-fragment').val(res.fragment);
		} else {
			Meteor.call('getFragment', exercise.programmingLanguage, exercise, function (err, res) {
				let $fragment = $('#textarea-fragment');
				if (!err && !$fragment.val().length)
					$fragment.val(res);
			});
		}
	});

	function dependOnExecutionResults(cb) {
		return function (ev) {
			depExecutionResults.depend();
			return cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
		}
	}

	function dependOnBlacklistMatches(cb) {
		return function (ev) {
			depBlacklistMatches.depend();
			return cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
		}
	}

	Template.programmingSolve.helpers(
		{
			safeExercise: () => exercise,
			isResult: () => !!result,
			exerciseSearchData: () => ({ _id: exercise.programmingLanguage }),
			exerciseSolveData: () => ({ _id: result ? result.exercise_id : exercise._id }),
			i18nProgrammingLanguage: () => i18n.getProgrammingLanguage(exercise.programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nCategoryDescription: i18n.getDescription,
			i18nExerciseName: i18n.getName,
			i18nExerciseDescription: i18n.getDescription,
			i18nDifficulty: i18n.getDifficulty,
			i18nResultDateTime: () => i18n.formatDate(result.solved, 'L LT'),
			blackListMessage: dependOnBlacklistMatches(() => blacklistMatches ? i18n('exercise.blacklistMatch', blacklistMatches) : null),
			testCaseSignature: cas => Progressor.getTestCaseSignature(exercise, cas),
			testCaseExpectedOutput: cas => Progressor.getExpectedTestCaseOutput(exercise, cas),
			testCasesEvaluated: dependOnExecutionResults(() => Progressor.isExerciseEvaluated(exercise, exectionResults)),
			testCaseSuccess: dependOnExecutionResults(cas => Progressor.isTestCaseSuccess(exercise, cas, exectionResults)),
			testCaseActualOutput: dependOnExecutionResults(cas => Progressor.getActualTestCaseOutput(exercise, cas, exectionResults)),
			invisibleTestCases: () => Progressor.hasInvisibleTestCases(exercise),
			invisibleTestCasesSuccess: dependOnExecutionResults(() => Progressor.isInvisibleSuccess(exercise, exectionResults)),
			executionFatal: dependOnExecutionResults(() => Progressor.isExecutionFatal(exercise, exectionResults))
		});

	Template.programmingSolve.events(
		{
			'click #button-execute'() {
				let frg = $('#textarea-fragment').val(), $res = $('#table-testcases').css('opacity', 0.333);
				Meteor.call('execute', exercise.programmingLanguage, exercise, frg, (err, res) => {
					exectionResults = !err ? res : null;
					depExecutionResults.changed();
					$('#table-testcases').css('opacity', 1);
				});
			},
			'keyup #textarea-fragment': _.throttle(function () {
				if (!blacklist) {
					blacklist = [];
					Meteor.call('getBlacklist', exercise.programmingLanguage, function (err, res) {
						blacklist = !err ? res : null;
					});
				} else if (blacklist) {
					let frg = $('#textarea-fragment').val();
					blacklistMatches = _.find(blacklist, blk => frg.indexOf(blk) >= 0);
					depBlacklistMatches.changed();
				}
			}, 500)
		});

})();
