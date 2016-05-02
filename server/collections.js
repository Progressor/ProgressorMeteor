(function () {
	'use strict';

	///////////////////
	// SUBSCRIPTIONS //
	///////////////////

	//USERS

	Meteor.publish('users', function () {
		return Meteor.users.find({ _id: { $ne: this.userId } }, { fields: { _id: 1, emails: 1, profile: 1, roles: 1 } });
	});

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

	function publishExercises(query, assumeReleased = false, assumeUnauthorised = false) {
		const that = this, published = [];

		function getExercises(id = null) {
			return Progressor.exercises.find(id ? { _id: id } : query);
		}

		function getResults(id = null) {
			return Progressor.results.find(id ? { exercise_id: id } : _.object(_.map(query, (v, k) => [k === '_id' ? 'exercise_id' : `exercise.${k}`, v])));
		}

		function publishExercise(id, exercise = getExercises(id).fetch()[0]) {
			const isAuthorised = exercise && that.userId === exercise.author_id || Roles.userIsInRole(that.userId, Progressor.ROLE_ADMIN);

			if (!exercise || !isAuthorised && !(exercise.released && exercise.released.confirmed) && exercise.type === 1 && (assumeReleased || !_.any(getResults(exercise._id).fetch(), r => Progressor.isExerciseSuccess(exercise, r.results))))
				return unpublishExercise(id);

			if (assumeUnauthorised || !isAuthorised) {
				if (!exercise.solutionVisible)
					delete exercise.solution;
				if (Progressor.hasInvisibleTestCases(exercise))
					exercise.testCases = _.flatten([Progressor.getVisibleTestCases(exercise), { invisible: true }]);
			}

			const isPublished = _.contains(published, id);
			if (!isPublished)
				published.push(id);
			that[isPublished ? 'changed' : 'added']('exercises', id, exercise);
		}

		function unpublishExercise(id) {
			const publishIndex = published.indexOf(id);
			if (publishIndex >= 0) {
				published.splice(publishIndex, 1);
				that.removed('exercises', id);
			}
		}

		const handleExercises = getExercises().observe(
			{
				added: e => publishExercise(e._id, e),
				changed: e => publishExercise(e._id, e),
				removed: e => unpublishExercise(e._id)
			});
		const handleResults = !assumeReleased ? getResults().observe(
			{
				added: r => publishExercise(r.exercise_id),
				changed: r => publishExercise(r.exercise_id),
				removed: r => publishExercise(r.exercise_id)
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
		publishExercises.call(this, { category_id: { $exists: true }, 'released.requested': { $exists: true } }, true);
	});
	Meteor.publish('releasedExercises', function () {
		publishExercises.call(this, { category_id: { $exists: true }, 'released.confirmed': { $exists: true } }, true);
	});
	Meteor.publish('releasedOrMyExercises', function () {
		publishExercises.call(this, { category_id: { $exists: true }, $or: [{ 'released.confirmed': { $exists: true } }, { author_id: this.userId } /*,{ lastEditor_id: this.userId }*/] }, true);
	});
	Meteor.publish('releasedExercisesForCategory', function (category) {
		check(category, String);
		publishExercises.call(this, { category_id: category, 'released.confirmed': { $exists: true } }, true);
	});
	Meteor.publish('releasedExercisesForLanguage', function (language) {
		check(language, String);
		publishExercises.call(this, { programmingLanguage: language, category_id: { $exists: true }, 'released.confirmed': { $exists: true } }, true);
	});
	Meteor.publish('exercise', function (id, isExecute = false) {
		check(id, String);
		check(isExecute, Boolean);
		publishExercises.call(this, { _id: id, category_id: { $exists: true } }, false, isExecute);
	});
	Meteor.publish('exerciseByResult', function (id, isExecute = false) {
		check(id, String);
		check(isExecute, Boolean);
		const result = Progressor.results.findOne({ user_id: this.userId, _id: id });
		return result ? publishExercises.call(this, { _id: result.exercise_id, category_id: { $exists: true } }, false, isExecute) : [];
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

	function publishResults(query, assumeUnauthorised = false) {
		const that = this, published = [];

		function getResults(id = null) {
			return Progressor.results.find(id ? { _id: id } : query);
		}

		function publishResult(id, result = getResults(id).fetch()[0]) {
			const isAuthorised = !assumeUnauthorised && (that.userId === result.exercise.author_id || Roles.userIsInRole(that.userId, Progressor.ROLE_ADMIN));

			if (!isAuthorised && Progressor.hasInvisibleTestCases(result.exercise))
				result.results = _.flatten([Progressor.getVisibleResults(result.exercise, result.results), { invisible: true, success: Progressor.isInvisibleSuccess(result.exercise, result.results) }]);

			const isPublished = _.contains(published, id);
			if (!isPublished)
				published.push(id);
			that[isPublished ? 'changed' : 'added']('results', id, result);
		}

		function unpublishResult(id) {
			const publishIndex = published.indexOf(id);
			if (publishIndex >= 0) {
				published.splice(publishIndex, 1);
				that.removed('results', id);
			}
		}

		const handle = getResults().observe(
			{
				added: r => publishResult(r._id, r),
				changed: r => publishResult(r._id, r),
				removed: r => unpublishResult(r._id)
			});

		this.ready();
		this.onStop(() => handle.stop());
	}

	Meteor.publish('myResults', function () {
		return Progressor.results.find({ user_id: this.userId });
	});
	Meteor.publish('myResult', function (id, isExecute = false) {
		check(id, String);
		check(isExecute, Boolean);
		publishResults.call(this, { user_id: this.userId, _id: id }, isExecute);
	});
	Meteor.publish('myResultByExercise', function (id, isExecute = false) {
		check(id, String);
		check(isExecute, Boolean);
		publishResults.call(this, { user_id: this.userId, exercise_id: id }, isExecute);
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
		};
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
