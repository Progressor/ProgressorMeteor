(function () {
	'use strict';

	_.extend(Progressor, {
		getTestCaseSignature(exercise, testCase) {
			return `${testCase.functionName}(${testCase.inputValues.join(', ')})`;
		},
		getExpectedTestCaseOutput(exercise, testCase) {
			return testCase.expectedOutputValues.length == 1 ? testCase.expectedOutputValues : testCase.expectedOutputValues.join(', ');
		},
		isSuccess(exercise, testCase, results) {
			var index = -1;
			_.find(exercise.testCases, (cas, idx) => (index = _.isEqual(cas, testCase) ? idx : index) >= 0);
			return index >= 0 && results && results[index] && results[index].success;
		},
		getActualTestCaseOutput(exercise, testCase, results) {
			var index = -1;
			_.find(exercise.testCases, (cas, idx) => (index = _.isEqual(cas, testCase) ? idx : index) >= 0);
			var result = index >= 0 && results ? results[index] : null;
			return result && result.success ? i18n('exercise.testCase.success') : result ? result.result : i18n('exercise.testCase.missing');
		}
	});

})();
