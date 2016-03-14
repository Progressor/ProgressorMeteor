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
		}),
		getUserName(user) {
			if (typeof(user) === 'string')
				user = Meteor.users.findOne(user);
			if (user && user.emails && user.emails.length)
				return user.emails[0].address;
		}
	});

	if (Meteor.isServer) {

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
	}

})();
