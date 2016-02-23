(function () {
	'use strict';

	var executorConnection = null;

	function getExecutorClient() {

		if (executorConnection === null)
			executorConnection = thrift.createConnection('localhost', 9090);
		return thrift.createClient(Executor, executorConnection);
	}

	Meteor.methods(
		{
			getExecutorTypes() {
				return {
					types: [
						{ _id: ttypes.TypeString, label: ttypes.TypeString, parameterCount: 0 },
						{ _id: ttypes.TypeCharacter, label: ttypes.TypeCharacter, parameterCount: 0 },
						{ _id: ttypes.TypeBoolean, label: ttypes.TypeBoolean, parameterCount: 0 },
						{ _id: ttypes.TypeByte, label: ttypes.TypeByte, parameterCount: 0 },
						{ _id: ttypes.TypeShort, label: ttypes.TypeShort, parameterCount: 0 },
						{ _id: ttypes.TypeInteger, label: ttypes.TypeInteger, parameterCount: 0 },
						{ _id: ttypes.TypeLong, label: ttypes.TypeLong, parameterCount: 0 },
						{ _id: ttypes.TypeSingle, label: ttypes.TypeSingle, parameterCount: 0 },
						{ _id: ttypes.TypeDouble, label: ttypes.TypeDouble, parameterCount: 0 },
						{ _id: ttypes.TypeDecimal, label: ttypes.TypeDecimal, parameterCount: 0 },
						{ _id: ttypes.TypeContainerArray, label: `${ttypes.TypeContainerArray}<T>`, parameterCount: 1 },
						{ _id: ttypes.TypeContainerList, label: `${ttypes.TypeContainerList}<T>`, parameterCount: 1 },
						{ _id: ttypes.TypeContainerSet, label: `${ttypes.TypeContainerSet}<T>`, parameterCount: 1 },
						{ _id: ttypes.TypeContainerMap, label: `${ttypes.TypeContainerMap}<K, V>`, parameterCount: 2 }
					],
					values: [
						{ types: [ttypes.TypeString], values: ['Progressor', 'Bern University of Applied Sciences'] },
						{ types: [ttypes.TypeCharacter], values: ['p', 'P', '<'] },
						{ types: [ttypes.TypeBoolean], values: ['true', 'false'] },
						{ types: [ttypes.TypeByte, ttypes.TypeShort, ttypes.TypeInteger, ttypes.TypeLong], values: [-25, 0, 1, new Date().getYear()] },
						{ types: [ttypes.TypeSingle, ttypes.TypeDouble, ttypes.TypeDecimal], values: [-3.141592653, 0, 1, 3.141592653] },
						{ types: [ttypes.TypeContainerArray, ttypes.TypeContainerList, ttypes.TypeContainerSet], values: ['-1,0,1,2', 'strut1,touwm1,weidj1'] },
						{ types: [ttypes.TypeContainerMap], values: ['strut1:Thomas Strub,touwm1:Marc Touw,weidj1:Janick Weidmann'] }
					]
				};
			},
			getBlacklist(language) {
				check(language, String);

				var client = getExecutorClient();
				return Meteor.wrapAsync(client.getBlacklist, client)(language);
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

				var functions = _.map(exercise.functions, (fun) => new ttypes.FunctionSignature(fun));

				var client = getExecutorClient();
				return Meteor.wrapAsync(client.getFragment, client)(language, functions);
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

				var functions = _.map(exercise.functions, fun => new ttypes.FunctionSignature(fun)),
					testCases = _.map(exercise.testCases, cas => new ttypes.TestCase(cas));

				var client = getExecutorClient();
				var results = Meteor.wrapAsync(client.execute, client)(language, fragment, functions, testCases);

				if (this.userId) {
					var qry = { user_id: this.userId, exercise_id: exercise._id };
					var del = Progressor.results.findOne(qry);
					Progressor.results.upsert(del ? del._id : null, _.extend(qry, { exercise: _.omit(exercise, '_id', 'category'), fragment: fragment, results: results, solved: new Date() }));
				}

				return results;
			}
		});

})();
