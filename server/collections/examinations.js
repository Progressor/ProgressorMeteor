Meteor.methods({
  /**
   * Creates or updates an examination.
   * @param examination {{durationMinutes: number, exercises: {base_id: string, weight: number}[]}} examination to save
   * @returns {number} the unique identifier of the examination
   */
  saveExamination(examination) {
    check(examination, Match.ObjectIncluding({
      durationMinutes: Match.Integer,
      exercises: [Match.ObjectIncluding({ exercise_id: String, weight: Number })],
    }));

    const _examination = examination._id ? Progressor.examinations.findOne({ _id: examination._id }) : examination;

    if (!this.userId) {
      throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
    } else if (_examination._id && _examination.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    }

    if (!examination.author_id) {
      examination.author_id = this.userId;
    }
    examination.lastEditor_id = this.userId;
    examination.lastEdited = new Date();

    return Progressor.examinations.upsert(examination._id, examination).insertedId || examination._id;
  },

  /**
   * Toggles the archive flag on an examination.
   * @param examination {{_id: string}} examination to toggle archive flag on
   * @param archived {boolean} whether to add or remove the archive flag
   * @returns {number} the number of examinations affected
   */
  toggleArchiveExamination(examination, archived) {
    check(examination, Match.ObjectIncluding({ _id: String }));
    check(archived, Boolean);

    examination = Progressor.examinations.findOne({ _id: examination._id });

    if (examination.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    }

    return Progressor.examinations.update(examination._id, { $set: { archived } }).rowsAffected;
  },

  /**
   * Deletes an examination.
   * @param examination {{_id: string}} examination to delete
   * @returns {number} the number of examinations affected
   */
  deleteExamination(examination) {
    check(examination, Match.ObjectIncluding({ _id: String }));

    examination = Progressor.examinations.findOne({ _id: examination._id });

    if (!this.userId) {
      throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
    } else if (examination._id && examination.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
    }

    return Progressor.examinations.remove(examination._id).rowsAffected;
  },
});
