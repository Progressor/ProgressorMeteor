// language codes are in lib/application-constants.js

const themes = ['3024-day', '3024-night',
                'ambiance-mobile', 'ambiance',
                'base16-dark', 'base16-light', 'blackboard',
                'cobalt',
                'eclipse', 'elegant', 'erlang-dark',
                'lesser-dark',
                'mbo', 'mdn-like', 'midnight', 'monokai',
                'neat', 'neo', 'night',
                'paraiso-dark', 'paraiso-light', 'pastel-on-dark',
                'rubyblue',
                'solarized',
                'the-matrix', 'tomorrow-night-eighties', 'twilight',
                'vibrant-ink',
                'xq-dark', 'xq-light'];
const defaultTheme = 'eclipse';
const defaultMode = 'text/plain';

const config = { // https://codemirror.net/doc/manual.html
  lineNumbers: true,
  lineWrapping: true,
  theme: defaultTheme,
  mode: defaultMode,
};

_.extend(Progressor, {

  /**
   * Gets the supported CodeMirror themes.
   * @returns {string[]}
   */
  getCodeMirrorThemes: () => themes,

  /**
   * Gets the default CodeMirror theme.
   * @returns string
   */
  getCodeMirrorDefaultTheme: () => defaultTheme,

  /**
   * Gets the default CodeMirror mode (file type).
   * @returns string
   */
  getCodeMirrorDefaultMode: () => defaultMode,

  /**
   * Generates a simple CodeMirror configuration object for the current user.
   * @returns {{lineNumbers: boolean, lineWrapping: boolean, theme: string, mode: string}}
   */
  getCodeMirrorConfiguration() {
    const user = Meteor.user();
    let ret = config;
    if (user && user.profile && user.profile.codeMirrorTheme) {
      ret = _.extend({}, ret, { theme: user.profile.codeMirrorTheme });
    }
    return ret;
  },
});
