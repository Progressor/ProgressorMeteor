(function () {
	'use strict';

	Meteor.methods(
		{
			saveExercise(exercise) {
				check(exercise, Match.ObjectIncluding(
					{
						programmingLanguage: String,
						category_id: String,
						difficulty: Match.Integer,
						type: Match.Integer
					}));

				const _exercise = exercise._id ? Progressor.exercises.findOne({ _id: exercise._id }) : exercise;

				if (!this.userId)
					throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
				else if (_exercise._id && _exercise.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
				else if (_exercise._id && _exercise.released && _exercise.released.requested && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));

				if (!exercise.author_id)
					exercise.author_id = this.userId;
				exercise.lastEditor_id = this.userId;
				exercise.lastEdited = new Date();

				return Progressor.exercises.upsert(exercise._id, exercise).insertedId || exercise._id;
			},
			toggleArchiveExercise(exercise, archived) {
				check(exercise, Match.ObjectIncluding({ _id: String }));
				check(archived, Boolean);

				exercise = Progressor.exercises.findOne({ _id: exercise._id });

				if (exercise.author_id !== this.userId)
					throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));

				return Progressor.exercises.upsert(exercise._id, { $set: { archived } }).rowsAffected;
			},
			deleteExercise(exercise) {
				check(exercise, Match.ObjectIncluding({ _id: String }));

				if (exercise._id)
					exercise = Progressor.exercises.findOne({ _id: exercise._id });

				if (!this.userId)
					throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
				else if (exercise._id && exercise.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
				else if (exercise._id && exercise.released && exercise.released.requested && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));

				return Progressor.exercises.remove(exercise._id).rowsAffected;
			}
		});

})();
