Meteor.startup(function () {

	var browserLanguages = navigator.languages || [ navigator.language, navigator.userLanguage, navigator.browserLanguage, navigator.systemLanguage ];
	_.some(browserLanguages, function (browserLanguage) {
		return _.some(i18n.languages, function (languageName, languageCode) {
			if (browserLanguage.startsWith(languageCode)) {
				i18n.setLanguage(languageCode);
				return true;
			}
			return false;
		});
	});
});
