///////////////////
// MAIN TEMPLATE //
///////////////////

Template.exerciseRelease.onRendered(function () {
  this.$('.panel-collapse').on('show.bs.collapse hide.bs.collapse', e => $(e.currentTarget).siblings().find('.glyphicon-collapse-up, .glyphicon-collapse-down').toggleClass('glyphicon-collapse-up glyphicon-collapse-down'));
});

////////////////////////////////
// SUB-TEMPLATE EXERCISE LIST //
////////////////////////////////

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

Template.exerciseRelease_listPanel.helpers({
  randomId: () => Random.id()
});

Template.exerciseRelease_listPanel.events({
  'click .a-release': toggleReleaseExercise(true),
  'click .a-unrelease': toggleReleaseExercise(false)
});
