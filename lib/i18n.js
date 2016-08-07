const languages = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
};
let defaultLanguage = _.keys(languages)[0];

const _setDefaultLanguage = i18n.setDefaultLanguage;
const _setLanguage = i18n.setLanguage;
const trackerDependency = new Tracker.Dependency();

_.extend(i18n, {

  /**
   * Gets the translation of particular text in the language requested by a specific user.
   * @param label {string} label of the text to get translation for
   * @param user {string|User} identifier or document representing user to get translation for
   * @returns {string}
   */
  forUser: (label, user) => i18n.forLanguage(label, i18n.getLanguageForUser(user)),

  /**
   * Gets the translation of particular text in the specific language.
   * @param label {string} label of the text to get translation for
   * @param language {string} language to get translation for
   * @returns {string}
   */
  forLanguage(label, language) {
    const _language = i18n.getLanguage();
    _setLanguage(language);
    const text = i18n(label);
    _setLanguage(_language);
    return text;
  },

  /**
   * Gets the supported languages.
   * @returns {{}} keys: language identifiers, values: names of languages
   */
  getLanguages: () => languages,

  /**
   * Gets the language requested by a specific user.
   * @param user {string|User} identifier or document representing user to get language for
   * @return {string} language requested by the user
   */
  getLanguageForUser(user) {
    if (typeof user === 'string') {
      user = Meteor.users.findOne(user);
    }
    return user && user.profile && user.profile.language ? user.profile.language : defaultLanguage;
  },

  /**
   * Sets the language to use for translation & formatting.
   * @param language {string} language to use
   * @param local {boolean} whether to use the translation only locally (will not be stored to user profile)
   */
  setLanguage(language, local = false) {
    if (Meteor.isClient && !local && Meteor.user()) {
      Meteor.users.update(Meteor.userId(), { $set: { 'profile.language': language } });
    }
    T9n.setLanguage(language); // login/register template
    moment.locale(language); // date/time support (https://github.com/moment/moment/tree/develop/locale)
    _setLanguage(language);
    trackerDependency.changed();
  },

  /**
   * Gets the default language.
   * @returns {string}
   */
  getDefaultLanguage: () => defaultLanguage,

  /**
   * Sets the default language.
   * @param language {string} language to use as default
   */
  setDefaultLanguage: language => _setDefaultLanguage(defaultLanguage = language),

  /**
   * Gets the translation of a specific exercise type.
   * @param type {number} identifier of the exercise type
   * @returns {string}
   */
  getExerciseType: type => i18n(`exercise.type.${type}`),

  /**
   * Gets the translation of a specific difficulty.
   * @param difficulty {number} level of the difficulty
   * @returns {string}
   */
  getDifficulty: difficulty => i18n(`exercise.difficulty.${difficulty}`),

  /**
   * Gets the translated name of a specific programming language.
   * @param language {number} identifier of the programming language
   * @returns {string}
   */
  getProgrammingLanguage: language => i18n(`programmingLanguages.${language}.name`),

  /**
   * Gets the translated description of a specific user type.
   * @param language {number} identifier of the programming language
   * @returns {string}
   */
  getProgrammingLanguageDescription: language => i18n(`programmingLanguages.${language}.description`),

  /**
   * Gets a translated property of a document.
   * @param document {{}} document to get property of
   * @param propertyName {string} name of the property to get translation of
   * @param language {string} language to get translation of
   * @param fallback {boolean} whether to fall back to different language if requested is not present
   * @return {string}
   */
  getProperty(document, propertyName, language = i18n.getLanguage(), fallback = true) {
    if (document) {
      const properties = document[`${propertyName}s`];
      if (properties) {
        const translations = _.chain(properties)
          .filter(p => fallback || p.language === language)
          .sortBy(p => p.language === language ? 1 : p.language === defaultLanguage ? 2 : 3)
          .map(p => p[`${propertyName}s`] || p[propertyName])
          .value();
        if (translations.length) {
          if (!_.isArray(translations[0])) {
            return _.find(translations, _.identity);
          }
          // TODO: fix this
          return _.chain(_.chain(translations).map(t => t.length).max().value()).range().map(i => _.chain(translations).map(t => t[i]).find(_.identity).value()).value();
        }
      }
    }
  },

  /**
   * Gets the translated name of a category.
   * Includes special handling for the private pseudo-categories.
   * @param category {{}} category to get name of
   * @param user {{}} user the request is associated with
   * @return {string}
   */
  getCategoryName: (category, user = null) => category.private ? Progressor.getUserEmail(user || Meteor.user()) : i18n.getName(category),

  /**
   * Gets the translated name of a document.
   * @param document {{}} document to get name of
   * @return {string}
   */
  getName: document => i18n.getProperty(document, 'name'),

  /**
   * Gets the translated name of a document in a specific language.
   * @param document {{}} document to get name of
   * @param language {string} language to get translation of
   * @param fallback {boolean} whether to fall back to different language if requested is not present
   * @return {string}
   */
  getNameForLanguage: (document, language, fallback = false) => i18n.getProperty(document, 'name', language, fallback),

  /**
   * Gets the translated description of a document.
   * @param document {{}} document to get name of
   * @return {string}
   */
  getDescription: document => i18n.getProperty(document, 'description'),

  /**
   * Gets the translated description of a document in a specific language.
   * @param document {{}} document to get name of
   * @param language {string} language to get translation of
   * @param fallback {boolean} whether to fall back to different language if requested is not present
   * @return {string}
   */
  getDescriptionForLanguage: (document, language, fallback = false) => i18n.getProperty(document, 'description', language, fallback),

  /**
   * Gets the translated options of a document.
   * @param document {{}} document to get name of
   * @return {string}
   */
  getOptions: document => i18n.getProperty(document, 'option'),

  /**
   * Gets the translated options of a document in a specific language.
   * @param document {{}} document to get name of
   * @param language {string} language to get translation of
   * @param fallback {boolean} whether to fall back to different language if requested is not present
   * @return {string}
   */
  getOptionsForLanguage: (document, language, fallback = false) => i18n.getProperty(document, 'option', language, fallback),

  /**
   * Formats a date in a specific format.
   * @param date {date} date to format
   * @param format {string} format to apply
   * @return {string}
   */
  formatDate(date, format) {
    trackerDependency.depend();
    return date ? moment(date).format(format) : i18n('form.notAvailable');
  },

  /**
   * Formats a date in a specific language's format.
   * @param date {date} date to format
   * @param format {string} format to apply
   * @param language {string} language to format date for
   * @return {string}
   */
  formatDateForLanguage(date, format, language) {
    trackerDependency.depend();
    return date ? moment(date).locale(language).format(format) : i18n('form.notAvailable');
  },
});

i18n.setDefaultLanguage(defaultLanguage);
i18n.showMissing(true);

marked.setOptions({ //github flavoured markdown (https://github.com/chjj/marked)
  gfm: true,
  tables: true,
  breaks: true,
});
