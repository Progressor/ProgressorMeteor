(function () {
	'use strict';

	const cols = { xs: 6, sm: 4, md: 3, lg: 2 };
	const introTexts = [i18n('layout.logo') + ' ', i18n('layout.explanation')];

	function getSeparators(idx) {
		return _.filter(_.map(cols, (no, cod) => (idx + 1) % (12 / no) === 0 ? cod : null), cod => !!cod);
	}

	Template.home.onRendered(() => {
		var introIndex = 0;
		var introInterval = setInterval(function () {
			if (introIndex < introTexts[0].length)
				$('#intro').text(introTexts[0].substr(0, ++introIndex)); //animate title
			else if (introIndex < introTexts[0].length + introTexts[1].length) {
				if (introIndex == introTexts[0].length)
					$('<small id="introExplanation"></small>').appendTo($('#intro')); //create & animate explanation
				$('#introExplanation').text(introTexts[1].substr(0, ++introIndex - introTexts[0].length));
			} else {
				clearInterval(introInterval); //clear animation interval
				$('<span class="pulsate">_</span>').appendTo($('#introExplanation'));
			}
		}, 150);
	});

	Template.home.helpers(
		{
			nofColumns: cod => cols[cod],
			programmingLanguages() {
				var cur = Progressor.getProgrammingLanguages(), upc = Progressor.getProgrammingLanguagesUpcoming();
				return _.union(
					_.map(cur, (lng, idx) => _.extend({}, lng, { name: i18n.getProgrammingLanguage(lng._id), description: i18n.getProgrammingLanguageDescription(lng._id), separators: getSeparators(idx) })),
					_.map(upc, (lng, idx) => _.extend({}, lng, { name: i18n.getProgrammingLanguage(lng._id), description: i18n.getProgrammingLanguageDescription(lng._id), separators: getSeparators(cur.length + idx), isUpcoming: true })));
			},
			nofExercises(lng) {
				var cnt = Progressor.exercises.find({ programmingLanguage: lng }).count();
				return `${cnt} ${i18n(`exercise.exercise${cnt != 1 ? 's' : ''}`)}`;
			}
		}
	);

	Template.home.events(
		{
			'click [data-href]': ev => Router.go('exerciseSearch', { _id: $(ev.currentTarget).data('href') }),
			'mouseover .panel-default:not(.disabled)': ev => $(ev.currentTarget).removeClass('panel-default').addClass('panel-primary'),
			'mouseout .panel-primary': ev => $(ev.currentTarget).removeClass('panel-primary').addClass('panel-default')
		});

})();
