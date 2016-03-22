(function () {
	'use strict';

	_.extend(Progressor, {
		// COLLECTIONS
		categories: new Mongo.Collection('categories'),
		exercises: new Mongo.Collection('exercises', {
			transform(doc){
				return _.extend(doc, {
					category: Progressor.categories.findOne({ _id: doc.category_id })
				});
			}
		}),
		results: new Mongo.Collection('results', {
			transform(doc) {
				if (doc.exercise)
					_.extend(doc.exercise, {
						category: Progressor.categories.findOne({ _id: doc.exercise.category_id })
					});
				return doc;
			}
		}),

		// HELPER METHODS
		getUserEmail(user) {
			if (typeof(user) === 'string')
				user = Meteor.users.findOne(user);
			if (user && user.emails && user.emails.length)
				return user.emails[0].address;
		},
		getUserFirstName(user) {
			if (typeof(user) === 'string')
				user = Meteor.users.findOne(user);
			if (user && user.profile.firstName)
				return user.profile.firstName;
		},
		getUserLastName(user){
			if (typeof(user) === 'string')
				user = Meteor.users.findOne(user);
			if (user && user.profile.lastName)
				return user.profile.lastName;
		}
	});

})();
