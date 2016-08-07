// SUBSCRIPTIONS //

// users //

Meteor.publish('users', () => Meteor.users.find({ _id: { $ne: this.userId } }, { fields: { _id: 1, emails: 1, profile: 1, roles: 1 } }));

// categories //

Meteor.publish('categories', () => Progressor.categories.find());
Meteor.publish('category', (id) => {
  check(id, String);
  return Progressor.categories.find({ _id: id });
});
Meteor.publish('categoriesForLanguage', (language) => {
  check(language, String);
  return Progressor.categories.find({ programmingLanguage: language });
});

// exercise //

function publishExercises(query, assumeReleased = false, assumeUnauthorised = false) {
  const published = [];

  function getExercises(id = null) {
    return Progressor.exercises.find(id ? { _id: id } : query);
  }

  function getResults(id = null) {
    return Progressor.results.find(id ? { exercise_id: id } : _.object(_.map(query, (v, k) => [k === '_id' ? 'exercise_id' : `exercise.${k}`, v])));
  }

  function unpublishExercise(id) {
    const publishIndex = published.indexOf(id);
    if (publishIndex >= 0) {
      published.splice(publishIndex, 1);
      this.removed('exercises', id);
    }
  }

  function publishExercise(id, exercise = getExercises(id).fetch()[0]) {
    const isAuthorised = exercise && this.userId === exercise.author_id || Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN);

    // TODO: add robust execution handling
    if (!exercise || !isAuthorised // in order to access the exercise, the user must have access
                     && !exercise.execution_id // or the exericse has to be part of an examination
                     && !(exercise.released && exercise.released.confirmed) // or the exercise has to be released
                     && exercise.type === 1 // or the exercise has to be a multiple choice or free text exercise (which are immediately visible)
                     && (assumeReleased || !_.some(getResults(exercise._id).fetch(), r => Progressor.isExerciseSuccess(exercise, r.results)))) { // or it has to be solved
      return unpublishExercise.call(this, id);
    }

    // remove sensitive information
    if (assumeUnauthorised || !isAuthorised) {
      if (exercise.execution_id) {
        // TODO: avoid `delete`
        delete exercise.solutionVisible;
      }
      if (!exercise.solutionVisible) {
        // TODO: avoid `delete`
        delete exercise.solution;
      }
      if (Progressor.hasInvisibleTestCases(exercise)) {
        exercise.testCases = _.flatten([Progressor.getVisibleTestCases(exercise), { invisible: true }]);
      }
    }

    const isPublished = _.contains(published, id);
    if (!isPublished) {
      published.push(id);
    }
    this[isPublished ? 'changed' : 'added']('exercises', id, exercise);
  }

  const handleExercises = getExercises().observe({
    added: e => publishExercise.call(this, e._id, e),
    changed: e => publishExercise.call(this, e._id, e),
    removed: e => unpublishExercise.call(this, e._id),
  });

  // include results, programming exercises have to be tested
  const handleResults = !assumeReleased ? getResults().observe({
    added: r => publishExercise.call(this, r.exercise_id),
    changed: r => publishExercise.call(this, r.exercise_id),
    removed: r => publishExercise.call(this, r.exercise_id),
  }) : null;

  this.ready();
  this.onStop(() => {
    handleExercises.stop();
    if (handleResults) {
      handleResults.stop();
    }
  });
}

// categorised exercises

Meteor.publish('releaseRequestedExercises', function releaseRequestedExercises() {
  if (!Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) return [];
  publishExercises.call(this, { category_id: { $exists: true }, 'released.requested': { $exists: true } }, true);
});
Meteor.publish('releasedExercises', function releasedExercises() {
  publishExercises.call(this, { category_id: { $exists: true }, 'released.confirmed': { $exists: true } }, true);
});
Meteor.publish('releasedOrMyExercises', function releasedOrMyExercises() {
  publishExercises.call(this, { category_id: { $exists: true }, $or: [{ 'released.confirmed': { $exists: true } }, { author_id: this.userId }] }, true);
});
Meteor.publish('releasedExercisesForCategory', function releasedExercisesForCategory(category) {
  check(category, String);
  publishExercises.call(this, { category_id: category, 'released.confirmed': { $exists: true } }, true);
});
Meteor.publish('releasedExercisesForLanguage', function releasedExercisesForLanguage(language) {
  check(language, String);
  publishExercises.call(this, { programmingLanguage: language, category_id: { $exists: true }, 'released.confirmed': { $exists: true } }, true);
});
Meteor.publish('exercise', function exercise(id, isExecute = false) {
  check(id, String);
  check(isExecute, Boolean);
  publishExercises.call(this, isExecute ? { _id: id } : { _id: id, category_id: { $exists: true } }, false, isExecute);
});
Meteor.publish('exerciseByResult', function exerciseByResult(id, isExecute = false) {
  check(id, String);
  check(isExecute, Boolean);
  const result = Progressor.results.findOne({ user_id: this.userId, _id: id });
  return result ? publishExercises.call(this, { _id: result.exercise_id, category_id: { $exists: true } }, false, isExecute) : [];
});

// examination exercises

Meteor.publish('exercisesByExecution', function exercisesByExecution(executionId, isExecute = false) {
  check(executionId, String);
  check(isExecute, Boolean);
  publishExercises.call(this, { execution_id: executionId }, true, isExecute);
});

// release request count

Meteor.publish('numberOfExercisesToRelease', function numberOfExercisesToRelease() {
  if (!Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) return [];

  const unique = 0;
  let count = 0;
  this.added('numberOfExercisesToRelease', unique, { count });
  const handle = Progressor.exercises.find({ category_id: { $exists: true }, 'released.requested': { $exists: true }, 'released.confirmed': { $exists: false } }).observeChanges({
    added: id => this.changed('numberOfExercisesToRelease', unique, { count: ++count }),
    removed: id => this.changed('numberOfExercisesToRelease', unique, { count: --count }),
  });

  this.ready();
  this.onStop(() => handle.stop());
});

// results //

function publishResults(query, assumeUnauthorised = false, includeDetails = false) {
  const published = [];

  function publishResult(id, result) {
    const isAuthorised = !assumeUnauthorised && (this.userId === result.exercise.author_id || Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN));

    // TODO: add robust execution handling
    const execution = result.exercise && result.exercise.execution_id ? Progressor.executions.findOne({ _id: result.exercise.execution_id }) : null;
    if (this.userId !== result.user_id && !(execution && this.userId === execution.author_id) && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
      return unpublishResult.call(this, id);

    // remove sensitive information
    if (result.results) {
      if (!isAuthorised && execution && result.exercise.type !== 1) {
        result.results = _.map(result.results, r => _.omit(r, 'success'));
      } else if (!isAuthorised && Progressor.hasInvisibleTestCases(result.exercise)) {
        result.results = _.flatten([Progressor.getVisibleResults(result.exercise, result.results), { invisible: true, success: Progressor.isInvisibleSuccess(result.exercise, result.results) }]);
      }
    }
    // remove sensitive information
    if ((assumeUnauthorised || !isAuthorised) && result.exercise) {
      if (result.exercise.execution_id) {
        // TODO: avoid `delete`
        delete result.exercise.solutionVisible;
      }
      if (!result.exercise.solutionVisible) {
        // TODO: avoid `delete`
        delete result.exercise.solution;
      }
      if (Progressor.hasInvisibleTestCases(result.exercise)) {
        result.exercise.testCases = _.flatten([Progressor.getVisibleTestCases(result.exercise), { invisible: true }]);
      }
    }

    const isPublished = _.contains(published, id);
    if (!isPublished) {
      published.push(id);
    }
    this[isPublished ? 'changed' : 'added']('results', id, result);
  }

  function unpublishResult(id) {
    const publishIndex = published.indexOf(id);
    if (publishIndex >= 0) {
      published.splice(publishIndex, 1);
      this.removed('results', id);
    }
  }

  const options = {};
  if (!includeDetails) {
    _.extend(query, { solved: { $exists: true } });
    _.extend(options, { fields: { log: 0 } });
  }

  const handle = Progressor.results.find(query).observe({
    added: r => publishResult.call(this, r._id, r),
    changed: r => publishResult.call(this, r._id, r),
    removed: r => unpublishResult.call(this, r._id),
  });

  this.ready();
  this.onStop(() => handle.stop());
}

Meteor.publish('myResults', function myResults(includeDetails = false) {
  check(includeDetails, Boolean);
  publishResults.call(this, { user_id: this.userId, 'exercise.category_id': { $exists: true } });
});
Meteor.publish('result', function result(id, isExecute = false, includeDetails = false) {
  check(id, String);
  check(isExecute, Boolean);
  check(includeDetails, Boolean);
  publishResults.call(this, _.extend({ _id: id /* , user_id: this.userId*/ }, isExecute ? {} : { 'exercise.category_id': { $exists: true } }), isExecute);
});
Meteor.publish('resultByExercise', function resultByExercise(exerciseId, isExecute = false, includeDetails = false) {
  check(exerciseId, String);
  check(isExecute, Boolean);
  check(includeDetails, Boolean);
  publishResults.call(this, _.extend({ exercise_id: exerciseId, user_id: this.userId }, isExecute ? {} : { exercise_id: exerciseId, 'exercise.category_id': { $exists: true } }), isExecute);
});

Meteor.publish('resultsByExecution', function resultsByExecution(executionId, isExecute = false, includeDetails = false) {
  check(executionId, String);
  check(isExecute, Boolean);
  check(includeDetails, Boolean);
  publishResults.call(this, { 'exercise.execution_id': executionId }, isExecute);
});

// examinations //

function publishExaminations(query) {
  const published = [];

  function publishExamination(id, examination) {
    if (this.userId !== examination.author_id && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)) {
      return unpublishExamination.call(this, id);
    }

    const isPublished = _.contains(published, id);
    if (!isPublished) {
      published.push(id);
    }
    this[isPublished ? 'changed' : 'added']('examinations', id, examination);
  }

  function unpublishExamination(id) {
    const publishIndex = published.indexOf(id);
    if (publishIndex >= 0) {
      published.splice(publishIndex, 1);
      this.removed('examinations', id);
    }
  }

  const handleExaminations = Progressor.examinations.find(query).observe({
    added: e => publishExamination.call(this, e._id, e),
    changed: e => publishExamination.call(this, e._id, e),
    removed: e => unpublishExamination.call(this, e._id),
  });

  this.ready();
  this.onStop(() => handleExaminations.stop());
}

Meteor.publish('myExaminations', function myExaminations() {
  publishExaminations.call(this, { author_id: this.userId });
});
Meteor.publish('examination', function examination(id) {
  check(id, String);
  publishExaminations.call(this, { _id: id });
});

Meteor.publish('examinationByExecution', function examinationByExecution(id) {
  check(id, String);
  const result = Progressor.executions.findOne({ _id: id });
  if (result) {
    publishExaminations.call(this, { _id: result.examination_id });
  }
});

// executions //

function publishExecutions(query) {
  const published = [];

  function getExecutions(id = null) {
    return Progressor.executions.find(id ? { _id: id } : query);
  }

  function publishExecution(id, execution = getExecutions(id).fetch()[0]) {
    if (this.userId !== execution.author_id && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN) // TODO: add robust time handling
        && ((execution.examinees && execution.examinees.length && !_.contains(execution.examinees, this.userId)) || !execution.startTime || execution.startTime > new Date() || new Date(execution.startTime.getTime() + execution.durationMinutes * 60 * 1000) < new Date())) {
      return unpublishExecution.call(this, id);
    }

    const isPublished = _.contains(published, id);
    if (!isPublished) {
      published.push(id);
    }
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
      removed: e => unpublishExecution.call(this, e._id),
    });

  this.ready();
  this.onStop(() => handleExecutions.stop());
}

Meteor.publish('myExecutions', function myExecutions() {
  publishExecutions.call(this, { author_id: this.userId });
});
Meteor.publish('execution', function execution(id) {
  check(id, String);
  publishExecutions.call(this, { _id: id });
});
Meteor.publish('executionByExercise', function executionByExercise(exerciseId) {
  check(exerciseId, String);
  publishExecutions.call(this, { exercises: { $elemMatch: { exercise_id: exerciseId } } });
});
Meteor.publish('executionsByExamination', function executionsByExamination(examinationId) {
  check(examinationId, String);
  publishExecutions.call(this, { examination_id: examinationId });
});

// HOUSTON CONFIGURATION //

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
  'Release/Hide': function (document) {
    check(document, Match.ObjectIncluding({ _id: String }));

    const release = !document.released || !document.released.confirmed;
    const result = release
      ? Progressor.exercises.update(document._id, { $set: { released: { requested: document.released && document.released.requested ? document.released.requested : new Date(), confirmed: new Date(), confirmor_id: this.userId } } })
      : Progressor.exercises.update(document._id, { $unset: { 'released.confirmed': null, 'released.confirmor_id': null } });

    return result === 1
      ? `Exercise '${document._id}' successfully ${release ? 'released' : 'hidden'}.`
      : `Exercise '${document._id}' could NOT successfully be ${release ? 'released' : 'hidden'}!`;
  },
});
