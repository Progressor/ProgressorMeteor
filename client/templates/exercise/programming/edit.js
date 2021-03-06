import { tmpl, changeExercise, changeExerciseTranslation } from '/imports/utilities';

const NUMBER_OF_BLACKLIST_COLUMNS = 3;

function getDefaultExercise() {
  return {
    type: 1,
    names: [],
    descriptions: [],
    functions: [{
      inputNames: [],
      inputTypes: [],
      outputNames: ['return'],
      outputTypes: [null],
    }],
    testCases: [{
      inputValues: [],
      expectedOutputValues: [],
      visible: false,
    }],
    fragment: null,
    solution: null,
    solutionVisible: false,
  };
}

// TEST ENTERED VALUES //

function testExecutorIdentifier(value) {
  return !value || /^[A-Z_][A-Z0-9_]*$/i.test(value);
}

function testExecutorType(type, isRecursive = false) {
  const executorType = tmpl().executorTypes.get() ? _.find(tmpl().executorTypes.get().types, t => type.substr(0, t._id.length) === t._id) : null;
  let index = executorType ? executorType._id.length : 0;
  if (!executorType) {
    return false; // ^: find the (outermost) type object and skip its name // verify a type has been found
  }
  else if (executorType.parameterCount > 0) { // if the type has parameters
    if (type.substr(index, 1) !== '<') return false; // verify the next character is the generic open bracket
    index++; // move index forward
    for (let i = 0; i < executorType.parameterCount; i++) { // repeat check for each type parameter
      const separator = i === executorType.parameterCount - 1 ? '>' : ','; // determine the separator expected after this type parameter
      if (i > 0) index += type.substr(index).match(/^\s?/)[0].length; // skip optional whitespace after separator
      const subLength = testExecutorType(type.substr(index), true);
      if (subLength === false) return false; // verify parameter is a valid type
      index += subLength; // move index forward
      if (type.substr(index, 1) !== separator) return false; // verify the next character is the defined separator
      index += separator.length; // move index forward
    }
  }
  return isRecursive ? index : index === type.length; // recursive: return new index, otherwise: verify end is reached
}

const openDelimiterPattern = '{\\s?', closeDelimiterPattern = '\\s?}', separatorPatterns = [',\\s?', ':\\s?'];

function testExecutorValue(value, type, isRecursive = false, ...delimiters) {
  const executorType = tmpl().executorTypes.get() ? _.find(tmpl().executorTypes.get().types, t => type && type.substr(0, t._id.length) === t._id) : null;
  let typeIndex = executorType ? executorType._id.length : 0, valueIndex = 0, match, number;
  if (executorType.pattern) { // ^: find the (outermost) type object and skip its name // if a pattern is specified
    if (!(match = value.match(delimiters.length ? `^(${executorType.pattern}?(?=(${delimiters.join(')|(')}))|${executorType.pattern})` : `^${executorType.pattern}`))) return false; // verify the pattern
    valueIndex += match[0].length; // move index forward // _: verify the number range
    if (executorType.max && !(Number.isFinite(number = (Number.isInteger(executorType.max) ? parseInt : parseFloat)(match[0])) && -executorType.max - 1 <= number && number <= executorType.max)) return false;
  }
  if (executorType.parameterCount > 0) { // if the type as parameters
    typeIndex++; // skip generic open bracket
    const _typeIndex = typeIndex; // remember initial type index position
    if (!(match = value.substr(valueIndex).match(`^${openDelimiterPattern}`))) return false; // verify open delimiter
    valueIndex += match[0].length; // move index forward
    for (let i = 0; true; i++) { // repeat until all collection items have been processed
      if ((match = value.substr(valueIndex).match(`^${closeDelimiterPattern}`)) && (valueIndex += match[0].length)) break; // verify close delimiter, move index forward
      else if (i > 0 && !((match = value.substr(valueIndex).match(`^${separatorPatterns[0]}`)) && (valueIndex += match[0].length))) return false; // verify item separator / move index forward
      typeIndex = _typeIndex; // reset type index
      for (let j = 0; j < executorType.parameterCount; j++) { // repeat check for each type parameter
        if (j > 0) typeIndex += type.substr(typeIndex).match(/^\s?/)[0].length; // skip optional whitespace after separator // _: recursive call (pass next separator)
        const subLength = testExecutorValue(value.substr(valueIndex), type.substr(typeIndex), true, closeDelimiterPattern, separatorPatterns[j < executorType.parameterCount - 1 ? 1 : 0]);
        typeIndex += subLength.typIdx; // move index forward
        valueIndex += subLength.valIdx; // move index forward
        typeIndex++; // skip separator
        if (j < executorType.parameterCount - 1) { // if there are more parameters to come // _: verify internal separator
          if (!(match = value.substr(valueIndex).match(`^${separatorPatterns[1]}`))) return false;
          valueIndex += match[0].length; // move index forward
        }
      }
    }
  }
  return isRecursive ? { typIdx: typeIndex, valIdx: valueIndex } : (typeIndex === type.length || executorType.parameterCount > 0) && valueIndex === value.length; // recursive: return new indexes, otherwise: verify end is reached
}

function testValidExercise(exercise) {
  const notEmpty = /[^\s]+/;
  const { programmingLanguage, category_id, difficulty, names, descriptions, functions, testCases, released } = exercise;
  const category = Progressor.categories.findOne({ _id: category_id });
  return programmingLanguage && _.any(Progressor.getProgrammingLanguages(), l => l._id === programmingLanguage)
         && category_id && category && !(category.private && released)
         && difficulty && _.contains(Progressor.getDifficulties(), difficulty)
         && names && names.length && _.some(names, n => n.name && notEmpty.test(n.name))
         && descriptions && descriptions.length && _.some(descriptions, d => d.description && notEmpty.test(d.description))
         && functions && functions.length && testValidFunctions(exercise)
         && testCases && testCases.length && testValidTestCases(exercise);
}

function testValidFunctions({ functions }) {
  return _.every(functions, f =>
    f.name
    && testExecutorIdentifier(f.name)
    && f.inputNames.length === f.inputTypes.length
    && _.every(f.inputNames, n => n && testExecutorIdentifier(n))
    && _.every(f.inputTypes, t => t && testExecutorType(t))

    && f.outputNames.length === f.outputTypes.length
    && _.every(f.outputNames, n => n && testExecutorIdentifier(n))
    && _.every(f.outputTypes, t => t && testExecutorType(t))
  );
}

function testValidTestCases({ functions, testCases }) {
  return _.every(testCases, testCase => {
    const _function = _.findWhere(functions, { name: testCase.functionName });
    return testCase.functionName
      && _function
      && _function.inputTypes.length === testCase.inputValues.length
      && _.every(testCase.inputValues, (v, i) => testExecutorValue(v, _function.inputTypes[i]))
      && _function.outputTypes.length === testCase.expectedOutputValues.length
      && _.every(testCase.expectedOutputValues, (v, i) => testExecutorValue(v, _function.outputTypes[i]));
  });
}

Template.programmingEdit.onCreated(function () {
  // TEMPLATE VARIABLES //

  this.isCreate = new ReactiveVar(false);
  this.exercise = new ReactiveVar(getDefaultExercise());
  this.executorTypes = new ReactiveVar(null);
  this.executionStatus = new ReactiveVar(0x0);
  this.executionResults = new ReactiveVar([]);
  this.blacklist = new ReactiveVar(null);
  this.blacklistMatches = new ReactiveVar([]);
  this.versionInformation = new ReactiveVar(null);
  this.wasCreate = false;
  // this.fragmentTyped = false;
  // this.solutionTyped = false;
  Session.set('fragment', null);
  Session.set('solution', null);

  // REACTIVE (LOCAL) EXERCISE //

  this.autorun(() => {
    const live = Progressor.exercises.findOne();
    const detached = Tracker.nonreactive(() => this.exercise.get());
    if (!live || !detached || live._id !== detached._id || Progressor.hasInvisibleTestCases(detached) || this.wasCreate !== this.isCreate.get()) {
      let _exercise = live || getDefaultExercise();
      if (this.wasCreate = this.isCreate.get()) {
        _exercise = _.omit(_exercise, '_id', 'released', 'archived', 'author_id', 'lastEditor_id', 'lastEdited');
      }
      this.exercise.set(Progressor.joinCategory(_exercise));
      this.executionResults.set([]);
      // this.fragmentTyped = false;
      // this.solutionTyped = false;
      Session.set('fragment', null);
      Session.set('solution', null);
    } else if (live.lastEditor_id !== Meteor.userId()) {
      Progressor.showAlert(i18n('form.documentChangedMessage'));
    }
  });

  // INITIALISATION //

  Meteor.call('getExecutorTypes', Progressor.handleError(r => this.executorTypes.set(r), false));
});

Template.programmingEdit.onRendered(function () {
  // COLLAPSIBLE PANELS //

  this.$('.panel-collapse').on(
    'show.bs.collapse hide.bs.collapse',
    e => $(e.currentTarget)
        .siblings()
        .find('.glyphicon-collapse-up, .glyphicon-collapse-down')
        .toggleClass('glyphicon-collapse-up glyphicon-collapse-down')
      );

  // CODEMIRROR CONFIGURATION //

  this.autorun(() => {
    const result = Progressor.results.findOne();
    if (!_.isBoolean(this.fragmentTyped) && (this.fragmentTyped = this.exercise.get() && this.exercise.get().fragment)) {
      Session.set('fragment', this.exercise.get().fragment);
    }
    if (!_.isBoolean(this.solutionTyped)) {
      if (this.solutionTyped = this.exercise.get() && this.exercise.get().solution) {
        Session.set('solution', this.exercise.get().solution);
      } else if (this.solutionTyped = result && result.fragment) {
        Session.set('solution', result.fragment);
      }
    }
    if ((!this.fragmentTyped || !this.solutionTyped) && this.exercise.get() && this.exercise.get().programmingLanguage && testValidFunctions(this.exercise.get())) {
      Meteor.call('getFragment', this.exercise.get().programmingLanguage, _.omit(this.exercise.get(), '_id', 'category'), Progressor.handleError((error, result) => {
        if ((!this.fragmentTyped || !this.solutionTyped) && this.exercise.get() && this.exercise.get().programmingLanguage) {
          if (!this.fragmentTyped) {
            Session.set('fragment', !error ? result : null);
          }
          if (!this.solutionTyped) {
            Session.set('solution', !error ? result : null);
          }
        }
      }));
    }
    if (this.exercise.get() && this.exercise.get().programmingLanguage) {
      const programmingLanguage = Progressor.getProgrammingLanguage(this.exercise.get().programmingLanguage);
      if (programmingLanguage) {
        this.$('.CodeMirror').each((i, c) => {
          c.CodeMirror.setOption('mode', programmingLanguage.codeMirror ? programmingLanguage.codeMirror : 'text/plain');
          c.CodeMirror.setOption('firstLineNumber', programmingLanguage && programmingLanguage.templateOffset ? programmingLanguage.templateOffset + 1 : 1);
        });
        Meteor.call('getVersionInformation', programmingLanguage._id, Progressor.handleError(r => this.versionInformation.set(r), false));
        if (!this.blacklist.get() || this.exercise.get().programmingLanguage !== this.blacklist.get().programmingLanguage) {
          this.blacklist.set({ programmingLanguage: this.exercise.get().programmingLanguage });
          Meteor.call('getBlacklist', this.exercise.get().programmingLanguage, Progressor.handleError((e, r) => {
            const elementsSorted = _.sortBy(r, b => b.toLowerCase()), nofBlacklistElements = elementsSorted.length, elementsPerColumn = Math.ceil(nofBlacklistElements / NUMBER_OF_BLACKLIST_COLUMNS);
            return this.blacklist.set(!e ? _.extend(this.blacklist.get(), {
              elements: r,
              elementColumns: _.map(_.range(0, NUMBER_OF_BLACKLIST_COLUMNS), c => ({ _id: c, elements: elementsSorted.slice(elementsPerColumn * c, elementsPerColumn * (c + 1)) })),
            }) : null);
          }));
        }
      }
    }
    if (!this.executionResults.get().length && result)
      this.executionResults.set(result.results);
  });
});

Template.programmingEdit.helpers({
  // EXERCISE HELPERS //

  safeExercise(context) {
    tmpl().isCreate.set(!context || !context._id);
    return tmpl().exercise.get();
  },
  canSave: () => !tmpl().exercise.get() || !tmpl().exercise.get()._id || !tmpl().exercise.get().released || !tmpl().exercise.get().released.requested || Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN),
  exerciseSearchData: () => ({ _id: tmpl().exercise.get().programmingLanguage }),
  exerciseDuplicateQuery: () => ({ duplicate: tmpl().exercise.get()._id }),
  categoryEditData: () => (tmpl().exercise.get() && tmpl().exercise.get().category_id && !Progressor.categories.findOne({ _id: tmpl().exercise.get().category_id }).private ? { _id: tmpl().exercise.get().category_id } : null),
  i18nProgrammingLanguages: () => _.map(Progressor.getProgrammingLanguages(), language => _.extend({}, language, {
    name: i18n.getProgrammingLanguage(language._id),
    isActive: language._id === tmpl().exercise.get().programmingLanguage,
  })),
  i18nCategories: () => _.chain(Progressor.categories.find({ programmingLanguage: tmpl().exercise.get().programmingLanguage }).fetch()).map(category => _.extend({}, category, {
    name: i18n.getCategoryName(category, tmpl().exercise.get() && tmpl().exercise.get().author_id ? tmpl().exercise.get().author_id : Meteor.userId()),
    isActive: category._id === tmpl().exercise.get().category_id,
  })).sortBy(c => c.private ? null : c.name).value(),
  i18nDifficulties: () => _.map(Progressor.getDifficulties(), difficulty => ({
    _id: difficulty, name: i18n.getDifficulty(difficulty),
    isActive: difficulty === tmpl().exercise.get().difficulty,
  })),
  codeMirrorOptions: () => Progressor.getCodeMirrorConfiguration(),
  i18nExerciseNamesDescriptions: () => _.map(i18n.getLanguages(), (name, id) => ({
    _id: id, language: name, isActive: id === i18n.getLanguage(),
    name: i18n.getNameForLanguage(tmpl().exercise.get(), id),
    description: i18n.getDescriptionForLanguage(tmpl().exercise.get(), id),
  })),
  // hasSingleFunction: () => _.filter(tmpl().exercise.get().functions, f => f.name).length === 1,
  functions: testCase => _.map(tmpl().exercise.get().functions, (_function, functionIndex) => _.extend({}, _function, {
    original: _function, functionIndex,
    isActive: testCase && testCase.functionName === _function.name,
    outputType: _function.outputTypes[0],
    inputs: _.chain(_function.inputNames.length > _function.inputTypes.length ? _function.inputNames.length : _function.inputTypes.length || 1).range().map(i => ({
      functionIndex, inputNameIndex: i, inputTypeIndex: i,
      name: _function.inputNames ? _function.inputNames[i] : null,
      type: _function.inputTypes ? _function.inputTypes[i] : null,
    })).value(),
  })),
  testCases: () => _.map(tmpl().exercise.get().testCases, (testCase, testCaseIndex) => {
    function adjustValues(valueProperty, nameProperty, typeProperty) {
      const values = testCase[`${valueProperty}s`], names = _function ? _function[`${nameProperty}s`] : null, types = _function ? _function[`${typeProperty}s`] : null;
      if (names || types) {
        const length = names && types ? (names.length > types.length ? names.length : types.length) : (names ? names.length : types.length);
        if (values.length < length) values.push(..._.chain(length - values.length).range().map(() => null).value());
        else if (values.length > length) values.splice(length);
      }
      return _.map(values, (v, i) => ({
        testCaseIndex, functionIndex, [`${valueProperty}Index`]: i,
        value: v, name: names ? names[i] : null, type: types ? types[i] : null,
      }));
    }

    let functionIndex = -1;
    const _function = _.find(tmpl().exercise.get().functions, (f, i) => (functionIndex = f.name === testCase.functionName && testCase.functionName !== undefined ? i : functionIndex) >= 0);
    return _.extend({}, testCase, {
      original: testCase, testCaseIndex, functionIndex,
      inputValues: adjustValues('inputValue', 'inputName', 'inputType'),
      expectedOutputValues: adjustValues('expectedOutputValue', 'outputName', 'outputType'),
    });
  }),
  executorTypes: () => tmpl().executorTypes.get() ? tmpl().executorTypes.get().types : [],
  executorValues: () => tmpl().executorTypes.get() ? _.map(tmpl().executorTypes.get().values, v => _.extend({ typeLabels: v.types.join(', ') }, v)) : [],
  blacklist: () => tmpl().blacklist.get(),
  blacklistColumnWidth: () => 12 / NUMBER_OF_BLACKLIST_COLUMNS,

  // TEST CASE EXECUTION HELPERS //

  executionDisabled: () => tmpl().executionStatus.get() !== 0x0,
  blackListMessage: () => tmpl().blacklistMatches.get().length ? i18n('exercise.blacklistMatchMessage', tmpl().blacklistMatches.get().join(', ')) : null,
  versionInformation() {
    const versionInformation = tmpl().versionInformation.get();
    if (versionInformation) return i18n('exercise.help.versionInformationMessage',
                                        versionInformation.languageVersion || i18n('form.notAvailable'), versionInformation.compilerName || i18n('form.notAvailable'), versionInformation.compilerVersion || i18n('form.notAvailable'),
                                        versionInformation.platformName || i18n('form.notAvailable'), versionInformation.platformVersion || i18n('form.notAvailable'), versionInformation.platformArchitecture || i18n('form.notAvailable'));
  },
  testCasesEvaluated: () => Progressor.isExerciseEvaluated(tmpl().exercise.get(), tmpl().executionResults.get()),
  testCaseEvaluated: c => Progressor.isTestCaseEvaluated(tmpl().exercise.get(), c.original, tmpl().executionResults.get()),
  testCaseSuccess: c => Progressor.isTestCaseSuccess(tmpl().exercise.get(), c.original, tmpl().executionResults.get()),
  testCaseActualOutput: c => Progressor.getActualTestCaseOutput(tmpl().exercise.get(), c.original, tmpl().executionResults.get()),
  executionFatal: () => Progressor.isExerciseFatal(tmpl().exercise.get(), tmpl().executionResults.get()),
});

// EVENT WRAPPERS //

function changeExerciseCollection(collectionName, propertySupplier) {
  return changeExercise(function (event, template, $this) {
    _.extend(template.exercise.get()[`${collectionName}s`][this[`${collectionName}Index`]], propertySupplier.call(this, event, template, $this, this));
  });
}

function changeExerciseSubcollection(collectionName, propertyName) {
  return changeExercise(function (event, template, $this) {
    template.exercise.get()[`${collectionName}s`][this[`${collectionName}Index`]][`${propertyName}s`][this[`${propertyName}Index`]] = $this.val();
  });
}

function addExerciseCollection(collectionName, itemSupplier) {
  return changeExercise(function (event, template, $this) {
    template.exercise.get()[`${collectionName}s`].splice(this[`${collectionName}Index`] + 1, 0, itemSupplier.call(this, event, template, $this, this));
  });
}

function removeExerciseCollection(collectionName) {
  return changeExercise(function (event, template) {
    const collection = template.exercise.get()[`${collectionName}s`];
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

Template.programmingEdit.events({

  // VALIDATION EVENTS //

  'keyup .input-function-name': function (event, template) {
    const $this = $(event.currentTarget), $group = $this.closest('.form-group');
    const $groups = template.$('.input-function-name').closest('.form-group').removeClass('has-error').end();
    if (!testExecutorIdentifier($this.val()))
      $group.addClass('has-error');
    _.chain($groups).groupBy(g => $(g).val()).filter(g => g.length > 1).flatten().each(g => $(g).closest('.form-group').addClass('has-error'));
  },
  'keyup .input-parameter-name': function (event) {
    const $this = $(event.currentTarget), $group = $this.closest('.form-group'), $function = $this.closest('.container-function');
    const $groups = $function.find('.input-parameter-name').closest('.form-group').removeClass('has-error').end();
    if (!testExecutorIdentifier($this.val()))
      $group.addClass('has-error');
    _.chain($groups).groupBy(g => $(g).val()).filter(g => g.length > 1).flatten().each(g => $(g).closest('.form-group').addClass('has-error'));
  },
  'keyup .exec-type': function (event) {
    const $this = $(event.currentTarget), $group = $this.closest('.form-group').removeClass('has-error');
    if (!testExecutorType($this.val()))
      $group.addClass('has-error');
  },
  'keyup .exec-value': function (event) {
    const $this = $(event.currentTarget), $group = $this.closest('.form-group').removeClass('has-error');
    if (!testExecutorValue($this.val(), this.type))
      $group.addClass('has-error');
  },

  // COLLECTION EVENTS //

  'click .btn-add-function': addExerciseCollection('function', () => getDefaultExercise().functions[0]),
  'click .btn-remove-function': removeExerciseCollection('function'),
  'click .btn-add-testcase': addExerciseCollection('testCase', () => getDefaultExercise().testCases[0]),
  'click .btn-remove-testcase': removeExerciseCollection('testCase'),
  'click .btn-add-parameter': changeExercise(function (event, template) {
    const exercise = template.exercise.get(), _function = exercise.functions[this.functionIndex];
    _function.inputNames.splice(this.inputNameIndex + 1, 0, null);
    _function.inputTypes.splice(this.inputTypeIndex + 1, 0, null);
    if (_function.name)
      _.chain(exercise.testCases).where({ functionName: _function.name }).each(t => t.inputValues.splice(this.inputNameIndex + 1, 0, null));
  }),
  'click .btn-remove-parameter': changeExercise(function (event, template) {
    const exercise = template.exercise.get(), _function = exercise.functions[this.functionIndex];
    _function.inputNames.splice(this.inputNameIndex, 1);
    _function.inputTypes.splice(this.inputTypeIndex, 1);
    if (_function.name)
      _.chain(exercise.testCases).where({ functionName: _function.name }).each(t => t.inputValues.splice(this.inputNameIndex, 1));
  }),

  // DATA CHANGE EVENTS //

  'change #select-language': changeExercise((e, t, $) => !t.exercise.get()._id ? _.extend(t.exercise.get(), { programmingLanguage: $.val(), category_id: null }) : null),
  'change #select-category': changeExercise((e, t, $) => t.exercise.get().category_id = $.val()),
  'change #select-difficulty': changeExercise((e, t, $) => t.exercise.get().difficulty = parseInt($.val())),
  'change [id^="input-name-"]': changeExerciseTranslation('name'),
  'change [id^="textarea-description-"]': changeExerciseTranslation('description'),
  'change .input-function-name': changeExerciseCollection('function', (e, t, $) => (setTimeout(() => t.$('.select-testcase-function').trigger('change'), 10), { name: $.val() })),
  'change .input-function-type': changeExerciseCollection('function', (e, t, $) => ({ outputNames: ['return'], outputTypes: [$.val()] })),
  'change .input-parameter-name': changeExerciseSubcollection('function', 'inputName'),
  'change .input-parameter-type': changeExerciseSubcollection('function', 'inputType'),
  'change .select-testcase-function': changeExerciseCollection('testCase', (e, t, $) => ({ functionName: $.val() })),
  'change .checkbox-testcase-visible': changeExerciseCollection('testCase', (e, t, $) => ({ visible: $.prop('checked') })),
  'change .input-testcase-input': changeExerciseSubcollection('testCase', 'inputValue'),
  'change .input-testcase-expectedoutput': changeExerciseSubcollection('testCase', 'expectedOutputValue'),
  'change #checkbox-solution-visible': changeExercise((e, t, $) => t.exercise.get().solutionVisible = $.prop('checked')),

  // PERSISTENCE EVENTS //

  'click .btn-save, click .btn-release-request': changeExercise(function (event, template, $this) {
    _.extend(template.exercise.get(), {
      fragment: Session.get('fragment'),
      solution: Session.get('solution'),
    });
    if ($this.hasClass('btn-release-request'))
      if (!Progressor.isExerciseSuccess(template.exercise.get(), template.executionResults.get()))
        return Progressor.showAlert(i18n('exercise.isNotTestedMessage'));
      else if (!template.exercise.get().category || template.exercise.get().category.private)
        return Progressor.showAlert(i18n('exercise.isNotValidMessage'));
      else
        template.exercise.get().released = { requested: new Date() };
    if (testValidExercise(template.exercise.get()))
      Meteor.call('saveExercise', _.omit(template.exercise.get(), 'category'), Progressor.handleError(result => {
        Progressor.showAlert(i18n('form.saveSuccessfulMessage'), 'success');
        execute(template, { _id: result }, (error, results) => {
          if (!error && Progressor.isExerciseSuccess(template.exercise.get(), results))
            Router.go('exerciseSolve', { _id: result });
          else {
            Router.go('exerciseEdit', { _id: result });
            Progressor.showAlert(i18n('exercise.executionFailureMessage'), 'warning');
          }
        });
      }, false));
    else
      Progressor.showAlert(i18n('exercise.isNotValidMessage'));
  }),
  'click .btn-delete': (event, template) => Meteor.call('deleteExercise', { _id: template.exercise.get()._id }, Progressor.handleError(() => Router.go('exerciseSearch', { _id: template.exercise.get().programmingLanguage }), false)),
  'click .btn-export': (event, template) => Progressor.generateExerciseJson(template.exercise.get()),

  // TEST CASE EXECUTION EVENTS //

  'click #button-execute': function (event, template) {
    execute(template, _.omit(template.exercise.get(), '_id', 'category'), (error, result) => {
      const success = !error && Progressor.isExerciseSuccess(template.exercise.get(), result);
      Progressor.showAlert(i18n(`exercise.execution${success ? 'Success' : 'Failure'}Message`), success ? 'success' : 'danger', 3000);
    });
  },
  'shown.bs.tab .a-toggle-codemirror': function (event, template) {
    template.$(`#${$(event.currentTarget).attr('aria-controls')}`).find('.CodeMirror')[0].CodeMirror.refresh();
  },
  'keyup #tab-fragment>.CodeMirror': _.throttle(function (event, template) {
    if (!(template.fragmentTyped = !!Session.get('fragment'))) changeExercise(() => null).call(this, event, template);
  }, 500),
  'keyup #tab-solution>.CodeMirror': _.throttle(function (event, template) {
    const solution = Session.get('solution');
    if (!(template.solutionTyped = !!solution)) changeExercise(() => null).call(this, event, template);
    if (template.exercise.get().programmingLanguage)
      if (template.blacklist.get() && template.exercise.get().programmingLanguage === template.blacklist.get().programmingLanguage) {
        template.blacklistMatches.set(_.filter(template.blacklist.get().elements, b => new RegExp(`\\b${escapeRegExp(b)}\\b`).test(solution)));
        template.executionStatus.set(template.blacklistMatches.get().length ? template.executionStatus.get() | 0x2 : template.executionStatus.get() & ~0x2);
      }
  }, 500),
});
