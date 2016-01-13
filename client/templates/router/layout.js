(function () {
	'use strict';

	Template.layout.helpers(
		{
			language: () => i18n.getLanguages()[i18n.getLanguage()],
			languages: () => _.map(i18n.getLanguages(), (nam, id) =>({ _id: id, name: nam, isActive: id === i18n.getLanguage() })),
			currentUserName: () => Meteor.user().emails[0].address,
			i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), id => ({ _id: id, name: i18n.getProgrammingLanguage(id) }))
		});

	Template.layout.events(
		{
			'click #link-logout': () => Meteor.logout(),
			'click .i18n.lang'(ev) {
				ev.preventDefault();
				i18n.setLanguage($(ev.currentTarget).data('lang'));
			}
		});
})();
