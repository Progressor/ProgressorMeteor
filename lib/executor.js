(function () {
	'use strict';

	const decimalPrefixes = {
		1e10: 'T',
		1e9: 'G',
		1e6: 'M',
		1e3: 'k',
		1: '',
		1e-3: 'm',
		1e-6: 'µ',
		1e-9: 'n'
	};

	function formatSeconds(seconds) {
		let prefix = _.chain(decimalPrefixes).keys().filter(p => p < seconds).max().value();
		return `${seconds / prefix} ${decimalPrefixes[prefix]}s`;
	}

	_.extend(Progressor, {
		getExerciseStatus: (e, r)=> Progressor.isExerciseEvaluated(e, r) ? Progressor.isExerciseSuccess(e, r) ? 1 : -1 : 0,
		isExerciseEvaluated: (e, r) => r && r.length,
		isExerciseSuccess: (e, r) => r && r.length && _.every(r, i => i.success),
		isExerciseFailure: (e, r) => r && r.length && _.some(r, i => !i.success),
		isExerciseFatal: (e, r) => r && r.length && _.some(r, i => i.fatal),

		getVisibleResults: (e, r) => e.testCases ? _.chain(r).zip(e.testCases).filter(([r, t]) => t.visible).map(([r]) => r).value() : r,

		hasInvisibleTestCases: e => e.testCases && _.some(e.testCases, c => !c.visible),
		isInvisibleSuccess: (e, r) => _.chain(e.testCases).filter(c => !c.visible).every(c => Progressor.isTestCaseSuccess(e, c, r)).value(),
		getVisibleTestCases: e => e.testCases ? _.filter(e.testCases, c => c.visible) : null,

		getResultStatus: (e, i, r) => i >= 0 && r && r[i] ? r[i].success ? 1 : r[i].fatal ? -2 : -1 : 0,
		isResultEvaluated: (e, i, r) => Progressor.getResultStatus(e, i, r) !== 0,
		isResultSuccess: (e, i, r) => Progressor.getResultStatus(e, i, r) > 0,
		isResultFailure: (e, i, r) => Progressor.getResultStatus(e, i, r) < 0,
		isResultFatal: (e, i, r) => Progressor.getResultStatus(e, i, r) < -1,

		getTestCaseIndex(exercise, testCase) {
			let index = -1;
			_.find(exercise.testCases, (c, i) => (index = _.isEqual(c, testCase) ? i : index) >= 0);
			return index;
		},
		getTestCaseStatus: (e, c, r) => Progressor.getResultStatus(e, Progressor.getTestCaseIndex(e, c), r),
		isTestCaseEvaluated: (e, c, r) => Progressor.getTestCaseStatus(e, c, r) !== 0,
		isTestCaseSuccess: (e, c, r) => Progressor.getTestCaseStatus(e, c, r) > 0,
		isTestCaseFailure: (e, c, r) => Progressor.getTestCaseStatus(e, c, r) < 0,
		isTestCaseFatal: (e, c, r) => Progressor.getTestCaseStatus(e, c, r) < -1,

		getTestCaseSignature: (e, c) => `${c.functionName}(${c.inputValues.join(', ')})`,
		getExpectedTestCaseOutput: (e, c) => c.expectedOutputValues.length == 1 ? c.expectedOutputValues : c.expectedOutputValues.join(', '),
		getActualTestCaseOutput(exercise, testCase, results) {
			const result = results ? results[Progressor.getTestCaseIndex(exercise, testCase)] : null;
			return result && result.success ? i18n('exercise.testCase.success') : result ? result.result : i18n('form.notAvailable');
		},
		getTestCaseExecutionTime(exercise, testCase, results) {
			const result = results ? results[Progressor.getTestCaseIndex(exercise, testCase)] : null;
			return result && result.performance ? formatSeconds(result.performance.testCaseExecutionTimeMilliseconds / 1e3) : i18n('form.notAvailable');
		}
	});

})();
