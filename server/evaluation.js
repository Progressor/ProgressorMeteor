// evaluation of programming exercises: see .\executor.js
Meteor.methods({
  /**
   * Creates a result log entry when an exercise is opened.
   * @param exercise {{_id: string}} exercise to create log entry for
   */
  openedExercise(exercise) {
    check(exercise, Match.ObjectIncluding({ _id: String }));

    exercise = Progressor.exercises.findOne({ _id: exercise._id });

    if (this.userId) {
      const query = { user_id: this.userId, exercise_id: exercise._id };
      const result = Progressor.results.findOne(query);

      const now = new Date();
      if (!result || !Progressor.getNewestResultLog(result.log, Progressor.RESULT_LOG_OPENED_TYPE)) {
        Progressor.results.upsert(result ? result._id : null, {
          $set: _.extend(query, { exercise: _.omit(exercise, '_id') /* , solved: now */ }),
          $push: { log: { $each: [{ type: Progressor.RESULT_LOG_OPENED_TYPE, timestamp: now }] } },
        });
      }
    }
  },

  /**
   * Creates a result log entry when the user starts to solve an exercise.
   * @param exercise {{_id: string}} exercise to create log entry for
   */
  startedExercise(exercise) {
    check(exercise, Match.ObjectIncluding({ _id: String }));

    exercise = Progressor.exercises.findOne({ _id: exercise._id });

    if (this.userId) {
      const query = { user_id: this.userId, exercise_id: exercise._id };
      const result = Progressor.results.findOne(query);

      const now = new Date();
      if (!result || !result.started || !Progressor.getNewestResultLog(result.log, Progressor.RESULT_LOG_STARTED_TYPE)) {
        Progressor.results.upsert(result ? result._id : null, {
          $set: _.extend(query, { started: now }),
          $push: { log: { $each: [{ type: Progressor.RESULT_LOG_STARTED_TYPE, timestamp: now }] } },
        });
      }
    }
  },

  /**
   * Creates a result progress update log entry.
   * @param exercise {{_id: string}} exercise to create log entry for
   * @param update {{activities: number}}
   */
  updateExerciseProgress(exercise, update) {
    check(exercise, Match.ObjectIncluding({ _id: String }));
    check(update, Match.ObjectIncluding({
      activities: Match.Integer,
      difference: Match.Optional(Match.Integer)
    }));

    if (this.userId && (update.activities || update.difference)) {
      const query = { user_id: this.userId, exercise_id: exercise._id };
      const result = Progressor.results.findOne(query);
      const lastLog = Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_PROGRESS_UPDATE_TYPE)
                      || Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_STARTED_TYPE)
                      || Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_OPENED_TYPE);

      const now = new Date();
      const logUpdate = _.extend({ type: Progressor.RESULT_LOG_PROGRESS_UPDATE_TYPE, timestamp: now }, update);
      if (lastLog) {
        logUpdate.intervalSeconds = (now.getTime() - lastLog.timestamp.getTime()) / 1e3;
      }

      Progressor.results.upsert(result ? result._id : null, {
        $set: query,
        $push: { log: { $each: [logUpdate] } },
      });
    }
  },

  /**
   * Evaluates a multiple choice exercise.
   * @param exercise {{_id: string}|{options: {options: *[][], solutions: number[]}}} exercise to evaluate
   * @param checkedOptions {number[]} the indices of the checked options
   * @returns {{success: boolean, checked: boolean}[]}
   */
  evaluateMultipleChoice(exercise, checkedOptions) {
    check(exercise, Match.OneOf(
      Match.ObjectIncluding({ _id: String }),
      Match.ObjectIncluding({
        options: [Match.ObjectIncluding({ options: [Match.Any] })],
        solution: [Match.Integer],
      })),
    );
    check(checkedOptions, [Match.Integer]);

    if (exercise._id) {
      exercise = Progressor.exercises.findOne({ _id: exercise._id });
    }

    const execution = Progressor.executions.findOne({ _id: exercise.execution_id });
    if (execution && (!execution.startTime || execution.startTime > new Date() || new Date(execution.startTime.getTime() + execution.durationMinutes * 60 * 1000) < new Date())) {
      throw new Meteor.Error('document-locked', i18n.forUser('error.locked.message', this.userId));
    }

    let results = _.map(exercise.options[0].options, (o, i) => ({
      success: _.contains(exercise.solution, i) === _.contains(checkedOptions, i),
      checked: _.contains(checkedOptions, i),
    }));

    if (exercise._id && this.userId) {
      const query = { user_id: this.userId, exercise_id: exercise._id };
      const result = Progressor.results.findOne(query);
      const lastLog = Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_EVALUATED_TYPE)
                      || Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_STARTED_TYPE)
                      || Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_OPENED_TYPE);

      const now = new Date();
      const updateFields = _.extend(query, { exercise: _.omit(exercise, '_id'), results, solved: now });
      const logEntries = [];
      const logEvaluated = {
        type: Progressor.RESULT_LOG_EVALUATED_TYPE,
        timestamp: now,
        success: Progressor.isExerciseSuccess(exercise, results),
        successPercentage: Progressor.getExerciseSuccessPercentage(exercise, results),
      };
      if (lastLog) {
        logEvaluated.intervalSeconds = (now.getTime() - lastLog.timestamp.getTime()) / 1e3;
      }
      logEntries.push(logEvaluated);

      if (Progressor.isExerciseSuccess(exercise, results)) {
        if (!result || !result.completed) {
          updateFields.completed = now;
        }
        if (!result || !Progressor.getNewestResultLog(result.log, Progressor.RESULT_LOG_COMPLETED_TYPE)) {
          logEntries.push({ type: Progressor.RESULT_LOG_COMPLETED_TYPE, timestamp: now });
        }
      }

      Progressor.results.upsert(result ? result._id : null, {
        $set: updateFields,
        $push: { log: { $each: logEntries } },
      });
    }

    if (exercise.execution_id) {
      results = _.map(results, r => _.omit(r, 'success'));
    }

    return results;
  },

  /**
   * Evaluates a free text exercise.
   * @param exercise {{_id: string}|{options: {options: *[][], solutions: number[]}}} exercise to evaluate
   * @param answer {string} the answer entered by the user
   * @returns {{success: boolean}[]}
   */
  evaluateFreeText(exercise, answer) {
    check(exercise, Match.OneOf(
      Match.ObjectIncluding({ _id: String }),
      Match.ObjectIncluding({
        pattern: String,
        solution: [String],
      })),
    );
    check(answer, String);

    if (exercise._id) {
      exercise = Progressor.exercises.findOne({ _id: exercise._id });
    }

    const execution = Progressor.executions.findOne({ _id: exercise.execution_id });
    if (execution && (!execution.startTime || execution.startTime > new Date() || new Date(execution.startTime.getTime() + execution.durationMinutes * 60 * 1000) < new Date())) {
      throw new Meteor.Error('document-locked', i18n.forUser('error.locked.message', this.userId));
    }

    let results = [];
    if (exercise.pattern && exercise.solution) {
      results.push({ success: _.contains(exercise.solution, answer) });
    }

    if (exercise._id && this.userId) {
      const query = { user_id: this.userId, exercise_id: exercise._id };
      const result = Progressor.results.findOne(query);
      const lastLog = Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_EVALUATED_TYPE)
                      || Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_STARTED_TYPE)
                      || Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_OPENED_TYPE);

      const now = new Date();
      const updateFields = _.extend(query, { exercise: _.omit(exercise, '_id'), answer, results, solved: now });
      const logEntries = [];
      const logEvaluated = {
        type: Progressor.RESULT_LOG_EVALUATED_TYPE,
        timestamp: now,
        success: Progressor.isExerciseSuccess(exercise, results),
        successPercentage: Progressor.getExerciseSuccessPercentage(exercise, results),
      };
      if (lastLog) logEvaluated.intervalSeconds = (now.getTime() - lastLog.timestamp.getTime()) / 1e3;
      if (result && result.answer) logEvaluated.difference = answer.length - result.answer.length;
      logEntries.push(logEvaluated);

      if (Progressor.isExerciseSuccess(exercise, results)) {
        if (!result || !result.completed) {
          updateFields.completed = now;
        }
        if (!result || !Progressor.getNewestResultLog(result.log, Progressor.RESULT_LOG_COMPLETED_TYPE)) {
          logEntries.push({ type: Progressor.RESULT_LOG_COMPLETED_TYPE, timestamp: now });
        }
      }

      Progressor.results.upsert(result ? result._id : null, {
        $set: updateFields,
        $push: { log: { $each: logEntries } },
      });
    }

    if (exercise.execution_id) {
      results = _.map(results, r => _.omit(r, 'success'));
    }

    return results;
  }
});
