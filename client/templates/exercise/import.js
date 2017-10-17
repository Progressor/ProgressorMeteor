import { tmpl } from '/imports/utilities';

Template.exerciseImport.onCreated(function () {
  // TEMPLATE VARIABLES //

  this.files = new ReactiveVar([]);
});

Template.exerciseImport.helpers({
  // DATA HELPERS //

  files: () => tmpl().files.get(),
  exercises: () => _.chain(tmpl().files.get()).map(file => _.map(file.exercises, exercise => ({
      ..._.pick(file, 'exported'),
      ..._.pick(exercise, 'names', 'type', 'programmingLanguage', 'difficulty', 'imported'),
      category: _.pick(_.findWhere(file.categories, { _id: exercise.category_id }), 'names', 'private'),
    }))).flatten(true).value(),
});

Template.exerciseImport.events({

   // LOADING //

  'change #input-file'(event, template) {
    const files = event.currentTarget.files;
    _.each(files, file => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const content = JSON.parse(fileReader.result);
        template.files.set([...template.files.get(), content]);
      };
      fileReader.readAsText(file);
    });
  },

  // SAVING //

  'click #btn-import'(event, template) {
    const files = template.files.get();
    const categoryMap = {};
    const tasks = [];
    const moveNext = object => (() => {
      object.imported = true;
      template.files.set(files);
      tasks.shift()();
    });

    _.each(files, (file) => {
      tasks.push(..._.chain(file.categories).filter(c => !c.imported).map(category => (() => {
        if (category.private) {
          categoryMap[category._id] = Progressor.categories.findOne({ private: true, programmingLanguage: category.programmingLanguage })._id;
          moveNext(category)();
        } else {
          Meteor.call('saveCategory', category, Progressor.handleError(moveNext(category), false));
        }
      })).value());

      tasks.push(..._.chain(file.exercises).filter(e => !e.imported).map(exercise => (() => {
        let _exercise = exercise;
        if (categoryMap[exercise.category_id]) {
          _exercise = { ...exercise, category_id: categoryMap[exercise.category_id] };
        }
        Meteor.call('saveExercise', _exercise, Progressor.handleError(moveNext(exercise), false));
      })).value());
    });

    if (tasks.length) {
      tasks.push(() => Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'success'));
      tasks.shift()();
    }
  },
});
