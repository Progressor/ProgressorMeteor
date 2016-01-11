Template.home.helpers(
	{
		programmingLanguageName: function (langauge) {
			return i18n('programmingLang.'+ langauge +'.title');
		},
		programmingLanguageDescription: function(langauge) {
			return i18n('programmingLang.'+ langauge +'.description');
		},
		programmingLanguages: function () {
			return programmingLanguages;
		},
		programmingLanguagesUpcoming: function () {
			return programmingLanguagesUpcoming;
		}
	}
);
//{{pathFor "exerciseSearch" data=this}}

Template.home.events(
	{
		'mouseover .panel': function (ev) {
			if (!$(ev.currentTarget).hasClass('disabled')) {
				$(ev.currentTarget).removeClass('panel-default').addClass('panel-primary');
			}
		},
		'mouseout .panel': function (ev) {
			if (!$(ev.currentTarget).hasClass('disabled')) {
				$(ev.currentTarget).removeClass('panel-primary').addClass('panel-default');
			}
		},
		'click .panel': function (ev) {
			if (!$(ev.currentTarget).hasClass('disabled')) {
				Router.go('/language/'+ $(ev.currentTarget).id);
			}
		},

	});
