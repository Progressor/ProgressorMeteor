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
	data: function () {
		return { customTitle: true };
	}
});

Router.route('/login', { name: 'login' });


Router.route('/language/:_id', {
	name: 'exerciseSearch',
	data: function () {
		var exercises = Exercises.aggregate(
			{ $match: { programmingLanguage: this.params._id } },
			{ $group: { _id: category_id } }
		);
		return exercises.length ? exercises : null;
	}
});

Router.route('/exercise/:_id', {
	name: 'programmingSolve',
	data: function () {
		return Exercises.findOne({ _id: this.params._id });
	}
});

Router.route('/create', { name: 'programmingEdit' });
