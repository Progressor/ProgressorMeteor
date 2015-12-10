var executorConnection = null;

Meteor.methods(
	{
		executeFragment: function (fragment) {
			check(fragment, String);

			var function1 = new ttypes.FunctionSignature();
			function1.name = 'simplyReturn';
			function1.inputNames = [ 'bool' ];
			function1.outputNames = [ 'return' ];
			function1.inputTypes = function1.outputTypes = [ ttypes.TypeBoolean ];

			var case1 = new ttypes.TestCase();
			case1.functionName = 'simplyReturn';
			case1.expectedOutputValues = case1.inputValues = [ 'true' ];

			var case2 = new ttypes.TestCase();
			case2.functionName = 'simplyReturn';
			case2.expectedOutputValues = case2.inputValues = [ 'false' ];

			if (executorConnection === null)
				executorConnection = thrift.createConnection('localhost', 9090);
			var client = thrift.createClient(Executor, executorConnection);
			return {
				blacklist: Meteor.wrapAsync(client.getBlacklist, client)('java'),
				defaultFragment: Meteor.wrapAsync(client.getFragment, client)('java', [ function1 ]),
				results: Meteor.wrapAsync(client.execute, client)('java', fragment, [ function1 ], [ case1, case2 ])
			};
		}
	});
