(function () {
	'use strict';

	let isCreate, exercise, executorTypes, executionResults, blacklist, blacklistMatches, solutionTyped;

	function getDefaultExercise(initInput = true) {
		return {
			type: 1,
			names: [],
			descriptions: [],
			functions: [{
				inputNames: initInput ? [null] : [],
				inputTypes: initInput ? [null] : [],
				outputNames: ['return'],
				outputTypes: [null]
			}],
			testCases: [{
				inputValues: [],
				expectedOutputValues: [],
				visible: false
			}],
			solution: null,
			solutionVisible: false
		};
	}

	function testExecutorIdentifier(value) {
		return value.length === 0 || /^[A-Z_][A-Z0-9_]*$/i.test(value);
	}

	function testExecutorType(type, isRecursive = false) {
		let executorType = executorTypes.get() ? _.find(executorTypes.get().types, t => type.substr(0, t._id.length) === t._id) : null, index = executorType ? executorType._id.length : 0;
		if (!executorType) return false; //^: find the (outermost) type object and skip its name //verify a type has been found
		else if (executorType.parameterCount > 0) { //if the type has parameters
			if (type.substr(index, 1) !== "<") return false; //verify the next character is the generic open bracket
			index++; //move index forward
			for (let i = 0; i < executorType.parameterCount; i++) { //repeat check for each type parameter
				let delimiter = i === executorType.parameterCount - 1 ? '>' : ',', subLength; //determine the delimiter expected after this type parameter
				if (i > 0) index += type.substr(index).match(/^\s?/)[0].length; //skip optional whitespace after separator
				if ((subLength = testExecutorType(type.substr(index), true)) === false) return false; //verify parameter is a valid type
				index += subLength; //move index forward
				if (type.substr(index, 1) !== delimiter) return false; //verify the next character is the defined delimiter
				index += delimiter.length; //move index forward
			}
		}
		return isRecursive ? index : index === type.length; //recursive: return new index, otherwise: verify end is reached
	}

	function testExecutorValue(value, type, isRecursive = false, separator = null) {
		let executorType = executorTypes.get() ? _.find(executorTypes.get().types, t => type.substr(0, t._id.length) === t._id) : null, typeIndex = executorType ? executorType._id.length : 0, valueIndex = 0, match, number;
		if (executorType.pattern) { //^: find the (outermost) type object and skip its name //if a pattern is specified
			if (!(match = value.match(separator ? `^(${executorType.pattern}?(?=${separator})|${executorType.pattern})` : `^${executorType.pattern}`))) return false; //verify the pattern
			valueIndex += match[0].length; //move index forward //_: verify the number range
			if (executorType.max && !(Number.isFinite(number = (Number.isInteger(executorType.max) ? parseInt : parseFloat)(match[0])) && -executorType.max - 1 <= number && number <= executorType.max)) return false;
		}
		if (executorType.parameterCount > 0) { //if the type as parameters
			typeIndex++; //skip generic open bracket
			let _typeIndex = typeIndex; //remember initial type index position
			for (let j = 0; valueIndex !== value.length; j++) { //repeat until all collection items have been processed
				if (j > 0) { //if item is not the first one
					typeIndex = _typeIndex; //reset type index
					if (executorType.patternSeparator && !(match = value.substr(valueIndex).match(`^${executorType.patternSeparator}`))) return false; //verify item separator
					valueIndex += match[0].length; //move index forward
				}
				for (let i = 0; i < executorType.parameterCount; i++) { //repeat check for each type parameter
					if (i > 0) typeIndex += type.substr(typeIndex).match(/^\s?/)[0].length; //skip optional whitespace after separator //_: recursive call (pass next separator)
					let subLength = testExecutorValue(value.substr(valueIndex), type.substr(typeIndex), true, i < executorType.parameterCount - 1 && executorType.patternInternalSeparators && executorType.patternInternalSeparators[i] ? executorType.patternInternalSeparators[i] : executorType.patternSeparator ? executorType.patternSeparator : null);
					typeIndex += subLength.typIdx; //move index forward
					valueIndex += subLength.valIdx; //move index forward
					typeIndex++; //skip delimiter
					if (i < executorType.parameterCount - 1) { //if there are more parameters to come //_: verify internal separator
						if (executorType.patternInternalSeparators && executorType.patternInternalSeparators[i] && !(match = value.substr(valueIndex).match(`^${executorType.patternInternalSeparators[i]}`))) return false;
						valueIndex += match[0].length; //move index forward
					}
				}
			}
		}
		return isRecursive ? { typIdx: typeIndex, valIdx: valueIndex } : (typeIndex === type.length || executorType.parameterCount > 0) && valueIndex === value.length; //recursive: return new indexes, otherwise: verify end is reached
	}

	Template.programmingEdit.onCreated(function () {
		isCreate = new ReactiveVar(false);
		exercise = new ReactiveVar(getDefaultExercise(false));
		executorTypes = new ReactiveVar(null);
		executionResults = new ReactiveVar([]);
		blacklist = new ReactiveVar(null);
		blacklistMatches = new ReactiveVar([]);
		solutionTyped = false;
		Session.set('solution', null);
	});

	Template.programmingEdit.onRendered(function () {
		// $('body').tooltip({ selector: '[data-toggle="tooltip"]' });

		Meteor.call('getExecutorTypes', (err, res) => err || executorTypes.set(res));

		this.autorun(function () {
			let live = Progressor.exercises.findOne();
			let detached = Tracker.nonreactive(() => exercise.get());
			if (!live || !detached || live._id !== detached._id) {
				let _exercise = live || getDefaultExercise(false);
				if (isCreate.get())
					_exercise = _.omit(_exercise, '_id');
				exercise.set(Progressor.joinCategory(_exercise));
			} else {
				let $alert = $('<div class="alert alert-warning pre-line fade" role="alert"></div>').text(i18n('form.documentChanged')).appendTo($('#global-alerts'));
				Meteor.setTimeout(() => $alert.addClass('in'), 1);
				Meteor.setTimeout(() => $alert.alert('close'), 7500);
			}
		});

		this.autorun(function () {
			if (!solutionTyped)
				if (exercise.get() && exercise.get().solution)
					Session.set('solution', exercise.get().solution);
				else if (exercise.get() && exercise.get().programmingLanguage && Progressor.hasValidFunctions(exercise.get()))
					Meteor.call('getFragment', exercise.get().programmingLanguage, exercise.get(), (err, res) => Session.set('solution', !err ? res : null));
				else
					Session.set('solution', null);
			if (exercise.get() && exercise.get().programmingLanguage) {
				let programmingLanguage = Progressor.getProgrammingLanguage(exercise.get().programmingLanguage);
				if (programmingLanguage)
					$('.CodeMirror')[0].CodeMirror.setOption('mode', programmingLanguage.codeMirror);
			}
		});
	});

	Template.programmingEdit.helpers(
		{
			safeExercise(context) {
				isCreate.set(!context);
				return exercise.get();
			},
			exercise: () => exercise.get(),
			exists: () => exercise.get() && exercise.get()._id,
			canSave: () => !exercise.get() || !exercise.get()._id || !exercise.get().released || !exercise.get().released.requested || _.contains(Meteor.user().roles[Roles.GLOBAL_GROUP], Progressor.ROLE_ADMIN),
			exerciseSearchData: () => ({ _id: exercise.get().programmingLanguage }),
			exerciseDuplicateQuery: () => ({ duplicate: exercise.get()._id }),
			categoryEditData: () => ( exercise.get() && exercise.get().category_id ? { _id: exercise.get().category_id } : null),
			userName: Progressor.getUserName,
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
			codeMirrorOptions: () => Progressor.getCodeMirrorConfiguration(),
			i18nExerciseNamesDescriptions: () => _.map(i18n.getLanguages(), (name, id) => ({
				_id: id, language: name, isActive: id === i18n.getLanguage(),
				name: i18n.getNameForLanguage(exercise.get(), id),
				description: i18n.getDescriptionForLanguage(exercise.get(), id)
			})),
			functions: testCase => _.map(exercise.get().functions, _function => _.extend({}, _function, {
				original: _function,
				outputType: _function.outputTypes[0],
				inputs: _.map(_function.inputTypes.length ? _function.inputTypes : getDefaultExercise().functions[0].inputTypes, (t, i) => ({ type: t, name: _function.inputNames ? _function.inputNames[i] : null })),
				isActive: testCase && testCase.functionName === _function.name
			})),
			testCases: () => _.map(exercise.get().testCases, testCase => {
				let _function = _.find(exercise.get().functions, f => f.name === testCase.functionName && testCase.functionName !== undefined);
				let fillValues = (values, types) => types ? _.chain(values).union(_.range(types.length)).first(types.length).map((v, i) => ({ value: typeof(v) === 'string' ? v : null, type: types[i] })).value() : _.map(values, (v, i) => ({ value: v }));
				return _.extend({}, testCase, {
					original: testCase,
					inputValues: fillValues(testCase.inputValues, _function ? _function.inputTypes : null),
					expectedOutputValues: fillValues(testCase.expectedOutputValues, _function ? _function.outputTypes : null)
				});
			}),
			executorTypes: () => executorTypes.get() ? executorTypes.get().types : [],
			executorValues: () => executorTypes.get() ? _.map(executorTypes.get().values, v => _.extend({ typeLabels: v.types.join(', ') }, v)) : [],

			//execution
			blackListMessage: () => blacklistMatches.get().length ? i18n('exercise.blacklistMatch', blacklistMatches.get().join(', ')) : null,
			testCasesEvaluated: () => Progressor.isExerciseEvaluated(exercise.get(), executionResults.get()),
			testCaseSuccess: c => Progressor.isTestCaseSuccess(exercise.get(), c.original, executionResults.get()),
			testCaseActualOutput: c => Progressor.getActualTestCaseOutput(exercise.get(), c.original, executionResults.get()),
			executionFatal: () => Progressor.isExecutionFatal(exercise.get(), executionResults.get())
		});

	function changeExercise(cb) {
		return function (ev) {
			let ret = cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
			exercise.dep.changed();
			return ret;
		};
	}

	function changeExerciseTranslation(translationName) {
		return changeExercise(function (ev) {
			let $this = $(ev.currentTarget), value = $this.val(), elements = exercise.get()[translationName + 's'], elementIndex = -1;
			let element = _.find(elements, (e, i) => (elementIndex = e.language === $this.data('lang') ? i : elementIndex) >= 0);
			if (!value)
				elements.splice(elementIndex, 1);
			else if (element)
				element[translationName] = value;
			else
				elements.push({ language: $this.data('lang'), [translationName]: value });
		});
	}

	function changeExerciseCollection(collectionName, cssClass, propertiesFunction) {
		return changeExercise((ev, $this) => _.extend(exercise.get()[collectionName][$this.closest('.' + cssClass).prevAll('.' + cssClass).length], propertiesFunction(ev, $this)));
	}

	function changeExerciseSubcollection(collectionName, cssClass1, propertyName, cssClass2) {
		return changeExercise((ev, $this) => exercise.get()[collectionName][$this.closest('.' + cssClass1).prevAll('.' + cssClass1).length][propertyName][$this.closest('.' + cssClass2).prevAll('.' + cssClass2).length] = $this.val());
	}

	function removeExerciseCollectionItem(collectionName, cssClass) {
		return changeExercise(function (ev, $this) {
			let removeIndex = $this.closest('.' + cssClass).prevAll('.' + cssClass).length;
			exercise.get()[collectionName] = _.filter(exercise.get()[collectionName], (e, i) => i !== removeIndex);
		});
	}

	function removeExerciseSubcollectionItems(collectionName, cssClass1, propertyNames, cssClass2) {
		return changeExercise(function (ev, $this) {
			let element = exercise.get()[collectionName][$this.closest('.' + cssClass1).prevAll('.' + cssClass1).length], removeIndex = $this.closest('.' + cssClass2).prevAll('.' + cssClass2).length;
			_.each(propertyNames, p => element[p] = _.filter(element[p], (e, i) => i !== removeIndex));
		});
	}

	Template.programmingEdit.events(
		{
			'keyup .input-function-name'(ev) {
				let $this = $(ev.currentTarget), $group = $this.closest('.form-group');
				let $groups = $('.input-function-name').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$group.addClass('has-error');
				_.chain($groups).groupBy(e => $(e).val()).filter(g => g.length > 1).flatten().each(e => $(e).closest('.form-group').addClass('has-error'));
			},
			'keyup .input-parameter-name'(ev) {
				let $this = $(ev.currentTarget), $group = $this.closest('.form-group'), $function = $this.closest('.container-function');
				let $groups = $function.find('.input-parameter-name').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$group.addClass('has-error');
				_.chain($groups).groupBy(e => $(e).val()).filter(g => g.length > 1).flatten().each(e => $(e).closest('.form-group').addClass('has-error'));
			},
			'keyup .exec-type': ev => {
				let $this = $(ev.currentTarget), $group = $this.closest('.form-group').removeClass('has-error');
				if (!testExecutorType($this.val()))
					$group.addClass('has-error');
			},
			'keyup .exec-value': ev => {
				let $this = $(ev.currentTarget), $group = $this.closest('.form-group').removeClass('has-error');
				if (!testExecutorValue($this.val(), $this.attr('data-type'))) //cannot use .data(), it will not update
					$group.addClass('has-error');
			},
			'click .btn-add-function': changeExercise(() => exercise.get().functions.push(getDefaultExercise().functions[0])),
			'click .btn-add-parameter': changeExercise((ev, $this) => exercise.get().functions[$this.closest('.container-function').prevAll('.container-function').length].inputTypes.push(null)),
			'click .btn-add-testcase': changeExercise(() => exercise.get().testCases.push(getDefaultExercise().testCases[0])),
			'click .btn-remove-function': removeExerciseCollectionItem('functions', 'container-function'),
			'click .btn-remove-parameter': removeExerciseSubcollectionItems('functions', 'container-function', ['inputNames', 'inputTypes'], 'container-parameter'),
			'click .btn-remove-testcase': removeExerciseCollectionItem('testCases', 'container-testcase'),
			'change #select-language': changeExercise((ev, $this) => !exercise.get()._id ? exercise.get().programmingLanguage = $this.val() : null),
			'change #select-category': changeExercise((ev, $this) => exercise.get().category_id = $this.val()),
			'change #select-difficulty': changeExercise((ev, $this) => exercise.get().difficulty = parseInt($this.val())),
			'change [id^="input-name-"]': changeExerciseTranslation('name'),
			'change [id^="textarea-description-"]': changeExerciseTranslation('description'),
			'change .input-function-name': changeExerciseCollection('functions', 'container-function', (ev, $this) => ({ name: $this.val() })),
			'change .input-function-type': changeExerciseCollection('functions', 'container-function', (ev, $this) => ({ outputNames: ['return'], outputTypes: [$this.val()] })),
			'change .input-parameter-name': changeExerciseSubcollection('functions', 'container-function', 'inputNames', 'container-parameter'),
			'change .input-parameter-type': changeExerciseSubcollection('functions', 'container-function', 'inputTypes', 'container-parameter'),
			'change .select-testcase-function': changeExerciseCollection('testCases', 'container-testcase', (ev, $this) => ({ functionName: $this.val() })),
			'change .checkbox-testcase-visible': changeExerciseCollection('testCases', 'container-testcase', (ev, $this) => ({ visible: $this.prop('checked') })),
			'change .input-testcase-input': changeExerciseSubcollection('testCases', 'container-testcase', 'inputValues', 'container-inputvalue'),
			'change .input-testcase-expectedoutput': changeExerciseSubcollection('testCases', 'container-testcase', 'expectedOutputValues', 'container-outputvalue'),
			'change #checkbox-solution-visible': changeExercise((ev, $this) => exercise.get().solutionVisible = $this.prop('checked')),
			'click .btn-save, click .btn-release-request': changeExercise(function (ev, $this) {
				exercise.get().solution = Session.get('solution');
				if ($this.hasClass('btn-release-request')) exercise.get().released = { requested: new Date() };
				Meteor.call('saveExercise', _.omit(exercise.get(), 'category'), (err, id) => err || Router.go('exerciseSolve', { _id: id }));
			}),
			'click .btn-delete': () => Meteor.call('deleteExercise', exercise.get(), err => err || Router.go('exerciseSearch', { _id: exercise.get().programmingLanguage })),

			//execution
			'click #button-execute'() {
				let $result = $('.testcase-result').css('opacity', 0.333);
				Meteor.call('execute', exercise.get().programmingLanguage, exercise.get(), Session.get('solution'), (err, res) => {
					let success = !err && Progressor.isExecutionSuccess(exercise.get(), res);
					executionResults.set(!err ? res : null);
					$result.css('opacity', 1);
					$('.execution-result').alert('close');
					let $alert = $(`<div class="alert alert-${success ? 'success' : 'danger'} fade execution-result" role="alert"></div>`).text(i18n(`exercise.testCase.${success ? 'success' : 'failure'}Message`)).appendTo($('#execution-results'));
					Meteor.setTimeout(() => $alert.addClass('in'), 1);
					Meteor.setTimeout(() => $alert.alert('close'), 3000);
				});
			},
			'keyup .CodeMirror': _.throttle(function () {
				solutionTyped = true;
				if (exercise.get().programmingLanguage)
					if (!blacklist.get() || exercise.get().programmingLanguage !== blacklist.get().programmingLanguage) {
						blacklist.set({ programmingLanguage: exercise.get().programmingLanguage });
						Meteor.call('getBlacklist', exercise.get().programmingLanguage, (err, res) => blacklist.set(!err ? _.extend(blacklist.get(), { elements: res }) : null));
					} else {
						let solution = Session.get('solution');
						blacklistMatches.set(_.filter(blacklist.get().elements, blk => solution.indexOf(blk) >= 0));
						$('#button-execute').prop('disabled', blacklistMatches.get().length);
					}
			}, 500)
		});

})();
