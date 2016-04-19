(function () {
	'use strict';

	///////////////////
	// SUBSCRIPTIONS //
	///////////////////

	function checked(checks, callback) {
		return function (...args) {
			for (let i = 0; i < args.length; i++)
				check(args[i], checks[i]);
			return callback.bind(this)(...args, this.userId);
		};
	}

	Meteor.publish('categories', () => Progressor.categories.find());
	Meteor.publish('category', checked([String], id => Progressor.categories.find({ _id: id })));
	Meteor.publish('categoriesForLanguage', checked([String], lng => Progressor.categories.find({ programmingLanguage: lng })));

	Meteor.publish('releaseRequestedExercises', () => Progressor.exercises.find({ category_id: { $exists: true }, 'released.requested': { $exists: true } }));
	Meteor.publish('releasedExercises', () => Progressor.exercises.find({ category_id: { $exists: true }, 'released.confirmed': { $exists: true } }));
	Meteor.publish('releasedOrMyExercises', checked([], userId => Progressor.exercises.find({ category_id: { $exists: true }, $or: [{ 'released.confirmed': { $exists: true } }, { author_id: userId }, { lastEditor_id: userId }] })));
	Meteor.publish('releasedExercisesForCategory', checked([String], cat => Progressor.exercises.find({ category_id: cat, 'released.confirmed': { $exists: true } })));
	Meteor.publish('releasedExercisesForLanguage', checked([String], lng => Progressor.exercises.find({ programmingLanguage: lng, category_id: { $exists: true }, 'released.confirmed': { $exists: true } })));
	Meteor.publish('unconfirmedExercises', () => Progressor.exercises.find({ category_id: { $exists: true }, 'released.requested': { $exists: true }, 'released.confirmed': { $exists: false } }));
	Meteor.publish('exercise', checked([String], id => Progressor.exercises.find({ _id: id, category_id: { $exists: true } })));
	Meteor.publish('exerciseByResult', function (id) {
		check(id, String);
		const result = Progressor.results.findOne({ user_id: this.userId, _id: id });
		if (result)
			return Progressor.exercises.find({ _id: result.exercise_id, category_id: { $exists: true } });
	});

	Meteor.publish('myResults', function () {
		return Progressor.results.find({ user_id: this.userId });
	});
	Meteor.publish('myResult', checked([String], function (id) {
		return Progressor.results.find({ user_id: this.userId, _id: id });
	}));
	Meteor.publish('myExerciseResult', checked([String], function (id) {
		return Progressor.results.find({ user_id: this.userId, exercise_id: id });
	}));

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

				const user = Meteor.user();
				if (!Roles.userIsInRole(user, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', user));

				if (!category.author_id)
					category.author_id = this.userId;
				category.lastEditor_id = this.userId;
				category.lastEdited = new Date();

				return Progressor.categories.upsert(category._id, category).insertedId || category._id;
			},
			deleteCategory(category) {
				check(category, Match.ObjectIncluding({ _id: String }));

				const user = Meteor.user();
				if (!Roles.userIsInRole(user, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', user));

				return Progressor.categories.remove(category._id).rowsAffected;
			},
			saveExercise(exercise) {
				check(exercise, Match.ObjectIncluding(
					{
						programmingLanguage: String,
						category_id: String,
						difficulty: Match.Integer,
						type: Match.Integer
					}));

				const user = Meteor.user();
				if (exercise.released && exercise.released.requested && !Roles.userIsInRole(user, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', user));
				else if (exercise.author_id !== this.userId)
					throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', user));

				if (!exercise.author_id)
					exercise.author_id = this.userId;
				exercise.lastEditor_id = this.userId;
				exercise.lastEdited = new Date();

				return Progressor.exercises.upsert(exercise._id, exercise).insertedId || exercise._id;
			},
			toggleArchiveExercise(exercise, archive) {
				check(exercise, Match.ObjectIncluding({ _id: String }));
				check(archive, Boolean);

				return Progressor.exercises.upsert(exercise._id, { [archive === true ? '$set' : '$unset']: { archived: true } }).rowsAffected;
			},
			deleteExercise(exercise) {
				check(exercise, Match.ObjectIncluding({ _id: String }));

				if (exercise._id)
					exercise = Progressor.exercises.findOne({ _id: exercise._id });

				const user = Meteor.user();
				if (exercise.released && exercise.released.requested && !Roles.userIsInRole(user, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', user));
				else if (exercise.author_id !== this.userId)
					throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', user));

				return Progressor.exercises.remove(exercise._id).rowsAffected;
			},
			toggleUsersRoles(users, roles, isInRole) {
				check(users, [String]);
				check(roles, [String]);
				check(isInRole, Boolean);

				const user = Meteor.user();
				if (!Roles.userIsInRole(user, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', user));

				Roles[isInRole ? 'addUsersToRoles' : 'removeUsersFromRoles'](users, roles);
				if (_.contains(roles, Progressor.ROLE_ADMIN))
					_.each(users, u => Houston._admins[isInRole ? 'insert' : 'remove']({ user_id: u }));
			}
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
