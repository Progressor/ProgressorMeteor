(function () {
	'use strict';

	Router.configure(
		{
			layoutTemplate: 'layout',
			notFoundTemplate: 'notFound'
		});

	Router.plugin('dataNotFound', {
		notFoundTemplate: 'notFound'
	});

	Router.route('/', {
		name: 'home',
		data: () => ({ customTitle: true })
	});

	Router.route('/account', { name: 'account' });

	Router.route('/language/:_id', {
		name: 'exerciseSearch',
		data() {
			var exercises = Progressor.exercises.find({ programmingLanguage: this.params._id }).fetch();
			if (!exercises.length) return null;

			var difficulties = [];
			_.forEach(Progressor.getDifficulties(), dif => difficulties[dif] = { _id: dif, exercises: [] });
			exercises.forEach(exc => difficulties[exc.difficulty].exercises.push(exc));

			return { exercises: exercises, difficulties: difficulties };
		}
	});

	Router.route('/exercise/:_id', {
		name: 'programmingSolve',
		data: () => Progressor.exercises.findOne({ _id: this.params._id })
	});
	/*
	 Router.route('/exercise/edit/:_id', {
	 name: 'programmingEdit',
	 data: function () {
	 return Exercises.findOne({ _id: this.params._id });
	 }
	 });*/
	Router.route('/exercise/create/programming', { name: 'programmingEdit' });

})();
