(function () {
	'use strict';

	let isCreate, exercise;

	function getDefaultExercise() {
		return {
			type: 2,
			names: [],
			descriptions: [],
			options: [{
				language: i18n.getLanguage(),
				options: [null]
			}],
			solution: [],
			multipleSolutions: true,
			solutionVisible: false
		};
	}

	function testValidExercise({ programmingLanguage, category_id, difficulty, names, descriptions, options }) {
		const notEmpty = /[^\s]+/;
		return programmingLanguage && _.any(Progressor.getProgrammingLanguages(), l => l._id === programmingLanguage)
					 && category_id && Progressor.categories.find({ _id: category_id }).count() === 1
					 && difficulty && _.contains(Progressor.getDifficulties(), difficulty)
					 && names && names.length && _.any(names, n => n.name && notEmpty.test(n.name))
					 && descriptions && descriptions.length && _.any(descriptions, d => d.description && notEmpty.test(d.description))
					 && options && options.length && _.chain(_.chain(_.map(options, o => o.options.length)).max().value()).range().all(i => _.any(options, o => o.options[i] && notEmpty.test(o.options[i]))).value();
	}

	Template.multipleEdit.onRendered(function () {
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

	Template.multipleEdit.onCreated(function () {
		isCreate = new ReactiveVar(false);
		exercise = new ReactiveVar(getDefaultExercise());
	});

	Template.multipleEdit.helpers(
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
			i18nExerciseNamesDescriptions: () => _.map(i18n.getLanguages(), function (name, id) {
				const nofOptions = _.chain([1, _.map(exercise.get().options, o => o.options.length)]).flatten().max().value();
				const options = _.chain([i18n.getOptionsForLanguage(exercise.get(), id) || [], _.map(_.range(nofOptions), () => null)]).flatten().first(nofOptions)
					.map((o, i) => ({ lang: id, text: o, isSolution: _.contains(exercise.get().solution, i), placeholder: (i18n.getOptions(exercise.get()) || [])[i] })).value();
				return {
					_id: id, language: name, isActive: id === i18n.getLanguage(),
					name: i18n.getNameForLanguage(exercise.get(), id),
					description: i18n.getDescriptionForLanguage(exercise.get(), id),
					options
				};
			})
		});

	function changeExercise(cb) {
		return function (ev) {
			const ret = cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
			exercise.dep.changed();
			return ret;
		};
	}

	function changeExerciseTranslation(translationName) {
		return changeExercise(function (ev, $this) {
			const value = $this.val(), language = $this.closest('[data-lang]').data('lang'), elements = exercise.get()[`${translationName}s`];
			let elementIndex = -1;
			const element = _.find(elements, (e, i) => (elementIndex = e.language === language ? i : elementIndex) >= 0);
			if (!value) elements.splice(elementIndex, 1);
			else if (element) element[translationName] = value;
			else elements.push({ language, [translationName]: value });
		});
	}

	function changeExerciseSubtranslation(translationName) {
		return changeExercise(function (ev, $this) {
			const value = $this.val(), language = $this.closest('[data-lang]').data('lang'), elements = exercise.get()[`${translationName}s`];
			const elementIndex = $this.closest('.container-translation').prevAll('.container-translation').length, element = elements[elementIndex], subelements = element ? element[`${translationName}s`] : null;
			const subelementIndex = $this.closest(`.container-${translationName}`).prevAll(`.container-${translationName}`).length;
			if (element) subelements[subelementIndex] = value || null;
			else elements.push({ language, [`${translationName}s`]: _.map(_.range(subelementIndex + 1), i => i === subelementIndex ? value : null) });
		});
	}

	function changeExerciseSolution(propertiesFunction) {
		return changeExercise(function (ev, $this) {
			const index = $this.closest('.container-option').prevAll('.container-option').length, $multiple = $('#checkbox-multiple-solutions');
			exercise.get().solution = _.chain([_.filter(exercise.get().solution, i => i !== index), _.first([index], propertiesFunction(ev, $this) ? 1 : 0)]).flatten().sortBy(_.identity).value();
			$multiple.prop('disabled', exercise.get().solution.length > 1).prop('checked', $multiple.prop('checked') || exercise.get().solution.length > 1);
		});
	}

	function addExerciseSubtranslation(translationName) {
		return changeExercise(function (ev, $this) {
			const elements = exercise.get()[`${translationName}s`], subelementIndex = $this.closest(`.container-${translationName}`).prevAll(`.container-${translationName}`).length;
			_.each(elements, e => e[`${translationName}s`].splice(subelementIndex + 1, 0, null));
		});
	}

	function removeExerciseSubtranslation(translationName) {
		return changeExercise(function (ev, $this) {
			const elements = exercise.get()[`${translationName}s`], subelementIndex = $this.closest(`.container-${translationName}`).prevAll(`.container-${translationName}`).length;
			_.each(elements, e => e[`${translationName}s`].splice(subelementIndex, 1));
		});
	}

	Template.multipleEdit.events(
		{
			'click .btn-add-option': addExerciseSubtranslation('option'),
			'click .btn-remove-option': removeExerciseSubtranslation('option'),
			'change #select-language': changeExercise((ev, $this) => !exercise.get()._id ? exercise.get().programmingLanguage = $this.val() : null),
			'change #select-category': changeExercise((ev, $this) => exercise.get().category_id = $this.val()),
			'change #select-difficulty': changeExercise((ev, $this) => exercise.get().difficulty = parseInt($this.val())),
			'change [id^="input-name-"]': changeExerciseTranslation('name'),
			'change [id^="textarea-description-"]': changeExerciseTranslation('description'),
			'change .input-option-text': changeExerciseSubtranslation('option'),
			'change .input-option-checked': changeExerciseSolution((ev, $this) => $this.prop('checked') && $this.val() === 'true'),
			'change #checkbox-multiple-solutions': changeExercise((ev, $this) => exercise.get().multipleSolutions = $this.prop('checked')),
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
