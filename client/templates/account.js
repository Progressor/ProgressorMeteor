(function () {
	'use strict';

	/*
	 * MAIN TEMPLATE
	 */

	function tmpl() {
		return Template.instance();
	}

	Template.account.onCreated(function () {
		this.userValues = [];
	});

	Template.account.onRendered(function () {
		this.$('#collapseArchive').on('show.bs.collapse hide.bs.collapse', event => $(event.currentTarget).siblings().find('.glyphicon').toggleClass('glyphicon-plus-sign glyphicon-minus-sign'));
		Meteor.typeahead.inject();
	});

	Template.account.helpers(
		{
			currentUserEmail: () => Progressor.getUserEmail(Meteor.user()),
			currentUserName: () => Progressor.getUserName(Meteor.user(), true),
			transformResults: r => _.map(r, i => _.extend({ result: _.omit(i, 'exercise') }, i.exercise)),
			users: () => _.map(Meteor.users.find({ roles: { $ne: Progressor.ROLE_ADMIN } }).fetch(), user => {
				const value = [Progressor.getUserName(user, true), Progressor.getUserEmail(user)].join(' ');
				tmpl().userValues[value] = user;
				return { value: value, name: Progressor.getUserName(user, true), email: Progressor.getUserEmail(user) };
			})
		});

	Template.account.events(
		{
			'click #button-logout': () => Meteor.logout(),
			'click #button-logout-others': () => Meteor.logoutOtherClients(),
			'change #input-name'(event) {
				const $this = $(event.currentTarget), $group = $this.closest('.form-group');
				Meteor.users.update(Meteor.userId(), { $set: { 'profile.name': $this.val() } }, error => {
					$group.addClass(!error ? 'has-success' : 'has-error');
					Meteor.setTimeout(() => $group.removeClass('has-success has-error'), 500);
				});
			},
			'click #button-make-admin'(event, template) {
				const $input = template.$('#input-make-admin'), $group = $input.closest('.form-group'), user = template.userValues[$input.val()];
				if (user)
					Meteor.call('toggleUsersRoles', [user._id], [Progressor.ROLE_ADMIN], true, Progressor.handleError(error => {
						$group.addClass(!error ? 'has-success' : 'has-error');
						Meteor.setTimeout(() => {
							$group.removeClass('has-success has-error');
							$input.val(null);
						}, 500);
					}));
				else
					Progressor.showAlert(i18n('form.noSelectionMessage'));
			},
			'click #at-btn'(event, template) {
				if (AccountsTemplates.getState() === 'resetPwd') {
					event.preventDefault();
					let newPassword = template.$('#at-field-password').val(), confirmPassword = template.$('#at-field-password_again').val();
					if (newPassword && newPassword == confirmPassword) {
						let { token, done } = Session.get('onResetPasswordLink_arguments');
						Accounts.resetPassword(token, newPassword, error => {
							if (!error) {
								Progressor.showAlert(i18n('account.passwordResetSuccessMessage'), 'success');
								done();
								Session.set('onResetPasswordLink_arguments', undefined);
							} else
								Progressor.showAlert(i18n('account.passwordResetErrorMessage'), 'danger');
						});
					} else
						Progressor.showAlert(i18n('account.passwordMismatchMessage'));
				}
			}
		});

	/*
	 * SUB-TEMPLATE EXERCISE LIST
	 */

	function toggleArchiveExercise(archive) {
		return function () {
			Meteor.call('toggleArchiveExercise', { _id: this._id }, archive, Progressor.handleError());
		};
	}

	Template.account_exerciseList.helpers(
		{
			evaluated: (e, r) => Progressor.isExerciseEvaluated(e, r),
			success: (e, r) => Progressor.isExerciseSuccess(e, r)
		});

	Template.account_exerciseList.events(
		{
			'click .a-archive': toggleArchiveExercise(true),
			'click .a-unarchive': toggleArchiveExercise(false)
		});

})();
