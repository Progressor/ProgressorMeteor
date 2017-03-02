Npm.depends({ thrift: '0.10.0' }); // https://www.npmjs.com/package/thrift

Package.describe({
  name: 'thrift',
  version: '0.10.0',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.addFiles('lib/executor_types.js', 'server');
  api.addFiles('ExecutorService.js', 'server');

  api.export('thrift', 'server');
  api.export('ttypes', 'server');
  api.export('Executor', 'server');
});
