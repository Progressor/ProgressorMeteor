(function () {
	'use strict';

	function getDefaultExercise() {
		return {
			type: 1,
			names: [],
			descriptions: [],
			functions: [{
				inputNames: [],
				inputTypes: [],
				outputNames: ['return'],
				outputTypes: [null]
			}],
			testCases: [{
				inputValues: [],
				expectedOutputValues: [],
				visible: false
			}],
			fragment: null,
			solution: null,
			solutionVisible: false
		};
	}

	function tmpl() {
		return Template.instance();
	}

	function testExecutorIdentifier(value) {
		return !value || /^[A-Z_][A-Z0-9_]*$/i.test(value);
	}

	function testExecutorType(type, isRecursive = false) {
		const executorType = tmpl().executorTypes.get() ? _.find(tmpl().executorTypes.get().types, t => type.substr(0, t._id.length) === t._id) : null;
		let index = executorType ? executorType._id.length : 0;
		if (!executorType) return false; //^: find the (outermost) type object and skip its name //verify a type has been found
		else if (executorType.parameterCount > 0) { //if the type has parameters
			if (type.substr(index, 1) !== "<") return false; //verify the next character is the generic open bracket
			index++; //move index forward
			for (let i = 0; i < executorType.parameterCount; i++) { //repeat check for each type parameter
				const delimiter = i === executorType.parameterCount - 1 ? '>' : ','; //determine the delimiter expected after this type parameter
				if (i > 0) index += type.substr(index).match(/^\s?/)[0].length; //skip optional whitespace after separator
				let subLength = testExecutorType(type.substr(index), true);
				if (subLength === false) return false; //verify parameter is a valid type
				index += subLength; //move index forward
				if (type.substr(index, 1) !== delimiter) return false; //verify the next character is the defined delimiter
				index += delimiter.length; //move index forward
			}
		}
		return isRecursive ? index : index === type.length; //recursive: return new index, otherwise: verify end is reached
	}

	function testExecutorValue(value, type, isRecursive = false, separator = null) {
		const executorType = tmpl().executorTypes.get() ? _.find(tmpl().executorTypes.get().types, t => type && type.substr(0, t._id.length) === t._id) : null;
		let typeIndex = executorType ? executorType._id.length : 0, valueIndex = 0, match, number;
		if (executorType.pattern) { //^: find the (outermost) type object and skip its name //if a pattern is specified
			if (!(match = value.match(separator ? `^(${executorType.pattern}?(?=${separator})|${executorType.pattern})` : `^${executorType.pattern}`))) return false; //verify the pattern
			valueIndex += match[0].length; //move index forward //_: verify the number range
			if (executorType.max && !(Number.isFinite(number = (Number.isInteger(executorType.max) ? parseInt : parseFloat)(match[0])) && -executorType.max - 1 <= number && number <= executorType.max)) return false;
		}
		if (executorType.parameterCount > 0) { //if the type as parameters
			typeIndex++; //skip generic open bracket
			const _typeIndex = typeIndex; //remember initial type index position
			for (let j = 0; valueIndex !== value.length; j++) { //repeat until all collection items have been processed
				if (j > 0) { //if item is not the first one
					typeIndex = _typeIndex; //reset type index
					if (executorType.patternSeparator && !(match = value.substr(valueIndex).match(`^${executorType.patternSeparator}`))) return false; //verify item separator
					valueIndex += match[0].length; //move index forward
				}
				for (let i = 0; i < executorType.parameterCount; i++) { //repeat check for each type parameter
					if (i > 0) typeIndex += type.substr(typeIndex).match(/^\s?/)[0].length; //skip optional whitespace after separator //_: recursive call (pass next separator)
					const subLength = testExecutorValue(value.substr(valueIndex), type.substr(typeIndex), true, i < executorType.parameterCount - 1 && executorType.patternInternalSeparators && executorType.patternInternalSeparators[i] ? executorType.patternInternalSeparators[i] : executorType.patternSeparator ? executorType.patternSeparator : null);
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

	function testValidExercise(exercise) {
		const notEmpty = /[^\s]+/;
		const { programmingLanguage, category_id, difficulty, names, descriptions, functions, testCases } = exercise;
		return programmingLanguage && _.any(Progressor.getProgrammingLanguages(), l => l._id === programmingLanguage)
					 && category_id && Progressor.categories.find({ _id: category_id }).count() === 1
					 && difficulty && _.contains(Progressor.getDifficulties(), difficulty)
					 && names && names.length && _.some(names, n => n.name && notEmpty.test(n.name))
					 && descriptions && descriptions.length && _.some(descriptions, d => d.description && notEmpty.test(d.description))
					 && functions && functions.length && testValidFunctions(exercise)
					 && testCases && testCases.length && testValidTestCases(exercise);
	}

	function testValidFunctions({ functions }) {
		return _.every(functions, f => f.name && testExecutorIdentifier(f.name)
																	 && f.inputNames.length === f.inputTypes.length && _.every(f.inputNames, n => n && testExecutorIdentifier(n)) && _.every(f.inputTypes, t => t && testExecutorType(t))
																	 && f.outputNames.length === f.outputTypes.length && _.every(f.outputNames, n => n && testExecutorIdentifier(n)) && _.every(f.outputTypes, t => t && testExecutorType(t)));
	}

	function testValidTestCases({ functions, testCases }) {
		return _.every(testCases, testCase => {
			const _function = _.where(functions, { name: testCase.functionName });
			return testCase.functionName && _function
						 && _function.inputTypes.length === testCase.inputValues.length && _.every(testCase.inputValues, (v, i) => testExecutorValue(v, _function.inputTypes[i]))
						 && _function.outputTypes.length === testCase.expectedOutputValues.length && _.every(testCase.expectedOutputValues, (v, i) => testExecutorValue(v, _function.outputTypes[i]));
		});
	}

	Template.programmingEdit.onCreated(function () {
		this.isCreate = new ReactiveVar(false);
		this.exercise = new ReactiveVar(getDefaultExercise());
		this.executorTypes = new ReactiveVar(null);
		this.executionStatus = new ReactiveVar(0x0);
		this.executionResults = new ReactiveVar([]);
		this.blacklist = new ReactiveVar(null);
		this.blacklistMatches = new ReactiveVar([]);
		this.fragmentTyped = false;
		this.solutionTyped = false;
		Session.set('fragment', null);
		Session.set('solution', null);
	});

	Template.programmingEdit.onRendered(function () {
		Meteor.call('getExecutorTypes', Progressor.handleError(r => this.executorTypes.set(r), false));

		this.autorun(() => {
			const live = Progressor.exercises.findOne();
			const detached = Tracker.nonreactive(() => this.exercise.get());
			if (!live || !detached || live._id !== detached._id) {
				let _exercise = live || getDefaultExercise();
				if (this.isCreate.get())
					_exercise = _.omit(_exercise, '_id', 'released', 'author_id', 'lastEditor_id', 'lastEdited');
				this.exercise.set(Progressor.joinCategory(_exercise));
				this.executionResults.set([]);
				this.fragmentTyped = false;
				this.solutionTyped = false;
				Session.set('fragment', null);
				Session.set('solution', null);
			} else if (live.lastEditor_id !== Meteor.userId())
				Progressor.showAlert(i18n('form.documentChangedMessage'));
		});

		this.autorun(() => {
			const result = Progressor.results.findOne();
			if (!this.fragmentTyped && (this.fragmentTyped = this.exercise.get() && this.exercise.get().fragment))
				Session.set('fragment', this.exercise.get().fragment);
			if (!this.solutionTyped)
				if (this.solutionTyped = this.exercise.get() && this.exercise.get().solution)
					Session.set('solution', this.exercise.get().solution);
				else if (this.solutionTyped = result && result.fragment)
					Session.set('solution', result.fragment);
			if ((!this.fragmentTyped || !this.solutionTyped) && this.exercise.get() && this.exercise.get().programmingLanguage && testValidFunctions(this.exercise.get()))
				Meteor.call('getFragment', this.exercise.get().programmingLanguage, _.omit(this.exercise.get(), '_id', 'category'), Progressor.handleError((error, result) => {
					if (!this.fragmentTyped) Session.set('fragment', !error ? result : null);
					if (!this.solutionTyped) Session.set('solution', !error ? result : null);
				}));
			if (this.exercise.get() && this.exercise.get().programmingLanguage) {
				const programmingLanguage = Progressor.getProgrammingLanguage(this.exercise.get().programmingLanguage);
				if (programmingLanguage)
					this.$('.CodeMirror').each((i, c) => c.CodeMirror.setOption('mode', programmingLanguage.codeMirror));
			}
			if (!this.executionResults.get().length && result)
				this.executionResults.set(result.results);
		});
	});

	Template.programmingEdit.helpers(
		{
			safeExercise(context) {
				tmpl().isCreate.set(!context || !context._id);
				return tmpl().exercise.get();
			},
			exists: () => tmpl().exercise.get() && tmpl().exercise.get()._id,
			canSave: () => !tmpl().exercise.get() || !tmpl().exercise.get()._id || !tmpl().exercise.get().released || !tmpl().exercise.get().released.requested || Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN),
			exerciseSearchData: () => ({ _id: tmpl().exercise.get().programmingLanguage }),
			exerciseDuplicateQuery: () => ({ duplicate: tmpl().exercise.get()._id }),
			categoryEditData: () => ( tmpl().exercise.get() && tmpl().exercise.get().category_id ? { _id: tmpl().exercise.get().category_id } : null),
			userName: Progressor.getUserName,
			i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), language => _.extend({}, language, {
				name: i18n.getProgrammingLanguage(language._id),
				isActive: language._id === tmpl().exercise.get().programmingLanguage
			})),
			i18nCategories: () => Progressor.categories.find({ programmingLanguage: tmpl().exercise.get().programmingLanguage }).map(category => _.extend({}, category, {
				name: i18n.getName(category),
				isActive: category._id === tmpl().exercise.get().category_id
			})),
			i18nDifficulties: () => _.map(Progressor.getDifficulties(), difficulty => ({
				_id: difficulty, name: i18n.getDifficulty(difficulty),
				isActive: difficulty === tmpl().exercise.get().difficulty
			})),
			codeMirrorOptions: () => Progressor.getCodeMirrorConfiguration(),
			i18nExerciseNamesDescriptions: () => _.map(i18n.getLanguages(), (name, id) => ({
				_id: id, language: name, isActive: id === i18n.getLanguage(),
				name: i18n.getNameForLanguage(tmpl().exercise.get(), id),
				description: i18n.getDescriptionForLanguage(tmpl().exercise.get(), id)
			})),
			functions: testCase => _.map(tmpl().exercise.get().functions, (_function, functionIndex) => _.extend({}, _function, {
				original: _function, functionIndex,
				isActive: testCase && testCase.functionName === _function.name,
				outputType: _function.outputTypes[0],
				inputs: _.map(_function.inputTypes.length ? _function.inputTypes : [null], (t, i) => ({
					functionIndex, inputNameIndex: i, inputTypeIndex: i,
					name: _function.inputNames ? _function.inputNames[i] : null, type: t
				}))
			})),
			testCases: () => _.map(tmpl().exercise.get().testCases, (testCase, testCaseIndex) => {
				function adjustValues(valueName, typeName) {
					const values = testCase[`${valueName}s`], types = _function ? _function[`${typeName}s`] : null;
					if (types) {
						if (values.length < types.length) values.push(..._.chain(types.length - values.length).range().map(() => null).value());
						else if (values.length > types.length) values.splice(types.length);
					}
					return _.map(values, (v, i) => ({
						testCaseIndex, functionIndex, [`${valueName}Index`]: i,
						value: v, type: types ? types[i] : null
					}));
				}

				let functionIndex = -1;
				const _function = _.find(tmpl().exercise.get().functions, (f, i) => (functionIndex = f.name === testCase.functionName && testCase.functionName !== undefined ? i : functionIndex) >= 0);
				return _.extend({}, testCase, {
					original: testCase, testCaseIndex, functionIndex,
					inputValues: adjustValues('inputValue', 'inputType'),
					expectedOutputValues: adjustValues('expectedOutputValue', 'outputType')
				});
			}),
			executorTypes: () => tmpl().executorTypes.get() ? tmpl().executorTypes.get().types : [],
			executorValues: () => tmpl().executorTypes.get() ? _.map(tmpl().executorTypes.get().values, v => _.extend({ typeLabels: v.types.join(', ') }, v)) : [],

			//execution
			executionDisabled: () => tmpl().executionStatus.get() !== 0x0,
			blackListMessage: () => tmpl().blacklistMatches.get().length ? i18n('exercise.blacklistMatchMessage', tmpl().blacklistMatches.get().join(', ')) : null,
			testCasesEvaluated: () => Progressor.isExerciseEvaluated(tmpl().exercise.get(), tmpl().executionResults.get()),
			testCaseSuccess: c => Progressor.isTestCaseSuccess(tmpl().exercise.get(), c.original, tmpl().executionResults.get()),
			testCaseActualOutput: c => Progressor.getActualTestCaseOutput(tmpl().exercise.get(), c.original, tmpl().executionResults.get()),
			executionFatal: () => Progressor.isExerciseFatal(tmpl().exercise.get(), tmpl().executionResults.get())
		});

	function changeExercise(callback) {
		return function (event, template) {
			const ret = callback.call(this, event, template, event && event.currentTarget ? $(event.currentTarget) : null);
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

	function changeExerciseCollection(collectionName, propertySupplier) {
		return changeExercise(function (event, template, $this) {
			_.extend(template.exercise.get()[`${collectionName}s`][this[`${collectionName}Index`]], propertySupplier.call(this, event, template, $this));
		});
	}

	function changeExerciseSubcollection(collectionName, propertyName) {
		return changeExercise(function (event, template, $this) {
			template.exercise.get()[`${collectionName}s`][this[`${collectionName}Index`]][`${propertyName}s`][this[`${propertyName}Index`]] = $this.val();
		});
	}

	function addExerciseCollection(collectionName, itemSupplier) {
		return changeExercise(function (event, template, $this) {
			template.exercise.get()[`${collectionName}s`].splice(this[`${collectionName}Index`] + 1, 0, itemSupplier.call(this, event, template, $this));
		});
	}

	function removeExerciseCollection(collectionName) {
		return changeExercise(function (event, template) {
			let collection = template.exercise.get()[`${collectionName}s`];
			collection.splice(this[`${collectionName}Index`], 1);
			if (!collection.length)
				collection.push(getDefaultExercise()[`${collectionName}s`][0]);
		});
	}

	function execute(template, exercise, callback, rethrow = true) {
		const $result = template.$('.testcase-result').css('opacity', 0.333);
		template.executionStatus.set(template.executionStatus.get() | 0x1);
		Meteor.call('execute', template.exercise.get().programmingLanguage, exercise, Session.get('solution'), true, Progressor.handleError((error, result) => {
			template.executionResults.set(!error ? result : null);
			$result.css('opacity', 1);
			template.executionStatus.set(template.executionStatus.get() & ~0x1);
			if (rethrow) callback(error, result);
			else if (!error) callback(result);
		}));
	}

	Template.programmingEdit.events(
		{
			'keyup .input-function-name'(event, template) {
				const $this = $(event.currentTarget), $group = $this.closest('.form-group');
				const $groups = template.$('.input-function-name').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$group.addClass('has-error');
				_.chain($groups).groupBy(g => $(g).val()).filter(g => g.length > 1).flatten().each(g => $(g).closest('.form-group').addClass('has-error'));
			},
			'keyup .input-parameter-name'(event) {
				const $this = $(event.currentTarget), $group = $this.closest('.form-group'), $function = $this.closest('.container-function');
				const $groups = $function.find('.input-parameter-name').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$group.addClass('has-error');
				_.chain($groups).groupBy(g => $(g).val()).filter(g => g.length > 1).flatten().each(g => $(g).closest('.form-group').addClass('has-error'));
			},
			'keyup .exec-type'(event) {
				const $this = $(event.currentTarget), $group = $this.closest('.form-group').removeClass('has-error');
				if (!testExecutorType($this.val()))
					$group.addClass('has-error');
			},
			'keyup .exec-value'(event) {
				const $this = $(event.currentTarget), $group = $this.closest('.form-group').removeClass('has-error');
				if (!testExecutorValue($this.val(), this.type))
					$group.addClass('has-error');
			},
			'click .btn-add-function': addExerciseCollection('function', () => getDefaultExercise().functions[0]),
			'click .btn-remove-function': removeExerciseCollection('function'),
			'click .btn-add-testcase': addExerciseCollection('testCase', () => getDefaultExercise().testCases[0]),
			'click .btn-remove-testcase': removeExerciseCollection('testCase'),
			'click .btn-add-parameter': changeExercise(function (event, template) {
				const exercise = template.exercise.get(), _function = exercise.functions[this.functionIndex];
				_function.inputNames.splice(this.inputNameIndex + 1, 0, null);
				_function.inputTypes.splice(this.inputTypeIndex + 1, 0, null);
				_.chain(exercise.testCases).where({ functionName: _function.name }).each(t => t.inputValues.splice(this.inputNameIndex + 1, 0, null));
			}),
			'click .btn-remove-parameter': changeExercise(function (event, template) {
				const exercise = template.exercise.get(), _function = exercise.functions[this.functionIndex];
				_function.inputNames.splice(this.inputNameIndex, 1);
				_function.inputTypes.splice(this.inputTypeIndex, 1);
				_.chain(exercise.testCases).where({ functionName: _function.name }).each(t => t.inputValues.splice(this.inputNameIndex, 1));
			}),
			'change #select-language': changeExercise((e, t, $) => !t.exercise.get()._id ? _.extend(t.exercise.get(), { programmingLanguage: $.val(), category_id: null }) : null),
			'change #select-category': changeExercise((e, t, $) => t.exercise.get().category_id = $.val()),
			'change #select-difficulty': changeExercise((e, t, $) => t.exercise.get().difficulty = parseInt($.val())),
			'change [id^="input-name-"]': changeExerciseTranslation('name'),
			'change [id^="textarea-description-"]': changeExerciseTranslation('description'),
			'change .input-function-name': changeExerciseCollection('function', (e, t, $) => ({ name: $.val() })),
			'change .input-function-type': changeExerciseCollection('function', (e, t, $) => ({ outputNames: ['return'], outputTypes: [$.val()] })),
			'change .input-parameter-name': changeExerciseSubcollection('function', 'inputName'),
			'change .input-parameter-type': changeExerciseSubcollection('function', 'inputType'),
			'change .select-testcase-function': changeExerciseCollection('testCase', (e, t, $) => ({ functionName: $.val() })),
			'change .checkbox-testcase-visible': changeExerciseCollection('testCase', (e, t, $) => ({ visible: $.prop('checked') })),
			'change .input-testcase-input': changeExerciseSubcollection('testCase', 'inputValue'),
			'change .input-testcase-expectedoutput': changeExerciseSubcollection('testCase', 'expectedOutputValue'),
			'change #checkbox-solution-visible': changeExercise((e, t, $) => t.exercise.get().solutionVisible = $.prop('checked')),
			'click .btn-save, click .btn-release-request': changeExercise(function (event, template, $this) {
				_.extend(template.exercise.get(), {
					fragment: Session.get('fragment'),
					solution: Session.get('solution')
				});
				if ($this.hasClass('btn-release-request'))
					if (Progressor.isExerciseSuccess(template.exercise.get(), template.executionResults.get()))
						template.exercise.get().released = { requested: new Date() };
					else
						Progressor.showAlert(i18n('exercise.isNotTestedMessage'));
				if (testValidExercise(template.exercise.get()))
					Meteor.call('saveExercise', _.omit(template.exercise.get(), 'category'), Progressor.handleError(result => {
						Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'success');
						execute(template, { _id: result }, (error, results) => {
							if (!error && Progressor.isExerciseSuccess(template.exercise.get(), results))
								Router.go('exerciseSolve', { _id: result });
							else
								Progressor.showAlert(i18n('exercise.executionFailureMessage'), 'warning');
						});
					}, false));
				else
					Progressor.showAlert(i18n('exercise.isNotValidMessage'));
			}),
			'click .btn-delete': (e, t) => Meteor.call('deleteExercise', { _id: t.exercise.get()._id }, Progressor.handleError(() => Router.go('exerciseSearch', { _id: t.exercise.get().programmingLanguage }), false)),

			//execution
			'click #button-execute'(event, template) {
				execute(template, _.omit(template.exercise.get(), 'category'), (error, result) => {
					const success = !error && Progressor.isExerciseSuccess(template.exercise.get(), result);
					Progressor.showAlert(i18n(`exercise.execution${success ? 'Success' : 'Failure'}Message`), success ? 'success' : 'danger', 3000);
				});
			},
			'shown.bs.tab .a-toggle-codemirror'(event, template) {
				template.$(`#${$(event.currentTarget).attr('aria-controls')}`).find('.CodeMirror')[0].CodeMirror.refresh();
			},
			'keyup #tab-fragment>.CodeMirror': _.throttle(function (event, template) {
				if (!(template.fragmentTyped = !!Session.get('fragment'))) changeExercise(() => null)();
			}, 500),
			'keyup #tab-solution>.CodeMirror': _.throttle(function (event, template) {
				const solution = Session.get('solution');
				if (!(template.solutionTyped = !!solution)) changeExercise(() => null)();
				if (template.exercise.get().programmingLanguage)
					if (!template.blacklist.get() || template.exercise.get().programmingLanguage !== template.blacklist.get().programmingLanguage) {
						template.blacklist.set({ programmingLanguage: template.exercise.get().programmingLanguage });
						Meteor.call('getBlacklist', template.exercise.get().programmingLanguage, Progressor.handleError((e, r) => template.blacklist.set(!e ? _.extend(template.blacklist.get(), { elements: r }) : null)));
					} else {
						template.blacklistMatches.set(_.filter(template.blacklist.get().elements, blk => solution.indexOf(blk) >= 0));
						template.executionStatus.set(template.blacklistMatches.get().length ? template.executionStatus.get() | 0x2 : template.executionStatus.get() & ~0x2);
					}
			}, 500)
		});

})();
