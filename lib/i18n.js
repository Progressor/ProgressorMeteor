(function () {
	'use strict';

	i18n.languages = {
		en: 'English',
		de: 'Deutsch',
		fr: 'Français'
	};

	i18n.setDefaultLanguage(i18n.defaultLanguage = _.keys(i18n.languages)[0]);
	i18n.setLanguage(i18n.defaultLanguage);

	i18n.showMissing(true);

	_.extend(i18n, {
		getLanguages: () => i18n.languages,
		getDefaultLanguage: () => i18n.defaultLanguage,
		getDifficulty: dif => i18n(`difficulty.${dif}`),
		getProgrammingLanguage: lng => i18n(`programmingLanguages.${lng}.name`),
		getProgrammingLanguageDescription: lng => i18n(`programmingLanguages.${lng}.description`),
		getName: doc => (_.findWhere(doc.names, { language: i18n.getLanguage() }) || _.findWhere(doc.names, { language: i18n.getDefaultLanguage() })).name,
		getDescription: doc => (_.findWhere(doc.descriptions, { language: i18n.getLanguage() }) || _.findWhere(doc.descriptions, { language: i18n.getDefaultLanguage() })).description
	});

})();
