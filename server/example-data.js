Meteor.startup(function () {
	'use strict';

	if (Progressor.categories.find().count() === 0
			&& Progressor.exercises.find().count() === 0
			&& Progressor.results.find().count() === 0
			&& Progressor.examinations.find().count() === 0
			&& Progressor.executions.find().count() === 0
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
			], d => Progressor.categories.insert(d));

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
					released: {
						requested: new Date(),
						confirmor_id: Meteor.users.findOne()._id,
						confirmed: new Date()
					},
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
					difficulty: 2,
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
					released: {
						requested: new Date()
					},
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				},
				{
					names: [
						{
							language: 'en',
							name: 'Java basics - quantity of operation'
						},
						{
							language: 'de',
							name: 'Java Grundlagen - Menge von Werten'
						}
					],
					programmingLanguage: 'java',
					category_id: Progressor.categories.findOne()._id,
					difficulty: 1,
					type: 2,
					descriptions: [
						{
							language: 'en',
							description: 'What is the description of a *quantity of operation values*, which could be executed on these?'
						},
						{
							language: 'de',
							description: 'Wie nennt man eine *Menge von Werten mit einer Menge von Operationen*, die auf diese Werten ausgeführt werden können?'
						}
					],
					options: [
						{
							language: 'en',
							options: ['Constant', 'Number', 'Value', 'Type']
						},
						{
							language: 'de',
							options: ['Konstante', 'Zahl', 'Wert', 'Typ']
						}
					],
					multipleSolutions: false,
					solution: [3],
					solutionVisible: true,
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				},
				{
					names: [
						{
							language: 'en',
							name: 'Java basics - identifiers'
						},
						{
							language: 'de',
							name: 'Java Grundlagen - Identifiers'
						}
					],
					programmingLanguage: 'java',
					category_id: Progressor.categories.findOne()._id,
					difficulty: 1,
					type: 2,
					descriptions: [
						{
							language: 'en',
							description: 'Which statements concerning **identifiers** are correct?'
						},
						{
							language: 'de',
							description: 'Welche Aussagen über **Identifiers** sind korrekt?'
						}
					],
					options: [
						{
							language: 'en',
							options: [
								'No case sensitivity.',
								'Identifiers can contain the symbol $.',
								'Identifiers can contain the symbols like ? or %.',
								'Identifiers must beginn with a capital letter or a small letter',
								'Identifiers are allowed to contain numbers, _ and **characters.',
								'Identifiers are allowed to beginn with a number.'
							]
						},
						{
							language: 'de',
							options: [
								'Gross-und Kleinschreibung spielt keine Rolle.',
								'Identifiers können das Symbol $ enthalten.',
								'Identifiers können Symbole wie ? oder % enthalten.',
								'Identifiers müssen mit einem Gross- oder Kleinbuchstaben beginnen.',
								'Identifiers dürfen Ziffern, _ und Buchstaben enthalten.',
								'Identifiers können mit einer Ziffer beginnen.'
							]
						}
					],
					multipleSolutions: true,
					solution: [1, 4],
					solutionVisible: true,
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				},
				{
					names: [
						{
							language: 'en',
							name: 'Java basics - reading code'
						},
						{
							language: 'de',
							name: 'Java Grundlagen - Code lesen'
						}
					],
					programmingLanguage: 'java',
					category_id: Progressor.categories.findOne()._id,
					difficulty: 1,
					type: 3,
					descriptions: [
						{
							language: 'en',
							description: 'It was **n = 1234**.\nWhat is the output?\n\n```int r= n % 10;```\n```n = n / 10;```\n```while (n > 0) {```\n &nbsp;&nbsp;```r = r * 10 + n % 10;```\n&nbsp;&nbsp;```n = n / 10;```\n```} System.out.println(r);```\n'
						},
						{
							language: 'de',
							description: 'Es sei **n = 1234**.\nWie sieht die Ausgabe aus?\n\n```int r= n % 10;```\n```n = n / 10;```\n```while (n > 0) {```\n &nbsp;&nbsp;```r = r * 10 + n % 10;```\n&nbsp;&nbsp;```n = n / 10;```\n```} System.out.println(r);```\n'
						}
					],
					pattern: '-?\\d+',
					solution: ['7'],
					solutionVisible: true,
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				},
				{
					names: [
						{
							language: 'en',
							name: 'Java basics- Class diagram'
						},
						{
							language: 'de',
							name: 'Java Grundlagen - Klassendiagram'
						}
					],
					programmingLanguage: 'java',
					category_id: Progressor.categories.findOne()._id,
					difficulty: 1,
					type: 3,
					descriptions: [
						{
							language: 'en',
							description: 'Translate the following class diagram into **Java** code!\n\n![alt text](http://msoe.us/taylor/tutorial/se1021/desktopItemUML.png)'
						},
						{
							language: 'de',
							description: 'Übersetze das folgende Klassendiagram in **Java** code!\n\n![alt text](http://msoe.us/taylor/tutorial/se1021/desktopItemUML.png)'
						}
					],
					solution: ['--sample java code--'],
					solutionVisible: true,
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				}
			], d => Progressor.exercises.insert(d));

		_.each(
			[
				{
					names: [
						{
							language: 'en',
							name: 'Java - 1st Term'
						},
						{
							language: 'de',
							name: 'Java - 1. Semester'
						}
					],
					exercises: _.map(Progressor.exercises.find().fetch(), exercise => ({
						_id: exercise._id,
						weight: Math.floor(Random.fraction() * 12 + 1)
					})),
					durationMinutes: 25,
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				}
			], d => Progressor.examinations.insert(d));

		_.each(
			[
				{
					names: [
						{
							language: 'en',
							name: 'Java - 1st Term - 2016'
						},
						{
							language: 'de',
							name: 'Java - 1. Semester - 2016'
						}
					],
					descriptions: [
						{
							language: 'en',
							description: 'This exam contributes 30% to the final grade.'
						}
					],
					examination_id: Progressor.examinations.findOne()._id,
					exercises: _.chain(Progressor.exercises.find().fetch()).map(exercise => ({
						base_id: exercise._id,
						_id: Progressor.exercises.insert(_.omit(exercise, '_id', 'category_id', 'difficulty')).insertedId,
						weight: Math.floor(Random.fraction() * 12 + 1)
					})).sortBy(() => Random.fraction()),
					examinees: [
						Meteor.users.findOne()._id
					],
					author_id: Meteor.users.findOne()._id,
					lastEditor_id: Meteor.users.findOne()._id,
					lastEdited: new Date()
				}
			], d => Progressor.executions.insert(d));

		_.each(
			[
				{
					user_id: Meteor.users.findOne()._id,
					exercise_id: Progressor.exercises.findOne({ programmingLanguage: 'java', difficulty: 1, type: 1 })._id,
					exercise: _.omit(Progressor.exercises.findOne({ programmingLanguage: 'java', difficulty: 1, type: 1 }), '_id'),
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
			], d => Progressor.results.insert(d));
	}

});
