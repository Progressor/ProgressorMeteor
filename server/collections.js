(function () {
	'use strict';

	///////////////////
	// SUBSCRIPTIONS //
	///////////////////

	Meteor.publish('categories', () => Progressor.categories.find());
	Meteor.publish('category', function (id) {
		check(id, String);
		return Progressor.categories.find(id);
	});
	Meteor.publish('categoriesForLanguage', function (lng) {
		check(lng, String);
		return Progressor.categories.find({ programmingLanguage: lng });
	});

	Meteor.publish('publicExercises', () => Progressor.exercises.find({ category_id: { $exists: true }, released: true }));
	Meteor.publish('publicExercisesForCategory', function (cat) {
		check(cat, String);
		return Progressor.exercises.find({ category_id: cat, released: true });
	});
	Meteor.publish('publicExercisesForLanguage', function (lng) {
		check(lng, String);
		return Progressor.exercises.find({ programmingLanguage: lng, category_id: { $exists: true }, released: true });
	});
	Meteor.publish('publicExercise', function (id) {
		check(id, String);
		return Progressor.exercises.find({ _id: id, category_id: { $exists: true }, released: true });
	});

	Meteor.publish('myResults', function () {
		return Progressor.results.find({ user_id: this.userId });
	});
	Meteor.publish('myExerciseResult', function (id) {
		check(id, String);
		return Progressor.results.find({ user_id: this.userId, exercise_id: id });
	});
	Meteor.publish('myResult', function (id) {
		check(id, String);
		return Progressor.results.find({ user_id: this.userId, _id: id });
	});

	//////////////////////////
	// MODIFICATION METHODS //
	//////////////////////////

	Meteor.methods(
		{
			saveCategory(category) {
				check(category, Match.ObjectIncluding(
					{
						programmingLanguage: String,
						names: [Match.ObjectIncluding({ language: String, name: String })],
						descriptions: [Match.ObjectIncluding({ language: String, description: String })]
					}));

				if (!category.author_id)
					category.author_id = this.userId;
				category.lastEditor_id = this.userId;
				category.lastEdited = new Date();

				return Progressor.categories.upsert(category._id, category).insertedId || category._id;
			},
			deleteCategory(category) {
				check(category, Match.ObjectIncluding({ _id: String }));

				return Progressor.categories.remove(category._id).rowsAffected;
			},
			saveExercise(exercise) {
				check(exercise, Match.ObjectIncluding(
					{
						programmingLanguage: String,
						category_id: String,
						difficulty: Match.Integer,
						type: Match.Integer,
						names: [Match.ObjectIncluding({ language: String, name: String })],
						descriptions: [Match.ObjectIncluding({ language: String, description: String })],
						functions: [
							Match.ObjectIncluding(
								{
									name: String,
									inputNames: [String],
									inputTypes: [String],
									outputNames: [String],
									outputTypes: [String]
								})],
						testCases: [
							Match.ObjectIncluding(
								{
									functionName: String,
									inputValues: [String],
									expectedOutputValues: [String],
									visible: Boolean
								})]
					}));

				if (!exercise.author_id)
					exercise.author_id = this.userId;
				exercise.lastEditor_id = this.userId;
				exercise.lastEdited = new Date();

				return Progressor.exercises.upsert(exercise._id, _.omit(exercise, 'category')).insertedId || exercise._id;
			},
			deleteExercise(exercise) {
				check(exercise, Match.ObjectIncluding({ _id: String }));

				return Progressor.exercises.remove(exercise._id).rowsAffected;
			}
		});

	///////////////////////////
	// HOUSTON CONFIGURATION //
	///////////////////////////

	Houston.add_collection(Meteor.users);

	function toggleFlag(collection, flag, elementName, setName, unsetName) {
		return function (document) {
			check(document, Match.ObjectIncluding({ _id: String }));

			return Progressor[collection].update(document._id, _.object([[document[flag] !== true ? '$set' : '$unset', _.object([[flag, true]])]])) === 1
				? `${elementName} '${document._id}' successfully ${document[flag] !== true ? setName : unsetName}.`
				: `${elementName} '${document._id}' could NOT successfully be ${document[flag] !== true ? setName : unsetName}!`;
		}
	}

	Houston.methods('exercises', {
		'Release/Hide': toggleFlag('exercises', 'released', 'Exercise', 'released', 'hidden'),
		'Archive/Restore': toggleFlag('exercises', 'archived', 'Exercise', 'archived', 'restored')
	});

})();
