(function () {
	'use strict';

	var exercise, blacklist, blacklistLoading;

	Template.programmingSolve.onCreated(function () {
		exercise = Progressor.exercises.findOne();
		Session.set('ExecuteResult', null);
		Session.set('BlacklistMatch', null);
	});

	Template.programmingSolve.onRendered(function () {
		var res = Progressor.results.findOne();
		if (res)
			$('#textarea-fragment').val(res.fragment);
		else
			Meteor.call('getFragment', exercise.programmingLanguage, exercise, function (err, res) {
				var $fragment = $('#textarea-fragment');
				if (!err && !$fragment.val().length)
					$fragment.val(res);
			});
	});

	Template.programmingSolve.helpers(
		{
			exerciseSearchData: () => ({ _id: exercise.programmingLanguage }),
			i18nProgrammingLanguage: exc => i18n.getProgrammingLanguage(exc.programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nCategoryDescription: i18n.getDescription,
			i18nExerciseName: i18n.getName,
			i18nExerciseDescription: i18n.getDescription,
			i18nDifficulty: i18n.getDifficulty,
			blackListMessage: () => Session.get('BlacklistMatch') ? i18n('exercise.blacklistMatch', Session.get('BlacklistMatch')) : null,
			testCaseSignature: cas => Progressor.getTestCaseSignature(exercise, cas),
			testCaseExpectedOutput: cas => Progressor.getExpectedTestCaseOutput(exercise, cas),
			testCaseSuccess: cas => Progressor.isSuccess(exercise, cas, Session.get('ExecuteResult')),
			testCaseActualOutput: cas => Progressor.getActualTestCaseOutput(exercise, cas, Session.get('ExecuteResult'))
		});

	Template.programmingSolve.events(
		{
			'click #button-execute'() {
				var frg = $('#textarea-fragment').val(), $res = $('#table-testcases').css('opacity', 0.333);
				//$res.find('.glyphicon').removeClass('text-success text-danger');
				Meteor.call('execute', exercise.programmingLanguage, exercise, frg, (err, res) => {
					Session.set('ExecuteResult', err ? null : res);
					$('#table-testcases').css('opacity', 1);
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
					var frg = $('#textarea-fragment').val();
					Session.set('BlacklistMatch', _.find(blacklist, blk => frg.indexOf(blk) >= 0));
				}
			}, 500)
		});

})();
