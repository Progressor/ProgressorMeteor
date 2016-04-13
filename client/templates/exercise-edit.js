(function () {
	'use strict';

	let createType;

	Template.exerciseEdit.onCreated(() => createType = new ReactiveVar(null));

	Template.exerciseEdit.helpers(
		{
			exerciseTypes: () => Progressor.getExerciseTypes(),
			exerciseType(/*exercise*/) {
				const exercise = Progressor.exercises.findOne();
				const type = exercise ? Progressor.getExerciseType((exercise.exercise_id ? exercise.exercise : exercise).type) : createType.get();
				return type ? `${type.template}Edit` : null;
			}
		});

	Template.exerciseEdit.events(
		{
			'change #select-type': ev => createType.set(Progressor.getExerciseType(parseInt($(ev.currentTarget).val())))
		});

})();
