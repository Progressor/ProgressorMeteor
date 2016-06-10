(function () {
	'use strict';

	const executors = Progressor.getConfiguration().executors;
	let executorIndex = 0;

	function connectExecutor() {

		//const instance = Random.choice(executors); //random
		const instance = executors[executorIndex = ++executorIndex % executors.length]; //round-robin
		const connection = thrift.createConnection(instance.host, instance.port);
		const client = thrift.createClient(Executor, connection);
		return { connection, client };
	}

	Meteor.methods(
		{
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
						{ types: [ttypes.TypeContainerArray, ttypes.TypeContainerList, ttypes.TypeContainerSet], values: ['-1,0,1,2', 'strut1,touwm1,weidj1'] },
						{ types: [ttypes.TypeContainerMap], values: ['strut1:Thomas Strub,touwm1:Marc Touw,weidj1:Janick Weidmann'] }
					]
				};
			},
			getBlacklist(language) {
				check(language, String);

				this.unblock();

				const { connection, client } = connectExecutor();
				const blacklist = Meteor.wrapAsync(client.getBlacklist, client)(language);
				connection.end();

				return blacklist;
			},
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

				this.unblock();

				if (exercise._id)
					exercise = Progressor.exercises.findOne({ _id: exercise._id });

				const functions = _.map(exercise.functions, f => new ttypes.FunctionSignature(f));

				const { connection, client } = connectExecutor();
				const fragment = Meteor.wrapAsync(client.getFragment, client)(language, functions);
				connection.end();

				return fragment;
			},
			execute(language, exercise, fragment, showInvisible = false) {
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
				check(showInvisible, Boolean);

				this.unblock();

				if (exercise._id)
					exercise = Progressor.exercises.findOne({ _id: exercise._id });

				const functions = _.map(exercise.functions, f => new ttypes.FunctionSignature(f)),
					testCases = _.map(exercise.testCases, c => new ttypes.TestCase(c));

				const { connection, client } = connectExecutor();
				const results = Meteor.wrapAsync(client.execute, client)(language, fragment, functions, testCases);
				connection.end();

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
					if (result && result.fragment) logEvaluated.lengthDifference = fragment.length - result.fragment.length;
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

				if (Progressor.hasInvisibleTestCases(exercise) && (!showInvisible || exercise._id && exercise.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN)))
					return _.flatten([Progressor.getVisibleResults(exercise, results), { invisible: true, success: Progressor.isInvisibleSuccess(exercise, results) }]);
				else
					return results;
			}
		});

})();
