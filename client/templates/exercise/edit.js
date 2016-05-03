(function () {
	'use strict';

	function tmpl() {
		return Template.instance();
	}

	Template.exerciseEdit.onCreated(function () {
		this.createType = new ReactiveVar(null);
	});

	Template.exerciseEdit.helpers(
		{
			exerciseTypes: () => Progressor.getExerciseTypes(),
			exerciseType(exercise) {
				const type = tmpl().createType.get() || Progressor.getExerciseType((exercise.exercise_id ? exercise.exercise : exercise).type);
				return type ? `${type.template}Edit` : null;
			}
		});

	Template.exerciseEdit.events(
		{
			'change #select-type'(event, template) {
				template.createType.set(Progressor.getExerciseType(parseInt($(event.currentTarget).val())));
			}
		});

})();
