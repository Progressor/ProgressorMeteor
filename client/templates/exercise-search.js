(function () {
	'use strict';

	var searchResults;

	Template.exerciseSearch.helpers(
		{
			categories: () => Progressor.categories.find().fetch(),
			i18nProgrammingLanguage: excs => i18n.getProgrammingLanguage(excs[0].programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty
		});

	Template.exerciseSearch.events(
		{
			'submit form'(ev) {
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
		});

})();
