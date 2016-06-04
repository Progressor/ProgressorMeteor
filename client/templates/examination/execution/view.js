(function () {
	'use strict';

	function tmpl() {
		return Template.instance();
	}

	Template.examinationExecutionView.helpers(
		{
			exercises: () => _.map(Progressor.executions.findOne().exercises, (e, i) => _.extend({ weight: e.weight }, Progressor.joinCategory(Progressor.exercises.findOne({ _id: e.exercise_id })))),
			totalWeight: () => {
				let totalWeight = 0;
				_.each(Progressor.executions.findOne().exercises, e => totalWeight += e.weight);
				return totalWeight;
			},
			noSuccessFeedback: (e) => e.type == 3 && e.pattern != null,
			success: (e, r) => Progressor.isExerciseSuccess(e, r),
			isSolved: (e, r) => Progressor.isExerciseEvaluated(e, r)
			
		});

})();
