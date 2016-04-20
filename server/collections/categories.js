(function () {
	'use strict';

	Meteor.methods(
		{
			saveCategory(category) {
				check(category, Match.ObjectIncluding(
					{
						programmingLanguage: String,
						names: [Match.ObjectIncluding({ language: String, name: String })],
						descriptions: [Match.ObjectIncluding({ language: String, description: String })]
					}));

				if (!Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));

				if (!category.author_id)
					category.author_id = this.userId;
				category.lastEditor_id = this.userId;
				category.lastEdited = new Date();

				return Progressor.categories.upsert(category._id, category).insertedId || category._id;
			},
			deleteCategory(category) {
				check(category, Match.ObjectIncluding({ _id: String }));

				if (!Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));

				return Progressor.categories.remove(category._id).rowsAffected;
			}
		});

})();
