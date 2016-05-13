(function () {
	'use strict';

	//http://docs.meteor.com/#/full/accounts_api

	AccountsTemplates.configure(
		{ //https://github.com/meteor-useraccounts/core/blob/master/Guide.md
			confirmPassword: true,
			enablePasswordChange: true,  // --> ToDo
			enforceEmailVerification: true,
			forbidClientAccountCreation: false,
			overrideLoginErrors: true,
			sendVerificationEmail: true, // --> email Tmplate
			lowercaseUsername: false,
			focusFirstInput: true,

			showAddRemoveServices: false,
			showForgotPasswordLink: true,
			showLabels: true,
			showPlaceholders: true,
			showResendVerificationEmailLink: true,

			continuousValidation: true,
			negativeFeedback: true,
			negativeValidation: true,
			positiveValidation: true,
			positiveFeedback: true,
			showValidating: true,

			// privacyUrl: 'privacy',
			// termsUrl: 'terms-of-use',

			homeRoutePath: '/',
			redirectTimeout: 4000

			// onLogoutHook: myLogoutFunc,
			// onSubmitHook: mySubmitFunc,
			// preSignUpHook: myPreSubmitFunc,
			// postSignUpHook: myPostSubmitFunc
		});

	if (Meteor.isClient) {
		Accounts.onEmailVerificationLink(function (token, done) {
			Accounts.verifyEmail(token, (error) => {
				if (!error) {
					Progressor.showAlert(i18n('account.verificationSuccess'), 'success', 10000);
					done();
				} else {
					Progressor.showAlert(i18n('account.verificationError'), 'danger', 10000);
				}
			});
		});
	}

})();

