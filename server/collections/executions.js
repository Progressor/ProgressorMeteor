Meteor.methods({
  /**
   * Creates or updates an execution.
   * @param execution {{examination_id: string, durationMinutes: number, exercises: {base_id: string, weight: number}[]}} execution to save
   * @returns {number} the unique identifier of the execution
   */
  saveExecution(execution) {
    check(execution, Match.ObjectIncluding({
      examination_id: String,
      durationMinutes: Match.Integer,
      exercises: [Match.ObjectIncluding({ base_id: String, weight: Number })],
    }));

    const _execution = execution._id ? Progressor.executions.findOne({ _id: execution._id }) : execution;

    if (!this.userId) {
      throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
    } else if (_execution._id && _execution.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    } else if (_execution._id && _execution.startTime && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));
    }

    if (!execution.author_id) {
      execution.author_id = this.userId;
    }
    execution.lastEditor_id = this.userId;
    execution.lastEdited = new Date();

    return Progressor.executions.upsert(execution._id, execution).insertedId || execution._id;
  },

  /**
   * Sets the start time of an execution and copies its exercises.
   * @param execution {{_id: string}} execution to start
   * @returns {number} the number of executions affected
   */
  startExecution(execution) {
    check(execution, Match.ObjectIncluding({ _id: String }));

    execution = Progressor.executions.findOne({ _id: execution._id });

    if (!this.userId) {
      throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
    } else if (execution._id && execution.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    } else if (execution._id && execution.startTime && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));
    }

    return Progressor.executions.update(execution._id, {
      $set: {
        startTime: new Date(),
        exercises: _.map(execution.exercises, exercise => _.extend(exercise, {
          exercise_id: Progressor.exercises.insert(_.extend(_.omit(Progressor.exercises.findOne({ _id: exercise.base_id }), '_id', 'category_id', 'difficulty', 'released', 'archived'), {
            execution_id: execution._id,
          })),
        })),
      },
    }).rowsAffected;
  },

  /**
   * Toggles the archive flag on an execution.
   * @param execution {{_id: string}} execution to toggle archive flag on
   * @param archived {boolean} whether to add or remove the archive flag
   * @returns {number} the number of executions affected
   */
  toggleArchiveExecution(execution, archived) {
    check(execution, Match.ObjectIncluding({ _id: String }));
    check(archived, Boolean);

    execution = Progressor.executions.findOne({ _id: execution._id });

    if (execution.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    }

    return Progressor.executions.update(execution._id, { $set: { archived } }).rowsAffected;
  },

  /**
   * Deletes an execution.
   * @param execution {{_id: string}} execution to delete
   * @returns {number} the number of documents affected
   */
  deleteExecution(execution) {
    check(execution, Match.ObjectIncluding({ _id: String }));

    execution = Progressor.executions.findOne({ _id: execution._id });

    if (!this.userId) {
      throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
    } else if (execution._id && execution.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    }

    return Progressor.executions.remove(execution._id).rowsAffected
           + Progressor.exercises.remove({ execution_id: execution._id }).rowsAffected
           + Progressor.results.remove({ 'exercises.execution_id': execution._id }).rowsAffected;
  },
});
