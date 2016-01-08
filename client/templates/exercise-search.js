Template.exerciseSearch.helpers(
	{
		difficulties: function () {
			return difficulties;
		},
		exercises: function (difficulty) {
			return Exercises.find({ difficulty: difficulty });
		},
		i18nDifficulty: function (difficulty) {
			return i18n('difficulty.' + difficulty);
		},
		i18nExerciseName: function (exercise) {
			return (_.findWhere(exercise.names, { language: i18n.getLanguage() })
							|| _.findWhere(exercise.names, { language: i18n.getDefaultLanguage() })).name;
		}
	});
