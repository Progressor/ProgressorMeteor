if (Meteor.isClient) {
	Session.setDefault('result', 'waiting for input...');

	Template.exec.helpers(
		{
			result: function () {
				return Session.get('result');
			}
		});

	Template.exec.events(
		{
			'click button': function () {
				Meteor.call('exec',
										$('[name=frag]').val(),
										function (err, res) {
											Session.set('result', err ? 'error' : JSON.stringify(res));
										});
			}
		});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
	});

	Meteor.methods(
		{
			exec: function (frag) {
				check(frag, String);

				var case1 = new ttypes.TestCase();
				case1.functionName = 'simplyReturn';
				case1.outputTypes = case1.inputTypes = [ ttypes.TypeBoolean ];
				case1.expectedOutputValues = case1.inputValues = [ 'true' ];

				var case2 = new ttypes.TestCase();
				case2.functionName = 'simplyReturn';
				case2.outputTypes = case2.inputTypes = [ ttypes.TypeBoolean ];
				case2.expectedOutputValues = case2.inputValues = [ 'false' ];

				var client = thrift.createClient(Executor, thrift.createConnection('localhost', 9090));
				return Meteor.wrapAsync(client.execute, client)('java', frag, [ case1, case2 ]);
			}
		});
}
