(function () {
	'use strict';

	let isCreate, exercise;

	function getDefaultExercise() {
		return {
			type: 2,
			names: [],
			descriptions: [],
			options: [{
				options: [null]
			}],
			solution: null,
			multipleSolutions: true,
			solutionVisible: false
		};
	}

	//TODO: analog defaultExercise anpassen
	function testValidExercise(exercise) {
		const notEmpty = /[^\s]+/;
		const { programmingLanguage, category_id, difficulty, names, descriptions } = exercise;
		return programmingLanguage && _.any(Progressor.getProgrammingLanguages(), l => l._id === programmingLanguage)
					 && category_id && Progressor.categories.find({ _id: category_id }).count() === 1
					 && difficulty && _.contains(Progressor.getDifficulties(), difficulty)
					 && names && names.length && _.any(names, n => n.name && notEmpty.test(n.name))
					 && descriptions && descriptions.length && _.any(descriptions, d => d.description && notEmpty.test(d.description))
					 && exercise.functions && exercise.functions.length && testValidFunctions(exercise)
					 && exercise.testCases && exercise.testCases.length && testValidTestCases(exercise);
	}

	Template.multipleEdit.onRendered(function () {
		this.autorun(function () {
			const live = Progressor.exercises.findOne();
			const detached = Tracker.nonreactive(() => exercise.get());
			if (!live || !detached || live._id !== detached._id) {
				let _exercise = live || getDefaultExercise();
				if (isCreate.get())
					_exercise = _.omit(_exercise, '_id');
				exercise.set(Progressor.joinCategory(_exercise));
			} else
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
				isCreate.set(!context);
				return exercise.get();
			},
			exercise: () => exercise.get(),
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
				const nofOptions = _.max(_.map(exercise.get().options, o => o.options.length));
				const options = _.chain(i18n.getOptionsForLanguage(exercise.get(), id) || []).union(_.range(nofOptions)).first(nofOptions)
					.map((o, i) => ({
						lang: id,
						text: typeof o === 'string' ? o : null,
						placeholder: '...',
						isSolution: _.contains(exercise.get().solution, i)
					})).value();
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

	function removeExerciseCollectionItem(collectionName, cssClass) {
		return changeExercise(function (ev, $this) {
			const removeIndex = $this.closest('.' + cssClass).prevAll('.' + cssClass).length;
			exercise.get()[collectionName] = _.filter(exercise.get()[collectionName], (e, i) => i !== removeIndex);
		});
	}
	
	
	
	Template.multipleEdit.events(
		{
			'click .btn-add-option': changeExercise(() => exercise.get().options.push(getDefaultExercise().options[0])),
			'click .btn-remove-option': removeExerciseCollectionItem('options', 'container-option'),
			

			'change #select-language': changeExercise((ev, $this) => !exercise.get()._id ? exercise.get().programmingLanguage = $this.val() : null),
			'change #select-category': changeExercise((ev, $this) => exercise.get().category_id = $this.val()),
			'change #select-difficulty': changeExercise((ev, $this) => exercise.get().difficulty = parseInt($this.val())),

			
			//ToDo: Anpassen
			'click .btn-save, click .btn-release-request': changeExercise(function (ev, $this) {
				exercise.get().fragment = Session.get('fragment');
				exercise.get().solution = Session.get('solution');
				if ($this.hasClass('btn-release-request'))
					if (Progressor.isExerciseSuccess(exercise.get(), executionResults.get()))
						exercise.get().released = { requested: new Date() };
					else
						Progressor.showAlert(i18n('exercise.isNotTestedMessage'));
				if (testValidExercise(exercise.get()))
					Meteor.call('saveExercise', _.omit(exercise.get(), 'category'), Progressor.handleError(res => Router.go('exerciseSolve', { _id: res }), false));
				else
					Progressor.showAlert(i18n('exercise.isNotValidMessage'));
			}),
			'click .btn-delete': () => Meteor.call('deleteExercise', { _id: exercise.get()._id }, Progressor.handleError(() => Router.go('exerciseSearch', { _id: exercise.get().programmingLanguage }), false)),

		});
})();