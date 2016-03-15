(function () {
	'use strict';

	Template.account.helpers(
		{
			currentUserName: () => Progressor.getUserName(Meteor.user()),
			userName: Progressor.getUserName,
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			i18nDateTime: d => i18n.formatDate(d, 'L LT')
		});

	Template.account.events(
		{
			'click #button-logout': () => Meteor.logout(),
			'click #button-logout-others': () => Meteor.logoutOtherClients()
		});

})();
