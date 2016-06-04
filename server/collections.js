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
		const published = [];

		function getExercises(id = null) {
			return Progressor.exercises.find(id ? { _id: id } : query);
		}

		function getResults(id = null) {
			return Progressor.results.find(id ? { exercise_id: id } : _.object(_.map(query, (v, k) => [k === '_id' ? 'exercise_id' : `exercise.${k}`, v])));
		}

		function publishExercise(id, exercise = getExercises(id).fetch()[0]) {
			const isAuthorised = exercise && this.userId === exercise.author_id || Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN);

			//TODO: add robust execution handling
			if (!exercise || !isAuthorised && !exercise.execution_id && !(exercise.released && exercise.released.confirmed) && exercise.type === 1 && (assumeReleased || !_.some(getResults(exercise._id).fetch(), r => Progressor.isExerciseSuccess(exercise, r.results))))
				return unpublishExercise.call(this, id);

			if (assumeUnauthorised || !isAuthorised) {
				if (!exercise.solutionVisible)
					delete exercise.solution;
				if (Progressor.hasInvisibleTestCases(exercise))
					exercise.testCases = _.flatten([Progressor.getVisibleTestCases(exercise), { invisible: true }]);
			}

			const isPublished = _.contains(published, id);
			if (!isPublished)
				published.push(id);
			this[isPublished ? 'changed' : 'added']('exercises', id, exercise);
		}

		function unpublishExercise(id) {
			const publishIndex = published.indexOf(id);
			if (publishIndex >= 0) {
				published.splice(publishIndex, 1);
				this.removed('exercises', id);
			}
		}

		const handleExercises = getExercises().observe(
			{
				added: e => publishExercise.call(this, e._id, e),
				changed: e => publishExercise.call(this, e._id, e),
				removed: e => unpublishExercise.call(this, e._id)
			});
		const handleResults = !assumeReleased ? getResults().observe(
			{
				added: r => publishExercise.call(this, r.exercise_id),
				changed: r => publishExercise.call(this, r.exercise_id),
				removed: r => publishExercise.call(this, r.exercise_id)
			}) : null;

		this.ready();
		this.onStop(() => {
			handleExercises.stop();
			if (handleResults)
				handleResults.stop();
		});
	}

	//CATEGORISED EXERCISES

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
		publishExercises.call(this, { _id: id /*, category_id: { $exists: true }*/ }, false, isExecute);
	});
	Meteor.publish('exerciseByResult', function (id, isExecute = false) {
		check(id, String);
		check(isExecute, Boolean);
		const result = Progressor.results.findOne({ user_id: this.userId, _id: id });
		return result ? publishExercises.call(this, { _id: result.exercise_id, category_id: { $exists: true } }, false, isExecute) : [];
	});

	//EXAMINATION EXERCISES

	Meteor.publish('exercisesByExecution', function (executionId, isExecute = false) {
		check(executionId, String);
		check(isExecute, Boolean);
		publishExercises.call(this, { execution_id: executionId }, true, isExecute);
	});

	//RELEASE REQUEST COUNT

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
		const published = [];

		function publishResult(id, result) {
			const isAuthorised = !assumeUnauthorised && (this.userId === result.exercise.author_id || Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN));

			//TODO: add robust execution handling
			const execution = result.exercise.execution_id ? Progressor.executions.findOne({ _id: result.exercise.execution_id }) : null;
			if (this.userId !== result.user_id && !(execution && this.userId === execution.author_id) && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
				return unpublishResult.call(this, id);

			if (!isAuthorised && execution && result.exercise.type !== 1)
				result.results = [];
			else if (!isAuthorised && Progressor.hasInvisibleTestCases(result.exercise))
				result.results = _.flatten([Progressor.getVisibleResults(result.exercise, result.results), { invisible: true, success: Progressor.isInvisibleSuccess(result.exercise, result.results) }]);

			const isPublished = _.contains(published, id);
			if (!isPublished)
				published.push(id);
			this[isPublished ? 'changed' : 'added']('results', id, result);
		}

		function unpublishResult(id) {
			const publishIndex = published.indexOf(id);
			if (publishIndex >= 0) {
				published.splice(publishIndex, 1);
				this.removed('results', id);
			}
		}

		const handle = Progressor.results.find(query).observe(
			{
				added: r => publishResult.call(this, r._id, r),
				changed: r => publishResult.call(this, r._id, r),
				removed: r => unpublishResult.call(this, r._id)
			});

		this.ready();
		this.onStop(() => handle.stop());
	}

	Meteor.publish('myResults', function () {
		return Progressor.results.find({ user_id: this.userId, 'exercise.category_id': { $exists: true } });
	});
	Meteor.publish('result', function (id, isExecute = false) {
		check(id, String);
		check(isExecute, Boolean);
		publishResults.call(this, { _id: id /*, 'exercise.category_id': { $exists: true }*/ }, isExecute);
	});
	Meteor.publish('resultByExercise', function (exerciseId, isExecute = false) {
		check(exerciseId, String);
		check(isExecute, Boolean);
		publishResults.call(this, { exercise_id: exerciseId /*, 'exercise.category_id': { $exists: true }*/ }, isExecute);
	});

	Meteor.publish('resultsByExecution', function (executionId, isExecute = false) {
		check(executionId, String);
		check(isExecute, Boolean);
		publishResults.call(this, { 'exercise.execution_id': executionId }, isExecute);
	});

	//EXAMINATIONS

	function publishExaminations(query) {
		const published = [];

		function publishExamination(id, examination) {
			if (this.userId !== examination.author_id && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
				return unpublishExamination.call(this, id);

			const isPublished = _.contains(published, id);
			if (!isPublished)
				published.push(id);
			this[isPublished ? 'changed' : 'added']('examinations', id, examination);
		}

		function unpublishExamination(id) {
			const publishIndex = published.indexOf(id);
			if (publishIndex >= 0) {
				published.splice(publishIndex, 1);
				this.removed('examinations', id);
			}
		}

		const handleExaminations = Progressor.examinations.find(query).observe(
			{
				added: e => publishExamination.call(this, e._id, e),
				changed: e => publishExamination.call(this, e._id, e),
				removed: e => unpublishExamination.call(this, e._id)
			});

		this.ready();
		this.onStop(() => handleExaminations.stop());
	}

	Meteor.publish('myExaminations', function () {
		publishExaminations.call(this, { author_id: this.userId });
	});
	Meteor.publish('examination', function (id) {
		check(id, String);
		publishExaminations.call(this, { _id: id });
	});

	//EXECUTIONS

	function publishExecutions(query) {
		const published = [];

		function getExecutions(id = null) {
			return Progressor.executions.find(id ? { _id: id } : query);
		}

		function publishExecution(id, execution = getExecutions(id).fetch()[0]) {
			if (this.userId !== execution.author_id && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN) //TODO: add robust time handling
					&& ((execution.examinees && execution.examinees.length && !_.contains(execution.examinees, this.userId)) || !execution.startTime || execution.startTime > new Date() || (execution.startTime + execution.durationMinutes * 60 * 1000) < new Date()))
				return unpublishExecution.call(this, id);

			const isPublished = _.contains(published, id);
			if (!isPublished)
				published.push(id);
			this[isPublished ? 'changed' : 'added']('executions', id, execution);
		}

		function unpublishExecution(id) {
			const publishIndex = published.indexOf(id);
			if (publishIndex >= 0) {
				published.splice(publishIndex, 1);
				this.removed('executions', id);
			}
		}

		const handleExecutions = getExecutions().observe(
			{
				added: e => publishExecution.call(this, e._id, e),
				changed: e => publishExecution.call(this, e._id, e),
				removed: e => unpublishExecution.call(this, e._id)
			});

		this.ready();
		this.onStop(() => handleExecutions.stop());
	}

	Meteor.publish('myExecutions', function () {
		publishExecutions.call(this, { author_id: this.userId });
	});
	Meteor.publish('execution', function (id) {
		check(id, String);
		publishExecutions.call(this, { _id: id });
	});
	Meteor.publish('executionByExercise', function (exerciseId) {
		check(exerciseId, String);
		publishExecutions.call(this, { exercises: { $elemMatch: { exercise_id: exerciseId } } });
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
