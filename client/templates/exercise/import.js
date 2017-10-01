
Template.exerciseImport.events({
  'change #input-file'(event) {
    const files = event.currentTarget.files;
    _.each(files, (file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const content = JSON.parse(fileReader.result);
        const categoryMap = {};
        _.each(content.categories, (category) => {
          if (category.private) {
            categoryMap[category._id] = Progressor.categories.findOne({ private: true, programmingLanguage: category.programmingLanguage })._id;
          } else {
            Meteor.call('saveCategory', category, Progressor.handleError((error, result) => {
              //Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'success');
            }, false));
          }
        });

        _.each(content.exercises, (exercise) => {
          if (categoryMap[exercise.category_id]) {
            exercise.category_id = categoryMap[exercise.category_id];
          }
          Meteor.call('saveExercise', exercise, Progressor.handleError((error, result) => {
            Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'success');
          }, false));
        });
      };

      fileReader.readAsText(file);
    });
  },
});
