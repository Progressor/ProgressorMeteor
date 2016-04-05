(function () {
	'use strict';

	function getExercise(forceRefresh) {
		return isResult.get() && !forceRefresh ? Progressor.results.findOne().exercise : Progressor.exercises.findOne();
	}

	Template.questionSolve.helpers(
		{
			i18nProgrammingLanguage: () => i18n.getProgrammingLanguage(getExercise().programmingLanguage),
			exerciseSearchData: () => ({ _id: getExercise().programmingLanguage }),
			i18nCategoryName: i18n.getName,
			i18nCategoryDescription: i18n.getDescription,
			i18nExerciseName: i18n.getName,
			i18nExerciseDescription: i18n.getDescription,
			i18nDifficulty: i18n.getDifficulty,
			i18nQuestionName: i18n.getName,
			i18nQuestionAnswers: (qst) => _.map(qst, function(val,key){return {num: key, answer: val}}),
			questionType: () => {
				let qst = Template.parentData(1);
				if (qst.type == 1) return "radio";
				if (qst.type == 2) return "checkbox";
				// if (qst.type == 3) return "text";
			}
		});

	Template.questionSolve.events(
		{
			
		});
})();