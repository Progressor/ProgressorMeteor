Session.setDefault('result', 'waiting for input...');

Template.exercise_prog.helpers(
	{
		result: function () {
			return Session.get('result');
		}
	});

Template.exercise_prog.events(
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
