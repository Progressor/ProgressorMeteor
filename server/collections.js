(function () {
	'use strict';

	///////////////////
	// SUBSCRIPTIONS //
	///////////////////

	//CATEGORIES

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

	//EXERCISES

	function publishExercises(query, assumeReleased = false) {
		const that = this, published = [];

		function getExercises(id = null) {
			return Progressor.exercises.find(id ? { _id: id } : query);
		}

		function getResults(id = null) {
			return Progressor.results.find(id ? { exercise_id: id } : _.object(_.map(query, (v, k) => [k === '_id' ? 'exercise_id' : `exercise.${k}`, v])));
		}

		function publish(id, exercise = getExercises(id).fetch()[0]) {
			if (!(exercise.released && exercise.released.confirmed) && that.userId !== exercise.author_id && !Roles.userIsInRole(that.userId, Progressor.ROLE_ADMIN) && (assumeReleased || !getResults(exercise._id).fetch().length))
				return unpublish(id);
			// if (!exercise.solutionVisible) //TODO: remove sensitive information for /solve only
			// 	exercise = _.extend({}, exercise, { solution: undefined });
			const isPublished = _.contains(published, id);
			that[isPublished ? 'changed' : 'added']('exercises', id, exercise);
			if (!isPublished)
				published.push(id);
		}

		function unpublish(id) {
			const publishIndex = published.indexOf(id);
			if (publishIndex >= 0) {
				that.removed('exercises', id);
				published.splice(publishIndex, 1);
			}
		}

		const handleExercises = getExercises().observe(
			{
				added: e => publish(e._id, e),
				changed: e => publish(e._id, e),
				removed: e => unpublish(e._id)
			});
		const handleResults = !assumeReleased ? getResults().observe(
			{
				added: r => publish(r.exercise_id),
				changed: r => publish(r.exercise_id),
				removed: r => publish(r.exercise_id)
			}) : null;

		this.ready();
		this.onStop(function () {
			handleExercises.stop();
			if (handleResults)
				handleResults.stop();
		});
	}

	Meteor.publish('releaseRequestedExercises', function () {
		if (!Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) return [];
		publishExercises.bind(this)({ category_id: { $exists: true }, 'released.requested': { $exists: true } }, true);
	});
	Meteor.publish('releasedExercises', function () {
		publishExercises.bind(this)({ category_id: { $exists: true }, 'released.confirmed': { $exists: true } }, true);
	});
	Meteor.publish('releasedOrMyExercises', function () {
		publishExercises.bind(this)({ category_id: { $exists: true }, $or: [{ 'released.confirmed': { $exists: true } }, { author_id: this.userId } /*,{ lastEditor_id: this.userId }*/] }, true);
	});
	Meteor.publish('releasedExercisesForCategory', function (category) {
		check(category, String);
		publishExercises.bind(this)({ category_id: category, 'released.confirmed': { $exists: true } }, true);
	});
	Meteor.publish('releasedExercisesForLanguage', function (language) {
		check(language, String);
		publishExercises.bind(this)({ programmingLanguage: language, category_id: { $exists: true }, 'released.confirmed': { $exists: true } }, true);
	});
	Meteor.publish('exercise', function (id) {
		check(id, String);
		publishExercises.bind(this)({ _id: id, category_id: { $exists: true } });
	});
	Meteor.publish('exerciseByResult', function (id) {
		check(id, String);
		const result = Progressor.results.findOne({ user_id: this.userId, _id: id });
		return result ? publishExercises.bind(this)({ _id: result.exercise_id, category_id: { $exists: true } }) : [];
	});

	Meteor.publish('numberOfExercisesToRelease', function () {
		if (!Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
			return [];

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

	//RESULTS

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
