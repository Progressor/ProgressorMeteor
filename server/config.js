const config = _.extend({}, (() => {
  try {
    return JSON.parse(Assets.getText('config.json'));
  } catch (ex) {
    return null;
  }
})(), (() => {
  try {
    return JSON.parse(Assets.getText('secret.json'));
  } catch (ex) {
    return null;
  }
})());

_.extend(Progressor, {
  /**
   * Gets the configuration file's merged content.
   * @return {{}}
   */
  getConfiguration() {
    return config;
  },
});

Meteor.startup(() => {
  if (config.kadira) {
    Kadira.connect(config.kadira.id, config.kadira.secret);
  }

  if (config.smtp) {
    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(config.smtp.user) + ":" + encodeURIComponent(config.smtp.password) + '@' + encodeURIComponent(config.smtp.server) + ':' + config.smtp.port;
    Accounts.emailTemplates.from = `Progressor <${config.smtp.address}>`;
    Accounts.emailTemplates.siteName = `${i18n('layout.title')} - ${i18n('layout.explanation')}`;
  }

  if (config.releaseNotifier && config.smtp) { // https://github.com/percolatestudio/meteor-synced-cron / http://bunkat.github.io/later/parsers.html#text
    SyncedCron.add({
      name: 'exercise release request notifier',
      schedule: p => p.text(config.releaseNotifier.schedule),
      job: Progressor.sendReleaseNotification,
    });
    SyncedCron.start();
  }
});
