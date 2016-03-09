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
				Meteor.subscribe('publicExercises'),
				Meteor.subscribe('myResults')
			];
		},
		data() {
			return {
				exercises: Progressor.results.find({}, { sort: { solved: -1 } }).fetch()
			};
		}
	});

	Router.route('/language/:_id', {
		name: 'exerciseSearch',
		waitOn() {
			return [
				Meteor.subscribe('categoriesForLanguage', this.params._id),
				Meteor.subscribe('publicExercisesForLanguage', this.params._id)
			];
		},
		data() {
			let exercises = Progressor.exercises.find().fetch();
			if (exercises.length)
				return {
					exercises: exercises,
					difficulties: Progressor.getDifficulties()
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
			allow: function() {
				if (true /* Check user Role here */) return true;
				else return false;
			},
			template: 'forbidden'
		},
		waitOn: () => Meteor.subscribe('categories')
	});

	Router.route('/exercise/edit/:_id', {
		name: 'exerciseEdit',
		onBeforeAction: ['authenticate', 'authorize'],
		authenticate: {
			template: 'account'
		}, authorize: {
			allow: function() {
				if (true /* Check user Role here */) return true;
				else return false;
			},
			template: 'forbidden'
		},
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('publicExercise', this.params._id)
			];
		},
		data: () => Progressor.exercises.findOne()
	});

	Router.route('/exercise/:_id', {
		name: 'exerciseSolve',
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('myExerciseResult', this.params._id),
				Meteor.subscribe('publicExercise', this.params._id)
			];
		},
		data: () => Progressor.exercises.findOne()
	});

	Router.route('/result/:_id', {
		name: 'resultView',
		onBeforeAction: ['authenticate', 'authorize'],
		authenticate: {
			template: 'account'
		}, authorize: {
			allow: function() {
				if (true /* Check user Role here */) return true;
				else return false;
			},
			template: 'forbidden'
		},
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('myResult', this.params._id)
			];
		},
		data: () => Progressor.results.findOne()
	});

})();
