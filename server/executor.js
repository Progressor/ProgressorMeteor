(function () {
	'use strict';

	const executors = Progressor.getConfiguration().executors;
	let executorIndex = 0;

	function invokeExecutor(functionName, ...argumentValues) {

		this.unblock();

		//const instance = Random.choice(executors); //random
		const instance = executors[executorIndex = ++executorIndex % executors.length]; //round-robin

		try {
			const Future = Npm.require('fibers/future');
			const future = new Future();

			const connection = thrift.createConnection(instance.host, instance.port);
			connection.on('error', error => future.throw(error));

			const client = thrift.createClient(Executor, connection);

			try {
				client[functionName](...argumentValues, (error, result) => error ? future.throw(error) : future.return(result));
				return future.wait();

			} finally {
				connection.end();
			}

		} catch (ex) {
			throw new Meteor.Error(`executor-${ex.errno}`, ex.code, String(ex));
		}
	}

	Meteor.methods(
		{
			/**
			 * Gets the data types the executor supports. Result includes example values for the types.
			 * @returns {{types: {_id: string, label: string, parameterCount: number, pattern: string, max: number}[], values: {types: string[], values: *[]}[]}}
			 */
			getExecutorTypes() {
				const integerPattern = '[-+]?[0-9]+', floatingPointPattern = '[-+]?[0-9]+(\\.[0-9]+)?([eE][-+]?[0-9]+)?';
				return {
					types: [
						{ _id: ttypes.TypeString, label: ttypes.TypeString, parameterCount: 0, pattern: '.*' },
						{ _id: ttypes.TypeCharacter, label: ttypes.TypeCharacter, parameterCount: 0, pattern: '.{1,1}' }, //cannot use single dot, non-greedy operator will be appended
						{ _id: ttypes.TypeBoolean, label: ttypes.TypeBoolean, parameterCount: 0, pattern: '([tT][rR][uU][eE]|[fF][aA][lL][sS][eE])' }, //true or false (case insensitive)
						{ _id: ttypes.TypeInt8, label: ttypes.TypeInt8, parameterCount: 0, pattern: integerPattern, max: 127 },
						{ _id: ttypes.TypeInt16, label: ttypes.TypeInt16, parameterCount: 0, pattern: integerPattern, max: 32767 },
						{ _id: ttypes.TypeInt32, label: ttypes.TypeInt32, parameterCount: 0, pattern: integerPattern, max: 2147483647 },
						{ _id: ttypes.TypeInt64, label: ttypes.TypeInt64, parameterCount: 0, pattern: integerPattern, max: 9223372036854775807 }, //will round to 9223372036854776000
						{ _id: ttypes.TypeFloat32, label: ttypes.TypeFloat32, parameterCount: 0, pattern: floatingPointPattern, max: 3.402823E+38 },
						{ _id: ttypes.TypeFloat64, label: ttypes.TypeFloat64, parameterCount: 0, pattern: floatingPointPattern, max: Number.MAX_VALUE },
						{ _id: ttypes.TypeDecimal, label: ttypes.TypeDecimal, parameterCount: 0, pattern: floatingPointPattern },
						{ _id: ttypes.TypeContainerArray, label: `${ttypes.TypeContainerArray}<T>`, parameterCount: 1 },
						{ _id: ttypes.TypeContainerList, label: `${ttypes.TypeContainerList}<T>`, parameterCount: 1 },
						{ _id: ttypes.TypeContainerSet, label: `${ttypes.TypeContainerSet}<T>`, parameterCount: 1 },
						{ _id: ttypes.TypeContainerMap, label: `${ttypes.TypeContainerMap}<K, V>`, parameterCount: 2 }
					],
					values: [
						{ types: [ttypes.TypeString], values: ['Progressor', 'Bern University of Applied Sciences'] },
						{ types: [ttypes.TypeCharacter], values: ['p', 'P', '<'] },
						{ types: [ttypes.TypeBoolean], values: ['true', 'false'] },
						{ types: [ttypes.TypeInt8, ttypes.TypeInt16, ttypes.TypeInt32, ttypes.TypeInt64], values: [-25, 0, 1, new Date().getYear()] },
						{ types: [ttypes.TypeFloat32, ttypes.TypeFloat64, ttypes.TypeDecimal], values: [-3.141592653, 2, 3.141592653, 5.27e-9] },
						{ types: [ttypes.TypeContainerArray, ttypes.TypeContainerList, ttypes.TypeContainerSet], values: ['{-1,0,1,2}', '{strut1,touwm1,weidj1}'] },
						{ types: [ttypes.TypeContainerMap], values: ['{strut1:Thomas Strub,touwm1:Marc Touw,weidj1:Janick Weidmann}'] }
					]
				};
			},

			/**
			 * Fetches the Executor's version information for a specific programming language.
			 * @param language {string} identifier of programming language to get version information for
			 * @returns {{languageVersion: string, compilerName: string, compilerVersion: string, platformName: string, platformVersion: string, platformArchitecture: string}}
			 */
			getVersionInformation(language) {
				check(language, String);

				return invokeExecutor.call(this, 'getVersionInformation', language);
			},

			/**
			 * Fetches the blacklist for a specific programming language from the Executor.
			 * @param language {string} identifier of programming language to get version information for
			 * @returns {string[]}
			 */
			getBlacklist(language) {
				check(language, String);

				return invokeExecutor.call(this, 'getBlacklist', language);
			},

			/**
			 * Fetches a generated code fragment for a specific exercise from the Executor.
			 * @param language {string} identifier of programming language to get version information for
			 * @param exercise {{_id: string}|{functions: {name: string, inputNames: string[], inputTypes: string[], outputNames: string[], outputTypes: string[]}[]}} exercise to generate code fragment for
			 * @returns {string}
			 */
			getFragment(language, exercise) {
				check(language, String);
				check(exercise, Match.OneOf(
					Match.ObjectIncluding(
						{
							_id: String
						}),
					Match.ObjectIncluding(
						{
							functions: [Match.ObjectIncluding({ name: String, inputNames: [String], inputTypes: [String], outputNames: [String], outputTypes: [String] })]
						})));

				if (exercise._id)
					exercise = Progressor.exercises.findOne({ _id: exercise._id });

				const functions = _.map(exercise.functions, f => new ttypes.FunctionSignature(f));

				return invokeExecutor.call(this, 'getFragment', language, functions);
			},

			/**
			 * Fetches the programming exercise evaluation from the Executor.
			 * @param language {string} identifier of programming language to get version information for
			 * @param exercise {{_id: string}|{functions: {name: string, inputNames: string[], inputTypes: string[], outputNames: string[], outputTypes: string[]}[], testCases: {functionName: string, inputValues: string[], expectedOutputValues: string[]}[]}} exercise to generate code fragment for
			 * @param fragment {string} code fragment to execute
			 * @param includeInvisible {boolean} whether to include invisible test cases in the results
			 * @returns {{success: boolean, fatal: boolean, result: string, performance: {}}[]}
			 */
			execute(language, exercise, fragment, includeInvisible = false) {
				check(language, String);
				check(exercise, Match.OneOf(
					Match.ObjectIncluding(
						{
							_id: String
						}),
					Match.ObjectIncluding(
						{
							functions: [Match.ObjectIncluding({ name: String, inputNames: [String], inputTypes: [String], outputNames: [String], outputTypes: [String] })],
							testCases: [Match.ObjectIncluding({ functionName: String, inputValues: [String], expectedOutputValues: [String] })]
						})));
				check(fragment, String);
				check(includeInvisible, Boolean);

				if (exercise._id)
					exercise = Progressor.exercises.findOne({ _id: exercise._id });

				const execution = Progressor.executions.findOne({ _id: exercise.execution_id });
				if (execution && (!execution.startTime || execution.startTime > new Date() || new Date(execution.startTime.getTime() + execution.durationMinutes * 60 * 1000) < new Date()))
					throw new Meteor.Error('document-locked', i18n.forUser('error.locked.message', this.userId));

				const functions = _.map(exercise.functions, f => new ttypes.FunctionSignature(f)),
					testCases = _.map(exercise.testCases, c => new ttypes.TestCase(c));

				const results = invokeExecutor.call(this, 'execute', language, fragment, functions, testCases);

				if (exercise._id && this.userId) {
					const query = { user_id: this.userId, exercise_id: exercise._id };
					const result = Progressor.results.findOne(query);
					const lastLog = Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_EVALUATED_TYPE)
													|| Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_STARTED_TYPE)
													|| Progressor.getNewestResultLog(result ? result.log : null, Progressor.RESULT_LOG_OPENED_TYPE);

					const now = new Date();
					const updateFields = _.extend(query, { exercise: _.omit(exercise, '_id'), fragment, results, solved: now });
					const logEntries = [], logEvaluated = {
						type: Progressor.RESULT_LOG_EVALUATED_TYPE, timestamp: now,
						success: Progressor.isExerciseSuccess(exercise, results),
						successPercentage: Progressor.getExerciseSuccessPercentage(exercise, results)
					};
					if (lastLog) logEvaluated.intervalSeconds = (now.getTime() - lastLog.timestamp.getTime()) / 1e3;
					if (result && result.fragment) logEvaluated.difference = fragment.length - result.fragment.length;
					logEntries.push(logEvaluated);

					if (Progressor.isExerciseSuccess(exercise, results)) {
						if (!result || !result.completed) updateFields.completed = now;
						if (!result || !Progressor.getNewestResultLog(result.log, Progressor.RESULT_LOG_COMPLETED_TYPE)) logEntries.push({ type: Progressor.RESULT_LOG_COMPLETED_TYPE, timestamp: now });
					}

					Progressor.results.upsert(result ? result._id : null, {
						$set: updateFields,
						$push: { log: { $each: logEntries } }
					});
				}

				if (Progressor.hasInvisibleTestCases(exercise) && (!includeInvisible || exercise._id && exercise.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)))
					return _.flatten([Progressor.getVisibleResults(exercise, results), { invisible: true, success: Progressor.isInvisibleSuccess(exercise, results) }]);
				else
					return results;
			}
		});

})();
