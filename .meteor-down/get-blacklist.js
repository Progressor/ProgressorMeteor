(function () {
	'use strict';

	var languages = ['java', 'cpp', 'csharp', 'kotlin'];

	meteorDown.init(function (Meteor) {

		Meteor.call('getBlacklist', languages[Math.floor(Math.random() * (languages.length + 1))], function (error, result) {
			Meteor.kill();
		});
	});

	meteorDown.run(
		{
			concurrency: 10,
			url: 'http://localhost:3000/'
		});

})();
