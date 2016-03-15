(function () {
	'use strict';

	_.extend(Progressor, {
		hasValidFunctions: e => _.all(e.functions, function (_function) {
			return _function.name
						 && _function.inputNames.length === _function.inputTypes.length && _.all(_function.inputNames) && _.all(_function.inputTypes)
						 && _function.outputNames.length === _function.outputTypes.length && _.all(_function.outputNames) && _.all(_function.outputTypes);
		}),
		getVisibleTestCases: e => _.filter(e.testCases, cas => cas.visible),
		hasInvisibleTestCases: e => _.any(e.testCases, cas => !cas.visible),
		getTestCaseSignature: (e, c) => `${c.functionName}(${c.inputValues.join(', ')})`,
		getExpectedTestCaseOutput: (e, c) => c.expectedOutputValues.length == 1 ? c.expectedOutputValues : c.expectedOutputValues.join(', '),
		getActualTestCaseOutput(exercise, testCase, results) {
			var index = -1;
			_.find(exercise.testCases, (c, i) => (index = _.isEqual(c, testCase) ? i : index) >= 0);
			var result = index >= 0 && results ? results[index] : null;
			return result && result.success ? i18n('exercise.testCase.success') : result ? result.result : i18n('exercise.testCase.missing');
		},
		getTestCaseSuccess(exercise, testCase, results) {
			var index = -1;
			_.find(exercise.testCases, (c, i) => (index = _.isEqual(c, testCase) ? i : index) >= 0);
			return index >= 0 && results && results[index] ? results[index].success ? 1 : results[index].fatal ? -2 : -1 : 0;
		},
		isTestCaseEvaluated: (e, c, r) => Progressor.getTestCaseSuccess(e, c, r) != 0,
		isTestCaseSuccess: (e, c, r) => Progressor.getTestCaseSuccess(e, c, r) > 0,
		isTestCaseFailure: (e, c, r) => Progressor.getTestCaseSuccess(e, c, r) < 0,
		isTestCaseFatal: (e, c, r) => Progressor.getTestCaseSuccess(e, c, r) < -1,
		isExerciseEvaluated: (e, r) => r && r.length,
		isExecutionSuccess: (e, r) => _.all(r, res => res.success),
		isExecutionFailure: (e, r) => !Progressor.isExecutionSuccess(e, r),
		isExecutionFatal: (e, r) => _.any(r, res => res.fatal),
		isInvisibleSuccess: (e, r) => _.chain(e.testCases).filter(cas => !cas.visible).all(cas => Progressor.isTestCaseSuccess(e, cas, r)).value(),
		getVisibleResults: (e, r) => _.chain(r).zip(e.testCase).filter(jnt => jnt[1].visibility).map(jnt => jnt[0]).value()
	});

})();
