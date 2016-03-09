(function () {
	'use strict';

	const filter = new ReactiveDict();

	Template.exerciseSearch.helpers(
		{
			categories: () => Progressor.categories.find().fetch(),
			i18nProgrammingLanguage: excs => i18n.getProgrammingLanguage(excs[0].programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			results() {
				let qry = {};
				if (filter.get('name') && filter.get('name').length > 2) qry.names = { $elemMatch: { name: new RegExp(filter.get('name').replace(/[^a-z0-9]+/i, '.*'), 'i') } };
				if (filter.get('category')) qry.category_id = filter.get('category');
				if (filter.get('difficulty')) qry.difficulty = filter.get('difficulty');
				if (_.keys(qry).length) return Progressor.exercises.find(qry, { limit: 25 }).fetch()
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
