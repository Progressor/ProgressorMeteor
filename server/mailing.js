/*
 * email template framework: http://foundation.zurb.com/emails.html
 * Tool to create inlined HTML: http://foundation.zurb.com/emails/inliner-v2.html
 * Documentation: http://foundation.zurb.com/emails/docs/css-guide.html
 *
 * Further references:
 * - http://kb.mailchimp.com/campaigns/ways-to-build/about-html-email
 * - https://css-tricks.com/using-css-in-html-emails-the-real-story/
 * - https://www.campaignmonitor.com/css/
 */

const templates = {
  releaseNotifier: 'templates/release-notifier/dist/template.html',
  verifyEmail: 'templates/verify-email/dist/template.html',
  resetPassword: 'templates/reset-password/dist/template.html',
};

_.each(templates, (f, n) => SSR.compileTemplate(n, Assets.getText(f)));

function i18nForUser(callback) {
  return function i18nSetup(user, ...rest) {
    i18n.setLanguage(i18n.getLanguageForUser(user));
    const result = callback.call(this, user, ...rest);
    i18n.setLanguage(i18n.getDefaultLanguage());
    return result;
  };
}

/*
 * EXERCISE RELEASE REQUEST NOTIFIER
 */

function releaseNotifierPlainText(user, exercises) {
  let plainText = `----------------------------------------------------------\n${i18n('layout.title')} - ${i18n('layout.explanation')}\n----------------------------------------------------------\n`;
  plainText += `${i18n('email.releaseNotifier.title')}\n\n${i18n('email.releaseNotifier.intro', Progressor.getUserName(user, true) || Progressor.getUserEmail(user), '', '')}\nhttp://localhost:3000/exercise/release\n\n`;
  _.each(exercises, exercise => {
    plainText += (`${i18n('exercise.nameLabel')}: ${i18n.getName(exercise)}\n${i18n('exercise.programmingLanguageLabel')}: ${i18n.getProgrammingLanguage(exercise.programmingLanguage)}\n${i18n('form.createdByLabel')}: ${Progressor.getUserName(user, true) || Progressor.getUserEmail(user)}\n${i18n('exercise.releaseRequestedAtLabel')}: ${i18n.formatDate(exercise.released.requested, 'L LT')}\n\n`);
  });
  plainText += `${i18n('email.greeting')}\n`;
  plainText += `${i18n('email.footer')}`;
  return plainText;
}

_.extend(Progressor, {

  /**
   * Sends an exercise release notification email to all administrators.
   */
  sendReleaseNotification() {
    const selector = {
      'released.requested': { $exists: true },
      'released.confirmed': { $exists: false },
      'released.notified': { $exists: false },
    };
    const requestedExercises = Progressor.exercises.find(selector).fetch();
    if (requestedExercises.length) {
      Meteor.users.find({ roles: Progressor.ROLE_ADMIN })
        .forEach(i18nForUser(user => {
          Email.send({
            from: Accounts.emailTemplates.from,
            to: Progressor.getUserEmail(user),
            subject: i18n('email.releaseNotifier.subject'),
            text: releaseNotifierPlainText(user, requestedExercises),
            html: SSR.render('releaseNotifier', {
              address: Progressor.getUserName(user, true) || Progressor.getUserEmail(user),
              requestedExercises,
            }),
          });
        }));

      _.each(requestedExercises, exercise => Progressor.exercises.update(
        { _id: exercise._id },
        { $set: { 'released.notified': new Date() } }
      ));
    }
  },
});

/*
 * VERIFY EMAIL
 */

function verifyEmailPlainText(user, verifyURL) {
  let plainText = `----------------------------------------------------------\n${i18n('layout.title')} - ${i18n('layout.explanation')}\n----------------------------------------------------------\n`;
  plainText += `${i18n('email.verifyEmail.title')}\n\n${i18n('email.verifyEmail.intro', Progressor.getUserName(user, true) || Progressor.getUserEmail(user), '', '')}\n${verifyURL}\n\n`;
  plainText += `${i18n('email.verifyEmail.info', '', '')}\n\n${i18n('email.verifyEmail.motivation')}\n\n`;
  plainText += `${i18n('email.greeting')}\n`;
  plainText += `${i18n('email.footer')}`;
  return plainText;
}

Accounts.emailTemplates.verifyEmail = {
  subject: i18nForUser(() => i18n('email.verifyEmail.subject')),
  text: i18nForUser((user, url) => verifyEmailPlainText(user, url)),
  html: i18nForUser((user, url) => SSR.render('verifyEmail', {
    address: Progressor.getUserName(user, true) || Progressor.getUserEmail(user),
    verifyURL: url,
  })),
};

/*
 * RESET PASSWORD
 */

function resetPasswordPlainText(user, resetpwdURL) {
  let plainText = `----------------------------------------------------------\n${i18n('layout.title')} - ${i18n('layout.explanation')}\n----------------------------------------------------------\n`;
  plainText += `${i18n('email.resetPassword.title')}\n\n${i18n('email.resetPassword.intro', Progressor.getUserName(user, true) || Progressor.getUserEmail(user))}\n${resetpwdURL}\n\n`;
  plainText += `${i18n('email.greeting')}\n`;
  plainText += `${i18n('email.footer')}`;
  return plainText;
}

Accounts.emailTemplates.resetPassword = {
  subject: i18nForUser(() => i18n('email.resetPassword.subject')),
  text: i18nForUser((user, url) => resetPasswordPlainText(user, url)),
  html: i18nForUser((user, url) => SSR.render('resetPassword', {
    address: Progressor.getUserName(user, true) || Progressor.getUserEmail(user),
    resetpwdURL: url,
  })),
};
