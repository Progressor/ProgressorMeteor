(function () {
	'use strict';

	/*
	 * MAIN TEMPLATE
	 */

	Template.exerciseRelease.onRendered(function () {
		$('#collapseReleased').on('show.bs.collapse hide.bs.collapse', event => $(event.currentTarget).siblings().find('.glyphicon').toggleClass('glyphicon-plus-sign glyphicon-minus-sign'));
	});

	/*
	 * SUB-TEMPLATE EXERCISE LIST
	 */

	function toggleReleaseExercise(release) {
		return function () {
			const exercise = Progressor.exercises.findOne({ _id: this._id });
			if (release)
				_.extend(exercise.released, { confirmed: new Date(), confirmor_id: Meteor.userId() });
			else
				exercise.released = _.omit(exercise.released, 'confirmed', 'confirmor_id');
			Meteor.call('saveExercise', exercise, Progressor.handleError());
		};
	}

	Template.exerciseRelease_exerciseList.helpers(
		{
			userName: Progressor.getUserName
		});

	Template.exerciseRelease_exerciseList.events(
		{
			'click .a-release': toggleReleaseExercise(true),
			'click .a-unrelease': toggleReleaseExercise(false)
		});

})();
