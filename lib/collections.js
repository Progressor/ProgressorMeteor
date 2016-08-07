function getUserInfo(user, showName, showEmail) {
  if (typeof user === 'string')
    user = Meteor.users.findOne(user);
  if (user) {
    let emails, emailsVerified;
    showName = showName && user && user.profile && user.profile.name;
    showEmail = showEmail && user && user.emails && (emails = user.emails).length;
    const showEmailVerified = showEmail && (emailsVerified = _.where(user.emails, { verified: true })).length;
    if (showName && showEmail) return `${user.profile.name} (${emailsVerified[0].address})`;
    else if (showName) return user.profile.name;
    else if (showEmailVerified) return emailsVerified[0].address;
    else if (showEmail) return emails[0].address;
  }
}

function joinCollection(document, property, collection = `${property}s`, key = `${property}_id`) {
  if (document)
    return _.extend({ [property]: Progressor[collection].findOne({ _id: document[key] }) }, document);
}

_.extend(Progressor, {

  /////////////////////////
  // MONGODB COLLECTIONS //
  /////////////////////////

  /** Contains the exercise categories. */
  categories: new Mongo.Collection('categories'),

  /**
   * Contains the various exercises.
   * Contains private, public & examination exercises; programming, multiple choice, and free text exercises.
   */
  exercises: new Mongo.Collection('exercises'),

  /** Contains the users' results for particular exercises. */
  results: new Mongo.Collection('results'),

  /** Contains the examinations (templates). */
  examinations: new Mongo.Collection('examinations'),

  /** Contains the (examination) executions. */
  executions: new Mongo.Collection('executions'),

  // generate collections (only on client) //

  /**
   * Contains a single record: the number of exercises that have to be released.
   * Is only available on the client.
   */
  numberOfExercisesToRelease: Meteor.isClient ? new Mongo.Collection('numberOfExercisesToRelease') : undefined,

  ////////////////////
  // HELPER METHODS //
  ////////////////////

  /**
   * Gets the email address of a user.
   * @param user {string|User} identifier or document representing the user
   * @returns {string}
   */
  getUserEmail: user => getUserInfo(user, false, true),

  /**
   * Gets the name of a user.
   * @param user {string|User} identifier or document representing the user
   * @param hideEmail {boolean} whether to hide the email address
   * @returns {string}
   */
  getUserName: (user, hideEmail = false) => getUserInfo(user, true, hideEmail !== true),

  /**
   * Performs a 'join' operation on an exercise adding the category details.
   * @param exercise {Exercise} the exercise to add category information to
   */
  joinCategory: exercise => joinCollection(exercise, 'category', 'categories'),

  /**
   * Performs a 'join' operation on an exercise adding the execution details.
   * @param exercise {Exercise} the exercise to add execution information to
   */
  joinExecution: exercise => joinCollection(exercise, 'execution'),

  /**
   * Performs a 'join' operation on an execution adding the examination details.
   * @param execution {Execution} the execution to add examination information to
   */
  joinExamination: execution => joinCollection(execution, 'examination')
});
