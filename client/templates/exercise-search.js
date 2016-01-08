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
		},
		i18nExercises: function() {
			if (i18n.getLanguage() == en) {
				return "names.[0].name";
			} else if (i18n.getLanguage() == de){
				return "names.[1].name";
			}
		}
	});
