(function () {
	'use strict';

	const POINTS_PER_MILLIMETER = 72 * 0.0393701;

	const FONT_SIZE = 12;
	const PAGE_SIZE = {
		name: 'A4',
		width: 210 * POINTS_PER_MILLIMETER,
		height: 297 * POINTS_PER_MILLIMETER,
		margin: 50
	};

	const DOWNLOAD_LINK = Meteor.isClient ? (() => $('<a></a>').hide().appendTo($('body')))() : null;

	_.extend(Progressor, {

		/**
		 * Generates an execution PDF document.
		 * @param execution execution to print
		 * @param includeResults whether to include the examinees' results
		 */
		generateExecutionPDF(execution, includeResults = false) {
			const user = Meteor.user(), userLanguage = i18n.getLanguageForUser(user);
			const userTitle = i18n.getNameForLanguage(execution, userLanguage, true);

			const pages = !includeResults ? _.map(i18n.getLanguages(), (n, l) => ({ language: l }))
				: _.chain(Progressor.results.find({ 'exercise.execution_id': execution._id }).fetch())
											.groupBy(r => r.user_id)
											.map((r, u) => ({ user: Meteor.users.findOne({ _id: u }), results: r, language: i18n.getLanguageForUser(r.user_id) }))
											.value();

			const pdf = new PDFDocument({
				info: {
					Title: userTitle,
					Author: Progressor.getUserName(execution.author_id),
					Subject: userTitle,
					ModDate: execution.lastEdited
				},
				size: PAGE_SIZE.name, margin: PAGE_SIZE.margin
			});

			_.extend(pdf, {
				get DEFAULT_FONT() {
					return 'Helvetica';
				},
				fontRegular: (size = FONT_SIZE) => pdf.font(pdf.DEFAULT_FONT, size),
				fontBold: (size = FONT_SIZE) => pdf.font(`${pdf.DEFAULT_FONT}-Bold`, size),
				fontOblique: (size = FONT_SIZE) => pdf.font(`${pdf.DEFAULT_FONT}-Oblique`, size),

				//create examination header
				header: (language = userLanguage) => {
					pdf.fontBold(18).text(userTitle)
						.fontRegular().moveDown()
						.text(i18n.getDescriptionForLanguage(execution, language, true))
						.moveDown();
					if (execution.startTime)
						pdf.fontBold().text(`${i18n.forLanguage('examination.startTimeLabel', language)}: `, { continued: true })
							.fontRegular().text(i18n.formatDate(execution.startTime, 'L LT'));
					return pdf.fontBold().text(`${i18n.forLanguage('examination.durationLabel', language)}: `, { continued: true })
						.fontRegular().text(`${execution.durationMinutes} min`)
						.moveDown();
				}
			});

			//add examinee list
			if (execution.examinees) {
				pdf.header()
					.fontBold().text(i18n.forLanguage('examination.examineesLabel', userLanguage));
				_.each(execution.examinees, e => pdf.fontRegular().text(Progressor.getUserName(e)));

				pdf.addPage();
			}

			_.each(pages, (page, pageIndex) => {
				if (pageIndex > 0)
					pdf.addPage();

				//add page description (language / user)
				pdf.fontOblique()
					.text(page.user ? Progressor.getUserName(page.user) : i18n.getLanguages()[page.language],
								PAGE_SIZE.margin, PAGE_SIZE.margin, { width: PAGE_SIZE.width - PAGE_SIZE.margin * 2, align: 'right' })
					.moveUp()

					//add examination header
					.header(page.language);

				_.each(execution.exercises, (executionExercise, exerciseIndex) => {
					const exercise = Progressor.exercises.findOne({ _id: executionExercise.exercise_id });
					const result = page.results ? _.find(page.results, r => executionExercise.exercise_id === r.exercise_id) : null;

					if (exerciseIndex > 0)
						if (exercise.type === 1)
							pdf.addPage();
						else
							pdf.moveDown().moveDown();

					pdf.fontBold().text(executionExercise.weight, PAGE_SIZE.margin, pdf.y, { width: PAGE_SIZE.width - PAGE_SIZE.margin * 2, align: 'right' })
						.moveUp()
						.fontBold().text(i18n.getNameForLanguage(exercise, page.language, true))
						.fontRegular().text(i18n.getDescriptionForLanguage(exercise, page.language, true)) //https://github.com/devongovett/pdfkit/blob/master/docs/generate.coffee
						.moveDown();

					switch (exercise.type) {
						case 1: //programming
							const { x: x1, y: y1 } = pdf;

							const fragmentWidth = (PAGE_SIZE.width - PAGE_SIZE.margin * 2) * 4 / 5;
							const fragmentHeight = PAGE_SIZE.height - pdf.y - PAGE_SIZE.margin;
							pdf.lineWidth(1).rect(x1, y1, fragmentWidth, fragmentHeight).stroke();

							const testCaseSize = 8;
							const testCaseX1 = x1 + (PAGE_SIZE.width - PAGE_SIZE.margin * 2) / 2;
							const testCaseX2 = testCaseX1 + (PAGE_SIZE.width - PAGE_SIZE.margin - testCaseX1) / 2;
							let testCaseHeight = 0;

							_.each(exercise.testCases, (testCase, testCaseIndex) => {

								pdf.rect(testCaseX1, y1 + testCaseHeight, PAGE_SIZE.width - PAGE_SIZE.margin * 2 - testCaseX1, testCaseSize * 2).fillAndStroke('#FFFFFF').fillColor('#000000');
								pdf.fontRegular(testCaseSize).text(Progressor.getTestCaseSignature(exercise, testCase), testCaseX1 + FONT_SIZE / 2, y1 + testCaseHeight + testCaseSize / 2,
																									 { width: testCaseX2 - testCaseX1 - testCaseSize, height: testCaseSize });

								const output = result ? Progressor.getActualTestCaseOutput(exercise, testCase, result.results) : Progressor.getExpectedTestCaseOutput(exercise, testCase);
								pdf.fontRegular(testCaseSize).text(output, testCaseX2 + testCaseSize / 2, y1 + testCaseHeight + testCaseSize / 2,
																									 { width: PAGE_SIZE.width - PAGE_SIZE.margin - testCaseX2 - testCaseSize, height: testCaseSize });

								testCaseHeight += testCaseSize * 2;
							});

							if (result || exercise.fragment)
								pdf.fontRegular().text(result.fragment || exercise.fragment, x1 + FONT_SIZE / 2, y1 + testCaseHeight + FONT_SIZE / 2, { width: fragmentWidth - FONT_SIZE });

							break;

						case 2: //multiple choice
							const indent = FONT_SIZE * 1.5;
							pdf.x += indent;

							_.each(i18n.getOptionsForLanguage(exercise, page.language, true), (option, optionIndex) => {
								const border = 1;
								const size = FONT_SIZE - 2 * border;

								pdf.lineWidth(border);
								if (exercise.multipleSolutions)
									pdf.rect(pdf.x - indent * 5 / 6, pdf.y, size, size);
								else
									pdf.circle(pdf.x - indent * 5 / 6 + size / 2, pdf.y + size / 2, size / 2);
								pdf.stroke();

								if (result && result.results[optionIndex].checked)
									pdf.polygon([pdf.x - indent * 5 / 6, pdf.y],
															[pdf.x - indent * 5 / 6 + size, pdf.y + size],
															[pdf.x - indent * 5 / 6 + size / 2, pdf.y + size / 2],
															[pdf.x - indent * 5 / 6 + size, pdf.y],
															[pdf.x - indent * 5 / 6, pdf.y + size],
															[pdf.x - indent * 5 / 6 + size / 2, pdf.y + size / 2]).stroke();

								pdf.fontRegular().text(option);
							});

							pdf.x -= indent;
							break;

						case 3: //free text
							const width = exercise.pattern && exercise.pattern.length ? 200 : PAGE_SIZE.width - PAGE_SIZE.margin * 2;
							let height = exercise.pattern && exercise.pattern.length ? 50 : 300;

							if (pdf.y + height * 2 / 3 + PAGE_SIZE.margin > PAGE_SIZE.height)
								pdf.addPage();
							else if (pdf.y + height + PAGE_SIZE.margin > PAGE_SIZE.height)
								height = PAGE_SIZE.height - pdf.y - PAGE_SIZE.margin;

							const { x, y } = pdf;
							pdf.lineWidth(1).rect(x, y, width, height).stroke();
							if (result)
								pdf.text(result.answer, x + FONT_SIZE / 2, y + FONT_SIZE / 2, { width: width - FONT_SIZE });
							pdf.moveDown().y += height;
					}
				});
			});

			pdf.write(`${execution._id}_${userTitle.replace(/[^a-zA-z0-9]+/g, '-')}.pdf`.toLowerCase());
		},

		/**
		 * Generate a CSV file containing the execution results.
		 * @param execution execution to generate reult file for
		 */
		generateExecutionCSV(execution) {

			let csv = 'Examinee';

			_.each(execution.exercises, (executionExercise, exerciseIndex) => {
				const exercise = Progressor.exercises.findOne({ _id: executionExercise.exercise_id });

				let details;
				switch (exercise.type) {
					case 1:
						details = _.map(exercise.testCases, (t, i) => `TC${i}`);
						break;
					case 2:
						details = _.map(exercise.options, (o, i) => `Opt${i}`);
						break;
					case 3:
						details = [];
				}

				csv += `,"${exerciseIndex + 1}: ${i18n.getName(exercise)}",weight,percent`;
				_.each(details, d => csv += `,"${d}"`);
			});

			csv += '\n';

			_.chain(Progressor.results.find({ 'exercise.execution_id': execution._id }).fetch())
				.groupBy(r => r.user_id)
				.each((results, user) => {

					csv += `"${Progressor.getUserName(user)}"`;

					_.each(execution.exercises, (executionExercise, exerciseIndex) => {
						const exercise = Progressor.exercises.findOne({ _id: executionExercise.exercise_id });
						const result = results ? _.find(results, r => executionExercise.exercise_id === r.exercise_id) : null;

						let nofDetails;
						switch (exercise.type) {
							case 1:
								nofDetails = exercise.testCases.length;
								break;
							case 2:
								nofDetails = exercise.length;
								break;
							case 3:
								nofDetails = 0;
						}

						csv += `,${executionExercise.weight}`;
						if (Progressor.isExerciseEvaluated(exercise, result ? result.results : null))
							csv += `,OK,${Progressor.getExerciseSuccessPercentage(exercise, result ? result.results : null)}`;
						else
							csv += `,NOT-EVAL,-1`;

						_.chain(nofDetails).range().each(i => csv += `,${Progressor.isResultSuccess(exercise, i, result ? result.results : null) ? 1 : 0}`);
					});

					csv += '\n';
				});

			const blob = new Blob([csv], { type: 'text/csv' }),
				url = window.URL.createObjectURL(blob);

			DOWNLOAD_LINK.prop('href', url)
				.prop('download', `${execution._id}_${i18n.getNameForLanguage(execution, i18n.getLanguageForUser(Meteor.user()), true).replace(/[^a-zA-z0-9]+/g, '-')}.csv`.toLowerCase())
				.get(0).click();
			window.URL.revokeObjectURL(url);
		}
	});

})();
