(function () {
	'use strict';

	const numberOfColumns = 3;

	let filter;

	function getFilter() {
		const flt = {};
		if (filter.get('name') && filter.get('name').length > 2) flt.names = { $elemMatch: { name: new RegExp(filter.get('name').replace(/[^a-z0-9]+/i, '.*'), 'i') } };
		if (filter.get('type')) flt.type = filter.get('type');
		if (filter.get('category')) flt.category_id = filter.get('category');
		if (filter.get('difficulty')) flt.difficulty = filter.get('difficulty');
		return flt;
	}

	Template.exerciseSearch.onCreated(() => filter = new ReactiveDict());

	Template.exerciseSearch.helpers(
		{
			columnWidth: () => 12 / numberOfColumns,
			exerciseSearchData: l => () => ({ _id: l }),
			difficultiesExercises(difficulties, exercises) {
				const exercisesSorted = _.chain(exercises).sortBy(i18n.getName);
				return _.map(difficulties, function (d) {
					const difficultyExercises = exercisesSorted.filter(e => e.difficulty === d).value(), nofDifficultyExercises = difficultyExercises.length, exercisesPerColumn = Math.ceil(nofDifficultyExercises / numberOfColumns);
					return {
						_id: d,
						exercises: difficultyExercises,
						exerciseColumns: _.map(_.range(0, numberOfColumns), c => ({ _id: c, exercises: difficultyExercises.slice(exercisesPerColumn * c, exercisesPerColumn * (c + 1)) }))
					};
				});
			},
			exerciseTypes: Progressor.getExerciseTypes,
			difficulties: Progressor.getDifficulties,
			categories: () => Progressor.categories.find().fetch(),
			evaluated(exercise) {
				const result = Progressor.results.findOne({ exercise_id: exercise._id });
				return result && Progressor.isExerciseEvaluated(exercise, result.results);
			},
			success(exercise) {
				const result = Progressor.results.findOne({ exercise_id: exercise._id });
				return result && Progressor.isExerciseSuccess(exercise, result.results);
			},
			i18nPageTitle (i, l, c) {
				if (!i) return i18n.getProgrammingLanguage(l);
				else return `${i18n.getProgrammingLanguage(l)} '${i18n.getName(c[0])}'`;
			},
			results() {
				const flt = getFilter();
				if (!_.isEmpty(flt)) return _.chain(Progressor.exercises.find(flt, { limit: 25 }).fetch()).map(Progressor.joinCategory).sortBy(i18n.getName).value();
			},
			message: () => i18n(`form.no${!_.isEmpty(getFilter()) ? 'Results' : 'Filter'}Message`)
		});

	Template.exerciseSearch.events(
		{
			'keyup #input-name': _.debounce(ev => filter.set('name', $(ev.currentTarget).val()), 250),
			'change #select-type': ev => filter.set('type', parseInt($(ev.currentTarget).val())),
			'change #select-category': ev => filter.set('category', $(ev.currentTarget).val()),
			'change #select-difficulty': ev => filter.set('difficulty', parseInt($(ev.currentTarget).val()))
		});

})();
