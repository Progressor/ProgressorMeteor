(function () {
	'use strict';

	//http://docs.meteor.com/#/full/accounts_api

	AccountsTemplates.configure(
		{ //https://github.com/meteor-useraccounts/core/blob/master/Guide.md
			confirmPassword: true,
			enablePasswordChange: true,
			enforceEmailVerification: true,
			forbidClientAccountCreation: false,
			overrideLoginErrors: true,
			sendVerificationEmail: true,
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
			redirectTimeout: 4000,

			// onLogoutHook: myLogoutFunc,
			// onSubmitHook: mySubmitFunc,
			// preSignUpHook: myPreSubmitFunc,
			// postSignUpHook: myPostSubmitFunc
		});

	Accounts.emailTemplates.siteName = "Progressor - The Programming Professor";
	// Accounts.emailTemplates.enrollAccount.subject = function (user) {
	// 	return "Welcome to Awesome Town, " + user.profile.name;
	// };
	// Accounts.emailTemplates.enrollAccount.text = function (user, url) {
	// 	return "You have been selected to participate in building a better future!"
	// 				 + " To activate your account, simply click the link below:\n\n"
	// 				 + url;
	// };

})();
