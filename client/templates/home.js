Session.setDefault('result', 'waiting for input...');

Template.home.helpers(
	{
		result: function () {
			return Session.get('result');
		}
	});

Template.home.events(
	{
		'click button': function () {
			Session.set('result', 'waiting for result...');
			Meteor.call('executeFragment',
									$('#fragment').val(),
									function (err, res) {
										Session.set('result', err ? 'error' : JSON.stringify(res));
									});
		}
	});
