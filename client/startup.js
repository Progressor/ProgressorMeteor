Meteor.startup(function () {
	'use strict';

	var browserLanguages = navigator.languages || [navigator.language, navigator.userLanguage, navigator.browserLanguage, navigator.systemLanguage];
	_.some(browserLanguages, function (lng) {
		return _.some(i18n.getLanguages(), function (nme, cod) {
			if (lng.startsWith(cod)) {
				i18n.setLanguage(cod);
				return true;
			}
			return false;
		});
	});
});
