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
		waitOn: () => Meteor.subscribe('publicExercises'),
		data: () => ({ customTitle: true })
	});

	Router.route('/account', {
		name: 'account',
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('publicOrMyExercises'),
				Meteor.subscribe('myResults')
			];
		},
		data() {
			return {
				results: _.map(Progressor.results.find({}, { sort: { solved: -1 } }).fetch(), r => _.extend({}, r, { exercise: Progressor.joinCategory(r.exercise) })),
				authoredExercises: _.map(Progressor.exercises.find({ author_id: Meteor.userId(), archived: { $not: true } }, { sort: { lastEdited: -1 } }).fetch(), Progressor.joinCategory),
				archivedExercises: _.map(Progressor.exercises.find({ author_id: Meteor.userId(), archived: true }, { sort: { lastEdited: -1 } }).fetch(), Progressor.joinCategory)
			};
		}
	});

	Router.route('/category/create', {
		name: 'categoryCreate',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		}
	});

	Router.route('/category/edit/:_id', {
		name: 'categoryEdit',
		onBeforeAction: ['authenticate'],
		authenticate: {
			template: 'account'
		},
		waitOn() {
			return Meteor.subscribe('category', this.params._id);
		},
		data: () => Progressor.categories.findOne()
	});

	Router.route('/category/:_id', {
		name: 'categoryExercises',
		waitOn() {
			return [
				Meteor.subscribe('category', this.params._id),
				Meteor.subscribe('publicExercisesForCategory', this.params._id)
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
				Meteor.subscribe('publicExercisesForLanguage', this.params._id),
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
		onBeforeAction: ['authenticate', 'authorize'],
		authenticate: {
			template: 'account'
		},
		authorize: {
			allow: () => true,
			template: 'forbidden'
		},
		waitOn() {
			const sub = [Meteor.subscribe('categories')];
			if (this.params && this.params.query && this.params.query.duplicate)
				sub.push(Meteor.subscribe('exercise', this.params.query.duplicate));
			return sub;
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
				Meteor.subscribe('exercise', this.params._id)
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
				Meteor.subscribe('exercise', this.params._id),
				Meteor.subscribe('myExerciseResult', this.params._id)
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
				Meteor.subscribe('exerciseByResult', this.params._id),
				Meteor.subscribe('myResult', this.params._id)
			];
		},
		data() {
			const result = Progressor.results.findOne();
			if (result) return _.extend({}, result, { exercise: Progressor.joinCategory(result.exercise) });
		}
	});

})();
