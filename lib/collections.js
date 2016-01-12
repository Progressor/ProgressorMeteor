(function () {
	'use strict';

	_.extend(Progressor, {
		categories: new Mongo.Collection('categories'),
		exercises: new Mongo.Collection('exercises', {
			transform: doc => _.extend(doc, { category: Progressor.categories.findOne({ _id: doc.category_id }) })
		}),
		results: new Mongo.Collection('results')
	});

	if (Meteor.isServer) {

		Meteor.publish('categories', () => Progressor.categories.find());
		Meteor.publish('categoriesForLanguage', function (lng) {
			check(lng, String);
			return Progressor.categories.find({ programmingLanguage: lng });
		});

		Meteor.publish('publicExercises', () => Progressor.exercises.find({ category_id: { $exists: true } }));
		Meteor.publish('publicExercisesForLanguage', function (lng) {
			check(lng, String);
			return Progressor.exercises.find({ programmingLanguage: lng, category_id: { $exists: true } });
		});
		Meteor.publish('publicExercise', function (id) {
			check(id, String);
			return Progressor.exercises.find({ _id: id, category_id: { $exists: true } });
		});

		Meteor.publish('myResult', function (id) {
			check(id, String);
			return Progressor.results.find({ user_id: this.userId, exercise_id: id });
		});
		Meteor.publish('myResults', function () {
			check(id, String);
			return Progressor.results.find({ user_id: this.userId });
		});

		Meteor.methods(
			{
				saveResult(exercise, fragment, results) {
					check(exercise, Match.ObjectIncluding(
						{
							programmingLanguage: String,
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
										expectedOutputValues: [String]
									})]
						}));
					check(fragment, String);
					check(results, [
						Match.ObjectIncluding(
							{
								success: Boolean,
								result: String
							})]);

					if (this.userId) {
						var qry = { user_id: this.userId, exercise_id: exercise._id };
						var del = Progressor.results.findOne(qry);
						if (del) Progressor.results.remove(del);
						Progressor.results.insert(_.extend(qry, { exercise: _.omit(exercise, '_id', 'category'), fragment: fragment, results: results, solved: new Date() }));
					}
				}
			}
		);

		Houston.add_collection(Meteor.users);
	}

})();
