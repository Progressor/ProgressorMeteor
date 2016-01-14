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

		Meteor.publish('myResult', function (id) {
			check(id, String);
			return Progressor.results.find({ user_id: this.userId, exercise_id: id });
		});
		Meteor.publish('myResults', function () {
			return Progressor.results.find({ user_id: this.userId });
		});

		Houston.add_collection(Meteor.users);
	}

})();
