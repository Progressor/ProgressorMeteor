(function () {
	'use strict';

	Session.setDefault('ExerciseSearchName', null);
	Session.setDefault('ExerciseSearchCategory', null);
	Session.setDefault('ExerciseSearchDifficulty', null);

	Template.exerciseSearch.helpers(
		{
			categories: () => Progressor.categories.find().fetch(),
			i18nProgrammingLanguage: excs => i18n.getProgrammingLanguage(excs[0].programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			results() {
				var qry = {};
				if (Session.get('ExerciseSearchName') && Session.get('ExerciseSearchName').length > 2)
					qry.names = { $elemMatch: { name: new RegExp(Session.get('ExerciseSearchName').replace(/[^a-z0-9]+/i, '.*'), 'i') } };
				if (Session.get('ExerciseSearchCategory'))
					qry.category_id = Session.get('ExerciseSearchCategory');
				if (Session.get('ExerciseSearchDifficulty'))
					qry.difficulty = Session.get('ExerciseSearchDifficulty');
				if (_.keys(qry).length)
					return Progressor.exercises.find(qry, { limit: 25 }).map(exc => _.extend(exc, {
						category: Progressor.categories.findOne({ _id: exc.category_id })
					}));
			}
		})
	;

	Template.exerciseSearch.events(
		{
			'keyup #input-name': _.debounce(ev => Session.set('ExerciseSearchName', $(ev.currentTarget).val()), 250),
			'change #select-category': ev => Session.set('ExerciseSearchCategory', $(ev.currentTarget).val()),
			'change #select-difficulty': ev => Session.set('ExerciseSearchDifficulty', parseInt($(ev.currentTarget).val()))
		});

})();
