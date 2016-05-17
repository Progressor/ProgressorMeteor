(function () {
	'use strict';

	Template.registerHelper('userName', Progressor.getUserName);
	Template.registerHelper('htmlLineBreak', t => t.replace(/\n/g, '<br />'));

	Template.registerHelper('i18nProgrammingLanguage', i18n.getProgrammingLanguage);
	Template.registerHelper('i18nExerciseType', i18n.getExerciseType);
	Template.registerHelper('i18nDifficulty', i18n.getDifficulty);
	Template.registerHelper('i18nName', i18n.getName);
	Template.registerHelper('i18nDescription', i18n.getDescription);
	Template.registerHelper('i18nOptions', i18n.getOptions);
	Template.registerHelper('i18nDateTime', d => i18n.formatDate(d, 'L LT'));

	if (Meteor.isClient) {
		Template.registerHelper('instance', Template.instance);

		Template.registerHelper('isAdmin', () => Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN));

		Template.registerHelper('i18nTooltips', function () {
			$('body').tooltip({ selector: '[data-toggle="tooltip"]' });
			Tracker.autorun(() => {
				i18n.getLanguage(); //depend on
				setTimeout(() => $('[data-toggle="tooltip"]').tooltip('fixTitle'), 1);
			});
		});
	}

	if (Meteor.isServer)
		Template.registerHelper('i18n', i18n);

})();
