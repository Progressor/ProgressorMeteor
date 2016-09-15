module.exports = {
  servers: {
    one: {
      host: '<meteor-host>',
      username: '<meteor-user>',
      password: '<meteor-password>'
    }
  },
  meteor: {
    name: 'progressor',
    path: '..',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: '<meteor-url>',
      MONGO_URL: '<mongo-url>'
    },
    dockerImage: 'abernix/meteord:base',
    deployCheckWaitTime: 60
  },
  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {}
    },
  },
};
