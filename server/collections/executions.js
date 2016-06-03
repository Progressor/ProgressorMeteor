(function () {
	'use strict';

	Meteor.methods(
		{
			saveExecution(execution){
				check(execution, Match.ObjectIncluding(
					{
						examination_id: String,
						names: [Match.ObjectIncluding({ language: String, name: String })],
						descriptions: [Match.ObjectIncluding({ language: String, description: String })],
						durationMinutes: Match.Integer,
						exercises: [Match.ObjectIncluding({ base_id: String, weight: Number })]
					}));

				const _examination = execution._id ? Progressor.examinations.findOne({ _id: execution._id }) : execution;

				if (!this.userId)
					throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
				else if (_examination._id && _examination.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
				else if (_examination._id && _examination.released && _examination.released.requested && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));

				if (!execution.author_id)
					execution.author_id = this.userId;
				execution.lastEditor_id = this.userId;
				execution.lastEdited = new Date();

				return Progressor.examinations.upsert(execution._id, execution).insertedId || execution._id;
			},
			deleteExecution(execution) {
				check(execution, Match.ObjectIncluding({ _id: String }));

				if (execution._id)
					execution = Progressor.examinations.findOne({ _id: execution._id });

				if (!this.userId)
					throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
				else if (execution._id && execution.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));

				return Progressor.examinations.remove(execution._id).rowsAffected;
			},
			startExecution(execution) {
				check(execution, Match.ObjectIncluding({ _id: String }));

				if (execution._id)
					execution = Progressor.examinations.findOne({ _id: execution._id });

				if (!this.userId)
					throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
				else if (execution._id && execution.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));

				return Progressor.examinations.update(execution._id, {
					$set: {
						startTime: new Date(),
						exercises: _.match(execution.exercises, exercise => _.extend(exercise, {
							exercise_id: Progressor.exercises.insert(_.omit(exercise, '_id', 'category_id', 'difficulty')).insertedId
						}))
					}
				}).rowsAffected;
			}
		});

})();
