(function () {
	'use strict';

	let category;

	function getDefaultCategory() {
		return { names: [], descriptions: [] };
	}

	Template.categoryEdit.onCreated(function () {
		category = new ReactiveVar(getDefaultCategory());
	});

	Template.categoryEdit.onRendered(function () {
		//$('body').tooltip({ selector: '[data-toggle="tooltip"]' });

		this.autorun(function () {
			let live = Progressor.categories.findOne();
			let detached = Tracker.nonreactive(() => category.get());
			if (!live || !detached || live._id !== detached._id)
				category.set(live);
			else {
				let $alert = $('<div class="alert alert-warning pre-line fade" role="alert"></div>').text(i18n('form.documentChanged')).appendTo($('#global-alerts'));
				Meteor.setTimeout(() => $alert.addClass('in'), 1);
				Meteor.setTimeout(() => $alert.alert('close'), 7500);
			}
		});
	});

	Template.categoryEdit.helpers(
		{
			category: () => category.get(),
			exists: () => category.get() && category.get()._id,
			exerciseSearchData: () => ({ _id: category.get().programmingLanguage }),
			userName: Progressor.getUserName,
			i18nProgrammingLanguage: () => i18n.getProgrammingLanguage(category.get().programmingLanguage),
			i18nCategoryName: () => i18n.getName(category.get()),
			i18nDateTime: dat => i18n.formatDate(dat, 'L LT'),
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
			else
				elements.push({ language: $this.data('lang'), [translationName]: value });
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
