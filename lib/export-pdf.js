(function () {
	'use strict';

	_.extend(Progressor, {
		generateExecutionPDF(execution, includeResults = false) {
			const user = Meteor.user(), userLanguage = i18n.getLanguageForUser(user);
			const userTitle = i18n.getNameForLanguage(execution, userLanguage, true);

			const pages = includeResults ? _.map(Progressor.results.find({ 'exercise.execution_id': execution._id }).fetch(), r => ({ result: r, language: i18n.getLanguageForUser(r.user_id) }))
				: _.map(i18n.getLanguages(), (n, l) => ({ language: l }));

			const pdf = new PDFDocument({
				info: {
					Title: userTitle,
					Author: Progressor.getUserName(execution.author_id),
					Subject: userTitle,
					ModDate: execution.lastEdited
				},
				size: 'A4', margin: 50
			});

			_.extend(pdf, {
				get DEFAULT_FONT() {
					return 'Helvetica';
				},
				fontRegular: (size = 12) => pdf.font(pdf.DEFAULT_FONT, size),
				fontBold: (size = 14) => pdf.font(`${pdf.DEFAULT_FONT}-Bold`, size),
				fontOblique: (size = 14) => pdf.font(`${pdf.DEFAULT_FONT}-Oblique`, size),

				header: (language = userLanguage) => {
					pdf.fontBold(18).text(userTitle)
						.fontRegular().moveDown()
						.text(i18n.getDescriptionForLanguage(execution, language, true))
						.moveDown();
					if (execution.startTime)
						pdf.fontBold().text(`${i18n.forLanguage('examination.startTimeLabel', userLanguage)}: `, { continued: true })
							.fontRegular().text(i18n.formatDate(execution.startTime, 'L LT'));
					return pdf.fontBold().text(`${i18n.forLanguage('examination.durationLabel', userLanguage)}: `, { continued: true })
						.fontRegular().text(`${execution.durationMinutes} min`)
						.moveDown();
				}
			});

			if (execution.examinees) {
				pdf.header()
					.fontBold().text(i18n.forLanguage('examination.examineesLabel'));
				_.each(execution.examinees, e => pdf.fontRegular().text(Progressor.getUserName(e)));

				pdf.addPage();
			}

			_.each(pages, (page, pageIndex) => {
				if (pageIndex > 0)
					pdf.addPage();
				pdf.header(page.language);

				_.each(execution.exercises, (executionExercise, exerciseIndex) => {
					const exercise = Progressor.exercises.findOne({ _id: executionExercise.exercise_id });

					if (exerciseIndex > 0)
						pdf.moveDown().moveDown();

					pdf.fontBold().text(i18n.getNameForLanguage(exercise, page.language, true))
						.fontRegular().text(i18n.getDescriptionForLanguage(exercise, page.language, true)); //https://github.com/devongovett/pdfkit/blob/master/docs/generate.coffee
				});
			});

			pdf.write(`${execution._id}_${userTitle.replace(/[^a-zA-z0-9]+/g, '-')}.pdf`.toLowerCase());
		}
	});

})();
