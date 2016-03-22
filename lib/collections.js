(function () {
	'use strict';

	function getUserInfo(user, showName, showEmail) {
		if (typeof(user) === 'string')
			user = Meteor.users.findOne(user);
		if (user) {
			showName = showName && user.profile && user.profile.name;
			showEmail = showEmail && user.emails && user.emails.length;
			if (showName && showEmail) return `${user.profile.name} (${user.emails[0].address})`;
			else if (showName) return user.profile.name;
			else if (showEmail) return user.emails[0].address;
		}
	}

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
		getUserEmail: u => getUserInfo(u, false, true),
		getUserName: (u, f) => getUserInfo(u, true, f !== true)
	});

})();
