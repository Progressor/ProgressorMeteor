(function () {
	'use strict';

	Houston.add_collection(Meteor.users);

	Houston.methods('exercises', {
		release(doc) {
			check(doc, Match.ObjectIncluding({ _id: String }));

			let upd = Progressor.exercises.update(doc._id, { $set: { released: true } });
			return upd === 1 ? `Exercise '${doc._id}' released successfully.` : `Could not successfully release exercise '${doc._id}'!`;
		}
	});

})();
