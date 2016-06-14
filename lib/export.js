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
						pdf.moveDown().moveDown();

					pdf.fontBold().text(i18n.getNameForLanguage(exercise, page.language, true))
						.fontRegular().text(i18n.getDescriptionForLanguage(exercise, page.language, true)) //https://github.com/devongovett/pdfkit/blob/master/docs/generate.coffee
						.moveDown();

					//weight

					switch (exercise.type) {
						case 1: //programming
							const y1 = pdf.y;

							const fragmentWidth = PAGE_SIZE.width / 2 - PAGE_SIZE.margin;
							let fragmentHeight;
							if (exercise.fragment) {
								pdf.fontRegular().text(exercise.fragment, pdf.x + 2, y1 + 2, { width: fragmentWidth - 4 });
								pdf.x -= 2;
								fragmentHeight = page.y - y1;
							} else
								fragmentHeight = PAGE_SIZE.height - pdf.y - PAGE_SIZE.margin;
							pdf.lineWidth(1).rect(pdf.x, y1, fragmentWidth, fragmentHeight);

							const y2 = pdf.y = y1 + fragmentHeight;

							if (pdf.y < y2)
								pdf.y = y2;

							//testCases

							break;

						case 2: //multiple choice
							const indent = FONT_SIZE * 1.5;
							pdf.x += indent;

							_.each(i18n.getOptionsForLanguage(exercise, page.language, true), option => {
								const border = 1;
								const size = FONT_SIZE - 2 * border;

								pdf.lineWidth(border);
								if (exercise.multipleSolutions)
									pdf.rect(pdf.x - indent * 5 / 6, pdf.y, size, size);
								else
									pdf.circle(pdf.x - indent * 5 / 6, pdf.y + size / 2, size / 2);
								pdf.stroke().fontRegular().text(option);
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

							pdf.lineWidth(1).rect(pdf.x, pdf.y, width, height).stroke();
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
						details = _.map(exercise.testCases, t => Progressor.getTestCaseSignature(exercise, t));
						break;
					case 2:
						details = i18n.getOptions(exercise.options);
						break;
					case 3:
						details = [];
				}

				csv += `,"${i18n.getName(exercise)}"`;
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

						csv += `,${Progressor.getExerciseStatus(exercise, result ? result.results : null)}`;
						_.chain(nofDetails).range().each(i => csv += `,${Progressor.getResultStatus(exercise, i, result ? result.results : null)}`);
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
