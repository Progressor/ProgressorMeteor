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
			solvedComplete: (e, r) => Progressor.isExecutionSuccess(e, r),
			i18nProgrammingLanguage: i18n.getProgrammingLanguage,
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			i18nDateTime: d => i18n.formatDate(d, 'L LT')
		});

	Template.account.events(
		{
			'click #button-logout': () => Meteor.logout(),
			'click #button-logout-others': () => Meteor.logoutOtherClients(),
			'click [data-archive-id]': ev => Meteor.call('saveExercise', _.extend(Progressor.exercises.findOne({ _id: $(ev.currentTarget).data('archive-id') }), { archived: true })),
			'click [data-unarchive-id]': ev => Meteor.call('saveExercise', _.omit(Progressor.exercises.findOne({ _id: $(ev.currentTarget).data('unarchive-id') }), 'archived')),
			'change #input-name' (ev) {
				let $this = $(ev.currentTarget), $group = $this.closest('.form-group');
				Meteor.users.update(Meteor.userId(), { $set: { 'profile.name': $this.val() } }, function (err) {
					$group.addClass(!err ? 'has-success' : 'has-error');
					Meteor.setTimeout(() => $group.removeClass('has-success has-error'), 500);
				});
			}
		});

})();
