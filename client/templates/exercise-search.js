(function () {
	'use strict';

	const numberOfColumns = 3;
	
	let filter;

	Template.exerciseSearch.onCreated(() => filter = new ReactiveDict());

	Template.exerciseSearch.helpers(
		{
			columnWidth: () => 12 / numberOfColumns,
			exerciseSearchData: l => () => ({ _id: l }),
			difficultiesExercises(difficulties, exercises) {
				let exercisesSorted = _.chain(exercises).sortBy(i18n.getName);
				return _.map(difficulties, function (d) {
					let difficultyExercises = exercisesSorted.filter(e => e.difficulty === d).value(), nofDifficultyExercises = difficultyExercises.length, exercisesPerColumn = Math.ceil(nofDifficultyExercises / numberOfColumns);
					return {
						_id: d,
						exercises: difficultyExercises,
						exerciseColumns: _.map(_.range(0, numberOfColumns), c => ({ _id: c, exercises: difficultyExercises.slice(exercisesPerColumn * c, exercisesPerColumn * (c + 1)) }))
					};
				});
			},
			categories: () => Progressor.categories.find().fetch(),
			i18nPageTitle (i, l, c) {
				if (!i) return i18n.getProgrammingLanguage(l);
				else return `${i18n.getProgrammingLanguage(l)} '${i18n.getName(c[0])}'`;
			},
			i18nProgrammingLanguage: i18n.getProgrammingLanguage,
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			results() {
				let qry = {};
				if (filter.get('name') && filter.get('name').length > 2) qry.names = { $elemMatch: { name: new RegExp(filter.get('name').replace(/[^a-z0-9]+/i, '.*'), 'i') } };
				if (filter.get('category')) qry.category_id = filter.get('category');
				if (filter.get('difficulty')) qry.difficulty = filter.get('difficulty');
				if (_.keys(qry).length) return _.sortBy(Progressor.exercises.find(qry, { limit: 25 }).fetch(), i18n.getName)
			},
			message: () => filter.get('name') && filter.get('name').length > 2 || filter.get('category') || filter.get('difficulty') ? i18n('form.noResults') : i18n('form.noQuery')
		});

	Template.exerciseSearch.events(
		{
			'keyup #input-name': _.debounce(ev => filter.set('name', $(ev.currentTarget).val()), 250),
			'change #select-category': ev => filter.set('category', $(ev.currentTarget).val()),
			'change #select-difficulty': ev => filter.set('difficulty', parseInt($(ev.currentTarget).val()))
		});

})();
