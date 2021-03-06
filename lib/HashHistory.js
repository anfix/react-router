'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _DOMHistory2 = require('./DOMHistory');

var _DOMHistory3 = _interopRequireDefault(_DOMHistory2);

var _NavigationTypes = require('./NavigationTypes');

var _NavigationTypes2 = _interopRequireDefault(_NavigationTypes);

var _DOMUtils = require('./DOMUtils');

var _URLUtils = require('./URLUtils');

var DefaultQueryKey = '_qk';

function ensureSlash() {
  var path = _DOMUtils.getHashPath();

  if (_URLUtils.isAbsolutePath(path)) return true;

  _DOMUtils.replaceHashPath('/' + path);

  return false;
}

function addQueryStringValueToPath(path, key, value) {
  return path + (path.indexOf('?') === -1 ? '?' : '&') + (key + '=' + value);
}

function getQueryStringValueFromPath(path, key) {
  var match = path.match(new RegExp('\\?.*?\\b' + key + '=(.+?)\\b'));
  return match && match[1];
}

function saveState(path, queryKey, state) {
  window.sessionStorage.setItem(state.key, JSON.stringify(state));
  return addQueryStringValueToPath(path, queryKey, state.key);
}

function readState(path, queryKey) {
  var sessionKey = getQueryStringValueFromPath(path, queryKey);
  var json = sessionKey && window.sessionStorage.getItem(sessionKey);

  if (json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      // Ignore invalid JSON in session storage.
    }
  }

  return null;
}

function updateCurrentState(queryKey, extraState) {
  var path = _DOMUtils.getHashPath();
  var state = readState(path, queryKey);

  if (state) saveState(path, queryKey, _extends(state, extraState));
}

/**
 * A history implementation for DOM environments that uses window.location.hash
 * to store the current path. This is essentially a hack for older browsers that
 * do not support the HTML5 history API (IE <= 9).
 *
 * Support for persistence of state across page refreshes is provided using a
 * combination of a URL query string parameter and DOM storage. However, this
 * support is not enabled by default. In order to use it, create your own
 * HashHistory.
 *
 *   import HashHistory from 'react-router/lib/HashHistory';
 *   var StatefulHashHistory = new HashHistory({ queryKey: '_key' });
 *   React.render(<Router history={StatefulHashHistory} .../>, ...);
 */

var HashHistory = (function (_DOMHistory) {
  _inherits(HashHistory, _DOMHistory);

  function HashHistory() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, HashHistory);

    _DOMHistory.call(this, options);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.queryKey = options.queryKey;

    if (typeof this.queryKey !== 'string') this.queryKey = this.queryKey ? DefaultQueryKey : null;
  }

  HashHistory.prototype._updateLocation = function _updateLocation(navigationType) {
    var path = _DOMUtils.getHashPath();
    var state = this.queryKey ? readState(path, this.queryKey) : null;
    this.location = this.createLocation(path, state, navigationType);
  };

  HashHistory.prototype.setup = function setup() {
    if (this.location == null) {
      ensureSlash();
      this._updateLocation();
    }
  };

  HashHistory.prototype.handleHashChange = function handleHashChange() {
    if (!ensureSlash()) return;

    if (this._ignoreNextHashChange) {
      this._ignoreNextHashChange = false;
    } else {
      this._updateLocation(_NavigationTypes2['default'].POP);
      this._notifyChange();
    }
  };

  HashHistory.prototype.addChangeListener = function addChangeListener(listener) {
    _DOMHistory.prototype.addChangeListener.call(this, listener);

    if (this.changeListeners.length === 1) {
      if (window.addEventListener) {
        window.addEventListener('hashchange', this.handleHashChange, false);
      } else {
        window.attachEvent('onhashchange', this.handleHashChange);
      }
    }
  };

  HashHistory.prototype.removeChangeListener = function removeChangeListener(listener) {
    _DOMHistory.prototype.removeChangeListener.call(this, listener);

    if (this.changeListeners.length === 0) {
      if (window.removeEventListener) {
        window.removeEventListener('hashchange', this.handleHashChange, false);
      } else {
        window.detachEvent('onhashchange', this.handleHashChange);
      }
    }
  };

  HashHistory.prototype.pushState = function pushState(state, path) {
    _warning2['default'](this.queryKey || state == null, 'HashHistory needs a queryKey in order to persist state');

    if (this.queryKey) updateCurrentState(this.queryKey, this.getScrollPosition());

    state = this._createState(state);

    if (this.queryKey) path = saveState(path, this.queryKey, state);

    this._ignoreNextHashChange = true;
    window.location.hash = path;

    this.location = this.createLocation(path, state, _NavigationTypes2['default'].PUSH);

    this._notifyChange();
  };

  HashHistory.prototype.replaceState = function replaceState(state, path) {
    state = this._createState(state);

    if (this.queryKey) path = saveState(path, this.queryKey, state);

    this._ignoreNextHashChange = true;
    _DOMUtils.replaceHashPath(path);

    this.location = this.createLocation(path, state, _NavigationTypes2['default'].REPLACE);

    this._notifyChange();
  };

  HashHistory.prototype.makeHref = function makeHref(path) {
    return '#' + path;
  };

  return HashHistory;
})(_DOMHistory3['default']);

var history = new HashHistory();
exports.history = history;
exports['default'] = HashHistory;