// REACTIVE HELPERS //

function getExecution() {
  return Progressor.executions.findOne();
}

function getResult(exercise) {
  return Progressor.results.findOne({ exercise_id: exercise._id });
}

function getResults(exercise) {
  const result = getResult(exercise);
  if (result) {
    return result.results;
  }
}

// HELPERS //

Template.examinationExecutionExamineeView.helpers({
  exercises: () => _.map(getExecution().exercises, (e, i) => _.extend({ weight: e.weight }, Progressor.joinCategory(Progressor.exercises.findOne({ _id: e.exercise_id })))),
  totalWeight: () => _.reduce(getExecution().exercises, (w, e) => w + (e.weight || 0), 0),
  hasResult: e => getResult(e),
  evaluated: e => e.type === 1 && Progressor.isExerciseEvaluated(e, getResults(e)),
  endTime: (t, d) => new Date(t.getTime() + d * 60000),
  successPercentage: e => Progressor.getExerciseSuccessPercentage(e, getResults(e)),
});
