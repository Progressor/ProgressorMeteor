(function () {
	'use strict';

	_.extend(Progressor, {
		categories: new Mongo.Collection('categories'),
		exercises: new Mongo.Collection('exercises', {
			transform(doc){
				return _.extend(doc, {
					category: Progressor.categories.findOne({ _id: doc.category_id })
				});
			}
		}),
		results: new Mongo.Collection('results', {
			transform(doc) {
				if (doc.exercise)
					_.extend(doc.exercise, {
						category: Progressor.categories.findOne({ _id: doc.exercise.category_id })
					});
				return doc;
			}
		})
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

		Meteor.methods(
			{
				saveExercise(exercise) {
					check(exercise, Match.ObjectIncluding(
						{
							names: [
								Match.ObjectIncluding(
									{
										language: String,
										name: String
									})],
							programmingLanguage: String,
							category_id: String,
							difficulty: Match.Integer,
							type: Match.Integer,
							descriptions: [
								Match.ObjectIncluding(
									{
										language: String,
										description: String
									})],
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
				}
			});

		Houston.add_collection(Meteor.users);
	}

})();
