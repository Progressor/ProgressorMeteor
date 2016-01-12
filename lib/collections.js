(function () {
	'use strict';

	_.extend(Progressor, {
		categories: new Mongo.Collection('categories'),
		exercises: new Mongo.Collection('exercises'),
		results: new Mongo.Collection('results')
	});

	if (Meteor.isServer) {

		Meteor.publish('categoriesForLanguage', function (lng) {
			check(lng, Match.OneOf(...Progressor.getProgrammingLanguages()));
			return Progressor.categories.find({ programmingLanguage: lng });
		});

		Meteor.publish('publicExercises', () => Progressor.exercises.find({ category_id: { $exists: true } }));
		Meteor.publish('publicExercisesForLanguage', function (lng) {
			check(lng, Match.OneOf(...Progressor.getProgrammingLanguages()));
			return Progressor.exercises.find({ programmingLanguage: lng, category_id: { $exists: true } });
		});
		Meteor.publish('publicExercise', function (id) {
			check(id, String);
			return Progressor.exercises.find({ _id: id, category_id: { $exists: true } });
		});

		Meteor.publish('myResults', () => Progressor.results.find({ user_id: this.userId }));

		Houston.add_collection(Meteor.users);
	}

})();
