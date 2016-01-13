(function () {
	'use strict';

	var init = false;

	Meteor.startup(function () {

		if (!init) {
			var languages = navigator.languages || [navigator.language, navigator.userLanguage, navigator.browserLanguage, navigator.systemLanguage];
			_.some(languages, function (lng) {
				return _.some(i18n.getLanguages(), function (nme, cod) {
					if (lng.startsWith(cod)) {
						i18n.setLanguage(cod, true);
						return true;
					}
					return false;
				});
			});
		}
	});

	Tracker.autorun(function () {

		var usr;
		if ((usr = Meteor.user()) && usr.profile && usr.profile.language)
			_.some(i18n.getLanguages(), function (nme, cod) {
				if (usr.profile.language.startsWith(cod)) {
					i18n.setLanguage(cod);
					init = true;
					return true;
				}
				return false;
			});
	});

})();
