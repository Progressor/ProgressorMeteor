(function () {
	'use strict';

	///////////////////
	// SUBSCRIPTIONS //
	///////////////////

	Meteor.publish('categories', function () {
		return Progressor.categories.find();
	});
	Meteor.publish('category', function (id) {
		check(id, String);
		return Progressor.categories.find({ _id: id });
	});
	Meteor.publish('categoriesForLanguage', function (language) {
		check(language, String);
		return Progressor.categories.find({ programmingLanguage: language });
	});

	Meteor.publish('releaseRequestedExercises', function () {
		return Progressor.exercises.find({ category_id: { $exists: true }, 'released.requested': { $exists: true } });
	});
	Meteor.publish('releasedExercises', function () {
		return Progressor.exercises.find({ category_id: { $exists: true }, 'released.confirmed': { $exists: true } });
	});
	Meteor.publish('releasedOrMyExercises', function () {
		return Progressor.exercises.find({ category_id: { $exists: true }, $or: [{ 'released.confirmed': { $exists: true } }, { author_id: this.userId }, { lastEditor_id: this.userId }] });
	});
	Meteor.publish('releasedExercisesForCategory', function (category) {
		check(category, String);
		return Progressor.exercises.find({ category_id: category, 'released.confirmed': { $exists: true } });
	});
	Meteor.publish('releasedExercisesForLanguage', function (language) {
		check(language, String);
		return Progressor.exercises.find({ programmingLanguage: language, category_id: { $exists: true }, 'released.confirmed': { $exists: true } });
	});
	Meteor.publish('unconfirmedExercises', function () {
		return Progressor.exercises.find({ category_id: { $exists: true }, 'released.requested': { $exists: true }, 'released.confirmed': { $exists: false } });
	});
	Meteor.publish('exercise', function (id) {
		check(id, String);
		return Progressor.exercises.find({ _id: id, category_id: { $exists: true } });
	});
	Meteor.publish('exerciseByResult', function (id) {
		check(id, String);
		const result = Progressor.results.findOne({ user_id: this.userId, _id: id });
		if (result)
			return Progressor.exercises.find({ _id: result.exercise_id, category_id: { $exists: true } });
	});

	Meteor.publish('myResults', function () {
		return Progressor.results.find({ user_id: this.userId });
	});
	Meteor.publish('myResult', function (id) {
		check(id, String);
		return Progressor.results.find({ user_id: this.userId, _id: id });
	});
	Meteor.publish('myExerciseResult', function (id) {
		check(id, String);
		return Progressor.results.find({ user_id: this.userId, exercise_id: id });
	});

	Meteor.publish('numberOfExercisesToRelease', function () {
		if (!Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) return [];
		const unique = 0;
		let count = 0;
		this.added('numberOfExercisesToRelease', unique, { count: count });
		const handle = Progressor.exercises.find({ category_id: { $exists: true }, 'released.requested': { $exists: true }, 'released.confirmed': { $exists: false } }).observeChanges(
			{
				added: id => this.changed('numberOfExercisesToRelease', unique, { count: ++count }),
				removed: id => this.changed('numberOfExercisesToRelease', unique, { count: --count })
			});
		this.ready();
		this.onStop(() => handle.stop());
	});

	///////////////////////////
	// HOUSTON CONFIGURATION //
	///////////////////////////

	Houston.add_collection(Meteor.users);
	Houston.add_collection(Meteor.roles);

	Houston.add_collection(Houston._admins);

	function toggleFlag(collection, flag, elementName, setName, unsetName) {
		return function (document) {
			check(document, Match.ObjectIncluding({ _id: String }));

			return Progressor[collection].update(document._id, { [document[flag] !== true ? '$set' : '$unset']: { [flag]: true } }) === 1
				? `${elementName} '${document._id}' successfully ${document[flag] !== true ? setName : unsetName}.`
				: `${elementName} '${document._id}' could NOT successfully be ${document[flag] !== true ? setName : unsetName}!`;
		}
	}

	Houston.methods(Progressor.exercises, {
		'Archive/Restore': toggleFlag('exercises', 'archived', 'Exercise', 'archived', 'restored'),
		'Release/Hide'(document) {
			check(document, Match.ObjectIncluding({ _id: String }));

			const release = !document.released || !document.released.confirmed;
			const result = release
				? Progressor.exercises.update(document._id, { $set: { released: { requested: document.released && document.released.requested ? document.released.requested : new Date(), confirmed: new Date(), confirmor_id: this.userId } } })
				: Progressor.exercises.update(document._id, { $unset: { 'released.confirmed': null, 'released.confirmor_id': null } });

			return result === 1
				? `Exercise '${document._id}' successfully ${release ? 'released' : 'hidden'}.`
				: `Exercise '${document._id}' could NOT successfully be ${release ? 'released' : 'hidden'}!`;
		}
	});

})();
