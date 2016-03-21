(function () {
	'use strict';

	Template.layout.helpers(
		{
			language: () => i18n.getLanguages()[i18n.getLanguage()],
			languages: () => _.map(i18n.getLanguages(), (nam, id) =>({ _id: id, name: nam, isActive: id === i18n.getLanguage() })),
			currentUserEmail: () => Progressor.getUserEmail(Meteor.user()),
			i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), lng => _.extend({}, lng, { name: i18n.getProgrammingLanguage(lng._id) }))
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
