(function () {
	'use strict';

	Accounts.onEmailVerificationLink((token, done) => {
		Accounts.verifyEmail(token, error => {
			if (!error) {
				Progressor.showAlert(i18n('account.verificationSuccessMessage'), 'success');
				done();
			} else
				Progressor.showAlert(i18n('account.verificationErrorMessage'), 'danger');
		});
	});

	Accounts.onResetPasswordLink((token, done) => {
		Session.set('onResetPasswordLink_arguments', { token, done });
		Meteor.defer(() => {
			AccountsTemplates.setState('resetPwd');
			Router.go('account');
		});
	});

})();
