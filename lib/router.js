Router.configure(
	{
		layoutTemplate: 'layout'
	});

Router.route('/', function () {

	this.layout('layout', {
		data: function () {
			return {
				customTitle: true
			};
		}
	});

	this.render('home');
});
