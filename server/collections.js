(function () {
	'use strict';

	///////////////////
	// SUBSCRIPTIONS //
	///////////////////

	function checked(checks, callback) {
		return function (...args) {
			for (let i = 0; i < args.length; i++)
				check(args[i], checks[i])
			return callback(...args, this.userId);
		};
	}

	Meteor.publish('categories', () => Progressor.categories.find());
	Meteor.publish('category', checked([String], id => Progressor.categories.find(id)));
	Meteor.publish('categoriesForLanguage', checked([String], lng => Progressor.categories.find({ programmingLanguage: lng })));

	Meteor.publish('publicExercises', () => Progressor.exercises.find({ category_id: { $exists: true }, 'released.confirmed': { $exists: true } }));
	Meteor.publish('publicOrMyExercises', userId => Progressor.exercises.find({ category_id: { $exists: true }, $or: [{ 'released.confirmed': { $exists: true } }, { author_id: userId }, { lastEditor_id: userId }] }));
	Meteor.publish('publicExercisesForCategory', checked([String], cat => Progressor.exercises.find({ category_id: cat, 'released.confirmed': { $exists: true } })));
	Meteor.publish('publicExercisesForLanguage', checked([String], lng => Progressor.exercises.find({ programmingLanguage: lng, category_id: { $exists: true }, 'released.confirmed': { $exists: true } })));
	Meteor.publish('unconfirmedExercises', () => Progressor.exercises.find({ category_id: { $exists: true }, 'released.requested': { $exists: true }, 'released.confirmed': { $exists: false } }));
	Meteor.publish('exercise', checked([String], id => Progressor.exercises.find({ _id: id, category_id: { $exists: true } })));
	Meteor.publish('exerciseByResult', function (id) {
		check(id, String);
		let result = Progressor.results.findOne({ user_id: this.userId, _id: id });
		if (result)
			return Progressor.exercises.find({ _id: result.exercise_id, category_id: { $exists: true } });
	});

	Meteor.publish('myResults', userId => Progressor.results.find({ user_id: userId }));
	Meteor.publish('myResult', checked([String], (id, userId) => Progressor.results.find({ user_id: userId, _id: id })));
	Meteor.publish('myExerciseResult', checked([String], (id, userId) => Progressor.results.find({ user_id: userId, exercise_id: id })));

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

			return Progressor[collection].update(document._id, { [document[flag] !== true ? '$set' : '$unset']: { [flag]: true } }) === 1
				? `${elementName} '${document._id}' successfully ${document[flag] !== true ? setName : unsetName}.`
				: `${elementName} '${document._id}' could NOT successfully be ${document[flag] !== true ? setName : unsetName}!`;
		}
	}

	Houston.methods('exercises', {
		'Archive/Restore': toggleFlag('exercises', 'archived', 'Exercise', 'archived', 'restored'),
		'Release/Hide'(document) {
			check(document, Match.ObjectIncluding({ _id: String }));

			let release = !document.released || !document.released.confirmed;
			let result = release
				? Progressor.exercises.update(document._id, { $set: { released: { requested: document.released && document.released.requested ? document.released.requested : new Date(), confirmed: new Date(), confirmor_id: this.userId } } })
				: Progressor.exercises.update(document._id, { $unset: { 'released.confirmed': null, 'released.confirmor_id': null } });

			return result === 1
				? `Exercise '${document._id}' successfully ${release ? 'released' : 'hidden'}.`
				: `Exercise '${document._id}' could NOT successfully be ${release ? 'released' : 'hidden'}!`;
		}
	});

})();
