Npm.depends({ thrift: '0.9.3' }); // https://www.npmjs.com/package/thrift

Package.describe(
	{
		name: 'thrift',
		version: '0.9.3',
		documentation: 'README.md'
	});

Package.onUse(function (api) {

	//api.versionsFrom('1.2.0.2');
	//api.use('ecmascript');

	api.addFiles('lib/executor_types.js', 'server');
	api.addFiles('ExecutorService.js', 'server');

	api.export('thrift', 'server');
	api.export('ttypes', 'server');
	api.export('Executor', 'server');
});
