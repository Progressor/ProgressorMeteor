(function () {
	'use strict';

	if (Meteor.isServer) { //http://docs.meteor.com/#/full/accounts_emailtemplates
		Accounts.emailTemplates.siteName = "Progressor - The Programming Professor";
		// Accounts.emailTemplates.enrollAccount.subject = u => "Welcome to Awesome Town, " + u.profile.name;
		// Accounts.emailTemplates.enrollAccount.text = (u, l) => "You have been selected to participate in building a better future! To activate your account, simply click the link below:\n\n" + l;
	}

	Accounts.onCreateUser(function (options, user) {
		if (options.profile)
			user.profile = options.profile;
		if (!Roles.getUsersInRole(Progressor.ROLE_ADMIN).length) {
			//Roles.addUsersToRoles(user._id, Progressor.ROLE_ADMIN);
			user.roles = [Progressor.ROLE_ADMIN];
			Houston._admins.insert({ user_id: user._id });
		}
		return user;
	});

})();
