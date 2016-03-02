(function () {
	'use strict';

	let init = false;

	function setLanguage(lng) {
		return _.some(i18n.getLanguages(), function (nme, cod) {
			if (lng.startsWith(cod)) {
				i18n.setLanguage(cod, true);
				return true;
			}
			return false;
		});
	}

	Meteor.startup(function () {

		if (!init)
			_.some(navigator.languages || [navigator.language, navigator.userLanguage, navigator.browserLanguage, navigator.systemLanguage], setLanguage);
	});

	Tracker.autorun(function () {

		let usr = Meteor.user();
		if (usr && usr.profile && usr.profile.language)
			setLanguage(usr.profile.language);
	});

})();
