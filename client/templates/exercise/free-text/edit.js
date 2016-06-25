(function () {
	'use strict';

	function getDefaultExercise() {
		return {
			type: 3,
			names: [],
			descriptions: [],
			solution: [null],
			solutionVisible: false
		};
	}

	function tmpl() {
		return Template.instance();
	}

	/////////////////////////
	// TEST ENTERED VALUES //
	/////////////////////////

	function testRegExp(pattern) {
		try {
			return !pattern || new RegExp(pattern);
		} catch (ex) {
			return false;
		}
	}

	function testSolution(pattern, solution) {
		return solution && solution.length && new RegExp(pattern).test(solution);
	}

	function testValidExercise({ programmingLanguage, category_id, difficulty, names, descriptions, pattern, solution, released }) {
		const category = Progressor.categories.findOne({ _id: category_id });
		const notEmpty = /[^\s]+/;
		return programmingLanguage && _.some(Progressor.getProgrammingLanguages(), l => l._id === programmingLanguage)
					 && category_id && category && !(category.private && released)
					 && difficulty && _.contains(Progressor.getDifficulties(), difficulty)
					 && names && names.length && _.some(names, n => n.name && notEmpty.test(n.name))
					 && descriptions && descriptions.length && _.some(descriptions, d => d.description && notEmpty.test(d.description))
					 && testRegExp(pattern) && (pattern || solution.length <= 1)
					 && _.every(solution, s => notEmpty.test(s) && testSolution(pattern, s));
	}

	Template.textEdit.onCreated(function () {

		////////////////////////
		// TEMPLATE VARIABLES //
		////////////////////////

		this.isCreate = new ReactiveVar(false);
		this.exercise = new ReactiveVar(getDefaultExercise());

		///////////////////////////////
		// REACTIVE (LOCAL) EXERCISE //
		///////////////////////////////

		this.autorun(() => {
			const live = Progressor.exercises.findOne();
			const detached = Tracker.nonreactive(() => this.exercise.get());
			if (!live || !detached || live._id !== detached._id) {
				let _exercise = live || getDefaultExercise();
				if (this.isCreate.get())
					_exercise = _.omit(_exercise, '_id', 'released', 'archived', 'author_id', 'lastEditor_id', 'lastEdited');
				this.exercise.set(Progressor.joinCategory(_exercise));
			} else if (live.lastEditor_id !== Meteor.userId())
				Progressor.showAlert(i18n('form.documentChangedMessage'));
		});
	});

	//////////////////////
	// EXERCISE HELPERS //
	//////////////////////

	Template.textEdit.helpers(
		{
			safeExercise(context) {
				tmpl().isCreate.set(!context || !context._id);
				return tmpl().exercise.get();
			},
			canSave: () => !tmpl().exercise.get() || !tmpl().exercise.get()._id || !tmpl().exercise.get().released || !tmpl().exercise.get().released.requested || Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN),
			exerciseSearchData: () => ({ _id: tmpl().exercise.get().programmingLanguage }),
			exerciseDuplicateQuery: () => ({ duplicate: tmpl().exercise.get()._id }),
			categoryEditData: () => ( tmpl().exercise.get() && tmpl().exercise.get().category_id ? { _id: tmpl().exercise.get().category_id } : null),
			i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), language => _.extend({}, language, {
				name: i18n.getProgrammingLanguage(language._id),
				isActive: language._id === tmpl().exercise.get().programmingLanguage
			})),
			i18nCategories: () => Progressor.categories.find({ programmingLanguage: tmpl().exercise.get().programmingLanguage }).map(category => _.extend({}, category, {
				name: i18n.getCategoryName(category, tmpl().exercise.get() && tmpl().exercise.get().author_id ? tmpl().exercise.get().author_id : Meteor.userId()),
				isActive: category._id === tmpl().exercise.get().category_id
			})),
			i18nDifficulties: () => _.map(Progressor.getDifficulties(), difficulty => ({
				_id: difficulty, name: i18n.getDifficulty(difficulty),
				isActive: difficulty === tmpl().exercise.get().difficulty
			})),
			i18nExerciseNamesDescriptions: () => _.map(i18n.getLanguages(), (name, id) => ({
				_id: id, language: name, isActive: id === i18n.getLanguage(),
				name: i18n.getNameForLanguage(tmpl().exercise.get(), id),
				description: i18n.getDescriptionForLanguage(tmpl().exercise.get(), id)
			})),
			solution: () => _.map(tmpl().exercise.get().solution, (solution, solutionIndex) => ({ value: solution, solutionIndex }))
		});

	////////////////////
	// EVENT WRAPPERS //
	////////////////////

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

	function changeExerciseCollection(collectionName, itemSupplier) {
		return changeExercise(function (event, template, $this) {
			template.exercise.get()[collectionName][this[`${collectionName}Index`]] = itemSupplier.call(this, event, template, $this, this);
		});
	}

	function addExerciseCollection(collectionName, itemSupplier) {
		return changeExercise(function (event, template, $this) {
			template.exercise.get()[collectionName].splice(this[`${collectionName}Index`] + 1, 0, itemSupplier.call(this, event, $this));
		});
	}

	function removeExerciseCollection(collectionName) {
		return changeExercise(function (event, template) {
			const collection = template.exercise.get()[collectionName];
			collection.splice(this[`${collectionName}Index`], 1);
			if (!collection.length)
				collection.push(getDefaultExercise()[collectionName][0]);
		});
	}

	Template.textEdit.events(
		{

			///////////////////////
			// COLLECTION EVENTS //
			///////////////////////

			'click .btn-add-solution': addExerciseCollection('solution', () => getDefaultExercise().solution[0]),
			'click .btn-remove-solution': removeExerciseCollection('solution'),

			////////////////////////
			// DATA CHANGE EVENTS //
			////////////////////////

			'keyup #input-pattern'(event, template) {
				const $this = $(event.currentTarget), $group = $this.closest('.form-group').removeClass('has-error'), pattern = $this.val();
				if (!testRegExp(pattern))
					$group.addClass('has-error');
				template.$('.input-solution').closest('.form-group').removeClass('has-error');
			},
			'keyup .input-solution'(event, template) {
				const $this = $(event.currentTarget), $group = $this.closest('.form-group').removeClass('has-error'), pattern = template.$('#input-pattern').val();
				if (testRegExp(pattern) && !testSolution(pattern, $this.val()))
					$group.addClass('has-error');
			},
			'change #select-language': changeExercise((e, t, $) => !t.exercise.get()._id ? t.exercise.get().programmingLanguage = $.val() : null),
			'change #select-category': changeExercise((e, t, $) => t.exercise.get().category_id = $.val()),
			'change #select-difficulty': changeExercise((e, t, $) => t.exercise.get().difficulty = parseInt($.val())),
			'change [id^="input-name-"]': changeExerciseTranslation('name'),
			'change [id^="textarea-description-"]': changeExerciseTranslation('description'),
			'keyup #input-pattern, change #input-pattern': changeExercise((e, t, $) => $.val().length ? t.exercise.get().pattern = $.val() : delete t.exercise.get().pattern),
			'change .input-solution': changeExerciseCollection('solution', (e, t, $) => $.val()),
			'change #checkbox-solution-visible': changeExercise((e, t, $) => t.exercise.get().solutionVisible = $.prop('checked')),

			////////////////////////
			// PERSISTENCE EVENTS //
			////////////////////////

			'click .btn-save, click .btn-release-request': changeExercise(function (event, template, $this) {
				if ($this.hasClass('btn-release-request'))
					template.exercise.get().released = { requested: new Date() };
				if (testValidExercise(template.exercise.get()))
					Meteor.call('saveExercise', _.omit(template.exercise.get(), 'category'), Progressor.handleError(r => Router.go('exerciseSolve', { _id: r }), false));
				else
					Progressor.showAlert(i18n('exercise.isNotValidMessage'));
			}),
			'click .btn-delete': (event, template) => Meteor.call('deleteExercise', { _id: template.exercise.get()._id }, Progressor.handleError(() => Router.go('exerciseSearch', { _id: template.exercise.get().programmingLanguage }), false))
		});

})();
