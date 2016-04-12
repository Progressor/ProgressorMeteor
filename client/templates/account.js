(function () {
	'use strict';

	Template.account.onRendered(function () {
		//$('body').tooltip({ selector: '[data-toggle="tooltip"]' });
		$('#collapseArchive').on('show.bs.collapse hide.bs.collapse', ev => $(ev.currentTarget).siblings().find('.glyphicon').toggleClass('glyphicon-plus-sign glyphicon-minus-sign'));
	});

	Template.account.helpers(
		{
			currentUserEmail: () => Progressor.getUserEmail(Meteor.user()),
			currentUserName: () => Progressor.getUserName(Meteor.user(), true),
			userName: Progressor.getUserName,
			solvedComplete: (e, r) => Progressor.isExecutionSuccess(e, r)
		});

	Template.account.events(
		{
			'click #button-logout': () => Meteor.logout(),
			'click #button-logout-others': () => Meteor.logoutOtherClients(),
			'click [data-archive-id]': ev => Meteor.call('toggleArchiveExercise', { _id: $(ev.currentTarget).data('archive-id') }, true, Progressor.handleError()),
			'click [data-unarchive-id]': ev => Meteor.call('toggleArchiveExercise', { _id: $(ev.currentTarget).data('unarchive-id') }, false, Progressor.handleError()),
			'change #input-name' (ev) {
				const $this = $(ev.currentTarget), $group = $this.closest('.form-group');
				Meteor.users.update(Meteor.userId(), { $set: { 'profile.name': $this.val() } }, function (err) {
					$group.addClass(!err ? 'has-success' : 'has-error');
					Meteor.setTimeout(() => $group.removeClass('has-success has-error'), 500);
				});
			}
		});

})();
