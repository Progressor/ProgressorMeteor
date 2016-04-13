(function () {
	'use strict';

	Template.exerciseSolve.helpers(
		{
			exerciseType: t => `${Progressor.getExerciseType((t.exercise_id ? t.exercise : t).type).template}Solve`
		});

})();
