(function () {
	'use strict';

	const defExercise = {
		functions: [{ inputNames: [null], outputTypes: [null] }],
		testCases: [{}]
	};

	var exercise = defExercise, depExercise = new Tracker.Dependency();
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

	Template.programmingEdit.onCreated(() => {
		exercise = Progressor.exercises.findOne() || defExercise;
		depExercise.changed();

		Meteor.call('getExecutorTypes', (err, res) => {
			executorTypes = res;
			depExecutorTypes.changed();
		});
	});

	Template.programmingEdit.helpers(
		{
			exerciseSearchData() {
				depExercise.depend();
				return { _id: exercise.programmingLanguage };
			},
			i18nProgrammingLanguage() {
				depExercise.depend();
				return i18n.getProgrammingLanguage(exercise.programmingLanguage);
			},
			i18nExerciseName: i18n.getName,
			i18nCategoryName: i18n.getName,
			i18nDifficulty: i18n.getDifficulty,
			i18nProgrammingLanguages() {
				depExercise.depend();
				return _.map(Progressor.getProgrammingLanguages(), lng => ({
					_id: lng, name: i18n.getProgrammingLanguage(lng),
					isActive: exercise && lng === exercise.programmingLanguage
				}));
			},
			i18nCategories() {
				depExercise.depend();
				return Progressor.categories.find({ programmingLanguage: exercise.programmingLanguage }).map(cat => _.extend(cat, {
					name: i18n.getName(cat),
					isActive: cat._id === exercise.category_id
				}));
			},
			i18nDifficulties() {
				depExercise.depend();
				return _.map(Progressor.getDifficulties(), dif => ({
					_id: dif, name: i18n.getDifficulty(dif),
					isActive: dif === exercise.difficulty
				}));
			},
			i18nExerciseNamesDescriptions() {
				depExercise.depend();
				return _.map(i18n.getLanguages(), (nam, id) => ({
					_id: id, language: nam, isActive: id === i18n.getLanguage(),
					name: i18n.getNameForLanguage(exercise, id),
					description: i18n.getDescriptionForLanguage(exercise, id)
				}));
			},
			executorTypes() {
				depExecutorTypes.depend();
				return executorTypes ? executorTypes.types : [];
			},
			executorValues: () => {
				depExecutorTypes.depend();
				return executorTypes ? _.map(executorTypes.values, val => _.extend(val, { typeLabels: val.types.join(', ') })) : [];
			},
			functions(cas) {
				depExercise.depend();
				return _.map(exercise.functions, fun => {
					return _.extend(fun, {
						outputType: fun.outputTypes[0],
						inputs: _.map(fun.inputNames.length ? fun.inputNames : [null], (nme, idx) => ({ name: nme, type: fun.inputTypes ? fun.inputTypes[idx] : null })),
						isActive: cas && cas.functionName === fun.name
					});
				});
			},
			testCases() {
				depExercise.depend();
				return exercise.testCases;
			}
		});

	Template.programmingEdit.events(
		{
			'click .dyn-repeat'(ev) {
				var $this = $(ev.currentTarget), $rep = $this.closest('.dyn-repeatable'), $cln = $rep.clone(true).insertAfter($rep);
				$this.remove();
				$cln.data('index', $cln.data('index') + 1);
				$cln.find('.dyn-repeatable').data('index', 0).prev('.dyn-repeatable').remove();
				$cln.find('input').val(null);
				$cln.find('select').each((idx, elm) => $(elm).val($(elm).find('option').first().val()));
				$cln.find('input, select').each((idx, elm) => {
					var $elm = $(elm), id = $elm.data('id');
					$elm.parents('.dyn-repeatable').each((idy, par) => id = id.replace(`{${$(par).data('var')}}`, $(par).data('index')));
					$cln.find(`[for="${$elm.prop('id')}"]`).prop('for', id);
					$elm.prop('id', id);
				});
			},
			'change #select-language'(ev) {
				exercise.programmingLanguage = $(ev.currentTarget).val();
				depExercise.changed();
			},
			'keyup [id^="input-function-name-"]'(ev) {
				var $this = $(ev.currentTarget), $grp = $this.closest('.form-group');
				var $grps = $('[id^="input-function-name-"]').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$grp.addClass('has-error');
				_.each(_.flatten(_.filter(_.groupBy($grps, elm => $(elm).val()), grp => grp.length > 1)),
							 elm => $(elm).closest('.form-group').addClass('has-error'));
			},
			'keyup [id^="input-parameter-name-"]'(ev) {
				var $this = $(ev.currentTarget), $grp = $this.closest('.form-group'), $fnc = $this.closest('.container-function');
				var $grps = $fnc.find('[id^="input-parameter-name-"]').closest('.form-group').removeClass('has-error').end();
				if (!testExecutorIdentifier($this.val()))
					$grp.addClass('has-error');
				_.each(_.flatten(_.filter(_.groupBy($grps, elm => $(elm).val()), grp => grp.length > 1)),
							 elm => $(elm).closest('.form-group').addClass('has-error'));
			},
			'keyup .exec-type'(ev) {
				var $this = $(ev.currentTarget), $grp = $this.closest('.form-group').removeClass('has-error');
				if (!testExecutorType($this.val()))
					$grp.addClass('has-error');
			}
		});

})();
