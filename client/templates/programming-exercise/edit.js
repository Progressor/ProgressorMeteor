(function () {
	'use strict';

	function getDefaultExercise() {
		return {
			type: 1,
			names: [],
			descriptions: [],
			functions: [{
				inputNames: [null],
				inputTypes: [],
				outputNames: ['return'],
				outputTypes: [null]
			}],
			testCases: [{
				inputValues: [],
				expectedOutputValues: [],
				visible: false
			}]
		};
	}

	var exercise = getDefaultExercise(), depExercise = new Tracker.Dependency();
	var executorTypes, depExecutorTypes = new Tracker.Dependency();

	function testExecutorIdentifier(val) {
		return val.length === 0 || /^[A-Z_][A-Z0-9_]*$/i.test(val);
	}

	function testExecutorType(val, rec) {
		var typ = _.find(executorTypes.types, typ => val.substr(0, typ._id.length) === typ._id), idx = typ ? typ._id.length : 0;
		if (!typ) return false;
		else if (typ.parameterCount > 0) {
			if (val.substr(idx, 1) !== "<") return false;
			idx += 1;
			for (var i = 0; i < typ.parameterCount; i++) {
				var dlm = i === typ.parameterCount - 1 ? '>' : ',', inc;
				if (i > 0) idx += val.substr(idx).match(/^\s?/)[0].length;
				if ((inc = testExecutorType(val.substr(idx), true)) === false) return false;
				idx += inc;
				if (val.substr(idx, 1) !== dlm) return false;
				idx += dlm.length;
			}
		}
		return rec ? idx : idx === val.length;
	}

	function changeExercise(cb) {
		return function (ev) {
			var ret = cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
			depExercise.changed();
			return ret;
		}
	}

	function dependOnExercise(cb) {
		return function (ev) {
			depExercise.depend();
			return cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
		}
	}

	function dependOnExecutorTypes(cb) {
		return function (ev) {
			depExecutorTypes.depend();
			return cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
		}
	}

	Template.programmingEdit.onCreated(() => {
		exercise = Progressor.exercises.findOne() || getDefaultExercise();
		depExercise.changed();

		Meteor.call('getExecutorTypes', (err, res) => {
			executorTypes = res;
			depExecutorTypes.changed();
		});
	});

	Template.programmingEdit.helpers(
		{
			exerciseSearchData: dependOnExercise(() => ({ _id: exercise.programmingLanguage })),
			i18nProgrammingLanguage: dependOnExercise(() => i18n.getProgrammingLanguage(exercise.programmingLanguage)),
			i18nExerciseName: i18n.getName,
			i18nCategoryName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			i18nProgrammingLanguages: dependOnExercise(() => _.map(Progressor.getProgrammingLanguages(), lng => ({
				_id: lng, name: i18n.getProgrammingLanguage(lng),
				isActive: exercise && lng === exercise.programmingLanguage
			}))),
			i18nCategories: dependOnExercise(() => Progressor.categories.find({ programmingLanguage: exercise.programmingLanguage }).map(cat => _.extend({}, cat, {
				name: i18n.getName(cat),
				isActive: cat._id === exercise.category_id
			}))),
			i18nDifficulties: dependOnExercise(() => _.map(Progressor.getDifficulties(), dif => ({
				_id: dif, name: i18n.getDifficulty(dif),
				isActive: dif === exercise.difficulty
			}))),
			i18nExerciseNamesDescriptions: dependOnExercise(() => _.map(i18n.getLanguages(), (nam, id) => ({
				_id: id, language: nam, isActive: id === i18n.getLanguage(),
				name: i18n.getNameForLanguage(exercise, id),
				description: i18n.getDescriptionForLanguage(exercise, id)
			}))),
			functions: dependOnExercise(cas => _.map(exercise.functions, fun => _.extend({}, fun, {
				outputType: fun.outputTypes[0],
				inputs: _.map(fun.inputNames.length ? fun.inputNames : getDefaultExercise().functions[0].inputNames, (nme, idx) => ({ name: nme, type: fun.inputTypes ? fun.inputTypes[idx] : null })),
				isActive: cas && cas.functionName === fun.name
			}))),
			testCases: dependOnExercise(() => exercise.testCases),
			executorTypes: dependOnExecutorTypes(() => executorTypes ? executorTypes.types : []),
			executorValues: dependOnExecutorTypes(() => executorTypes ? _.map(executorTypes.values, val => _.extend({}, val, { typeLabels: val.types.join(', ') })) : [])
		});

	function changeExerciseTranslation(trs) {
		return changeExercise(function (ev, $this) {
			var elm = _.find(exercise[trs + 's'], elm => elm.language === $this.data('lang'));
			if (elm)
				elm[trs] = $this.val();
			else {
				elm = { language: $this.data('lang') };
				elm[trs] = $this.val();
				exercise[trs + 's'].push(elm);
			}
		});
	}

	function changeExerciseCollection(col, cls, prps) {
		return changeExercise((ev, $this) => _.extend(exercise[col][$this.closest('.' + cls).prevAll('.' + cls).length], prps(ev, $this)));
	}

	function changeExerciseSubcollection(col, cls1, prp, cls2) {
		return changeExercise((ev, $this) => exercise[col][$this.closest('.' + cls1).prevAll('.' + cls1).length][prp][$this.closest('.' + cls2).prevAll('.' + cls2).length] = $this.val());
	}

	Template.programmingEdit.events(
		{
			'click .btn-add-function': changeExercise(() => exercise.functions.push(getDefaultExercise().functions[0])),
			'click .btn-add-parameter': changeExercise((ev, $this) => exercise.functions[$this.closest('.container-function').prevAll('.container-function').length].inputNames.push(null)),
			'click .btn-add-testcase': changeExercise(() => exercise.testCases.push(getDefaultExercise().testCases[0])),
			'keyup .input-function-name'(ev) {
				var $this = $(ev.currentTarget), $grp = $this.closest('.form-group');
				var $grps = $('.input-function-name').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$grp.addClass('has-error');
				_.each(_.flatten(_.filter(_.groupBy($grps, elm => $(elm).val()), grp => grp.length > 1)), elm => $(elm).closest('.form-group').addClass('has-error'));
			},
			'keyup .input-parameter-name'(ev) {
				var $this = $(ev.currentTarget), $grp = $this.closest('.form-group'), $fnc = $this.closest('.container-function');
				var $grps = $fnc.find('.input-parameter-name').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$grp.addClass('has-error');
				_.each(_.flatten(_.filter(_.groupBy($grps, elm => $(elm).val()), grp => grp.length > 1)), elm => $(elm).closest('.form-group').addClass('has-error'));
			},
			'keyup .exec-type'(ev) {
				var $this = $(ev.currentTarget), $grp = $this.closest('.form-group').removeClass('has-error');
				if (!testExecutorType($this.val()))
					$grp.addClass('has-error');
			},
			'change #select-language': changeExercise((ev, $this) => exercise.programmingLanguage = $this.val()),
			'change #select-category': changeExercise((ev, $this) => exercise.category_id = $this.val()),
			'change #select-difficulty': changeExercise((ev, $this) => exercise.difficulty = parseInt($this.val())),
			'change [id^="input-name-"]': changeExerciseTranslation('name'),
			'change [id^="textarea-description-"]': changeExerciseTranslation('description'),
			'change .input-function-name': changeExerciseCollection('functions', 'container-function', (ev, $this) => ({ name: $this.val() })),
			'change .input-function-type': changeExerciseCollection('functions', 'container-function', (ev, $this) => ({ outputNames: ['return'], outputTypes: [$this.val()] })),
			'change .input-parameter-name': changeExerciseSubcollection('functions', 'container-function', 'inputNames', 'container-parameter'),
			'change .input-parameter-type': changeExerciseSubcollection('functions', 'container-function', 'inputTypes', 'container-parameter'),
			'change .select-testcase-function': changeExerciseCollection('testCases', 'container-testcase', function (ev, $this) {
				var fnc = _.find(exercise.functions, fnc => fnc.name === $this.val());
				if (fnc) return { functionName: $this.val(), inputValues: _.map(_.range(fnc.inputNames.length), () => null), expectedOutputValues: getDefaultExercise().functions[0].outputTypes };
			}),
			'change .checkbox-testcase-visible': changeExerciseCollection('testCases', 'container-testcase', (ev, $this) => ({ visible: $this.prop('checked') })),
			'change .input-testcase-input': changeExerciseSubcollection('testCases', 'container-testcase', 'inputValues', 'container-inputvalue'),
			'change .input-testcase-expectedoutput': changeExerciseSubcollection('testCases', 'container-testcase', 'expectedOutputValues', 'container-outputvalue'),
			'click .btn-save': () => Meteor.call('saveExercise', exercise, (err, id) => err || Router.go('exerciseSolve', { _id: id }))
		});

})();
