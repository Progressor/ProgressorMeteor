(function () {
	'use strict';

	var exercise, executorTypes, executorTypesDependency = new Tracker.Dependency();

	Template.programmingEdit.onCreated(function () {
		exercise = Progressor.exercises.findOne();
		Session.set('ProgrammingLanguage', exercise ? exercise.programmingLanguage : null);
		Meteor.call('getExecutorTypes', (err, res) => {
			executorTypes = res;
			executorTypesDependency.changed();
		});
	});

	Template.programmingEdit.helpers(
		{
			exerciseSearchData: () => ({ _id: exercise.programmingLanguage }),
			i18nProgrammingLanguage: () => i18n.getProgrammingLanguage(exercise.programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			languages: () => _.map(i18n.getLanguages(), (nam, id) => ({
				_id: id, name: nam, isActive: id === i18n.getLanguage(),
				exerciseName: i18n.getNameForLanguage(exercise, id),
				exerciseDescription: i18n.getDescriptionForLanguage(exercise, id)
			})),
			executorTypes: () => {
				executorTypesDependency.depend();
				return executorTypes;
			},
			i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), lng => ({
				_id: lng, name: i18n.getProgrammingLanguage(lng),
				isActive: exercise && lng === exercise.programmingLanguage
			})),
			i18nCategories: () => Progressor.categories.find({ programmingLanguage: Session.get('ProgrammingLanguage') }).map(cat => _.extend(cat, {
				name: i18n.getName(cat),
				isActive: exercise && cat._id === exercise.category_id
			})),
			i18nDifficulties: () => _.map(Progressor.getDifficulties(), dif => ({ _id: dif, name: i18n.getDifficulty(dif), isActive: exercise && dif === exercise.difficulty }))
		});

	Template.programmingEdit.events(
		{
			'click a[data-toggle="tab"]'(ev) {
				ev.preventDefault();
				$(ev.currentTarget).tab('show');
			},
			'click .dyn-repeat'(ev) {
				var $this = $(ev.currentTarget), $rep = $this.closest('.dyn-repeatable');
				$rep.after($rep.clone().find('input').val(null).end());
				$this.remove();
			},
			'change #select-language': ev => Session.set('ProgrammingLanguage', $(ev.currentTarget).val())
		});

})();
