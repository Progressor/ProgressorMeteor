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
			'click .glyphicon-folder-close'(ev) {
				let exercise = Progressor.exercises.findOne({ _id: $(ev.currentTarget).attr('archive-button') });
				exercise.archived = true;
				Meteor.call('saveExercise', exercise);
			},
			'click .glyphicon-repeat'(ev) {
				let exercise = Progressor.exercises.findOne({ _id: $(ev.currentTarget).attr('revert-button') });
				exercise.archived = false;
				Meteor.call('saveExercise', exercise);
			},
			'click #userDat-save'() {
				let firstName = $('#input-firstName').val(), $fname = $('#input-firstName').css('opacity', 0.333);
				let lastName = $('#input-lastName').val(), $lname = $('#input-lastName').css('opacity', 0.333);
				Meteor.users.update(Meteor.userId(), { $set: { "profile.firstname": firstName, "profile.lastname": lastName } });
				setTimeout(function() {
					$fname.css('opacity', 1);
					$lname.css('opacity', 1);
				}, 500);
			}
		});

})();
