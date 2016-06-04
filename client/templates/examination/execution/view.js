(function () {
	'use strict';

	Template.examinationExecutionView.helpers(
		{
			exercises: () => _.map(Progressor.executions.findOne().exercises, (e, i) => _.extend({ weight: e.weight }, Progressor.joinCategory(Progressor.exercises.findOne({ _id: e.exercise_id })))),
			totalWeight: () => _.reduce(Progressor.executions.findOne().exercises, (w, e) => w + e.weight, 0),
			noSuccessFeedback: e => e.type == 3 && !e.pattern,
			evaluated: (e, r) => Progressor.isExerciseEvaluated(e, r),
			successPercentage: (e, r) => Progressor.getExerciseSuccessPercentage(e, r)
		});

})();
