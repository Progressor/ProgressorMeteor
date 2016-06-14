(function () {
	'use strict';

	//////////////////////
	// REACTIVE HELPERS //
	//////////////////////

	function getResult(exercise) {
		return Progressor.results.findOne({ exercise_id: exercise._id });
	}

	function getResults(exercise) {
		const result = getResult(exercise);
		if (result) return result.results;
	}

	/////////////
	// HELPERS //
	/////////////

	Template.examinationExecutionExamineeView.helpers(
		{
			exercises() {
				return _.map(this.exercises, (e, i) => _.extend({ weight: e.weight }, Progressor.joinCategory(Progressor.exercises.findOne({ _id: e.exercise_id }))));
			},
			hasResult() {
				return getResult(this);
			},
			evaluated() {
				return this.type === 1 && Progressor.isExerciseEvaluated(this, getResults(this));
			},
			successPercentage() {
				return Progressor.getExerciseSuccessPercentage(this, getResults(this));
			},
			endTime: (t, d) => new Date(t.getTime() + d * 60000),
			totalWeight: () => _.reduce(Progressor.executions.findOne().exercises, (w, e) => w + e.weight, 0)
		});

})();
