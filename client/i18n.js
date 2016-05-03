(function () {
	'use strict';

	function setLanguage(lng) {
		return _.some(i18n.getLanguages(), (name, code) => {
			if (lng.startsWith(code)) {
				i18n.setLanguage(code, true);
				return true;
			}
			return false;
		});
	}

	Meteor.startup(function () {
		_.some(navigator.languages || [navigator.language, navigator.userLanguage, navigator.browserLanguage, navigator.systemLanguage], setLanguage);
		Tracker.autorun(function () {
			const usr = Meteor.user();
			if (usr && usr.profile && usr.profile.language)
				setLanguage(usr.profile.language);
		});
	});

})();
