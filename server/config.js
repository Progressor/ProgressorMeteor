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
    let mailUrl = 'smtp://';
    if (config.smtp.user) {
      mailUrl += encodeURIComponent(config.smtp.user);
      if (config.smtp.password) {
        mailUrl += `:${encodeURIComponent(config.smtp.password)}`;
      }
    }
    if (config.smtp.server) {
      if (config.smtp.user) {
        mailUrl += '@';
      }
      mailUrl += encodeURIComponent(config.smtp.server);
    }
    if (config.smtp.port) {
      mailUrl += `:${config.smtp.port}`;
    }
    process.env.MAIL_URL = mailUrl;
    console.log(mailUrl);

    if (config.smtp.address) {
      Accounts.emailTemplates.from = `Progressor <${config.smtp.address}>`;
    }

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
