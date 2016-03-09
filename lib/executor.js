(function () {
	'use strict';

	_.extend(Progressor, {
		getVisibleTestCases(exercise) {
			return _.filter(exercise.testCases, cas => cas.visible)
		},
		hasInvisibleTestCases(exercise) {
			return _.any(exercise.testCases, cas => !cas.visible)
		},
		getTestCaseSignature(exercise, testCase) {
			return `${testCase.functionName}(${testCase.inputValues.join(', ')})`;
		},
		getExpectedTestCaseOutput(exercise, testCase) {
			return testCase.expectedOutputValues.length == 1 ? testCase.expectedOutputValues : testCase.expectedOutputValues.join(', ');
		},
		getActualTestCaseOutput(exercise, testCase, results) {
			var index = -1;
			_.find(exercise.testCases, (cas, idx) => (index = _.isEqual(cas, testCase) ? idx : index) >= 0);
			var result = index >= 0 && results ? results[index] : null;
			return result && result.success ? i18n('exercise.testCase.success') : result ? result.result : i18n('exercise.testCase.missing');
		},
		getTestCaseSuccess(exercise, testCase, results) {
			var index = -1;
			_.find(exercise.testCases, (cas, idx) => (index = _.isEqual(cas, testCase) ? idx : index) >= 0);
			return index >= 0 && results && results[index] ? results[index].success ? 1 : results[index].fatal ? -2 : -1 : 0;
		},
		isTestCaseEvaluated(exercise, testCase, results) {
			return Progressor.getTestCaseSuccess(exercise, testCase, results) != 0;
		},
		isTestCaseSuccess(exercise, testCase, results) {
			return Progressor.getTestCaseSuccess(exercise, testCase, results) > 0;
		},
		isTestCaseFailure(exercise, testCase, results) {
			return Progressor.getTestCaseSuccess(exercise, testCase, results) < 0;
		},
		isTestCaseFatal(exercise, testCase, results) {
			return Progressor.getTestCaseSuccess(exercise, testCase, results) < -1;
		},
		isExerciseEvaluated(exercise, results) {
			return results && results.length;
		},
		isExecutionSuccess(exercise, results) {
			return _.all(results, res => res.success);
		},
		isExecutionFailure(exercise, results) {
			return !Progressor.isExecutionSuccess(exercise, results);
		},
		isExecutionFatal(exercise, results) {
			return _.any(results, res => res.fatal);
		},
		isInvisibleSuccess(exercise, results) {
			return _.chain(exercise.testCases).filter(cas => !cas.visible).all(cas => Progressor.isTestCaseSuccess(exercise, cas, results)).value();
		},
		getVisibleResults(exercise, results) {
			return _.chain(results).zip(exercise.testCase).filter(jnt => jnt[1].visibility).map(jnt => jnt[0]).value();
		}
	});

})();
