i18n.languages = {
	en: 'English',
	de: 'Deutsch',
	fr: 'Français'
};

i18n.setDefaultLanguage(i18n.defaultLanguage = 'en');
i18n.setLanguage(i18n.defaultLanguage);

i18n.getDefaultLanguage = function () {
	return i18n.defaultLanguage
};
