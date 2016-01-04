Template.home.events(
	{
		'mouseover .panel': function (ev) {
			$(ev.currentTarget).removeClass('panel-default').addClass('panel-primary');
		},
		'mouseout .panel': function (ev) {
			$(ev.currentTarget).removeClass('panel-primary').addClass('panel-default');
		}
	});
