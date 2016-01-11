var searchResults;

function i18nName(elem) {
	return (_.findWhere(elem.names, { language: i18n.getLanguage() })
					|| _.findWhere(elem.names, { language: i18n.getDefaultLanguage() })).name;
}
function i18nDifficulty (difficulty) {
	return i18n('difficulty.' + difficulty);
}

Template.exerciseSearch.helpers(
	{
		categories: function () {
			return Categories.find();
		},
		categoryID: function (category) {
			return category._id;
		},
		difficulties: function () {
			return difficulties;
		},
		exercises: function (difficulty) {
			return Exercises.find({ difficulty: difficulty });
		},
		i18nCategoryName: i18nName,
		i18nExerciseName: i18nName,
		i18nDifficulty: i18nDifficulty,
	});

Template.exerciseSearch.events(
	{
		'submit form': function (ev) {
			ev.preventDefault();
			$('#results-table > tbody').empty();

			/* ToDo: hidden result table
			if ($('#results-div').style.visibility = 'hidden') {
				$('#results-div').style.visibility = 'visible';
			}
			*/

			var difficulty = parseInt($("#select-level").val());
			var category = $("#select-topic").val();

			searchResults = Exercises.find({
																			 difficulty: difficulty,
																			 category_id: category
																		 }).fetch();

			searchResults.forEach(function (result) {
				var name = (_.findWhere(result.names, { language: i18n.getLanguage() }) || _.findWhere(result.names, { language: i18n.getDefaultLanguage() })).name;
				var topic = Categories.findOne({ _id: result.category_id });
				//ToDo: List sortable by headers
				var level = result.difficulty;
				$('#results-table > tbody:last-child').append("<tr><td>" + name + "</td><td>" + i18nName(topic) + "</td><td>" + i18nDifficulty(level) + "</td></tr>");
			});

		}
	})
;
