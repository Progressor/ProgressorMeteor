(function () {
	'use strict';

	//only functionality:
	//redirect to the correct exercise type

	Template.exerciseSolve.helpers(
		{
			exerciseType() {
				return `${Progressor.getExerciseType((this.exercise_id ? this.exercise : this).type).template}Solve`;
			}
		});

})();
