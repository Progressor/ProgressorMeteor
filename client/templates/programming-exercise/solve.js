(function () {
	'use strict';

	function showSuccess (show) {
		if (show) $("#success").show();
		if (!show) $("#success").hide();
	}

	let exercise, result, blacklist, blacklistLoading;

	Template.programmingSolve.onCreated(function () {
		exercise = Progressor.exercises.findOne();
		if (exercise) result = null;
		else exercise = (result = Progressor.results.findOne()).exercise;

		Session.set('ExecuteResult', result ? result.results : null);
		Session.set('BlacklistMatch', null);
	});

	Template.programmingSolve.onRendered(function () {
		let res = result || Progressor.results.findOne();
		if (res) {
			$('#textarea-fragment').val(res.fragment);
			showSuccess(true);
		} else {
			Meteor.call('getFragment', exercise.programmingLanguage, exercise, function (err, res) {
				let $fragment = $('#textarea-fragment');
				if (!err && !$fragment.val().length)
					$fragment.val(res);
			});
			showSuccess(false);
		}
	});

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
			blackListMessage: () => Session.get('BlacklistMatch') ? i18n('exercise.blacklistMatch', Session.get('BlacklistMatch')) : null,
			testCaseSignature: cas => Progressor.getTestCaseSignature(exercise, cas),
			testCaseExpectedOutput: cas => Progressor.getExpectedTestCaseOutput(exercise, cas),
			testCaseSuccess: cas => Progressor.isSuccess(exercise, cas, Session.get('ExecuteResult')),
			testCaseActualOutput: cas => Progressor.getActualTestCaseOutput(exercise, cas, Session.get('ExecuteResult')),
			invisibleTestCases: () => Progressor.hasInvisibleTestCases(exercise),
			invisibleTestCasesSuccess: () => Progressor.isInvisibleSuccess(exercise, Session.get('ExecuteResult'))
		});

	Template.programmingSolve.events(
		{
			'click #button-execute'() {
				let frg = $('#textarea-fragment').val(), $res = $('#table-testcases').css('opacity', 0.333);
				//$res.find('.glyphicon').removeClass('text-success text-danger');
				Meteor.call('execute', exercise.programmingLanguage, exercise, frg, (err, res) => {
					Session.set('ExecuteResult', err ? null : res);
					$('#table-testcases').css('opacity', 1);
					showSuccess(true);
				});
			},
			'keyup #textarea-fragment': _.throttle(function () {
				if (!blacklist && !blacklistLoading) {
					blacklistLoading = true;
					Meteor.call('getBlacklist', exercise.programmingLanguage, function (err, res) {
						blacklistLoading = false;
						if (!err) blacklist = res;
					});
				} else if (blacklist) {
					let frg = $('#textarea-fragment').val();
					Session.set('BlacklistMatch', _.find(blacklist, blk => frg.indexOf(blk) >= 0));
				}
			}, 500)
		});

})();
