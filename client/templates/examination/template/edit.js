(function () {
	'use strict';

	function getDefaultExamination() {
		return {
			names: [],
			exercises: []
		};
	}

	function tmpl() {
		return Template.instance();
	}

	function testValidExamination({ names, durationMinutes, exercises }) {
		const notEmpty = /[^\s]+/;
		return names && names.length && _.some(names, n => n.name && notEmpty.test(n.name))
					 && durationMinutes > 0
					 && exercises && exercises.length && _.every(exercises, e => e.weight > 0);
	}

	function getFilter() {
		const flt = {};
		if (tmpl().filter.get('name') && tmpl().filter.get('name').length > 2) flt.names = { $elemMatch: { name: new RegExp(tmpl().filter.get('name').replace(/[^a-z0-9]+/i, '.*'), 'i') } };
		if (tmpl().filter.get('type')) flt.type = tmpl().filter.get('type');
		if (tmpl().filter.get('language')) flt.programmingLanguage = tmpl().filter.get('language');
		if (tmpl().filter.get('category')) flt.category_id = tmpl().filter.get('category');
		if (tmpl().filter.get('difficulty')) flt.difficulty = tmpl().filter.get('difficulty');
		if (tmpl().filter.get('visibilityReleased') === false) flt.author_id = Meteor.userId();
		if (tmpl().filter.get('visibilityUnreleased') === false) flt['released.confirmed'] = { $exists: true };
		return flt;
	}

	Template.examinationTemplateEdit.onCreated(function () {
		this.isCreate = new ReactiveVar(false);
		this.examination = new ReactiveVar(getDefaultExamination());
		this.filter = new ReactiveDict();
	});

	Template.examinationTemplateEdit.onRendered(function () {
		this.autorun(() => {
			const live = Progressor.examinations.findOne();
			const detached = Tracker.nonreactive(() => this.examination.get());
			if (!live || !detached || live._id !== detached._id) {
				let _examination = live || getDefaultExamination();
				if (this.isCreate.get())
					_examination = _.omit(_examination, '_id', 'author_id', 'lastEditor_id', 'lastEdited');
				this.examination.set(_examination);
			} else if (live.lastEditor_id !== Meteor.userId())
				Progressor.showAlert(i18n('form.documentChangedMessage'));
		});
	});

	Template.examinationTemplateEdit.helpers(
		{
			safeExamination(context) {
				tmpl().isCreate.set(!context || !context._id);
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
				if (!_.isEmpty(flt)) {
					const addedIds = _.map(tmpl().examination.get().exercises, e => e.exercise_id);
					return _.chain(Progressor.exercises.find(_.extend(flt, { _id: { $nin: addedIds } }), { sort: [['lastEdited', 'desc']], limit: 25 }).fetch()).map(Progressor.joinCategory)/*.sortBy(i18n.getName)*/.value();
				}
			},
			message: () => i18n(`form.no${!_.isEmpty(getFilter()) ? 'Results' : 'Filter'}Message`),
			exercises: () => _.map(tmpl().examination.get().exercises, (e, i) => _.extend({ exerciseIndex: i, weight: e.weight }, Progressor.joinCategory(Progressor.exercises.findOne({ _id: e.exercise_id }))))
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

	function changeExaminationCollection(collectionName, propertySupplier) {
		return changeExamination(function (event, template, $this) {
			_.extend(template.examination.get()[`${collectionName}s`][this[`${collectionName}Index`]], propertySupplier.call(this, event, template, $this));
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
			'keyup #input-name': _.debounce((e, t) => t.filter.set('name', $(e.currentTarget).val()), 250),
			'change #select-type': (e, t) => t.filter.set('type', parseInt($(e.currentTarget).val())),
			'change #select-language': (e, t) => t.filter.set('language', $(e.currentTarget).val()),
			'change #select-category': (e, t) => t.filter.set('category', $(e.currentTarget).val()),
			'change #select-difficulty': (e, t) => t.filter.set('difficulty', parseInt($(e.currentTarget).val())),
			'change #checkbox-released': (e, t) => t.filter.set('visibilityReleased', $(e.currentTarget).prop('checked')),
			'change #checkbox-unreleased': (e, t) => t.filter.set('visibilityUnreleased', $(e.currentTarget).prop('checked')),
			'change [id^="input-name-"]': changeExaminationTranslation('name'),
			'change #input-duration': changeExamination((e, t, $) => t.examination.get().durationMinutes = parseInt($.val())),
			'change .input-weight': changeExaminationCollection('exercise', (e, t, $) => ({ weight: parseInt($.val()) })),
			'click .btn-add-exercise': changeExamination(function (event, template) {
				template.examination.get().exercises.push({ exercise_id: this._id });
			}),
			'click .btn-remove-exercise': removeExaminationCollection('exercise'),
			'click .btn-save'(event, template) {
				if (testValidExamination(template.examination.get()))
					Meteor.call('saveExamination', template.examination.get(), Progressor.handleError(r => Router.go('examinationTemplateEdit', { _id: r }), false));
				else
					Progressor.showAlert(i18n('examination.templateIsNotValidMessage'));
			},
			'click .btn-delete': (e, t) => Meteor.call('deleteExamination', { _id: t.examination.get()._id }, Progressor.handleError(() => Router.go('home'), false))
		});

})();
