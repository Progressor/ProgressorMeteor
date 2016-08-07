//http://docs.meteor.com/#/full/accounts_api
AccountsTemplates.configure({ //https://github.com/meteor-useraccounts/core/blob/master/Guide.md
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
  redirectTimeout: 4000

  // onLogoutHook: myLogoutFunc,
  // onSubmitHook: mySubmitFunc,
  // preSignUpHook: myPreSubmitFunc,
  // postSignUpHook: myPostSubmitFunc
});
