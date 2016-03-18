(function () {
	'use strict';

	Template.account.helpers(
		{
			currentUserName: () => Progressor.getUserName(Meteor.user()),
			userName: Progressor.getUserName,
			solvedComplete: (e, r) => Progressor.isExecutionSuccess(e, r),
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			i18nDateTime: d => i18n.formatDate(d, 'L LT')
		});

	Template.account.events(
		{
			'click #button-logout': () => Meteor.logout(),
			'click #button-logout-others': () => Meteor.logoutOtherClients(),
			'click .button-archive'(ev) {
				let exercise = Progressor.exercises.findOne({ _id: $(ev.currentTarget).attr('data-button') });
				exercise.archived = true;
				Meteor.call('saveExercise', exercise);
			}
		});

})();
