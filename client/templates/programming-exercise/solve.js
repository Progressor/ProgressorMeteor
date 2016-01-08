Session.setDefault('result', 'waiting for input...');

Template.programmingSolve.helpers(
	{
		result: function () {
			return Session.get('result');
		}
	});

Template.programmingSolve.events(
	{
		'click #btn-compile': function() {
			var ex=Exercises.findOne(/*{_id:'slkdfasd7fi7as6dfkasz6d'}*/);
			Meteor.call('execute',
									ex.programmingLanguage,
									ex,
									$('#fragment').val(),
									function (err, res) {

										$('#execResult').append(err ? 'error' : JSON.stringify(res));
									});
		}
	});
