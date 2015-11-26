Meteor.startup(function () {

	//var localeFromBrowser = window.navigator.userLanguage || window.navigator.language;

	i18n.setDefaultLanguage(i18n.defaultLanguage = 'en');
	i18n.setLanguage(i18n.defaultLanguage);
});
