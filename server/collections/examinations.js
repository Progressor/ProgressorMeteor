(function () {
	'use strict';

	Meteor.methods(
		{
			saveExamination(examination){
				check(examination, Object);

				const _examination = examination._id ? Progressor.examinations.findOne({ _id: examination._id }) : examination;

				if (!this.userId)
					throw new Meteor.Error('not-authenticated', i18n.forUser('error.notAuthenticated.message', this.userId));
				else if (_examination._id && _examination.author_id !== this.userId && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-owner', i18n.forUser('error.notAuthor.message', this.userId));
				else if (_examination._id && _examination.released && _examination.released.requested && !Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));

				if (!examination.author_id) examination.author_id = this.userId;
				examination.lastEditor_id = this.userId;
				examination.lastEdited = new Date();
				return Progressor.examinations.upsert(examination._id, examination).insertId || examination._id;
			}
		});

})();
