Router.configure(
	{
		layoutTemplate: 'layout'
	});

Router.route('/', {name: 'home'}, function () {  // function??
	this.layout('layout', {
		data: function () {
			return {
				customTitle: true
			};
		}
	})
});

Router.route('/login', {name: 'login'});

Router.route('/java', {name: 'exerciseSearch'});

Router.route('/java/exercise1', {name: 'exerciseProg'});



