(function () {
	'use strict';

	/*
	 * MAIN TEMPLATE
	 */

	Template.account.onRendered(() => $('#collapseArchive').on('show.bs.collapse hide.bs.collapse', ev => $(ev.currentTarget).siblings().find('.glyphicon').toggleClass('glyphicon-plus-sign glyphicon-minus-sign')));

	Template.account.helpers(
		{
			currentUserEmail: () => Progressor.getUserEmail(Meteor.user()),
			currentUserName: () => Progressor.getUserName(Meteor.user(), true),
			transformResults: r => _.map(r, i => _.extend({ result: _.omit(i, 'exercise') }, i.exercise))
		});

	Template.account.events(
		{
			'click #button-logout': () => Meteor.logout(),
			'click #button-logout-others': () => Meteor.logoutOtherClients(),
			'change #input-name' (ev) {
				const $this = $(ev.currentTarget), $group = $this.closest('.form-group');
				Meteor.users.update(Meteor.userId(), { $set: { 'profile.name': $this.val() } }, function (err) {
					$group.addClass(!err ? 'has-success' : 'has-error');
					Meteor.setTimeout(() => $group.removeClass('has-success has-error'), 500);
				});
			}
		});

	/*
	 * SUB-TEMPLATE EXERCISE LIST
	 */

	function toggleArchiveExercise(archive) {
		return ev => Meteor.call('toggleArchiveExercise', { _id: $(ev.currentTarget).closest('tr').data('id') }, archive, Progressor.handleError());
	}

	Template.account_exerciseList.helpers(
		{
			userName: Progressor.getUserName,
			evaluated: (e, r) => Progressor.isExerciseEvaluated(e, r),
			success: (e, r) => Progressor.isExerciseSuccess(e, r)
		});

	Template.account_exerciseList.events(
		{
			'click .a-archive': toggleArchiveExercise(true),
			'click .a-unarchive': toggleArchiveExercise(false)
		});

})();
