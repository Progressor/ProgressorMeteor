(function () {
	'use strict';

	_.extend(Progressor, {
		getVisibleTestCases: e => _.filter(e.testCases, c => c.visible),
		hasInvisibleTestCases: e => _.any(e.testCases, c => !c.visible),
		getTestCaseSignature: (e, c) => `${c.functionName}(${c.inputValues.join(', ')})`,
		getExpectedTestCaseOutput: (e, c) => c.expectedOutputValues.length == 1 ? c.expectedOutputValues : c.expectedOutputValues.join(', '),
		getActualTestCaseOutput(exercise, testCase, results) {
			let index = -1;
			_.find(exercise.testCases, (c, i) => (index = _.isEqual(c, testCase) ? i : index) >= 0);
			const result = index >= 0 && results ? results[index] : null;
			return result && result.success ? i18n('exercise.testCase.success') : result ? result.result : i18n('exercise.testCase.missing');
		},
		getTestCaseStatus(exercise, testCase, results) {
			let index = -1;
			_.find(exercise.testCases, (c, i) => (index = _.isEqual(c, testCase) ? i : index) >= 0);
			return Progressor.getResultStatus(exercise, index, results);
		},
		getResultStatus: (e, i, r) => i >= 0 && r && r[i] ? r[i].success ? 1 : r[i].fatal ? -2 : -1 : 0,
		getExerciseStatus: (e, r)=> Progressor.isExerciseEvaluated(e, r) ? Progressor.isExerciseSuccess(e, r) ? 1 : -1 : 0,
		isTestCaseEvaluated: (e, c, r) => Progressor.getTestCaseStatus(e, c, r) !== 0,
		isTestCaseSuccess: (e, c, r) => Progressor.getTestCaseStatus(e, c, r) > 0,
		isTestCaseFailure: (e, c, r) => Progressor.getTestCaseStatus(e, c, r) < 0,
		isTestCaseFatal: (e, c, r) => Progressor.getTestCaseStatus(e, c, r) < -1,
		isResultEvaluated: (e, i, r) => Progressor.getResultStatus(e, i, r) !== 0,
		isResultSuccess: (e, i, r) => Progressor.getResultStatus(e, i, r) > 0,
		isResultFailure: (e, i, r) => Progressor.getResultStatus(e, i, r) < 0,
		isExerciseEvaluated: (e, r) => r && r.length,
		isExerciseSuccess: (e, r) => r && r.length && _.all(r, i => i.success),
		isExerciseFailure: (e, r) => r && r.length && _.all(r, i => !i.success),
		isExerciseFatal: (e, r) => r && r.length && _.any(r, i => i.fatal),
		isInvisibleSuccess: (e, r) => _.chain(e.testCases).filter(c => !c.visible).all(c => Progressor.isTestCaseSuccess(e, c, r)).value(),
		getVisibleResults: (e, r) => _.chain(r).zip(e.testCase).filter(z => z[1].visibility).map(z => z[0]).value()
	});

})();
