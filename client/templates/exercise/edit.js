import { tmpl } from '/imports/utilities';

// only functionality:
// delegation to correct exercise type;
// if none selected, show selection

Template.exerciseEdit.onCreated(function () {
  this.createType = new ReactiveVar(null);
});

Template.exerciseEdit.helpers({
  exerciseTypes: () => Progressor.getExerciseTypes(),
  exerciseType(exercise) {
    const type = tmpl().createType.get() || Progressor.getExerciseType((exercise.exercise_id ? exercise.exercise : exercise).type);
    return type ? `${type.template}Edit` : null;
  },
});

Template.exerciseEdit.events({
  'change #select-type': (e, t) => t.createType.set(Progressor.getExerciseType(parseInt($(e.currentTarget).val()))),
});
