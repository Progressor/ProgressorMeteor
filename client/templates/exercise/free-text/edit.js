(function () {
	'use strict';

	let isCreate, exercise, hasPattern;

	function getDefaultExercise() {
		return {
			type: 3,
			names: [],
			descriptions: [],
			solution: [null],
			solutionVisible: false
		};
	}

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

	function testValidExercise({ programmingLanguage, category_id, difficulty, names, descriptions, pattern, solution }) {
		const notEmpty = /[^\s]+/;
		return programmingLanguage && _.some(Progressor.getProgrammingLanguages(), l => l._id === programmingLanguage)
					 && category_id && Progressor.categories.find({ _id: category_id }).count() === 1
					 && difficulty && _.contains(Progressor.getDifficulties(), difficulty)
					 && names && names.length && _.some(names, n => n.name && notEmpty.test(n.name))
					 && descriptions && descriptions.length && _.some(descriptions, d => d.description && notEmpty.test(d.description))
					 && testRegExp(pattern)
					 && _.every(solution, s => notEmpty.test(s) && testSolution(pattern, s));
	}

	Template.textEdit.onRendered(function () {
		this.autorun(function () {
			const live = Progressor.exercises.findOne();
			const detached = Tracker.nonreactive(() => exercise.get());
			if (!live || !detached || live._id !== detached._id) {
				let _exercise = live || getDefaultExercise();
				if (isCreate.get())
					_exercise = _.omit(_exercise, '_id', 'released', 'author_id', 'lastEditor_id', 'lastEdited');
				exercise.set(Progressor.joinCategory(_exercise));
			} else if (live.lastEditor_id !== Meteor.userId())
				Progressor.showAlert(i18n('form.documentChangedMessage'));
		});
	});

	Template.textEdit.onCreated(function () {
		isCreate = new ReactiveVar(false);
		exercise = new ReactiveVar(getDefaultExercise());
	});

	Template.textEdit.helpers(
		{
			safeExercise(context) {
				isCreate.set(!context || !context._id);
				return exercise.get();
			},
			exists: () => exercise.get() && exercise.get()._id,
			canSave: () => !exercise.get() || !exercise.get()._id || !exercise.get().released || !exercise.get().released.requested || Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN),
			exerciseSearchData: () => ({ _id: exercise.get().programmingLanguage }),
			exerciseDuplicateQuery: () => ({ duplicate: exercise.get()._id }),
			categoryEditData: () => ( exercise.get() && exercise.get().category_id ? { _id: exercise.get().category_id } : null),
			userName: Progressor.getUserName,
			not: b => !b,
			i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), language => _.extend({}, language, {
				name: i18n.getProgrammingLanguage(language._id),
				isActive: language._id === exercise.get().programmingLanguage
			})),
			i18nCategories: () => Progressor.categories.find({ programmingLanguage: exercise.get().programmingLanguage }).map(category => _.extend({}, category, {
				name: i18n.getName(category),
				isActive: category._id === exercise.get().category_id
			})),
			i18nDifficulties: () => _.map(Progressor.getDifficulties(), difficulty => ({
				_id: difficulty, name: i18n.getDifficulty(difficulty),
				isActive: difficulty === exercise.get().difficulty
			})),
			i18nExerciseNamesDescriptions: () => _.map(i18n.getLanguages(), (name, id) => ({
				_id: id, language: name, isActive: id === i18n.getLanguage(),
				name: i18n.getNameForLanguage(exercise.get(), id),
				description: i18n.getDescriptionForLanguage(exercise.get(), id)
			})),
			hasPattern: () => hasPattern
		});

	function changeExercise(cb) {
		return function (ev) {
			const ret = cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
			exercise.dep.changed();
			return ret;
		};
	}

	function changeExerciseCollection(collectionName, cssClass, propertiesFunction) {
		return changeExercise((ev, $this) => _.extend(exercise.get()[collectionName][$this.closest(`.${cssClass}`).prevAll(`.${cssClass}`).length], propertiesFunction(ev, $this)));
	}
	
	function changeExerciseTranslation(translationName) {
		return changeExercise(function (ev, $this) {
			const value = $this.val(), elements = exercise.get()[`${translationName}s`], language = $this.closest('[data-lang]').data('lang');
			let elementIndex = -1;
			const element = _.find(elements, (e, i) => (elementIndex = e.language === language ? i : elementIndex) >= 0);
			if (!value) elements.splice(elementIndex, 1);
			else if (element) element[translationName] = value;
			else elements.push({ language, [translationName]: value });
		});
	}

	function addExerciseCollectionItem(collectionName, cssClass, generator) {
		return changeExercise(function (ev, $this) {
			const removeIndex = $this.closest(`.${cssClass}`).prevAll(`.${cssClass}`).length;
			exercise.get()[collectionName].splice(removeIndex + 1, 0, generator(ev, $this));
		});
	}

	function removeExerciseCollectionItem(collectionName, cssClass) {
		return changeExercise(function (ev, $this) {
			const removeIndex = $this.closest(`.${cssClass}`).prevAll(`.${cssClass}`).length;
			exercise.get()[collectionName].splice(removeIndex, 1);
		});
	}

	Template.textEdit.events(
		{
			'click .btn-add-solution': addExerciseCollectionItem('solution', 'container-solution', () => getDefaultExercise().solution[0]),
			'click .btn-remove-solution': removeExerciseCollectionItem('solution'),
			'keyup #input-pattern'(ev) {
				const $this = $(ev.currentTarget), $group = $this.closest('.form-group').removeClass('has-error'), pattern = $this.val();
				if (!testRegExp(pattern))
					$group.addClass('has-error');
			},
			'keyup #textarea-solution'(ev) {
				const $this = $(ev.currentTarget), $group = $this.closest('.form-group').removeClass('has-error'), pattern = $('#input-pattern').val();
				if (testRegExp(pattern) && !testSolution(pattern, $this.val()))
					$group.addClass('has-error');
			},
			'change #select-language': changeExercise((ev, $this) => !exercise.get()._id ? exercise.get().programmingLanguage = $this.val() : null),
			'change #select-category': changeExercise((ev, $this) => exercise.get().category_id = $this.val()),
			'change #select-difficulty': changeExercise((ev, $this) => exercise.get().difficulty = parseInt($this.val())),
			'change [id^="input-name-"]': changeExerciseTranslation('name'),
			'change [id^="textarea-description-"]': changeExerciseTranslation('description'),
			'change #input-pattern': changeExercise((ev, $this) => $this.val().length ? exercise.get().pattern = $this.val() : delete exercise.get().pattern),
			'change #textarea-solution': changeExercise((ev, $this) => exercise.get().solution = [$this.val()]),
			'change .input-solution-text': changeExerciseCollection('solution', 'container-solution', (ev, $this) => $this.val()),
			'change #checkbox-solution-visible': changeExercise((ev, $this) => exercise.get().solutionVisible = $this.prop('checked')),
			'click .btn-save, click .btn-release-request': changeExercise(function (ev, $this) {
				if ($this.hasClass('btn-release-request'))
					exercise.get().released = { requested: new Date() };
				if (testValidExercise(exercise.get()))
					Meteor.call('saveExercise', _.omit(exercise.get(), 'category'), Progressor.handleError(res => Router.go('exerciseSolve', { _id: res }), false));
				else
					Progressor.showAlert(i18n('exercise.isNotValidMessage'));
			}),
			'click .btn-delete': () => Meteor.call('deleteExercise', { _id: exercise.get()._id }, Progressor.handleError(() => Router.go('exerciseSearch', { _id: exercise.get().programmingLanguage }), false))
		});

})();
