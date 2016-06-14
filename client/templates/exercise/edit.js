(function () {
	'use strict';

	function tmpl() {
		return Template.instance();
	}

	//only functionality:
	//delegation to correct exercise type;
	//if none selected, show selection

	Template.exerciseEdit.onCreated(function () {
		this.createType = new ReactiveVar(null);
	});

	Template.exerciseEdit.helpers(
		{
			exerciseTypes: () => Progressor.getExerciseTypes(),
			exerciseType() {
				const type = tmpl().createType.get() || Progressor.getExerciseType((this.exercise_id ? this.exercise : this).type);
				return type ? `${type.template}Edit` : null;
			}
		});

	Template.exerciseEdit.events(
		{
			'change #select-type': (e, t) => t.createType.set(Progressor.getExerciseType(parseInt($(e.currentTarget).val())))
		});

})();
