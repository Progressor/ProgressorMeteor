const decimalPrefixes = {
  1e10: 'T',
  1e9: 'G',
  1e6: 'M',
  1e3: 'k',
  1: '',
  1e-3: 'm',
  1e-6: 'µ',
  1e-9: 'n',
};

const logTypes = {
  opened: 'Opened',
  started: 'Started',
  evaluated: 'Evaluated',
  completed: 'Completed',
  progressUpdate: 'ProgressUpdate',
};

function formatSeconds(seconds) {
  const prefix = _.chain(decimalPrefixes).keys().filter(p => p < seconds).max().value();
  return `${seconds / prefix} ${decimalPrefixes[prefix]}s`;
}

_.extend(Progressor, {

  /**
   * Gets the name of the 'opened' log type.
   * @returns {string}
   */
  get RESULT_LOG_OPENED_TYPE() {
    return logTypes.opened;
  },

  /**
   * Gets the name of the 'started' log type.
   * @returns {string}
   */
  get RESULT_LOG_STARTED_TYPE() {
    return logTypes.started;
  },

  /**
   * Gets the name of the 'evaluated' log type.
   * @returns {string}
   */
  get RESULT_LOG_EVALUATED_TYPE() {
    return logTypes.evaluated;
  },

  /**
   * Gets the name of the 'completed' log type.
   * @returns {string}
   */
  get RESULT_LOG_COMPLETED_TYPE() {
    return logTypes.completed;
  },

  /**
   * Gets the name of the 'progress update' log type.
   * @returns {string}
   */
  get RESULT_LOG_PROGRESS_UPDATE_TYPE() {
    return logTypes.progressUpdate;
  },

  /**
   * Gets the interval between two progress updates (in milliseconds).
   * @returns {number}
   */
  get RESULT_LOG_PROGRESS_UPDATE_INTERVAL() {
    return 5 * 1000;
  },

  /** Gets the oldest result log of a particular type. */
  getOldestResultLog: (log, ...types) => log && log.length ? _.chain(log).filter(l => _.contains(types, l.type)).sortBy(l => l.timestamp).first().value() : null,

  /** Gets the newest result log of a particular type. */
  getNewestResultLog: (log, ...types) => log && log.length ? _.chain(log).filter(l => _.contains(types, l.type)).sortBy(l => l.timestamp).last().value() : null,

  /** Gets the status of an exercise. (-2: fatal exception, -1: failed, 0: not evaluated, 1: success) */
  getExerciseStatus: (exercise, results) => Progressor.isExerciseFatal(exercise, results) ? -2 : Progressor.isExerciseEvaluated(exercise, results) ? Progressor.isExerciseSuccess(exercise, results) ? 1 : -1 : 0,

  /** Determines whether an exercise has been evaluated. */
  isExerciseEvaluated: (exercise, results) => results && results.length,

  /** Determines whether an exercise has been solved successfully. */
  isExerciseSuccess: (exercise, results) => results && results.length && _.every(results, i => i.success),

  /** Determines whether an exercise has NOT been solved successfully. */
  isExerciseFailure: (exercise, results) => results && results.length && _.some(results, i => !i.success),

  /** Determines whether a fatal exception occurred when solving an exercise. */
  isExerciseFatal: (exercise, results) => results && results.length && _.some(results, i => i.fatal),

  /** Calculates the success percentage of an exercise solution. (0 = unsolved / completely wrong, 1 = fully solved) */
  getExerciseSuccessPercentage: (exercise, results) => results && results.length ? _.filter(results, i => i.success).length / results.length : 0,

  /** Tests if there are any invisible test cases in an exercise. */
  hasInvisibleTestCases: exercise => exercise.testCases && _.some(exercise.testCases, c => !c.visible),

  /** Tests if the invisible test cases executed successfully. */
  isInvisibleSuccess: (exercise, results) => _.chain(exercise.testCases).filter(c => !c.visible).every(c => Progressor.isTestCaseSuccess(exercise, c, results)).value(),

  /** Gets only the visible test cases for a specific exercise. */
  getVisibleTestCases: exercise => exercise.testCases ? _.filter(exercise.testCases, c => c.visible) : null,

  /** Gets only the visible results for a specific exercise. */
  getVisibleResults: (exercise, results) => exercise.testCases ? _.chain(exercise.testCases).zip(results || []).filter(([t]) => t.visible).map(([t, s]) => s || {}).value() : results,

  /** Gets the status of a specific result. (-2: fatal exception, -1: failed, 0: not evaluated, 1: success) */
  getResultStatus: (exercise, resultIndex, results) => resultIndex >= 0 && results && results[resultIndex] ? results[resultIndex].success ? 1 : results[resultIndex].fatal ? -2 : -1 : 0,

  /** Determines whether a specific result exists. */
  isResultEvaluated: (exercise, resultIndex, results) => Progressor.getResultStatus(exercise, resultIndex, results) !== 0,

  /** Determines whether a result is a success. */
  isResultSuccess: (exercise, resultIndex, results) => Progressor.getResultStatus(exercise, resultIndex, results) > 0,

  /** Determines whether a result is a failure. */
  isResultFailure: (exercise, resultIndex, results) => Progressor.getResultStatus(exercise, resultIndex, results) < 0,

  /** Determines whether a result is a fatal failure. */
  isResultFatal: (exercise, resultIndex, results) => Progressor.getResultStatus(exercise, resultIndex, results) < -1,

  /** Gets the index of a test case. */
  getTestCaseIndex(exercise, testCase) {
    let index = -1;
    _.find(exercise.testCases, (c, i) => (index = _.isEqual(c, testCase) ? i : index) >= 0);
    return index;
  },

  /** Gets the status of a specific test case. (-2: fatal exception, -1: failed, 0: not evaluated, 1: success) */
  getTestCaseStatus: (exercise, testCase, results) => Progressor.getResultStatus(exercise, Progressor.getTestCaseIndex(exercise, testCase), results),

  /** Determines whether a specific test case has been evalutated. */
  isTestCaseEvaluated: (exercise, testCase, results) => Progressor.getTestCaseStatus(exercise, testCase, results) !== 0,

  /** Determines whether a test case has passed success. */
  isTestCaseSuccess: (exercise, testCase, results) => Progressor.getTestCaseStatus(exercise, testCase, results) > 0,

  /** Determines whether a test case failed. */
  isTestCaseFailure: (exercise, testCase, results) => Progressor.getTestCaseStatus(exercise, testCase, results) < 0,

  /** Determines whether a test case failed fatally. */
  isTestCaseFatal: (exercise, testCase, results) => Progressor.getTestCaseStatus(exercise, testCase, results) < -1,

  /** Generates the signature string representing test case. */
  getTestCaseSignature: (exercise, testCase) => `${testCase.functionName}(${testCase.inputValues.join(', ')})`,

  /** Generates the string representing the expected output values of a function. */
  getExpectedTestCaseOutput: (exercise, testCase) => testCase.expectedOutputValues.join(', '),

  /** Generates the string representing the actual output of a test case. */
  getActualTestCaseOutput(exercise, testCase, results) {
    const result = results ? results[Progressor.getTestCaseIndex(exercise, testCase)] : null;
    return result && result.success ? i18n('exercise.testCase.success') : result ? result.result : i18n('form.notAvailable');
  },

  /** Generates the string representing the time taken to execute a test case. */
  getTestCaseExecutionTime(exercise, testCase, results) {
    const result = results ? results[Progressor.getTestCaseIndex(exercise, testCase)] : null;
    return result && result.performance ? formatSeconds(result.performance.testCaseExecutionTimeMilliseconds / 1e3) : i18n('form.notAvailable');
  },
});
