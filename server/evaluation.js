(function () {
	'use strict';

	//evaluation of programming exercises in executor

	Meteor.methods(
		{
			evaluateMultipleChoice(exercise, checkedOptions) {
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
				check(checkedOptions, [Match.Integer]);

				if (exercise._id)
					exercise = Progressor.exercises.findOne({ _id: exercise._id });

				const results = _.map(exercise.options[0].options, (o, i) => ({ success: _.contains(exercise.solution, i) === _.contains(checkedOptions, i), checked: _.contains(checkedOptions, i) }));

				if (exercise._id && this.userId) {
					const query = { user_id: this.userId, exercise_id: exercise._id };
					const upsertExercise = Progressor.results.findOne(query);
					Progressor.results.upsert(upsertExercise ? upsertExercise._id : null, _.extend(query, { exercise: _.omit(exercise, '_id'), results, solved: new Date() }));
				}

				return results;
			},
			evaluateFreeText(exercise, answer) {
				check(exercise, Match.OneOf(
					Match.ObjectIncluding(
						{
							_id: String
						}),
					Match.ObjectIncluding(
						{
							pattern: String,
							solution: [String]
						})));
				check(answer, String);

				if (exercise._id)
					exercise = Progressor.exercises.findOne({ _id: exercise._id });

				let results = [];
				if (exercise.pattern && exercise.solution)
					results.push({ success: _.contains(exercise.solution, answer) });

				if (exercise._id && this.userId) {
					const query = { user_id: this.userId, exercise_id: exercise._id };
					const upsertExercise = Progressor.results.findOne(query);
					Progressor.results.upsert(upsertExercise ? upsertExercise._id : null, _.extend(query, { exercise: _.omit(exercise, '_id'), answer, results, solved: new Date() }));
				}

				return results;
			}
		});

})();
