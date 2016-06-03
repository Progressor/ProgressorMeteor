(function () {
	'use strict';

	function tmpl() {
		return Template.instance();
	}

	Template.examinationExecutionView.onCreated(function () {
	});

	Template.examinationExecutionView.helpers(
		{
			exercises: () => _.map(Progressor.executions.findOne().exercises, (e, i) => _.extend({ weight: e.weight }, Progressor.joinCategory(Progressor.exercises.findOne({ _id: e.exercise_id })))),
			totalWeight: () => {
				let totalWeight = 0;
				_.each(Progressor.executions.findOne().exercises, e => totalWeight += e.weight);
				return totalWeight;
			}
		});

	Template.examinationExecutionView.events(
		{});

})();
