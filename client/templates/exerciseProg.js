Session.setDefault('result', 'waiting for input...');

Template.exerciseProg.helpers(
	{
		result: function () {
			return Session.get('result');
		}
	});

Template.exerciseProg.events(
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
