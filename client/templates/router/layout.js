Template.layout.onCreated(function () {
  this.autorun(() => {
    if (Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN)) {
      Meteor.subscribe('numberOfExercisesToRelease');
    }
  });
});

Template.layout.helpers({
  exerciseCreateQuery: t => ({ type: t._id }),
  language: () => i18n.getLanguages()[i18n.getLanguage()],
  languages: () => _.map(i18n.getLanguages(), (l, i) => ({ _id: i, name: l, isActive: i === i18n.getLanguage() })),
  currentUserEmail: () => Progressor.getUserEmail(Meteor.user()),
  currentTemplate: () => Router.current().route.getName(),
  i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), l => _.extend({ name: i18n.getProgrammingLanguage(l._id) }, l)),
  i18nExerciseTypes: () => _.map(Progressor.getExerciseTypes(), t => _.extend({ name: i18n.getExerciseType(t._id) }, t)),
  nofExercisesToRelease() {
    const result = Progressor.numberOfExercisesToRelease.findOne();
    if (result) {
      return result.count;
    }
  },
});

Template.layout.events({
  'click #link-logout': () => Meteor.logout(),
  'click .i18n.lang': function (event) {
    event.preventDefault();
    i18n.setLanguage(this._id);
  },
});
