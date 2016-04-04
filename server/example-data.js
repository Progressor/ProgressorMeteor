Meteor.startup(function () {
	'use strict';

	if (Progressor.categories.find().count() === 0
			&& Progressor.exercises.find().count() === 0
			&& Progressor.results.find().count() === 0
			&& Meteor.users.find().count() > 0) {

		_.each(
			[
				{
					programmingLanguage: 'java',
					names: [
						{
							language: 'en',
							name: 'String'
						},
						{
							language: 'de',
							name: 'String/Text'
						}
					],
					descriptions: [
						{
							language: 'en',
							description: 'The **String** class represents character strings. All string literals in *Java* programs, such as `abc`, are implemented as instances of this class.'
						}
					],
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				}
			], function (category) {
				Progressor.categories.insert(category);
			});

		_.each(
			[
				{
					names: [
						{
							language: 'en',
							name: 'Your first exercise!'
						},
						{
							language: 'de',
							name: 'Deine erste Aufgabe!'
						}
					],
					programmingLanguage: 'java',
					category_id: Progressor.categories.findOne()._id,
					difficulty: 1,
					type: 1,
					descriptions: [
						{
							language: 'en',
							description: 'Output **Hello World**.'
						},
						{
							language: 'de',
							description: 'Gib __Hello World__ aus.'
						}
					],
					functions: [
						{
							name: 'helloWorld',
							inputNames: [],
							inputTypes: [],
							outputNames: ['return'],
							outputTypes: ['string']
						}
					],
					testCases: [
						{
							functionName: 'helloWorld',
							inputValues: [],
							expectedOutputValues: ['Hello World'],
							visible: true
						}
					],
					solution: 'public String helloWorld() { return "Hello World"; }',
					solutionVisible: true,
					released: false,
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				},
				{
					names: [
						{
							language: 'en',
							name: 'Length comparison'
						},
						{
							language: 'de',
							name: 'Längenvergleich'
						}
					],
					programmingLanguage: 'java',
					category_id: Progressor.categories.findOne()._id,
					difficulty: 1,
					type: 1,
					descriptions: [
						{
							language: 'en',
							description: 'Return the shorter / longer of the two strings.\n\n*If both are of equal length, return the first.*'
						},
						{
							language: 'de',
							description: 'Gib den kürzeren / längeren der beiden Strings zurück.\n\n*Wenn beide gleich lang sind, gib den ersten zurück.*'
						}
					],
					functions: [
						{
							name: 'shorter',
							inputNames: ['first', 'second'],
							inputTypes: ['string', 'string'],
							outputNames: ['return'],
							outputTypes: ['string']
						},
						{
							name: 'longer',
							inputNames: ['first', 'second'],
							inputTypes: ['string', 'string'],
							outputNames: ['return'],
							outputTypes: ['string']
						}
					],
					testCases: [
						{
							functionName: 'shorter',
							inputValues: ['short', 'long'],
							expectedOutputValues: ['long'],
							visible: true
						},
						{
							functionName: 'shorter',
							inputValues: ['long', 'short'],
							expectedOutputValues: ['long'],
							visible: false
						},
						{
							functionName: 'shorter',
							inputValues: ['Bern University of Applied Sciences', 'Berner Fachhochschule'],
							expectedOutputValues: ['Berner Fachhochschule'],
							visible: true
						},
						{
							functionName: 'shorter',
							inputValues: ['', ''],
							expectedOutputValues: [''],
							visible: false
						},
						{
							functionName: 'shorter',
							inputValues: ['asdf', 'temp'],
							expectedOutputValues: ['asdf'],
							visible: false
						},
						{
							functionName: 'longer',
							inputValues: ['short', 'long'],
							expectedOutputValues: ['short'],
							visible: true
						},
						{
							functionName: 'longer',
							inputValues: ['long', 'short'],
							expectedOutputValues: ['short'],
							visible: false
						},
						{
							functionName: 'longer',
							inputValues: ['Bern University of Applied Sciences', 'Berner Fachhochschule'],
							expectedOutputValues: ['Bern University of Applied Sciences'],
							visible: true
						},
						{
							functionName: 'longer',
							inputValues: ['', ''],
							expectedOutputValues: [''],
							visible: false
						},
						{
							functionName: 'longer',
							inputValues: ['asdf', 'temp'],
							expectedOutputValues: ['asdf'],
							visible: false
						}
					],
					solution: null,
					solutionVisible: false,
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				}
			], function (exercise) {
				Progressor.exercises.insert(exercise);
			});

		_.each(
			[
				{
					user_id: Meteor.users.findOne()._id,
					exercise_id: Progressor.exercises.findOne()._id,
					exercise: _.omit(Progressor.exercises.findOne(), '_id', 'category'),
					fragment: 'public String helloWorld() { return "Hello, World!"; }',
					results: [
						{
							success: false,
							result: 'Hello, World!',
							performance: {
								runtimeMilliseconds: 75.237
							}
						}
					],
					solved: new Date()
				}
			], function (result) {
				Progressor.results.insert(result);
			});
	}
});
