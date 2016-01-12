(function () {
	'use strict';

	var programmingLanguages = _.union(
		_.map(Progressor.getProgrammingLanguages(), lng => ({ _id: lng })),
		_.map(Progressor.getProgrammingLanguagesUpcoming(), lng => ({ _id: lng, isUpcoming: true })));

	Template.home.helpers(
		{
			programmingLanguages: () => programmingLanguages,
			nofExercises(lng) {
				var cnt = Progressor.exercises.find({ programmingLanguage: lng }).count(),
					txt = `exercise.exercise${cnt != 1 ? 's' : ''}`
				return `${cnt} ${i18n(txt)}`;
			},
			i18nProgrammingLanguage: i18n.getProgrammingLanguage,
			i18nProgrammingLanguageDescription: i18n.getProgrammingLanguageDescription
		}
	);

	Template.home.events(
		{
			'click [data-href]': (ev) => Router.go('exerciseSearch', { _id: $(ev.currentTarget).data('href') }),
			'mouseover .panel-primary': (ev) => $(ev.currentTarget).removeClass('panel-primary').addClass('panel-info'),
			'mouseout .panel-info': (ev) => $(ev.currentTarget).removeClass('panel-info').addClass('panel-primary')
		});

})();
