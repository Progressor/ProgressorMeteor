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
								})
						]
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
								})
						]
					}));
				check(fragment, String);

				var functions = _.map(exercise.functions, (fun) => new ttypes.FunctionSignature(fun)),
					testCases = _.map(exercise.testCases, (cas) => new ttypes.TestCase(cas));

				var client = getExecutorClient();
				return Meteor.wrapAsync(client.execute, client)(language, fragment, functions, testCases);
			}
		});

})();
