(function () {
	'use strict';

	_.extend(Progressor, {
		generateExaminationPDF(examination, results = null) {
			let language = i18n.getLanguageForUser(Meteor.user());
			const pdf = new PDFDocument({
				info: {
					Title: i18n.getNameForLanguage(examination, language),
					Author: Progressor.getUserName(examination.author_id),
					Subject: i18n.getNameForLanguage(examination, language),
					ModDate: examination.lastEdited
				},
				size: 'A4', margin: 50
			});
			pdf.fontSize(12);

			pdf.text(i18n.getName(examination, language), 10, 30, { align: 'center', width: 200 });

			pdf.write(`${examination._id}_${i18n.getName(examination, language).replace(/[^a-zA-z0-9]+/g, '-')}.pdf`.toLowerCase());
		}
	});

})();
