(function () {
	'use strict';

	Meteor.methods(
		{

			/**
			 * Creates or updates a category.
			 * @param category {{programmingLanguage: string}} category to save
			 * @returns {number} the unique identifier of the category
			 */
			saveCategory(category) {
				check(category, Match.ObjectIncluding(
					{
						programmingLanguage: String
					}));

				const _category = category._id ? Progressor.categories.findOne({ _id: category._id }) : category;

				if (!Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));
				else if (_category.private)
					throw new Meteor.Error('illegal-operation', 'You cannot edit a private pseudo-category.');

				if (!category.author_id)
					category.author_id = this.userId;
				category.lastEditor_id = this.userId;
				category.lastEdited = new Date();

				return Progressor.categories.upsert(category._id, category).insertedId || category._id;
			},

			/**
			 * Deletes a category.
			 * @param category {{_id: string}} category to delete
			 * @returns {number} the number of categories affected
			 */
			deleteCategory(category) {
				check(category, Match.ObjectIncluding({ _id: String }));

				if (!Roles.userIsInRole(this.userId, Progressor.ROLE_ADMIN))
					throw new Meteor.Error('not-admin', i18n.forUser('error.notAdmin.message', this.userId));

				return Progressor.categories.remove(category._id).rowsAffected;
			}
		});

})();
