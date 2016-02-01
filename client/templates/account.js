(function () {
	'use strict';

	Template.account.onRendered(function () {
		if (location.hash === '#logout')
			$('#button-logout').click();
	});

	Template.account.helpers(
		{
			currentUserName: () => Meteor.user().emails[0].address,
			resultViewData: res => ({ _id: res._id }),
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			i18nDateTime: dat => i18n.formatDate(dat, 'L LT')
		});

	Template.account.events(
		{
			'click #button-logout': () => Meteor.logout(),
			'click #button-logout-others': () => Meteor.logoutOtherClients()
		});

})();
