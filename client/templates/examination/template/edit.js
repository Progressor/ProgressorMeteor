(function () {
	'use strict';
	const NUMBER_OF_COLUMNS = 3;
	var examExercises = [];

	function getDefaultExamination() {
		return {
			names: [],
			exercises: []
		};
	}

	function tmpl() {
		return Template.instance();
	}

	function getFilter() {
		const flt = {};
		if (tmpl().filter.get('name') && tmpl().filter.get('name').length > 2) flt.names = { $elemMatch: { name: new RegExp(tmpl().filter.get('name').replace(/[^a-z0-9]+/i, '.*'), 'i') } };
		if (tmpl().filter.get('type')) flt.type = tmpl().filter.get('type');
		if (tmpl().filter.get('category')) flt.category_id = tmpl().filter.get('category');
		if (tmpl().filter.get('difficulty')) flt.difficulty = tmpl().filter.get('difficulty');
		return flt;
	}

	Template.examinationTemplateEdit.onCreated(function () {
		this.examination = new ReactiveVar(getDefaultExamination());
		this.filter = new ReactiveDict();
	});

	Template.examinationTemplateEdit.helpers(
		{
			safeExamination(context) {
				//tmpl().isCreate.set(!context || !context._id);
				return tmpl().examination.get();
			},
			i18nExaminationNames: () => _.map(i18n.getLanguages(), (name, id) => ({
				_id: id, language: name, isActive: id === i18n.getLanguage(),
				name: i18n.getNameForLanguage(tmpl().examination.get(), id)
			})),
			exerciseTypes: Progressor.getExerciseTypes,
			difficulties: Progressor.getDifficulties,
			i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), language => _.extend({}, language, {
				name: i18n.getProgrammingLanguage(language._id)
			})),
			i18nCategories: () => Progressor.categories.find({ programmingLanguage: tmpl().filter.get('language') }).map(category => _.extend({}, category, {
				name: i18n.getName(category)
			})),
			i18nDifficulties: () => _.map(Progressor.getDifficulties(), difficulty => ({
				_id: difficulty, name: i18n.getDifficulty(difficulty)
			})),
			results() {
				const flt = getFilter();
				if (!_.isEmpty(flt)) return _.chain(Progressor.exercises.find(flt, { limit: 25 }).fetch()).map(Progressor.joinCategory).sortBy(i18n.getName).value();
			},
			exercises: () => _.map(tmpl().examination.get().exercises, (e, i) => _.extend({}, e, { exerciseIndex: i })),
			message: () => i18n(`form.no${!_.isEmpty(getFilter()) ? 'Results' : 'Filter'}Message`)
		});

	function changeExamination(callback) {
		return function (event, template) {
			const ret = callback.call(this, event, template, event && event.currentTarget ? $(event.currentTarget) : null);
			template.examination.dep.changed();
			return ret;
		};
	}

	function changeExaminationTranslation(translationName) {
		return changeExamination(function (event, template, $this) {
			const value = $this.val(), elements = template.examination.get()[`${translationName}s`], language = this._id;
			let elementIndex = -1;
			const element = _.find(elements, (e, i) => (elementIndex = e.language === language ? i : elementIndex) >= 0);
			if (!value) elements.splice(elementIndex, 1);
			else if (element) element[translationName] = value;
			else elements.push({ language, [translationName]: value });
		});
	}

	function removeExaminationCollection(collectionName) {
		return changeExamination(function (event, template) {
			let collection = template.examination.get()[`${collectionName}s`];
			collection.splice(this[`${collectionName}Index`], 1);
		});
	}

	Template.examinationTemplateEdit.events(
		{
			'change #select-type': (event, template) => template.filter.set('type', parseInt($(event.currentTarget).val())),
			'change #select-language': (event, template) => template.filter.set('language', $(event.currentTarget).val()),
			'change #select-category': (event, template) => template.filter.set('category', $(event.currentTarget).val()),
			'change #select-difficulty': (event, template) => template.filter.set('difficulty', parseInt($(event.currentTarget).val())),
			'change [id^="input-name-"]': changeExaminationTranslation('name'),
			'change #input-duration': changeExamination((event, template, $this) => template.examination.get().durationMinutes = parseInt($this.val())),
			'click .btn-add-function': changeExamination(function (event, template) {
				template.examination.get().exercises.push(this);
			}),
			'click .btn-remove-function': removeExaminationCollection('exercise'),
			'click .btn-save': (event, template) => Meteor.call('saveExamination', template.examination.get(),
																													Progressor.handleError(result => Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'success'), false))
		});

})();
