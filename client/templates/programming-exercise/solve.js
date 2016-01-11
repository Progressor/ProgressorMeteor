Session.setDefault('result', 'waiting for input...');

function i18nName(elem) {
	return (_.findWhere(elem.names, { language: i18n.getLanguage() })
					|| _.findWhere(elem.names, { language: i18n.getDefaultLanguage() })).name;
}

Template.programmingSolve.helpers(
	{
		result: function () {
			return Session.get('result');
		},
		exerciseID: function () {
			return params._id;
		},
		i18nExerciseName: i18nName,
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
