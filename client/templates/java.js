Session.setDefault('result', 'waiting for input...');

Template.java.helpers(
	{
		result: function () {
			return Session.get('result');
		}
	});

Template.java.events(
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
