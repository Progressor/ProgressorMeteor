(function () {
	'use strict';

	function getUserInfo(user, showName, showEmail) {
		if (typeof user === 'string')
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

	function joinCollection(document, property, collection = `${property}s`, key = `${property}_id`) {
		return _.extend({ [property]: Progressor[collection].findOne({ _id: document[key] }) }, document);
	}

	_.extend(Progressor, {
		//MONGODB COLLECTIONS
		categories: new Mongo.Collection('categories'),
		exercises: new Mongo.Collection('exercises'),
		results: new Mongo.Collection('results'),

		//GENERATED COLLECTIONS
		numberOfExercisesToRelease: Meteor.isClient ? new Mongo.Collection('numberOfExercisesToRelease') : undefined,

		//HELPER METHODS
		getUserEmail: u => getUserInfo(u, false, true),
		getUserName: (u, h = false) => getUserInfo(u, true, h !== true),
		joinCategory: d => joinCollection(d, 'category', 'categories')
	});

})();
