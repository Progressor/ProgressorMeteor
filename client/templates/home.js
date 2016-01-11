Template.home.helpers(
	{
		programmingLanguages: function () {
			return programmingLanguages;
		},
		programmingLanguagesUpcoming: function () {
			return programmingLanguagesUpcoming;
		}
	}
);

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
		}
	});
