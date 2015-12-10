var executorConnection = null;

Meteor.methods(
	{
		executeFragment: function (fragment) {
			check(fragment, String);

			var case1 = new ttypes.TestCase();
			case1.functionName = 'simplyReturn';
			case1.outputTypes = case1.inputTypes = [ ttypes.TypeBoolean ];
			case1.expectedOutputValues = case1.inputValues = [ 'true' ];

			var case2 = new ttypes.TestCase();
			case2.functionName = 'simplyReturn';
			case2.outputTypes = case2.inputTypes = [ ttypes.TypeBoolean ];
			case2.expectedOutputValues = case2.inputValues = [ 'false' ];

			if (executorConnection === null)
				executorConnection = thrift.createConnection('localhost', 9090);
			var client = thrift.createClient(Executor, executorConnection);
			return {
				blacklist: Meteor.wrapAsync(client.getBlacklist, client)('java'),
				defaultFragment: Meteor.wrapAsync(client.getFragment, client)('java', [ case1, case2 ]),
				results: Meteor.wrapAsync(client.execute, client)('java', fragment, [ case1, case2 ])
			};
		}
	});
