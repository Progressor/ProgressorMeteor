(function () {
	'use strict';

	var languages = {
			en: 'English',
			de: 'Deutsch',
			fr: 'Français'
		},
		defaultLanguage = _.keys(languages)[0];

	i18n.setDefaultLanguage(defaultLanguage);
	i18n.showMissing(true);

	var _setDefaultLanguage = i18n.setDefaultLanguage;

	_.extend(i18n, {

		getLanguages: () => languages,
		getDefaultLanguage: () => defaultLanguage,
		setDefaultLanguage: lng => _setDefaultLanguage(defaultLanguage = lng),

		getDifficulty: dif => i18n(`difficulty.${dif}`),
		getProgrammingLanguage: lng => i18n(`programmingLanguages.${lng}.name`),
		getProgrammingLanguageDescription: lng => i18n(`programmingLanguages.${lng}.description`),

		getProperty(doc, prp) {
			if (!_.isArray(doc) && _.isObject(doc) && _.has(doc, `${prp}s`))
				doc = doc[`${prp}s`];
			if (_.isArray(doc)) {
				var lng = i18n.getLanguage();
				var res = _.findWhere(doc, { language: lng }) || _.findWhere(doc, { language: defaultLanguage });
				return _.isObject(res) && _.has(res, prp) ? res[prp] : null;
			}
		},
		getName: doc => i18n.getProperty(doc, 'name'),
		getDescription: doc => i18n.getProperty(doc, 'description')
	});

})();
