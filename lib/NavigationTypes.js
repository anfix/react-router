'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var NavigationTypes = _keymirror2['default']({

  /**
   * Indicates that navigation was caused by a call to history.push.
   */
  PUSH: null,

  /**
   * Indicates that navigation was caused by a call to history.replace.
   */
  REPLACE: null,

  /**
   * Indicates that navigation was caused by some other action such
   * as using a browser's back/forward buttons and/or manually manipulating
   * the URL in a browser's location bar. This is the default.
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
   * for more information.
   */
  POP: null

});

exports['default'] = NavigationTypes;
module.exports = exports['default'];