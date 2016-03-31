(function () {
	'use strict';

	const executorInstances = [
		{ host: 'localhost', port: 9090 }
	];

	let executorConnections, executorIndex = 0;

	function getExecutorClient() {

		if (!executorConnections)
			executorConnections = _.map(executorInstances, i => thrift.createConnection(i.host, i.port));

		//return thrift.createClient(Executor, Random.choice(executorConnections)); //Random
		return thrift.createClient(Executor, executorConnections[executorIndex = ++executorIndex % executorConnections.length]); //round-robin
	}

	Meteor.methods(
		{
			getExecutorTypes() {
				let rexInt = '[-+]?[0-9]+', rexFlt = '[-+]?[0-9]+(\\.[0-9]+)?([eE][-+]?[0-9]+)?';
				let rexSep = ',\\s?', rexKVS = ':\\s?';
				return {
					types: [
						{ _id: ttypes.TypeString, label: ttypes.TypeString, parameterCount: 0, pattern: '.*' },
						{ _id: ttypes.TypeCharacter, label: ttypes.TypeCharacter, parameterCount: 0, pattern: '.{1,1}' }, //cannot use single dot, non-greedy operator will be appended
						{ _id: ttypes.TypeBoolean, label: ttypes.TypeBoolean, parameterCount: 0, pattern: '([tT][rR][uU][eE]|[fF][aA][lL][sS][eE])' }, //true or false (case insensitive)
						{ _id: ttypes.TypeInt8, label: ttypes.TypeInt8, parameterCount: 0, pattern: rexInt, max: 127 },
						{ _id: ttypes.TypeInt16, label: ttypes.TypeInt16, parameterCount: 0, pattern: rexInt, max: 32767 },
						{ _id: ttypes.TypeInt32, label: ttypes.TypeInt32, parameterCount: 0, pattern: rexInt, max: 2147483647 },
						{ _id: ttypes.TypeInt64, label: ttypes.TypeInt64, parameterCount: 0, pattern: rexInt, max: 9223372036854775807 }, //will round to 9223372036854776000
						{ _id: ttypes.TypeFloat32, label: ttypes.TypeFloat32, parameterCount: 0, pattern: rexFlt, max: 3.402823E+38 },
						{ _id: ttypes.TypeFloat64, label: ttypes.TypeFloat64, parameterCount: 0, pattern: rexFlt, max: Number.MAX_VALUE },
						{ _id: ttypes.TypeDecimal, label: ttypes.TypeDecimal, parameterCount: 0, pattern: rexFlt },
						{ _id: ttypes.TypeContainerArray, label: `${ttypes.TypeContainerArray}<T>`, parameterCount: 1, patternSeparator: rexSep },
						{ _id: ttypes.TypeContainerList, label: `${ttypes.TypeContainerList}<T>`, parameterCount: 1, patternSeparator: rexSep },
						{ _id: ttypes.TypeContainerSet, label: `${ttypes.TypeContainerSet}<T>`, parameterCount: 1, patternSeparator: rexSep },
						{ _id: ttypes.TypeContainerMap, label: `${ttypes.TypeContainerMap}<K, V>`, parameterCount: 2, patternSeparator: rexSep, patternInternalSeparators: [rexKVS] }
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

				return getExecutorClient().getBlacklist(language);
			},
			getFragment(language, exercise) {
				check(language, String);
				check(exercise, Match.ObjectIncluding(
					{
						functions: [
							Match.ObjectIncluding(
								{
									name: String,
									inputNames: [String],
									inputTypes: [String],
									outputNames: [String],
									outputTypes: [String]
								})]
					}));

				this.unblock();

				let functions = _.map(exercise.functions, f => new ttypes.FunctionSignature(f));
				return getExecutorClient().getFragment(language, functions);
			},
			execute(language, exercise, fragment) {
				check(language, String);
				check(exercise, Match.ObjectIncluding(
					{
						functions: [
							Match.ObjectIncluding(
								{
									name: String,
									inputNames: [String],
									inputTypes: [String],
									outputNames: [String],
									outputTypes: [String]
								})],
						testCases: [
							Match.ObjectIncluding(
								{
									functionName: String,
									inputValues: [String],
									expectedOutputValues: [String]
								})]
					}));
				check(fragment, String);

				this.unblock();

				let functions = _.map(exercise.functions, f => new ttypes.FunctionSignature(f)),
					testCases = _.map(exercise.testCases, c => new ttypes.TestCase(c));

				let client = getExecutorClient(), results = Meteor.wrapAsync(client.execute, client)(language, fragment, functions, testCases);

				if (exercise._id && this.userId) {
					let qry = { user_id: this.userId, exercise_id: exercise._id };
					let del = Progressor.results.findOne(qry);
					Progressor.results.upsert(del ? del._id : null, _.extend(qry, { exercise: _.omit(exercise, '_id', 'category'), fragment: fragment, results: results, solved: new Date() }));
				}

				//let pubResults = Progressor.getVisibleResults(exercise, results);
				//if (Progressor.hasInvisibleTestCases(exercise))
				//	pubResults.push({ invisible: true, success: Progressor.isInvisibleSuccess(exercise, results) });

				return results;
			}
		});

})();
