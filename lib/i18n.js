(function () {
	'use strict';

	const languages = {
		en: 'English',
		de: 'Deutsch',
		fr: 'Français'
	};
	let defaultLanguage = _.keys(languages)[0];

	const _setDefaultLanguage = i18n.setDefaultLanguage, _setLanguage = i18n.setLanguage;
	const trackerDependency = new Tracker.Dependency();

	_.extend(i18n, {

		getLanguages: () => languages,
		setLanguage(language, local = false) {
			if (Meteor.isClient && !local && Meteor.user()) Meteor.users.update(Meteor.userId(), { $set: { 'profile.language': language } });
			T9n.setLanguage(language); //login/register template
			moment.locale(language); //date/time support (https://github.com/moment/moment/tree/develop/locale)
			_setLanguage(language);
			trackerDependency.changed();
		},
		getDefaultLanguage: () => defaultLanguage,
		setDefaultLanguage: l => _setDefaultLanguage(defaultLanguage = l),

		getExerciseType: t => i18n(`exercise.type.${t}`),
		getDifficulty: d => i18n(`exercise.difficulty.${d}`),
		getProgrammingLanguage: lng => i18n(`programmingLanguages.${lng}.name`),
		getProgrammingLanguageDescription: lng => i18n(`programmingLanguages.${lng}.description`),

		getProperty(document, property, language, fallback = true) {
			if (!_.isArray(document) && _.isObject(document) && _.has(document, `${property}s`))
				document = document[`${property}s`];
			if (_.isArray(document)) {
				const res = _.findWhere(document, { language: language }) || (fallback ? _.findWhere(document, { language: defaultLanguage }) : null);
				return res ? res[`${property}s`] || res[property] : null;
			}
		},
		getName: d => i18n.getProperty(d, 'name', i18n.getLanguage()),
		getNameForLanguage: (d, l) => i18n.getProperty(d, 'name', l, false),
		getDescription: d => i18n.getProperty(d, 'description', i18n.getLanguage()),
		getDescriptionForLanguage: (d, l) => i18n.getProperty(d, 'description', l, false),
		getOptions: d => i18n.getProperty(d, 'option', i18n.getLanguage()),
		getOptionsForLanguage: (d, l) => i18n.getProperty(d, 'option', l, false),

		formatDate(date, format) {
			trackerDependency.depend();
			return moment(date).format(format);
		}
	});

	i18n.setDefaultLanguage(defaultLanguage);
	i18n.showMissing(true);

	marked.setOptions(
		{ //github flavoured markdown (https://github.com/chjj/marked)
			gfm: true,
			tables: true,
			breaks: true
		});

})();
