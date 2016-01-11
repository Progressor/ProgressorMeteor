
function i18nName(elem) {
	return (_.findWhere(elem.names, { language: i18n.getLanguage() })
					|| _.findWhere(elem.names, { language: i18n.getDefaultLanguage() })).name;
}
function i18nDescription(elem) {
	return (_.findWhere(elem.descriptions, { language: i18n.getLanguage() })
					|| _.findWhere(elem.descriptions, { language: i18n.getDefaultLanguage() })).description;
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
		i18nDescription: i18nDescription,
		fragment: function () {
			Meteor.call('getFragment',
									this.programmingLanguage,
									this,
									function (res) {
										return res;
									})
		},
		fragTest: function () {
			return JSON.stringify(this);
		}
	});

Template.programmingSolve.events(
	{
		'click #btn-compile': function () {
			var ex = Exercises.findOne({_id: this._id});
			Meteor.call('execute',
									ex.programmingLanguage,
									ex,
									$('#fragment').val(),
									function (err, res) {
										$('#execResult').append(err ? 'error' : JSON.stringify(res));
									});
		}
	});

