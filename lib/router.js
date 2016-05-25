(function () {
	'use strict';

	Router.configure(
		{
			layoutTemplate: 'layout',
			notFoundTemplate: 'notFound',
			loadingTemplate: 'dataLoading'
		});

	Router.plugin('dataNotFound', {
		notFoundTemplate: 'notFound'
	});

	Router.route('/', {
		name: 'home',
		waitOn: () => Meteor.subscribe('releasedExercises'),
		data: () => ({ customTitle: true })
	});

	Router.route('/account', {
		name: 'account',
		waitOn() {
			return [
				Meteor.subscribe('users'),
				Meteor.subscribe('categories'),
				Meteor.subscribe('releasedOrMyExercises'),
				Meteor.subscribe('myResults')
			];
		},
		data() {
			if (this.params.query.state)
				AccountsTemplates.setState(this.params.query.state);
			return {
				results: _.map(Progressor.results.find({}, { sort: { solved: -1 } }).fetch(), r => _.extend({}, r, { exercise: Progressor.joinCategory(r.exercise) })),
				createdExercises: _.map(Progressor.exercises.find({ author_id: Meteor.userId(), archived: { $not: true } }, { sort: { lastEdited: -1 } }).fetch(), Progressor.joinCategory),
				archivedExercises: _.map(Progressor.exercises.find({ author_id: Meteor.userId(), archived: true }, { sort: { lastEdited: -1 } }).fetch(), Progressor.joinCategory)
			};
		}
	});

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
				requested: _.map(Progressor.exercises.find({ 'released.confirmed': { $exists: false } }, { sort: { 'released.requested': -1 } }).fetch(), Progressor.joinCategory),
				released: _.map(Progressor.exercises.find({ 'released.confirmed': { $exists: true } }, { sort: { 'released.confirmed': -1 } }).fetch(), Progressor.joinCategory)
			};
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
				Meteor.subscribe('categories'),
				Meteor.subscribe('exercise', this.params._id),
				Meteor.subscribe('myResultByExercise', this.params._id)
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
				Meteor.subscribe('myResultByExercise', this.params._id, true)
			];
		},
		data() {
			const exercise = Progressor.exercises.findOne();
			if (exercise) return Progressor.joinCategory(exercise);
		}
	});

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
				Meteor.subscribe('myResult', this.params._id, true)
			];
		},
		data() {
			const result = Progressor.results.findOne();
			if (result) return _.extend({}, result, { exercise: Progressor.joinCategory(result.exercise) });
		}
	});

	Router.route('/examination/template/create', {
		name: 'examinationTemplateCreate',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('releasedExercises')
			];
		}
	});

	Router.route('/examination/template/edit/:_id', {
		name: 'examinationTemplateEdit',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		}
	});

	Router.route('/examination/template/:_id', {
		name: 'examinationTemplateView',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		}
	});

	Router.route('/examination/create', {
		name: 'examinationExecutionCreate',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		}
	});

	Router.route('/examination/edit/:_id', {
		name: 'examinationExecutionEdit',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		}
	});

	Router.route('/examination/:_id', {
		name: 'examinationExecutionView'
	});

})();
