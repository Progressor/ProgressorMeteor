(function () {
	'use strict';

	function setLanguage(local = false) {
		return language => _.some(i18n.getLanguages(), (name, code) => {
			const match = language.startsWith(code);
			if (match) i18n.setLanguage(code, local);
			return match;
		});
	}

	Meteor.startup(function () {

		const languages = navigator.languages || [navigator.language, navigator.userLanguage, navigator.browserLanguage, navigator.systemLanguage];

		//set default language (don't save yet)
		_.some(languages, setLanguage(true));

		Tracker.autorun(() => {
			const usr = Meteor.user();
			if (!usr || !usr.profile || !usr.profile.language || !setLanguage(true)(usr.profile.language)) //set profile language (don't overwrite)
				_.some(languages, setLanguage()); //save default language
		});

	});

})();
