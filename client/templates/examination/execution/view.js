(function () {
	'use strict';

	function getExecution() {
		return Progressor.executions.findOne();
	}

	function getResult(exercise) {
		return Progressor.results.findOne({ exercise_id: exercise._id });
	}

	function getResults(exercise) {
		const result = getResult(exercise);
		if (result) return result.results;
	}

	Template.examinationExecutionView.helpers(
		{
			exercises: () => _.map(getExecution().exercises, (e, i) => _.extend({ weight: e.weight }, Progressor.joinCategory(Progressor.exercises.findOne({ _id: e.exercise_id })))),
			totalWeight: () => _.reduce(getExecution().exercises, (w, e) => w + e.weight, 0),
			hasResult: e => getResult(e),
			evaluated: e => e.type === 1 && Progressor.isExerciseEvaluated(e, getResults(e)),
			successPercentage: e => Progressor.getExerciseSuccessPercentage(e, getResults(e))
		});

})();
