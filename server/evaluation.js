(function () {
	'use strict';

	//evaluation of programming exercises in executor

	Meteor.methods(
		{
			evaluateMultipleChoice(exercise, input) {
				check(exercise, Match.OneOf(
					Match.ObjectIncluding(
						{
							_id: String
						}),
					Match.ObjectIncluding(
						{
							options: [Match.ObjectIncluding({ options: [Match.Any] })],
							solution: [Match.Integer]
						})));
				check(input, [Match.Integer]);

				if (exercise._id)
					exercise = Progressor.exercises.findOne({ _id: exercise._id });

				const results = _.map(exercise.options[0].options, (o, i) => ({ success: _.contains(exercise.solution, i), checked: _.contains(input, i) }));

				if (exercise._id && this.userId) {
					const qry = { user_id: this.userId, exercise_id: exercise._id };
					const del = Progressor.results.findOne(qry);
					Progressor.results.upsert(del ? del._id : null, _.extend(qry, { exercise: _.omit(exercise, '_id'), results: results, solved: new Date() }));
				}

				return results;
			}
		});

})();
