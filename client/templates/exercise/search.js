(function () {
	'use strict';

	const NUMBER_OF_COLUMNS = 3;

	function tmpl() {
		return Template.instance();
	}

	///////////////////
	// SEARCH FILTER //
	///////////////////

	function getFilter() {
		const flt = {};
		if (tmpl().filter.get('name') && tmpl().filter.get('name').length > 2) flt.names = { $elemMatch: { name: new RegExp(tmpl().filter.get('name').replace(/[^a-z0-9]+/i, '.*'), 'i') } };
		if (tmpl().filter.get('type')) flt.type = tmpl().filter.get('type');
		if (tmpl().filter.get('category')) flt.category_id = tmpl().filter.get('category');
		if (tmpl().filter.get('difficulty')) flt.difficulty = tmpl().filter.get('difficulty');
		return flt;
	}

	////////////////////////
	// TEMPLATE VARIABLES //
	////////////////////////

	Template.exerciseSearch.onCreated(function () {
		this.filter = new ReactiveDict();
	});

	Template.exerciseSearch.helpers(
		{

			//////////////////////
			// EXERCISE HELPERS //
			//////////////////////

			columnWidth: () => 12 / NUMBER_OF_COLUMNS,
			exerciseSearchData: l => () => ({ _id: l }),
			difficultiesExercises(difficulties, exercises) {
				const exercisesSorted = _.chain(exercises).sortBy(e => i18n.getName(e).toLowerCase());
				return _.map(difficulties, difficulty => {
					const difficultyExercises = exercisesSorted.where({ difficulty }).value(), nofDifficultyExercises = difficultyExercises.length, exercisesPerColumn = Math.ceil(nofDifficultyExercises / NUMBER_OF_COLUMNS);
					return {
						_id: difficulty,
						exercises: difficultyExercises,
						exerciseColumns: _.map(_.range(0, NUMBER_OF_COLUMNS), c => ({ _id: c, exercises: difficultyExercises.slice(exercisesPerColumn * c, exercisesPerColumn * (c + 1)) }))
					};
				});
			},
			exerciseTypes: Progressor.getExerciseTypes,
			difficulties: Progressor.getDifficulties,
			categories: () => Progressor.categories.find({ private: { $exists: false } }).fetch(),
			evaluated() {
				const result = Progressor.results.findOne({ exercise_id: this._id });
				return result && Progressor.isExerciseEvaluated(this, result.results);
			},
			success() {
				const result = Progressor.results.findOne({ exercise_id: this._id });
				return result && Progressor.isExerciseSuccess(this, result.results);
			},
			i18nPageTitle (i, l, c) {
				if (!i) return i18n.getProgrammingLanguage(l);
				else return `${i18n.getProgrammingLanguage(l)} '${i18n.getName(c[0])}'`;
			},

			////////////////////
			// SEARCH HELPERS //
			////////////////////

			results() {
				const flt = getFilter();
				if (!_.isEmpty(flt)) return _.chain(Progressor.exercises.find(flt, { sort: [['requested.released', 'desc']], limit: 25 }).fetch()).map(Progressor.joinCategory)/*.sortBy(i18n.getName)*/.value();
			},
			message: () => i18n(`form.no${!_.isEmpty(getFilter()) ? 'Results' : 'Filter'}Message`)
		});

	///////////////////
	// SEARCH EVENTS //
	///////////////////

	Template.exerciseSearch.events(
		{
			'keyup #input-name': _.debounce((e, t) => t.filter.set('name', $(e.currentTarget).val()), 250),
			'change #select-type': (e, t) => t.filter.set('type', parseInt($(e.currentTarget).val())),
			'change #select-category': (e, t) => t.filter.set('category', $(e.currentTarget).val()),
			'change #select-difficulty': (e, t) => t.filter.set('difficulty', parseInt($(e.currentTarget).val()))
		});

})();
