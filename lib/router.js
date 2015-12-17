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

Router.route('/login', function (){
	this.render('login');
});

Router.route('/java', function (){
	this.render('java');
});
