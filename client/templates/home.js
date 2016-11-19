// INTRO ANIMATION //

const introTexts = [
  `${i18n('layout.logo')} `,
  i18n('layout.explanation'),
];

Template.home.onRendered(function () {
  this.introIndex = 0;
  $('#logo').text('');
  this.introInterval = Meteor.setInterval(() => {
    if (this.introIndex < introTexts[0].length) {
      $('#logo').text(introTexts[0].substr(0, ++this.introIndex)); // animate title
    } else if (this.introIndex < introTexts[0].length + introTexts[1].length) {
      this.$('#introExplanation').text(introTexts[1].substr(0, ++this.introIndex - introTexts[0].length));
    } else {
      Meteor.clearInterval(this.introInterval); // clear animation interval
      $('<span class="pulsate">_</span>').appendTo(this.$('#introExplanation'));
    }
  }, 150);
});

Template.home.onDestroyed(function templateHomeOnDestroyed() {
  Meteor.clearInterval(this.introInterval);
});

// PROGRAMMING LANGUAGE VISUALISATION //

Template.home.helpers({
  programmingLanguages() {
    const cur = Progressor.getProgrammingLanguages();
    const upc = Progressor.getProgrammingLanguagesUpcoming();
    return _.union(
      _.map(cur, (lng, idx) => _.extend({
        name: i18n.getProgrammingLanguage(lng._id),
        description: i18n.getProgrammingLanguageDescription(lng._id),
      }, lng)),
      _.map(upc, (lng, idx) => _.extend({
        name: i18n.getProgrammingLanguage(lng._id),
        description: i18n.getProgrammingLanguageDescription(lng._id),
        isUpcoming: true,
      }, lng)));
  },
  nofExercises(lng) {
    const cnt = Progressor.exercises.find({ programmingLanguage: lng }).count();
    return `${cnt} ${i18n(`exercise.exercise${cnt !== 1 ? 's' : ''}`)}`;
  },
});

Template.home.events({
  'mouseover .panel-default:not(.disabled)': event => $(event.currentTarget).removeClass('panel-default').addClass('panel-primary'),
  'mouseout .panel-primary': event => $(event.currentTarget).removeClass('panel-primary').addClass('panel-default'),
});
