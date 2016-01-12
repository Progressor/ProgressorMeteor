(function () {
	'use strict';

	var exercise;

	Template.programmingSolve.onCreated(function () {
		exercise = Progressor.exercises.findOne();
		Session.set('ExecuteResult', null);
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
			testCaseSignature: cas => Progressor.getTestCaseSignature(exercise, cas),
			testCaseExpectedOutput: cas => Progressor.getExpectedTestCaseOutput(exercise, cas),
			testCaseSuccess: cas => Progressor.isSuccess(exercise, cas, Session.get('ExecuteResult')),
			testCaseActualOutput: cas => Progressor.getActualTestCaseOutput(exercise, cas, Session.get('ExecuteResult'))
		});

	Template.programmingSolve.events(
		{
			'click #button-execute': function () {
				var frg = $('#textarea-fragment').val();
				Meteor.call('execute', exercise.programmingLanguage, exercise, frg, function (err, res) {
					Session.set('ExecuteResult', err ? null : res);
					if (!err && Meteor.userId())
						Meteor.call('saveResult', exercise, frg, res);
				});
			}
		});

})();
