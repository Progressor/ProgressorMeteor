(function () {
	'use strict';

	function blinker() {
		$('#underlineChar').fadeOut(500);
		$('#underlineChar').fadeIn(500);
	}
	setInterval(blinker, 1000);

	const cols = { xs: 6, sm: 4, md: 3, lg: 2 };

	function getSeparators(idx) {
		return _.filter(_.map(cols, (no, cod) => (idx + 1) % (12 / no) === 0 ? cod : null), cod => !!cod);
	}

	Template.home.helpers(
		{
			nofColumns: cod => cols[cod],
			programmingLanguages() {
				var cur = Progressor.getProgrammingLanguages(), upc = Progressor.getProgrammingLanguagesUpcoming();
				return _.union(
					_.map(cur, (lng, idx) => ({ _id: lng, separators: getSeparators(idx) })),
					_.map(upc, (lng, idx) => ({ _id: lng, isUpcoming: true, separators: getSeparators(cur.length + idx) })));
			},
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
