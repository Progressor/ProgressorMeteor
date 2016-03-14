(function () {
	'use strict';

	Houston.add_collection(Meteor.users);

	function toggleFlag(collection, flag, elementName, setName, unsetName) {
		return function (document) {
			check(document, Match.ObjectIncluding({ _id: String }));

			return Progressor[collection].update(document._id, _.object([[document[flag] !== true ? '$set' : '$unset', _.object([[flag, true]])]])) === 1
				? `${elementName} '${document._id}' successfully ${document[flag] !== true ? setName : unsetName}.`
				: `${elementName} '${document._id}' could NOT successfully be ${document[flag] !== true ? setName : unsetName}!`;
		}
	}

	Houston.methods('exercises', {
		'Release/Hide': toggleFlag('exercises', 'released', 'Exercise', 'released', 'hidden'),
		'Archive/Restore': toggleFlag('exercises', 'archived', 'Exercise', 'archived', 'restored')
	});

})();
