import { tmpl } from '/imports/utilities';

const NUMBER_OF_COLUMNS = 3;

// SEARCH FILTER //

function getFilter() {
  const flt = {};
  if (tmpl().filter.get('name') && tmpl().filter.get('name').length > 2) {
    flt.names = { $elemMatch: { name: new RegExp(tmpl().filter.get('name').replace(/[^a-z0-9]+/i, '.*'), 'i') } };
  }
  if (tmpl().filter.get('type')) {
    flt.type = tmpl().filter.get('type');
  }
  if (tmpl().filter.get('category')) {
    flt.category_id = tmpl().filter.get('category');
  }
  if (tmpl().filter.get('difficulty')) {
    flt.difficulty = tmpl().filter.get('difficulty');
  }
  return flt;
}

// TEMPLATE VARIABLES //

Template.exerciseSearch.onCreated(function templateExerciseSearchOnCreated() {
  this.filter = new ReactiveDict();
});

Template.exerciseSearch.helpers({
  // EXERCISE HELPERS //

  columnWidth: () => 12 / NUMBER_OF_COLUMNS,
  exerciseSearchData: l => () => ({ _id: l }),
  difficultiesExercises(difficulties, exercises) {
    const exercisesSorted = _.chain(exercises).sortBy(e => i18n.getName(e).toLowerCase());
    return _.map(difficulties, difficulty => {
      const difficultyExercises = exercisesSorted.where({ difficulty }).value();
      const nofDifficultyExercises = difficultyExercises.length;
      const exercisesPerColumn = Math.ceil(nofDifficultyExercises / NUMBER_OF_COLUMNS);
      return {
        _id: difficulty,
        exercises: difficultyExercises,
        exerciseColumns: _.map(
          _.range(0, NUMBER_OF_COLUMNS), c => ({
            _id: c,
            exercises: difficultyExercises.slice(exercisesPerColumn * c,
            exercisesPerColumn * (c + 1)),
          })
        ),
      };
    });
  },
  exerciseTypes: Progressor.getExerciseTypes,
  difficulties: Progressor.getDifficulties,
  categories: () => Progressor.categories.find({ private: { $exists: false } }).fetch(),
  evaluated(exercise) {
    const result = Progressor.results.findOne({ exercise_id: exercise._id });
    return result && Progressor.isExerciseEvaluated(exercise, result.results);
  },
  success(exercise) {
    const result = Progressor.results.findOne({ exercise_id: exercise._id });
    return result && Progressor.isExerciseSuccess(exercise, result.results);
  },
  i18nPageTitle(i, l, c) {
    return (!i) ? i18n.getProgrammingLanguage(l) : `${i18n.getProgrammingLanguage(l)} '${i18n.getName(c[0])}'`;
  },

  // SEARCH HELPERS //

  results() {
    const flt = getFilter();
    if (!_.isEmpty(flt)) {
      const exercises = Progressor.exercises.find(flt, { sort: [['requested.released', 'desc']], limit: 25 }).fetch();
      return _.map(exercises, Progressor.joinCategory);
    }
  },
  message: () => i18n(`form.no${!_.isEmpty(getFilter()) ? 'Results' : 'Filter'}Message`),
});

// SEARCH EVENTS //

Template.exerciseSearch.events({
  'keyup #input-name': _.debounce((event, templateInstance) => templateInstance.filter.set('name', $(event.currentTarget).val()), 250),
  'change #select-type': (event, templateInstance) => templateInstance.filter.set('type', parseInt($(event.currentTarget).val(), 10)),
  'change #select-category': (event, templateInstance) => templateInstance.filter.set('category', $(event.currentTarget).val()),
  'change #select-difficulty': (event, templateInstance) => templateInstance.filter.set('difficulty', parseInt($(event.currentTarget).val(), 10)),
});
