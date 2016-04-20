(function () {
	'use strict';

	//http://docs.meteor.com/#/full/accounts_emailtemplates
	Accounts.emailTemplates.siteName = "Progressor - The Programming Professor";
	// Accounts.emailTemplates.enrollAccount.subject = u => "Welcome to Awesome Town, " + u.profile.name;
	// Accounts.emailTemplates.enrollAccount.text = (u, l) => "You have been selected to participate in building a better future! To activate your account, simply click the link below:\n\n" + l;

	Meteor.methods(
		{
			toggleUsersRoles(users, roles, isInRole) {
				check(users, [String]);
				check(roles, [String]);
				check(isInRole, Boolean);

				const user = Meteor.user();
				if (!Roles.userIsInRole(user, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', user));

				Roles[isInRole ? 'addUsersToRoles' : 'removeUsersFromRoles'](users, roles);
				if (_.contains(roles, Progressor.ROLE_ADMIN))
					_.each(users, u => Houston._admins[isInRole ? 'insert' : 'remove']({ user_id: u }));
			}
		});

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