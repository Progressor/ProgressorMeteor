(function () {
	'use strict';

	function getUserInfo(user, showName, showEmail) {
		if (typeof(user) === 'string')
			user = Meteor.users.findOne(user);
		if (user) {
			let emailsVerified;
			showName = showName && user && user.profile && user.profile.name;
			showEmail = showEmail && user && user.emails && (emailsVerified = _.filter(user.emails, e => e.verified)).length;
			if (showName && showEmail) return `${user.profile.name} (${emailsVerified[0].address})`;
			else if (showName) return user.profile.name;
			else if (showEmail) return emailsVerified[0].address;
		}
	}

	_.extend(Progressor, {
		// COLLECTIONS
		categories: new Mongo.Collection('categories'),
		exercises: new Mongo.Collection('exercises', {
			transform(exercise){
				return _.extend(exercise, {
					category: Progressor.categories.findOne({ _id: exercise.category_id })
				});
			}
		}),
		results: new Mongo.Collection('results', {
			transform(result) {
				// _.extend(result, {
				// 	exerciseSnapshot: Progressor.exercises.findOne({ _id: result.exercise_id })
				// });
				if (result.exercise)
					_.extend(result.exercise, {
						category: Progressor.categories.findOne({ _id: result.exercise.category_id })
					});
				return result;
			}
		}),

		// HELPER METHODS
		getUserEmail: u => getUserInfo(u, false, true),
		getUserName: (u, f) => getUserInfo(u, true, f !== true)
	});

})();
