(function () {
	'use strict';

	///////////////////
	// CONFIGURATION //
	///////////////////

	Router.configure(
		{
			layoutTemplate: 'layout',
			notFoundTemplate: 'notFound',
			loadingTemplate: 'dataLoading'
		});

	Router.plugin('dataNotFound', {
		notFoundTemplate: 'notFound'
	});

	///////////////////////
	// INDEPENDENT PAGES //
	///////////////////////

	Router.route('/', {
		name: 'home',
		waitOn: () => Meteor.subscribe('releasedExercises'),
		data: () => ({ layout_customTitle: true })
	});

	Router.route('/account', {
		name: 'account',
		waitOn() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('categories'),
				Meteor.subscribe('releasedOrMyExercises'),
				Meteor.subscribe('myResults'),
				Meteor.subscribe('myExaminations'),
				Meteor.subscribe('myExecutions')
			];
		},
		data() {
			if (this.params.query.state)
				AccountsTemplates.setState(this.params.query.state);
			return {
				results: _.map(Progressor.results.find({}, { sort: [['solved', 'desc']] }).fetch(), r => _.extend({}, r, { exercise: Progressor.joinCategory(r.exercise) })),
				createdExercises: _.map(Progressor.exercises.find({ author_id: Meteor.userId(), archived: { $not: true } }, { sort: [['lastEdited', 'desc']] }).fetch(), Progressor.joinCategory),
				archivedExercises: _.map(Progressor.exercises.find({ author_id: Meteor.userId(), archived: true }, { sort: [['lastEdited', 'desc']] }).fetch(), Progressor.joinCategory),
				createdExaminations: Progressor.examinations.find({ author_id: Meteor.userId(), archived: { $not: true } }, { sort: [['lastEdited', 'desc']] }).fetch(),
				archivedExaminations: Progressor.examinations.find({ author_id: Meteor.userId(), archived: true }, { sort: [['lastEdited', 'desc']] }).fetch(),
				createdExecutions: Progressor.executions.find({ author_id: Meteor.userId(), archived: { $not: true } }, { sort: [['lastEdited', 'desc']] }).fetch(),
				archivedExecutions: Progressor.executions.find({ author_id: Meteor.userId(), archived: true }, { sort: [['lastEdited', 'desc']] }).fetch()
			};
		}
	});

	////////////////
	// CATEGORIES //
	////////////////

	Router.route('/category/create', {
		name: 'categoryCreate',
		onBeforeAction: ['authenticate', 'authorize'],
		authenticate: {
			template: 'account'
		},
		authorize: {
			allow: () => Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN),
			template: 'forbidden'
		}
	});

	Router.route('/category/edit/:_id', {
		name: 'categoryEdit',
		onBeforeAction: ['authenticate', 'authorize'],
		authenticate: {
			template: 'account'
		},
		authorize: {
			allow: () => Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN),
			template: 'forbidden'
		},
		waitOn() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('category', this.params._id)
			];
		},
		data: () => Progressor.categories.findOne()
	});

	Router.route('/category/:_id', {
		name: 'categoryExercises',
		waitOn() {
			return [
				Meteor.subscribe('category', this.params._id),
				Meteor.subscribe('releasedExercisesForCategory', this.params._id),
				Meteor.subscribe('myResults')
			];
		},
		data() {
			const category = Progressor.categories.findOne(), exercises = Progressor.exercises.find().fetch();
			//if (exercises.length)
			if (category)
				return {
					isCategory: true,
					programmingLanguage: category.programmingLanguage,
					exercises: _.map(exercises, Progressor.joinCategory)
				};
		}
	});

	///////////////
	// EXERCISES //
	///////////////

	Router.route('/language/:_id', {
		name: 'exerciseSearch',
		waitOn() {
			return [
				Meteor.subscribe('categoriesForLanguage', this.params._id),
				Meteor.subscribe('releasedExercisesForLanguage', this.params._id),
				Meteor.subscribe('myResults')
			];
		},
		data() {
			const programmingLanguage = _.find(Progressor.getProgrammingLanguages(), l => l._id === this.params._id), exercises = Progressor.exercises.find().fetch();
			//if (exercises.length)
			if (programmingLanguage)
				return {
					programmingLanguage: programmingLanguage._id,
					exercises: _.map(exercises, Progressor.joinCategory)
				};
		}
	});

	Router.route('/exercise/release', {
		name: 'exerciseRelease',
		onBeforeAction: ['authenticate', 'authorize'],
		authenticate: {
			template: 'account'
		},
		authorize: {
			allow: () => Roles.userIsInRole(Meteor.userId(), Progressor.ROLE_ADMIN),
			template: 'forbidden'
		},
		waitOn() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('categories'),
				Meteor.subscribe('releaseRequestedExercises')
			];
		},
		data() {
			return {
				requested: _.map(Progressor.exercises.find({ 'released.confirmed': { $exists: false } }, { sort: [['released.requested', 'desc']] }).fetch(), Progressor.joinCategory),
				released: _.map(Progressor.exercises.find({ 'released.confirmed': { $exists: true } }, { sort: [['released.requested', 'desc']] }).fetch(), Progressor.joinCategory)
			};
		}
	});

	Router.route('/exercise/create', {
		name: 'exerciseCreate',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			const sub = [Meteor.subscribe('categories')];
			if (this.params && this.params.query && this.params.query.duplicate)
				sub.push(Meteor.subscribe('exercise', this.params.query.duplicate));
			return sub;
		},
		data() {
			const exercise = Progressor.exercises.findOne(), type = exercise ? exercise.type : this.params.query.type;
			return type ? { type: parseInt(type) } : {};
		}
	});

	Router.route('/exercise/edit/:_id', {
		name: 'exerciseEdit',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('categories'),
				Meteor.subscribe('exercise', this.params._id),
				Meteor.subscribe('resultByExercise', this.params._id)
			];
		},
		data() {
			const exercise = Progressor.exercises.findOne();
			if (exercise) return Progressor.joinCategory(exercise);
		}
	});

	Router.route('/exercise/:_id', {
		name: 'exerciseSolve',
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('exercise', this.params._id, true),
				Meteor.subscribe('resultByExercise', this.params._id, true),
				Meteor.subscribe('executionByExercise', this.params._id)
			];
		},
		data() {
			const exercise = Progressor.exercises.findOne();
			if (exercise) {
				if (exercise.execution_id)
					exercise.layout_examinationTheme = true;
				return Progressor.joinExecution(Progressor.joinCategory(exercise));
			}
		}
	});

	/////////////
	// RESULTS //
	/////////////

	Router.route('/result/:_id', {
		name: 'resultView',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('exerciseByResult', this.params._id, true),
				Meteor.subscribe('result', this.params._id, true)
			];
		},
		data() {
			const result = Progressor.results.findOne();
			if (result) return _.extend({}, result, { exercise: Progressor.joinCategory(result.exercise) });
		}
	});

	/////////////////////////////
	// EXAMINATION (TEMPLATES) //
	/////////////////////////////

	Router.route('/examination/template/create', {
		name: 'examinationTemplateCreate',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('releasedOrMyExercises')
			];
		}
	});

	Router.route('/examination/template/edit/:_id', {
		name: 'examinationTemplateEdit',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('categories'),
				Meteor.subscribe('releasedOrMyExercises'),
				Meteor.subscribe('examination', this.params._id),
				Meteor.subscribe('executionsByExamination', this.params._id)
			];
		}, data() {
			return Progressor.examinations.findOne();
		}
	});

	//////////////////////////////
	// (EXAMINATION) EXECUTIONS //
	//////////////////////////////

	Router.route('/examination/create', {
		name: 'examinationExecutionCreate',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('releasedOrMyExercises'),
				Meteor.subscribe('examination', this.params.query.examination)
			];
		}
	});

	Router.route('/examination/edit/:_id', {
		name: 'examinationExecutionEdit',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('categories'),
				Meteor.subscribe('releasedOrMyExercises'),
				Meteor.subscribe('exercisesByExecution', this.params._id),
				Meteor.subscribe('execution', this.params._id),
				Meteor.subscribe('examinationByExecution', this.params._id)
			];
		}, data() {
			return Progressor.joinExamination(Progressor.executions.findOne());
		}
	});

	Router.route('/examination/admin/:_id', {
		name: 'examinationExecutionView',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('categories'),
				Meteor.subscribe('exercisesByExecution', this.params._id),
				Meteor.subscribe('resultsByExecution', this.params._id),
				Meteor.subscribe('execution', this.params._id),
				Meteor.subscribe('examinationByExecution', this.params._id)
			];
		}, data() {
			return Progressor.joinExamination(Progressor.executions.findOne());
		}
	});

	Router.route('/examination/:_id', {
		name: 'examinationExecutionExamineeView',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('categories'),
				Meteor.subscribe('exercisesByExecution', this.params._id, true),
				Meteor.subscribe('resultsByExecution', this.params._id, true, true),
				Meteor.subscribe('execution', this.params._id)
			];
		}, data() {
			return Progressor.executions.findOne();
		}
	});

})();
