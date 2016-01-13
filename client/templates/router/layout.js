(function () {
	'use strict';

	Template.layout.helpers(
		{
			language: () => i18n.getLanguages()[i18n.getLanguage()],
			languages: () => _.map(i18n.getLanguages(), function (name, id) {
				var act = i18n.getLanguage();
				return { _id: id, name: name, isActive: id === act };
			}),
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
