(function () {
	'use strict';

	_.extend(Progressor, {
		categories: new Mongo.Collection('categories'),
		exercises: new Mongo.Collection('exercises'),
		results: new Mongo.Collection('results')
	});

	if (Meteor.isServer)
		Houston.add_collection(Meteor.users);

})();
