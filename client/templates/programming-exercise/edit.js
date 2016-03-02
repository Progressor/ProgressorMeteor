(function () {
	'use strict';

	function getDefaultExercise() {
		return {
			type: 1,
			names: [],
			descriptions: [],
			functions: [{
				inputNames: [null],
				inputTypes: [null],
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

	let exercise = getDefaultExercise(), executorTypes;
	const depExercise = new Tracker.Dependency(), depExecutorTypes = new Tracker.Dependency();

	function testExecutorIdentifier(val) {
		return val.length === 0 || /^[A-Z_][A-Z0-9_]*$/i.test(val);
	}

	function testExecutorType(typ, rec) {
		let xtp = executorTypes ? _.find(executorTypes.types, xtp => typ.substr(0, xtp._id.length) === xtp._id) : null, idx = xtp ? xtp._id.length : 0;
		if (!xtp) return false; //^: find the (outermost) type object and skip its name //verify a type has been found
		else if (xtp.parameterCount > 0) { //if the type has parameters
			if (typ.substr(idx, 1) !== "<") return false; //verify the next character is the generic open bracket
			idx++; //move index forward
			for (let i = 0; i < xtp.parameterCount; i++) { //repeat check for each type parameter
				let dlm = i === xtp.parameterCount - 1 ? '>' : ',', inc; //determine the delimiter expected after this type parameter
				if (i > 0) idx += typ.substr(idx).match(/^\s?/)[0].length; //skip optional whitespace after separator
				if ((inc = testExecutorType(typ.substr(idx), true)) === false) return false; //verify parameter is a valid type
				idx += inc; //move index forward
				if (typ.substr(idx, 1) !== dlm) return false; //verify the next character is the defined delimiter
				idx += dlm.length; //move index forward
			}
		}
		return rec ? idx : idx === typ.length; //recursive: return new index, otherwise: verify end is reached
	}

	function testExecutorValue(val, typ, rec, sep) {
		let xtp = executorTypes ? _.find(executorTypes.types, xtp => typ.substr(0, xtp._id.length) === xtp._id) : null, typIdx = xtp ? xtp._id.length : 0, valIdx = 0, mtc, num;
		if (xtp.pattern) { //^: find the (outermost) type object and skip its name //if a pattern is specified
			if (!(mtc = val.match(sep ? `^(${xtp.pattern}?(?=${sep})|${xtp.pattern})` : `^${xtp.pattern}`))) return false; //verify the pattern
			valIdx += mtc[0].length; //move index forward //_: verify the number range
			if (xtp.max && !(Number.isFinite(num = (Number.isInteger(xtp.max) ? parseInt : parseFloat)(mtc[0])) && -xtp.max - 1 <= num && num <= xtp.max)) return false;
		}
		if (xtp.parameterCount > 0) { //if the type as parameters
			typIdx++; //skip generic open bracket
			let _typIdx = typIdx; //remember initial type index position
			for (let j = 0; valIdx !== val.length; j++) { //repeat until all collection items have been processed
				if (j > 0) { //if item is not the first one
					typIdx = _typIdx; //reset type index
					if (xtp.patternSeparator && !(mtc = val.substr(valIdx).match(`^${xtp.patternSeparator}`))) return false; //verify item separator
					valIdx += mtc[0].length; //move index forward
				}
				for (let i = 0; i < xtp.parameterCount; i++) { //repeat check for each type parameter
					if (i > 0) typIdx += typ.substr(typIdx).match(/^\s?/)[0].length; //skip optional whitespace after separator //_: recursive call (pass next separator)
					let inc = testExecutorValue(val.substr(valIdx), typ.substr(typIdx), true, i < xtp.parameterCount - 1 && xtp.patternInternalSeparators && xtp.patternInternalSeparators[i] ? xtp.patternInternalSeparators[i] : xtp.patternSeparator ? xtp.patternSeparator : null);
					typIdx += inc.typIdx; //move index forward
					valIdx += inc.valIdx; //move index forward
					typIdx++; //skip delimiter
					if (i < xtp.parameterCount - 1) { //if there are more parameters to come //_: verify internal separator
						if (xtp.patternInternalSeparators && xtp.patternInternalSeparators[i] && !(mtc = val.substr(valIdx).match(`^${xtp.patternInternalSeparators[i]}`))) return false;
						valIdx += mtc[0].length; //move index forward
					}
				}
			}
		}
		return rec ? { typIdx: typIdx, valIdx: valIdx } : (typIdx === typ.length || xtp.parameterCount > 0) && valIdx === val.length; //recursive: return new indexes, otherwise: verify end is reached
	}

	function changeExercise(cb) {
		return function (ev) {
			let ret = cb(ev, ev && ev.currentTarget ? $(ev.currentTarget) : null);
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
			disableLanguage: () => !!exercise._id,
			exerciseSearchData: dependOnExercise(() => ({ _id: exercise.programmingLanguage })),
			i18nProgrammingLanguage: dependOnExercise(() => i18n.getProgrammingLanguage(exercise.programmingLanguage)),
			i18nExerciseName: i18n.getName,
			i18nCategoryName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			i18nProgrammingLanguages: dependOnExercise(() => _.map(Progressor.getProgrammingLanguages(), lng => _.extend({}, lng, {
				name: i18n.getProgrammingLanguage(lng._id),
				isActive: exercise && lng._id === exercise.programmingLanguage
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
				inputs: _.map(fun.inputTypes.length ? fun.inputTypes : getDefaultExercise().functions[0].inputTypes, (typ, idx) => ({ type: typ, name: fun.inputNames ? fun.inputNames[idx] : null })),
				isActive: cas && cas.functionName === fun.name
			}))),
			testCases: dependOnExercise(() => _.map(exercise.testCases, cas => {
				let fun = _.find(exercise.functions, fun => fun.name === cas.functionName);
				let fillValues = (vals, typs) => typs ? _.chain(vals).union(_.range(typs.length)).first(typs.length).map((val, idx) => ({ value: typeof(val) === 'string' ? val : null, type: typs[idx] })).value() : _.map(vals, (val, idx) => ({ value: val }));
				return _.extend({}, cas, {
					inputValues: fillValues(cas.inputValues, fun ? fun.inputTypes : null),
					expectedOutputValues: fillValues(cas.expectedOutputValues, fun ? fun.outputTypes : null)
				});
			})),
			executorTypes: dependOnExecutorTypes(() => executorTypes ? executorTypes.types : []),
			executorValues: dependOnExecutorTypes(() => executorTypes ? _.map(executorTypes.values, val => _.extend({}, val, { typeLabels: val.types.join(', ') })) : [])
		});

	function changeExerciseTranslation(trs) {
		return changeExercise(function (ev, $this) {
			let elm = _.find(exercise[trs + 's'], elm => elm.language === $this.data('lang'));
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

	function removeExerciseCollectionItem(col, cls) {
		return changeExercise(function (ev, $this) {
			let remIdx = $this.closest('.' + cls).prevAll('.' + cls).length;
			exercise[col] = _.filter(exercise[col], (itm, idx) => idx !== remIdx);
		});
	}

	function removeExerciseSubcollectionItems(col, cls1, prps, cls2) {
		return changeExercise(function (ev, $this) {
			let excCol = exercise[col][$this.closest('.' + cls1).prevAll('.' + cls1).length], remIdx = $this.closest('.' + cls2).prevAll('.' + cls2).length;
			_.each(prps, prp => excCol[prp] = _.filter(excCol[prp], (itm, idx) => idx !== remIdx));
		});
	}

	Template.programmingEdit.events(
		{
			'keyup .input-function-name'(ev) {
				let $this = $(ev.currentTarget), $grp = $this.closest('.form-group');
				let $grps = $('.input-function-name').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$grp.addClass('has-error');
				_.chain($grps).groupBy(elm => $(elm).val()).filter(grp => grp.length > 1).flatten().each(elm => $(elm).closest('.form-group').addClass('has-error'));
			},
			'keyup .input-parameter-name'(ev) {
				let $this = $(ev.currentTarget), $grp = $this.closest('.form-group'), $fnc = $this.closest('.container-function');
				let $grps = $fnc.find('.input-parameter-name').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$grp.addClass('has-error');
				_.chain($grps).groupBy(elm => $(elm).val()).filter(grp => grp.length > 1).flatten().each(elm => $(elm).closest('.form-group').addClass('has-error'));
			},
			'keyup .exec-type': dependOnExecutorTypes((ev) => {
				let $this = $(ev.currentTarget), $grp = $this.closest('.form-group').removeClass('has-error');
				if (!testExecutorType($this.val()))
					$grp.addClass('has-error');
			}),
			'keyup .exec-value': dependOnExecutorTypes((ev) => {
				let $this = $(ev.currentTarget), $grp = $this.closest('.form-group').removeClass('has-error');
				if (!testExecutorValue($this.val(), $this.attr('data-type'))) //cannot use .data(), it will not update
					$grp.addClass('has-error');
			}),
			'click .btn-add-function': changeExercise(() => exercise.functions.push(getDefaultExercise().functions[0])),
			'click .btn-add-parameter': changeExercise((ev, $this) => exercise.functions[$this.closest('.container-function').prevAll('.container-function').length].inputTypes.push(null)),
			'click .btn-add-testcase': changeExercise(() => exercise.testCases.push(getDefaultExercise().testCases[0])),
			'click .btn-remove-function': removeExerciseCollectionItem('functions', 'container-function'),
			'click .btn-remove-parameter': removeExerciseSubcollectionItems('functions', 'container-function', ['inputNames', 'inputTypes'], 'container-parameter'),
			'click .btn-remove-testcase': removeExerciseCollectionItem('testCases', 'container-testcase'),
			'change #select-language': changeExercise((ev, $this) => !exercise._id ? exercise.programmingLanguage = $this.val() : null),
			'change #select-category': changeExercise((ev, $this) => exercise.category_id = $this.val()),
			'change #select-difficulty': changeExercise((ev, $this) => exercise.difficulty = parseInt($this.val())),
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
			'click .btn-save': () => Meteor.call('saveExercise', exercise, (err, id) => err || Router.go('exerciseSolve', { _id: id })),
			'click .btn-delete': () => Meteor.call('deleteExercise', exercise, err => err || Router.go('exerciseSearch', { _id: exercise.programmingLanguage }))
		});

})();
