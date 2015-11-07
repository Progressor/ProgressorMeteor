/*
 * generate NodeJS code as described in executor project
 *
 * copy the file ExecutorService.js to .\packages\thrift
 * and file executor_types.js to .\packages\thrift\lib
 * this forces Meteor to load the types before the service
 *
 * replace all `require(...)` calls by `Npm.require(...)`
 * Npm-calls are encapsulated in Meteor
 *
 * remove the keyword `var` for the declarations `var thrift = ...`, `var Thrift = ...` and `var Q = ...` in executor_types.js
 * remove the keyword `var` for the declaration `var ttypes = ...` in executor_types.js
 * replace `module.exports` by `ttypes` in executor_types.js
 *
 * remove the declarations `var thrift = ...`, `var Thrift = ...`, `var Q = ...` and `var ttypes = ...` in ExecutorService.js
 * add a declaration `Executor = {}` in ExecutorService.js before any code
 * replace `exports` by `Executor` in ExecutorService.js
 *
 * all of these changes allow the variables to be accessible outside the Meteor package
 */

Npm.depends({ thrift: '0.9.3' }); // https://www.npmjs.com/package/thrift

Package.describe(
	{
		name: 'thrift',
		version: '0.9.3',
		documentation: null
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
