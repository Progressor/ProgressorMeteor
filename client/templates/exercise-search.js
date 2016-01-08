Template.exerciseSearch.helpers(
	{
		dificulties: function () {
			return difficulties;
		},
		exercises: function (difficulty) {
			return Exercises.find({ difficulty: difficulty });
		},
		i18nDificulty: function (difficulty) {
			return "i18n \"difficulty.".concat(difficulty.toString(),"\"");
		}
	});
