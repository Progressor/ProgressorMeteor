(function () {
	'use strict';

	function getDefaultExecution() {
		return {
			names: [],
			descriptions: [],
			exercises: []
		};
	}

	function createExecution(examination) {
		if (examination)
			return {
				examination_id: examination._id,
				names: examination.names,
				descriptions: [],
				durationMinutes: examination.durationMinutes,
				exercises: _.map(examination.exercises, e => ({ weight: e.weight, base_id: e.exercise_id }))
			};
	}

	function tmpl() {
		return Template.instance();
	}

	/////////////////////////
	// TEST ENTERED VALUES //
	/////////////////////////

	function testValidExecution({ names, descriptions, durationMinutes, exercises }) {
		const notEmpty = /[^\s]+/;
		return names && names.length && _.some(names, n => n.name && notEmpty.test(n.name))
					 && descriptions && descriptions.length && _.some(descriptions, n => n.description && notEmpty.test(n.description))
					 && durationMinutes > 0
					 && exercises && exercises.length && _.every(exercises, e => e.weight > 0);
	}

	Template.examinationExecutionEdit.onCreated(function () {

		////////////////////////
		// TEMPLATE VARIABLES //
		////////////////////////

		this.isCreate = new ReactiveVar(false);
		this.execution = new ReactiveVar(getDefaultExecution());
		this.userValues = [];

		////////////////////////////////
		// REACTIVE (LOCAL) EXECUTION //
		////////////////////////////////

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

	///////////////////////
	// USER AUTOCOMPLETE //
	///////////////////////

	Template.examinationExecutionEdit.onRendered(() => Meteor.typeahead.inject());

	Template.examinationExecutionEdit.helpers(
		{

			///////////////////////
			// EXECUTION HELPERS //
			///////////////////////

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
			exercises: () => _.map(tmpl().execution.get().exercises, (exercise, index) => _.extend(
				{
					exerciseIndex: index,
					isFirst: index === 0,
					isLast: index === tmpl().execution.get().exercises.length - 1,
					weight: exercise.weight
				}, Progressor.joinCategory(Progressor.exercises.findOne({ _id: exercise.base_id })))),
			totalWeight: e => _.reduce(e.exercises, (w, e) => w + e.weight, 0),

			/////////////////////////
			// USER SEARCH HELPERS //
			/////////////////////////

			users() {
				const addedIds = tmpl().execution.get().examinees || [];
				return _.map(Meteor.users.find({ _id: { $nin: addedIds } }).fetch(), user => {
					const value = [Progressor.getUserName(user, true), Progressor.getUserEmail(user)].join(' ');
					tmpl().userValues[value] = user;
					return { value: value, name: Progressor.getUserName(user, true), email: Progressor.getUserEmail(user) };
				});
			}
		});

	////////////////////
	// EVENT WRAPPERS //
	////////////////////

	function changeExecution(callback) {
		return function (event, template) {
			const ret = callback.call(this, event, template, event && event.currentTarget ? $(event.currentTarget) : null, this);
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

	function changeExecutionCollection(collectionName, propertySupplier) {
		return changeExecution(function (event, template, $this) {
			_.extend(template.execution.get()[`${collectionName}s`][this[`${collectionName}Index`]], propertySupplier.call(this, event, template, $this, this));
		});
	}

	function addExecutionCollection(collectionName, itemSupplier) {
		return changeExecution(function (event, template, $this) {
			if (!template.execution.get()[`${collectionName}s`])
				template.execution.get()[`${collectionName}s`] = [];
			template.execution.get()[`${collectionName}s`].splice(this[`${collectionName}Index`] + 1, 0, itemSupplier.call(this, event, template, $this, this));
		});
	}

	function removeExecutionCollection(collectionName) {
		return changeExecution(function (event, template) {
			template.execution.get()[`${collectionName}s`].splice(this[`${collectionName}Index`], 1);
			if (!template.execution.get()[`${collectionName}s`].length)
				delete template.execution.get()[`${collectionName}s`];
		});
	}

	function reorderExecutionCollection(collectionName, offset) {
		return changeExecution(function (event, template) {
			const collection = template.execution.get()[`${collectionName}s`], index = this[`${collectionName}Index`];
			collection.splice(index + offset, 0, ...collection.splice(index, 1));
		});
	}

	Template.examinationExecutionEdit.events(
		{

			///////////////////////
			// COLLECTION EVENTS //
			///////////////////////

			'click .btn-move-exercise-up': reorderExecutionCollection('exercise', -1),
			'click .btn-move-exercise-down': reorderExecutionCollection('exercise', +1),
			'click #button-add-examinee': addExecutionCollection('examinee', (event, template) => {
				const $input = template.$('#input-add-examinee'), user = template.userValues[$input.val()];
				$input.val(null);
				return user._id;
			}),
			'click .btn-remove-examinee': removeExecutionCollection('examinee'),

			////////////////////////
			// DATA CHANGE EVENTS //
			////////////////////////

			'change [id^="input-name-"]': changeExecutionTranslation('name'),
			'change [id^="textarea-description-"]': changeExecutionTranslation('description'),
			'change #input-duration': changeExecution((event, template, $this) => template.execution.get().durationMinutes = parseInt($this.val())),
			'change .input-weight': changeExecutionCollection('exercise', (e, t, $) => ({ weight: parseInt($.val()) })),

			////////////////////////
			// PERSISTENCE EVENTS //
			////////////////////////

			'click .btn-save'(event, template) {
				if (testValidExecution(template.execution.get()))
					Meteor.call('saveExecution', template.execution.get(), Progressor.handleError(result => {
						Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'success');
						Router.go('examinationExecutionEdit', { _id: result });
					}, false));
				else
					Progressor.showAlert(i18n('examination.executionIsNotValidMessage'));
			},
			'click .btn-delete': (e, t) => Meteor.call('deleteExecution', { _id: t.execution.get()._id }, Progressor.handleError(() => Router.go('home'), false)),
			'click btn-start-execution'(event, template) {
				Meteor.call('startExecution', { _id: template.execution._id }, Progressor.handleError(() => {
					Router.go('examinationExecutionView', { _id: template.execution._id });
				}, false));
			},

			///////////////////
			// EXPORT EVENTS //
			///////////////////

			'click .btn-export-pdf-empty': (e, t) => Progressor.generateExecutionPDF(getExecution())
		});

})();
