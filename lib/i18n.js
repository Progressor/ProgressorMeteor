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
		setLanguage(lng, loc) {
			if (Meteor.isClient && !loc && Meteor.user()) Meteor.users.update(Meteor.userId(), { $set: { 'profile.language': lng } });
			T9n.setLanguage(lng); //login/register template
			moment.locale(lng); //date/time support (https://github.com/moment/moment/tree/develop/locale)
			_setLanguage(lng);
			trackerDependency.changed();
		},
		getDefaultLanguage: () => defaultLanguage,
		setDefaultLanguage: lng => _setDefaultLanguage(defaultLanguage = lng),

		getDifficulty: dif => i18n(`difficulty.${dif}`),
		getProgrammingLanguage: lng => i18n(`programmingLanguages.${lng}.name`),
		getProgrammingLanguageDescription: lng => i18n(`programmingLanguages.${lng}.description`),

		getProperty(doc, prp, lng, frc) {
			if (!_.isArray(doc) && _.isObject(doc) && _.has(doc, `${prp}s`))
				doc = doc[`${prp}s`];
			if (_.isArray(doc)) {
				let res = _.findWhere(doc, { language: lng }) || (!frc ? _.findWhere(doc, { language: defaultLanguage }) : null);
				return _.isObject(res) && _.has(res, prp) ? res[prp] : null;
			}
		},
		getName: doc => i18n.getProperty(doc, 'name', i18n.getLanguage()),
		getNameForLanguage: (doc, lng) => i18n.getProperty(doc, 'name', lng, true),
		getDescription: doc => i18n.getProperty(doc, 'description', i18n.getLanguage()),
		getDescriptionForLanguage: (doc, lng) => i18n.getProperty(doc, 'description', lng, true),

		formatDate(dat, fmt) {
			trackerDependency.depend();
			return moment(dat).format(fmt);
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
