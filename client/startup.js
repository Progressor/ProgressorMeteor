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

	Template.registerHelper('i18nProgrammingLanguage', i18n.getProgrammingLanguage);
	Template.registerHelper('i18nExerciseType', i18n.getExerciseType);
	Template.registerHelper('i18nDifficulty', i18n.getDifficulty);
	Template.registerHelper('i18nName', i18n.getName);
	Template.registerHelper('i18nDescription', i18n.getDescription);
	Template.registerHelper('i18nOptions', i18n.getOptions);
	Template.registerHelper('i18nDateTime', d => i18n.formatDate(d, 'L LT'));

	Meteor.startup(function () {
		if (!init)
			_.some(navigator.languages || [navigator.language, navigator.userLanguage, navigator.browserLanguage, navigator.systemLanguage], setLanguage);
	});

	Tracker.autorun(function () {
		const usr = Meteor.user();
		if (usr && usr.profile && usr.profile.language)
			setLanguage(usr.profile.language);
	});

})();
