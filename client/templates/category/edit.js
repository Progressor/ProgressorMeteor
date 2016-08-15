import { tmpl } from '/imports/utilities';

function getDefaultCategory() {
  return {
    names: [],
    descriptions: [],
  };
}

// TEST ENTERED VALUES //

function testValidCategory({ programmingLanguage, names, descriptions }) {
  const notEmpty = /[^\s]+/;
  return programmingLanguage && _.some(Progressor.getProgrammingLanguages(), l => l._id === programmingLanguage)
         && names && names.length && _.some(names, n => n.name && notEmpty.test(n.name))
         && descriptions && descriptions.length && _.some(descriptions, d => d.description && notEmpty.test(d.description));
}

Template.categoryEdit.onCreated(function () {
  // TEMPLATE VARIABLES //

  this.category = new ReactiveVar(getDefaultCategory());

  // REACTIVE (LOCAL) CATEGORY //

  this.autorun(() => {
    const live = Progressor.categories.findOne();
    const detached = Tracker.nonreactive(() => this.category.get());
    if (!live || !detached || live._id !== detached._id) {
      this.category.set(live || getDefaultCategory());
    } else if (live.lastEditor_id !== Meteor.userId()) {
      Progressor.showAlert(i18n('form.documentChangedMessage'));
    }
  });
});

// HELPERS //

Template.categoryEdit.helpers({
  category: () => tmpl().category.get(),
  exerciseSearchData: () => ({ _id: tmpl().category.get().programmingLanguage }),
  i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), language => _.extend({}, language, {
    name: i18n.getProgrammingLanguage(language._id),
    isActive: tmpl().category.get() && language._id === tmpl().category.get().programmingLanguage,
  })),
  i18nCategoryNamesDescriptions: () => _.map(i18n.getLanguages(), (name, id) => ({
    _id: id, language: name, isActive: id === i18n.getLanguage(),
    name: i18n.getNameForLanguage(tmpl().category.get(), id),
    description: i18n.getDescriptionForLanguage(tmpl().category.get(), id),
  })),
});

// EVENT WRAPPERS //

function changeCategory(callback) {
  return function (event, template) {
    const ret = callback.call(this, event, template, event && event.currentTarget ? $(event.currentTarget) : null, this);
    template.category.dep.changed();
    return ret;
  };
}

function changeCategoryTranslation(translationName) {
  return changeCategory(function (event, template, $this) {
    const value = $this.val();
    const elements = template.category.get()[`${translationName}s`];
    const language = this._id;
    let elementIndex = -1;
    const element = _.find(elements, (e, i) => (elementIndex = e.language === language ? i : elementIndex) >= 0);
    if (!value) {
      elements.splice(elementIndex, 1);
    } else if (element) {
      element[translationName] = value;
    } else {
      elements.push({ language, [translationName]: value });
    }
  });
}

Template.categoryEdit.events({
  // DATA CHANGE EVENTS //

  'change #select-language': changeCategory((e, t, $) => !t.category.get()._id ? t.category.get().programmingLanguage = $.val() : null),
  'change [id^="input-name-"]': changeCategoryTranslation('name'),
  'change [id^="textarea-description-"]': changeCategoryTranslation('description'),

  // PERSISTENCE EVENTS //

  'click .btn-save': function (event, template) {
    if (testValidCategory(template.category.get())) {
      Meteor.call('saveCategory', template.category.get(), Progressor.handleError(r => Router.go('categoryExercises', { _id: r }), false));
    } else {
      Progressor.showAlert(i18n('category.isNotValidMessage'));
    }
  },
  'click .btn-delete': () => Meteor.call('deleteCategory', template.category.get(), Progressor.handleError(() => Router.go('exerciseSearch', { _id: template.category.get().programmingLanguage }), false)),
});
