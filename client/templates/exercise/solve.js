//only functionality:
//redirect to the correct exercise type

Template.exerciseSolve.helpers({
  exerciseType: t => `${Progressor.getExerciseType((t.exercise_id ? t.exercise : t).type).template}Solve`
});
