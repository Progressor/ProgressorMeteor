(function () {
	'use strict';

	let category;

	function getDefaultCategory() {
		return { names: [], descriptions: [] };
	}

	function testValidCategory({ programmingLanguage, names, descriptions }) {
		const notEmpty = /[^\s]+/;
		return programmingLanguage && _.any(Progressor.getProgrammingLanguages(), l => l._id === programmingLanguage)
					 && names && names.length && _.any(names, n => n.name && notEmpty.test(n.name))
					 && descriptions && descriptions.length && _.any(descriptions, d => d.description && notEmpty.test(d.description));
	}

	Template.categoryEdit.onCreated(function () {
		category = new ReactiveVar(getDefaultCategory());
	});

	Template.categoryEdit.onRendered(function () {
		this.autorun(function () {
			const live = Progressor.categories.findOne();
			const detached = Tracker.nonreactive(() => category.get());
			if (!live || !detached || live._id !== detached._id)
				category.set(live || getDefaultCategory());
			else if (live.lastEditor_id !== Meteor.userId())
				Progressor.showAlert(i18n('form.documentChangedMessage'));
		});
	});

	Template.categoryEdit.helpers(
		{
			category: () => category.get(),
			exists: () => category.get() && category.get()._id,
			exerciseSearchData: () => ({ _id: category.get().programmingLanguage }),
			userName: Progressor.getUserName,
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
			const ret = cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
			category.dep.changed();
			return ret;
		};
	}

	function changeCategoryTranslation(translationName) {
		return changeCategory(function (ev) {
			const $this = $(ev.currentTarget), value = $this.val(), language = $this.closest('[data-lang]').data('lang'), elements = category.get()[`${translationName}s`];
			let elementIndex = -1;
			const element = _.find(elements, (e, i) => (elementIndex = e.language === language ? i : elementIndex) >= 0);
			if (!value) elements.splice(elementIndex, 1);
			else if (element) element[translationName] = value;
			else elements.push({ language, [translationName]: value });
		});
	}

	Template.categoryEdit.events(
		{
			'change #select-language': changeCategory((ev, $this) => !category.get()._id ? category.get().programmingLanguage = $this.val() : null),
			'change [id^="input-name-"]': changeCategoryTranslation('name'),
			'change [id^="textarea-description-"]': changeCategoryTranslation('description'),
			'click .btn-save'() {
				if (testValidCategory(category.get()))
					Meteor.call('saveCategory', category.get(), Progressor.handleError(res => Router.go('categoryExercises', { _id: res }), false));
				else
					Progressor.showAlert(i18n('category.isNotValidMessage'));
			},
			'click .btn-delete': () => Meteor.call('deleteCategory', category.get(), Progressor.handleError(() => Router.go('exerciseSearch', { _id: category.get().programmingLanguage }), false))
		});

})();
