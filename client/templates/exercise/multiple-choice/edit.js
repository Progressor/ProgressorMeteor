function getDefaultExercise() {
  return {
    type: 2,
    names: [],
    descriptions: [],
    options: [{
      language: i18n.getLanguage(),
      options: [null],
    }],
    solution: [],
    multipleSolutions: true,
    solutionVisible: false,
  };
}

function tmpl() {
  return Template.instance();
}

// TEST ENTERED VALUES //

function testValidExercise({ programmingLanguage, category_id, difficulty, names, descriptions, options, released }) {
  const category = Progressor.categories.findOne({ _id: category_id });
  const notEmpty = /[^\s]+/;
  return programmingLanguage
    && _.some(Progressor.getProgrammingLanguages(), l => l._id === programmingLanguage)
    && category_id
    && category
    && !(category.private && released)
    && difficulty
    && _.contains(Progressor.getDifficulties(), difficulty)
    && names
    && names.length
    && _.some(names, n => n.name && notEmpty.test(n.name))
    && descriptions
    && descriptions.length
    && _.some(descriptions, d => d.description && notEmpty.test(d.description))
    && options
    && options.length
    && _.chain(_.chain(_.map(options, o => o.options.length)).max().value()).range().every(i => _.some(options, o => o.options[i] && notEmpty.test(o.options[i]))).value();
}

Template.multipleEdit.onCreated(function () {
  // TEMPLATE VARIABLES //

  this.isCreate = new ReactiveVar(false);
  this.exercise = new ReactiveVar(getDefaultExercise());

  // REACTIVE (LOCAL) EXERCISE //

  this.autorun(() => {
    const live = Progressor.exercises.findOne();
    const detached = Tracker.nonreactive(() => this.exercise.get());
    if (!live || !detached || live._id !== detached._id) {
      let _exercise = live || getDefaultExercise();
      if (this.isCreate.get()) {
        _exercise = _.omit(_exercise, '_id', 'released', 'archived', 'author_id', 'lastEditor_id', 'lastEdited');
      }
      this.exercise.set(Progressor.joinCategory(_exercise));
    } else if (live.lastEditor_id !== Meteor.userId()) {
      Progressor.showAlert(i18n('form.documentChangedMessage'));
    }
  });
});

// EXERCISE HELPERS //

Template.multipleEdit.helpers(
  {
    safeExercise(context) {
      tmpl().isCreate.set(!context || !context._id);
      return tmpl().exercise.get();
    },
    canSave: () => !tmpl().exercise.get() || !tmpl().exercise.get()._id || !tmpl().exercise.get().released || !tmpl().exercise.get().released.requested || Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN),
    exerciseSearchData: () => ({ _id: tmpl().exercise.get().programmingLanguage }),
    exerciseDuplicateQuery: () => ({ duplicate: tmpl().exercise.get()._id }),
    categoryEditData: () => (tmpl().exercise.get() && tmpl().exercise.get().category_id && !Progressor.categories.findOne({ _id: tmpl().exercise.get().category_id }).private ? { _id: tmpl().exercise.get().category_id } : null),
    not: b => !b,
    i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), language => _.extend({}, language, {
      name: i18n.getProgrammingLanguage(language._id),
      isActive: language._id === tmpl().exercise.get().programmingLanguage,
    })),
    i18nCategories: () => _.chain(Progressor.categories.find({ programmingLanguage: tmpl().exercise.get().programmingLanguage }).fetch()).map(category => _.extend({}, category, {
      name: i18n.getCategoryName(category, tmpl().exercise.get() && tmpl().exercise.get().author_id ? tmpl().exercise.get().author_id : Meteor.userId()),
      isActive: category._id === tmpl().exercise.get().category_id,
    })).sortBy(c => c.private ? null : c.name).value(),
    i18nDifficulties: () => _.map(Progressor.getDifficulties(), difficulty => ({
      _id: difficulty, name: i18n.getDifficulty(difficulty),
      isActive: difficulty === tmpl().exercise.get().difficulty,
    })),
    i18nExerciseNamesDescriptions: () => _.map(i18n.getLanguages(), function (name, id) {
      const nofOptions = _.chain([1, _.map(tmpl().exercise.get().options, o => o.options.length)]).flatten().max().value();
      const options = _.chain([i18n.getOptionsForLanguage(tmpl().exercise.get(), id) || [], _.map(_.range(nofOptions), () => null)]).flatten().first(nofOptions)
        .map((o, i) => ({ language: id, optionIndex: i, text: o, isSolution: _.contains(tmpl().exercise.get().solution, i), placeholder: (i18n.getOptions(tmpl().exercise.get()) || [])[i] })).value();
      return {
        _id: id, language: name, isActive: id === i18n.getLanguage(),
        name: i18n.getNameForLanguage(tmpl().exercise.get(), id),
        description: i18n.getDescriptionForLanguage(tmpl().exercise.get(), id),
        options,
      };
    }),
  });

// EVENT WRAPPERS //

function changeExercise(callback) {
  return function (event, template) {
    const ret = callback.call(this, event, template, event && event.currentTarget ? $(event.currentTarget) : null, this);
    template.exercise.dep.changed();
    return ret;
  };
}

function changeExerciseTranslation(translationName) {
  return changeExercise(function (event, template, $this) {
    const value = $this.val(), elements = template.exercise.get()[`${translationName}s`], language = this._id;
    let elementIndex = -1;
    const element = _.find(elements, (e, i) => (elementIndex = e.language === language ? i : elementIndex) >= 0);
    if (!value) elements.splice(elementIndex, 1);
    else if (element) element[translationName] = value;
    else elements.push({ language, [translationName]: value });
  });
}

Template.multipleEdit.events({

  // COLLECTION EVENTS //

  'click .btn-add-option': changeExercise(function (event, template, $this) {
    _.each(template.exercise.get().options, e => e.options.splice(this.optionIndex + 1, 0, getDefaultExercise().options[0].options[0]));
  }),
  'click .btn-remove-option': changeExercise(function (event, template, $this) {
    _.each(template.exercise.get().options, e => e.options.splice(this.optionIndex, 1));
  }),

  // DATA CHANGE EVENTS //

  'change #select-language': changeExercise((e, t, $) => !t.exercise.get()._id ? t.exercise.get().programmingLanguage = $.val() : null),
  'change #select-category': changeExercise((e, t, $) => t.exercise.get().category_id = $.val()),
  'change #select-difficulty': changeExercise((e, t, $) => t.exercise.get().difficulty = parseInt($.val())),
  'change [id^="input-name-"]': changeExerciseTranslation('name'),
  'change [id^="textarea-description-"]': changeExerciseTranslation('description'),
  'change .input-option-text': changeExercise(function (event, template, $this) {
    const value = $this.val(), options = template.exercise.get().options, option = _.findWhere(options, { language: this.language });
    if (option) option.options[this.optionIndex] = value || null;
    else options.push({ language: this.language, options: _.map(_.range(this.optionIndex + 1), i => i === this.optionIndex ? value : null) });
  }),
  'change .input-option-checked': changeExercise(function (event, template, $this) {
    const $multiple = template.$('#checkbox-multiple-solutions');
    template.exercise.get().solution = _.chain([_.filter(template.exercise.get().solution, i => i !== this.optionIndex), _.first([this.optionIndex], $this.prop('checked') && $this.val() === 'true' ? 1 : 0)]).flatten().sortBy(_.identity).value();
    $multiple.prop('disabled', template.exercise.get().solution.length > 1);
    if (template.exercise.get().solution.length > 1)
      template.exercise.get().multipleSolutions = true;
  }),
  'change #checkbox-multiple-solutions': changeExercise((e, t, $) => t.exercise.get().multipleSolutions = $.prop('checked')),
  'change #checkbox-solution-visible': changeExercise((e, t, $) => t.exercise.get().solutionVisible = $.prop('checked')),

  // PERSISTENCE EVENTS //

  'click .btn-save, click .btn-release-request': changeExercise(function (event, template, $this) {
    if ($this.hasClass('btn-release-request'))
      template.exercise.get().released = { requested: new Date() };
    if (testValidExercise(template.exercise.get()))
      Meteor.call('saveExercise', _.omit(template.exercise.get(), 'category'), Progressor.handleError(r => Router.go('exerciseSolve', { _id: r }), false));
    else
      Progressor.showAlert(i18n('exercise.isNotValidMessage'));
  }),
  'click .btn-delete': (event, template) => Meteor.call('deleteExercise', { _id: template.exercise.get()._id }, Progressor.handleError(() => Router.go('exerciseSearch', { _id: template.exercise.get().programmingLanguage }), false)),
});
