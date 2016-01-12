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
		name: 'account'
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
			var exercises = Progressor.exercises.find().fetch();
			if (exercises.length) {
				var difficulties = [];
				_.forEach(Progressor.getDifficulties(), dif => difficulties[dif] = { _id: dif, exercises: [] });
				exercises.forEach(exc => difficulties[exc.difficulty].exercises.push(exc));
				return { exercises: exercises, difficulties: difficulties }; //return both exercises & difficulties
			}
		}
	});

	Router.route('/exercise/create', {
		name: 'exerciseCreate'
	});

	Router.route('/exercise/edit/:_id', {
		name: 'programmingEdit',
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('publicExercise', this.params._id)
			];
		},
		data: () => Progressor.exercises.findOne()
	});

	Router.route('/exercise/:_id', {
		name: 'programmingSolve',
		waitOn() {
			return [
				Meteor.subscribe('categories'),
				Meteor.subscribe('myResult', this.params._id),
				Meteor.subscribe('publicExercise', this.params._id)
			];
		},
		data: () => Progressor.exercises.findOne()
	});

})();
