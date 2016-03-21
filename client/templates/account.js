(function () {
	'use strict';

	$('[data-toggle="tooltip"]').tooltip();

	Template.account.helpers(
		{
			currentUserEmail: () => Progressor.getUserEmail(Meteor.user()),
			currentUserFirstName: () => Progressor.getUserFirstName(Meteor.user()),
			currentUserLastName: () => Progressor.getUserLastName(Meteor.user()),
			userName: Progressor.getUserEmail,
			solvedComplete: (e, r) => Progressor.isExecutionSuccess(e, r),
			i18nCategoryName: i18n.getName,
			i18nExerciseName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			i18nDateTime: d => i18n.formatDate(d, 'L LT')
		});

	Template.account.events(
		{
			'click #button-logout': () => Meteor.logout(),
			'click #button-logout-others': () => Meteor.logoutOtherClients(),
			'click .button-archive'(ev) {
				let exercise = Progressor.exercises.findOne({ _id: $(ev.currentTarget).attr('data-button') });
				exercise.archived = true;
				Meteor.call('saveExercise', exercise);
			},
			'click .glyphicon-repeat'(ev) {
				let exercise = Progressor.exercises.findOne({ _id: $(ev.currentTarget).attr('revert-button') });
				exercise.archived = false;
				Meteor.call('saveExercise', exercise);
			},
			'click #userDat-save'() {
				let firstName = $('#input-firstName').val();
				let lastName = $('#input-lastName').val();

				Meteor.users.update( Meteor.userId(), { $set: { "profile.firstname": firstName, "profile.lastname": lastName }  });
				
			}
		});

})();
