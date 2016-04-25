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
		forUser: (n, u) => i18n.forLanguage(n, i18n.getLanguageForUser(u)),
		forLanguage(name, language) {
			const _language = i18n.getLanguage();
			_setLanguage(language);
			const text = i18n(name);
			_setLanguage(_language);
			return text;
		},

		getLanguages: () => languages,
		getLanguageForUser(user) {
			if (typeof user === 'string')
				user = Meteor.users.findOne(user);
			return user && user.profile && user.profile.language ? user.profile.language : defaultLanguage;
		},
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

		getProperty(document, propertyName, language, fallback = true) {
			const properties = document[`${propertyName}s`];
			if (properties) {
				const translations = _.chain(properties).filter(p => fallback || p.language === language)
					.sortBy(p => p.language === language ? 1 : p.language === defaultLanguage ? 2 : 3).map(p => p[`${propertyName}s`] || p[propertyName]).value();
				if (translations.length)
					if (!_.isArray(translations[0])) return _.find(translations, _.identity);
					else return _.chain(_.chain(translations).map(t => t.length).max().value()).range().map(i => _.chain(translations).map(t => t[i]).find(_.identity).value()).value();
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
