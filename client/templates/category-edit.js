(function () {
	'use strict';

	const category = new ReactiveVar(getDefaultCategory());

	function getDefaultCategory() {
		return { names: [], descriptions: [] };
	}

	Template.categoryEdit.onCreated(function () {
		this.autorun(() => category.set(Progressor.categories.findOne() || getDefaultCategory()));
	});

	Template.categoryEdit.helpers(
		{
			exerciseSearchData: c => () => ({ _id: c.programmingLanguage }),
			i18nProgrammingLanguage: c => i18n.getProgrammingLanguage(c.programmingLanguage),
			i18nCategoryName: i18n.getName,
			i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), language => _.extend({}, language, {
				name: i18n.getProgrammingLanguage(language._id),
				isActive: category.get() && language._id === category.get().programmingLanguage
			})),
			i18nCategoryNamesDescriptions: () => _.map(i18n.getLanguages(), (name, id) => ({
				_id: id, language: name, isActive: id === i18n.getLanguage(),
				name: i18n.getNameForLanguage(category.get(), id),
				description: i18n.getDescriptionForLanguage(category.get(), id)
			}))
		});

	function changeCategory(cb) {
		return function (ev) {
			let ret = cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
			category.dep.changed();
			return ret;
		};
	}

	function changeCategoryTranslation(translationName) {
		return changeCategory(function (ev) {
			let $this = $(ev.currentTarget), value = $this.val(), elements = category.get()[translationName + 's'], elementIndex = -1;
			let element = _.find(elements, (e, i) => (elementIndex = e.language === $this.data('lang') ? i : elementIndex) >= 0);
			if (!value)
				elements.splice(elementIndex, 1);
			else if (element)
				element[translationName] = value;
			else {
				element = { language: $this.data('lang') };
				element[translationName] = value;
				elements.push(element);
			}
		});
	}

	Template.categoryEdit.events(
		{
			'change #select-language': changeCategory((ev, $this) => !category.get()._id ? category.get().programmingLanguage = $this.val() : null),
			'change [id^="input-name-"]': changeCategoryTranslation('name'),
			'change [id^="textarea-description-"]': changeCategoryTranslation('description'),
			'click .btn-save': () => Meteor.call('saveCategory', category.get(), (error, id) => error || Router.go('categoryExercises', { _id: id })),
			'click .btn-delete': () => Meteor.call('deleteCategory', category.get(), error => error || Router.go('exerciseSearch', { _id: category.get().programmingLanguage }))
		});

})();
