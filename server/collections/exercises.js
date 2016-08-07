Meteor.methods({

  /**
   * Creates or updates an exercise.
   * @param exercise {{programmingLanguage: string, category_id: string, difficulty: number, type: number}} exercise to save
   * @returns {number} the unique identifier of the exercise
   */
  saveExercise(exercise) {
    check(exercise, Match.ObjectIncluding({
      programmingLanguage: String,
      category_id: String,
      difficulty: Match.Integer,
      type: Match.Integer,
    }));

    const _exercise = exercise._id ? Progressor.exercises.findOne({ _id: exercise._id }) : exercise;

    if (!this.userId) {
      throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
    } else if (_exercise._id && _exercise.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    } else if (_exercise._id && (_exercise.released && _exercise.released.requested || _exercise.execution_id) && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));
    }

    if (!exercise.author_id) {
      exercise.author_id = this.userId;
    }
    exercise.lastEditor_id = this.userId;
    exercise.lastEdited = new Date();

    return Progressor.exercises.upsert(exercise._id, exercise).insertedId || exercise._id;
  },

  /**
   * Toggles the archive flag on an exercise.
   * @param exercise {{_id: string}} exercise to toggle archive flag on
   * @param archived {boolean} whether to add or remove the archive flag
   * @returns {number} the number of exercises affected
   */
  toggleArchiveExercise(exercise, archived) {
    check(exercise, Match.ObjectIncluding({ _id: String }));
    check(archived, Boolean);

    exercise = Progressor.exercises.findOne({ _id: exercise._id });

    if (exercise.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    }

    return Progressor.exercises.update(exercise._id, { $set: { archived } }).rowsAffected;
  },

  /**
   * Deletes an exercise.
   * @param exercise {{_id: string}} exercise to delete
   * @returns {number} the number of exercises affected
   */
  deleteExercise(exercise) {
    check(exercise, Match.ObjectIncluding({ _id: String }));

    exercise = Progressor.exercises.findOne({ _id: exercise._id });

    if (!this.userId) {
      throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
    } else if (exercise._id && exercise.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    } else if (exercise._id && exercise.released && exercise.released.requested && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));
    }

    return Progressor.exercises.remove(exercise._id).rowsAffected;
  },
});
