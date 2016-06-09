(function () {
	'use strict';

	const cols = { xs: 6, sm: 4, md: 3, lg: 2 };
	const introTexts = [i18n('layout.logo') + ' ', i18n('layout.explanation')];

	function getSeparators(idx) {
		return _.filter(_.map(cols, (no, cod) => (idx + 1) % (12 / no) === 0 ? cod : null), cod => !!cod);
	}

	Template.home.onRendered(function () {
		this.introIndex = 0;
		this.introInterval = Meteor.setInterval(() => {
			if (this.introIndex < introTexts[0].length)
				this.$('#intro').text(introTexts[0].substr(0, ++this.introIndex)); //animate title
			else if (this.introIndex < introTexts[0].length + introTexts[1].length) {
				if (this.introIndex === introTexts[0].length)
					$('<small id="introExplanation"></small>').appendTo(this.$('#intro')); //create & animate explanation
				this.$('#introExplanation').text(introTexts[1].substr(0, ++this.introIndex - introTexts[0].length));
			} else {
				Meteor.clearInterval(this.introInterval); //clear animation interval
				$('<span class="pulsate">_</span>').appendTo(this.$('#introExplanation'));
			}
		}, 150);
	});

	Template.home.onDestroyed(function () {
		Meteor.clearInterval(this.introInterval);
	});

	Template.home.helpers(
		{
			nofColumns: cod => cols[cod],
			programmingLanguages() {
				const cur = Progressor.getProgrammingLanguages(), upc = Progressor.getProgrammingLanguagesUpcoming();
				return _.union(
					_.map(cur, (lng, idx) => _.extend({ name: i18n.getProgrammingLanguage(lng._id), description: i18n.getProgrammingLanguageDescription(lng._id), separators: getSeparators(idx) }, lng)),
					_.map(upc, (lng, idx) => _.extend({ name: i18n.getProgrammingLanguage(lng._id), description: i18n.getProgrammingLanguageDescription(lng._id), separators: getSeparators(cur.length + idx), isUpcoming: true }, lng)));
			},
			nofExercises(lng) {
				const cnt = Progressor.exercises.find({ programmingLanguage: lng }).count();
				return `${cnt} ${i18n(`exercise.exercise${cnt !== 1 ? 's' : ''}`)}`;
			}
		}
	);

	Template.home.events(
		{
			'mouseup .language-link'(event) {
				event.preventDefault();
				if (event.which === 2 || event.which === 4 || (event.which === 1 && event.ctrlKey))
					window.open(Router.path('exerciseSearch', { _id: this._id }));
				else if (event.which === 1)
					Router.go('exerciseSearch', { _id: this._id });
			},
			'mouseover .panel-default:not(.disabled)': event => $(event.currentTarget).removeClass('panel-default').addClass('panel-primary'),
			'mouseout .panel-primary': event => $(event.currentTarget).removeClass('panel-primary').addClass('panel-default')
		});

})();
