(function () {
	'use strict';

	function getDefaultExecution() {
		return {
			names: [],
			exercises: [],
			descriptions: []
		};
	}

	function createExecution(examination) {
		if (examination)
			return {
				examination_id: examination._id,
				durationMinutes: examination.durationMinutes,
				names: examination.names,
				descriptions: [],
				exercises: _.map(examination.exercises, e => ({ weight: e.weight, base_id: e.exercise_id }))
			};
	}

	function tmpl() {
		return Template.instance();
	}

	function testValidExecution({ names, descriptions, durationMinutes, exercises }) {
		const notEmpty = /[^\s]+/;
		return names && names.length && _.some(names, n => n.name && notEmpty.test(n.name))
					 && descriptions && descriptions.length && _.some(descriptions, n => n.description && notEmpty.test(n.description))
					 && durationMinutes > 0
					 && exercises && exercises.length && _.every(exercises, e => e.weight > 0);
	}

	Template.examinationExecutionEdit.onCreated(function () {
		this.isCreate = new ReactiveVar(false);
		this.execution = new ReactiveVar(getDefaultExecution());
		this.userValues = [];
	});

	Template.examinationExecutionEdit.onRendered(function () {
		Meteor.typeahead.inject();

		this.autorun(() => {
			const live = Progressor.executions.findOne();
			const examination = Progressor.examinations.findOne();
			const detached = Tracker.nonreactive(() => this.execution.get());
			if (!live || !detached || live._id !== detached._id)
				this.execution.set(live || createExecution(examination) || getDefaultExecution());
			else if (live.lastEditor_id !== Meteor.userId())
				Progressor.showAlert(i18n('form.documentChangedMessage'));
		});
	});

	Template.examinationExecutionEdit.helpers(
		{
			safeExecution(context) {
				tmpl().isCreate.set(!context || !context._id);
				return tmpl().execution.get();
			},
			i18nExecutionNamesDescriptions: () => _.map(i18n.getLanguages(), (name, id) => ({
				_id: id, language: name, isActive: id === i18n.getLanguage(),
				name: i18n.getNameForLanguage(tmpl().execution.get(), id),
				description: i18n.getDescriptionForLanguage(tmpl().execution.get(), id)
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
			exercises: () => _.map(tmpl().execution.get().exercises, (e, i) => _.extend(
				{
					exerciseIndex: i,
					isFirst: i === 0,
					isLast: i === tmpl().execution.get().exercises.length - 1,
					weight: e.weight
				}, Progressor.joinCategory(Progressor.exercises.findOne({ _id: e.base_id })))),
			users() {
				const addedIds = tmpl().execution.get().examinees || [];
				return _.map(Meteor.users.find({ _id: { $nin: addedIds } }).fetch(), user => {
					const value = [Progressor.getUserName(user, true), Progressor.getUserEmail(user)].join(' ');
					tmpl().userValues[value] = user;
					return { value: value, name: Progressor.getUserName(user, true), email: Progressor.getUserEmail(user) };
				});
			}

		});

	function changeExecution(callback) {
		return function (event, template) {
			const ret = callback.call(this, event, template, event && event.currentTarget ? $(event.currentTarget) : null);
			template.execution.dep.changed();
			return ret;
		};
	}

	function changeExecutionTranslation(translationName) {
		return changeExecution(function (event, template, $this) {
			const value = $this.val(), elements = template.execution.get()[`${translationName}s`], language = this._id;
			let elementIndex = -1;
			const element = _.find(elements, (e, i) => (elementIndex = e.language === language ? i : elementIndex) >= 0);
			if (!value) elements.splice(elementIndex, 1);
			else if (element) element[translationName] = value;
			else elements.push({ language, [translationName]: value });
		});
	}

	function removeExecutionCollection(collectionName) {
		return changeExecution(function (event, template) {
			let collection = template.execution.get()[`${collectionName}s`];
			collection.splice(this[`${collectionName}Index`], 1);
		});
	}

	Template.examinationExecutionEdit.events(
		{
			'change [id^="input-name-"]': changeExecutionTranslation('name'),
			'change [id^="textarea-description-"]': changeExecutionTranslation('description'),
			'change #input-duration': changeExecution((event, template, $this) => template.execution.get().durationMinutes = parseInt($this.val())),
			'click .btn-up': changeExecution(function (event, template) {
				var index = this.exerciseIndex;
				var ex2 = template.execution.get().exercises[index - 1];
				template.execution.get().exercises[index - 1] = template.execution.get().exercises[index];
				template.execution.get().exercises[index] = ex2;
			}),
			'click .btn-down': changeExecution(function (event, template) {
				var index = this.exerciseIndex;
				var ex2 = template.execution.get().exercises[index + 1];
				template.execution.get().exercises[index + 1] = template.execution.get().exercises[index];
				template.execution.get().exercises[index] = ex2;
			}),
			'click .btn-remove-examinee': removeExecutionCollection('examinee'),
			'click #button-add-examinee': changeExecution(function (event, template) {
				const $input = template.$('#input-add-examinee'), user = template.userValues[$input.val()];
				if (!template.execution.get().examinees)
					template.execution.get().examinees = [user._id];
				else
					template.execution.get().examinees.push(user._id);
				$input.val(null);
			}),
			'click .btn-save': function (event, template) {
				if (testValidExecution(template.execution.get()))
					Meteor.call('saveExecution', template.execution.get(), Progressor.handleError(function (result) {
						Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'success');
						Router.go('examinationExecutionEdit', { _id: result });
					}, false));
				else
					Progressor.showAlert(i18n('examination.executionIsNotValidMessage'));
			},
			'click .btn-delete': (e, t) => Meteor.call('deleteExecution', { _id: t.execution.get()._id }, Progressor.handleError(() => Router.go('home'), false)),
			'click btn-start-execution': function (event, template) {
			}
		});

})();
