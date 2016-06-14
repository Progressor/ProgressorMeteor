(function () {
	'use strict';

	///////////////////
	// MAIN TEMPLATE //
	///////////////////

	function tmpl() {
		return Template.instance();
	}

	// template variables //

	Template.account.onCreated(function () {
		this.userValues = [];
	});

	Template.account.onRendered(function () {

		// collapsible panels //

		this.$('.panel-collapse').on('show.bs.collapse hide.bs.collapse', e => $(e.currentTarget).siblings().find('.glyphicon').toggleClass('glyphicon-collapse-up glyphicon-collapse-down'));

		// user autocomplete //

		Meteor.typeahead.inject();
	});

	Template.account.helpers(
		{

			// account helpers //

			currentUserEmail: () => Progressor.getUserEmail(Meteor.user()),
			currentUserName: () => Progressor.getUserName(Meteor.user(), true),
			results(){
				return _.map(this.results, r => _.extend({ isExercise: true, isResult: true, result: _.omit(r, 'exercise') }, r.exercise));
			},
			createdExercises(){
				return _.map(this.createdExercises, e => _.extend({ isExercise: true }, e));
			},
			createdExaminations(){
				return _.map(this.createdExaminations, e => _.extend({ isExamination: true }, e));
			},
			createdExecutions(){
				return _.map(this.createdExecutions, e => _.extend({ isExamination: true, isExecution: true }, e));
			},
			archive(){
				return _.chain(_.map(this.archivedExercises, e => _.extend({ isArchive: true, isExercise: true }, e)))
					.union(_.map(this.archivedExaminations, e => _.extend({ isArchive: true, isExamination: true }, e)),
								 _.map(this.archivedExecutions, e => _.extend({ isArchive: true, isExamination: true, isExecution: true }, e)))
					.sortBy(d => d.lastEdited).value().reverse();
			},

			// user search helpers //

			users: () => _.map(Meteor.users.find({ roles: { $ne: Progressor.ROLE_ADMIN } }).fetch(), user => {
				const value = [Progressor.getUserName(user, true), Progressor.getUserEmail(user)].join(' ');
				tmpl().userValues[value] = user;
				return { value: value, name: Progressor.getUserName(user, true), email: Progressor.getUserEmail(user) };
			})
		});

	Template.account.events(
		{

			// account management events //

			'click #at-btn'(event, template) { //inject custom messaging into accounts UI
				if (AccountsTemplates.getState() === 'resetPwd') {
					event.preventDefault();
					let newPassword = template.$('#at-field-password').val(), confirmPassword = template.$('#at-field-password_again').val();
					if (newPassword && newPassword === confirmPassword) {
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
			},
			'click #button-logout': () => Meteor.logout(),
			'click #button-logout-others': () => Meteor.logoutOtherClients(),

			// account settings events //

			'change #input-name'(event) {
				const $this = $(event.currentTarget), $group = $this.closest('.form-group');
				Meteor.users.update(Meteor.userId(), { $set: { 'profile.name': $this.val() } }, error => {
					$group.addClass(!error ? 'has-success' : 'has-error');
					Meteor.setTimeout(() => $group.removeClass('has-success has-error'), 500);
				});
			},

			// admin authorisation events //

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
			}
		});

	////////////////////////////////
	// SUB-TEMPLATE EXERCISE LIST //
	////////////////////////////////

	function toggleArchiveExercise(archive) {
		return function () {
			Meteor.call(this.isExercise ? 'toggleArchiveExercise' : !this.isExecution ? 'toggleArchiveExamination' : 'toggleArchiveExecution',
									{ _id: this._id }, archive, Progressor.handleError());
		};
	}

	Template.account_listPanel.helpers(
		{
			randomId: () => Random.id(),
			evaluated() {
				return Progressor.isExerciseEvaluated(this, this.result.results);
			},
			success() {
				return Progressor.isExerciseSuccess(this, this.result.results);
			}
		});

	Template.account_listPanel.events(
		{
			'click .a-archive': toggleArchiveExercise(true),
			'click .a-unarchive': toggleArchiveExercise(false)
		});

})();
