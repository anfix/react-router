'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _DOMHistory2 = require('./DOMHistory');

var _DOMHistory3 = _interopRequireDefault(_DOMHistory2);

var _DOMUtils = require('./DOMUtils');

var _NavigationTypes = require('./NavigationTypes');

var _NavigationTypes2 = _interopRequireDefault(_NavigationTypes);

function updateCurrentState(extraState) {
  var state = window.history.state;

  if (state) window.history.replaceState(_extends(state, extraState), '');
}

/**
 * A history implementation for DOM environments that support the
 * HTML5 history API (pushState, replaceState, and the popstate event).
 * Provides the cleanest URLs and should always be used in browser
 * environments if possible.
 *
 * Note: BrowserHistory automatically falls back to using full page
 * refreshes if HTML5 history is not available, so URLs are always
 * the same across browsers.
 */

var BrowserHistory = (function (_DOMHistory) {
  _inherits(BrowserHistory, _DOMHistory);

  function BrowserHistory(options) {
    _classCallCheck(this, BrowserHistory);

    _DOMHistory.call(this, options);
    this.handlePopState = this.handlePopState.bind(this);
    this.isSupported = _DOMUtils.supportsHistory();
  }

  BrowserHistory.prototype._updateLocation = function _updateLocation(navigationType) {
    var state = null;

    if (this.isSupported) {
      var historyState = window.history.state;
      state = this._createState(historyState);

      if (!historyState || !historyState.key) window.history.replaceState(state, '');
    }

    this.location = this.createLocation(_DOMUtils.getWindowPath(), state, navigationType);
  };

  BrowserHistory.prototype.setup = function setup() {
    if (this.location == null) this._updateLocation();
  };

  BrowserHistory.prototype.handlePopState = function handlePopState(event) {
    if (event.state === undefined) return; // Ignore extraneous popstate events in WebKit.

    this._updateLocation(_NavigationTypes2['default'].POP);
    this._notifyChange();
  };

  BrowserHistory.prototype.addChangeListener = function addChangeListener(listener) {
    _DOMHistory.prototype.addChangeListener.call(this, listener);

    if (this.changeListeners.length === 1) {
      if (window.addEventListener) {
        window.addEventListener('popstate', this.handlePopState, false);
      } else {
        window.attachEvent('onpopstate', this.handlePopState);
      }
    }
  };

  BrowserHistory.prototype.removeChangeListener = function removeChangeListener(listener) {
    _DOMHistory.prototype.removeChangeListener.call(this, listener);

    if (this.changeListeners.length === 0) {
      if (window.removeEventListener) {
        window.removeEventListener('popstate', this.handlePopState, false);
      } else {
        window.detachEvent('onpopstate', this.handlePopState);
      }
    }
  };

  // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-pushstate

  BrowserHistory.prototype.pushState = function pushState(state, path) {
    if (this.isSupported) {
      updateCurrentState(this.getScrollPosition());

      state = this._createState(state);

      window.history.pushState(state, '', path);
      this.location = this.createLocation(path, state, _NavigationTypes2['default'].PUSH);
      this._notifyChange();
    } else {
      window.location = path;
    }
  };

  // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-replacestate

  BrowserHistory.prototype.replaceState = function replaceState(state, path) {
    if (this.isSupported) {
      state = this._createState(state);

      window.history.replaceState(state, '', path);
      this.location = this.createLocation(path, state, _NavigationTypes2['default'].REPLACE);
      this._notifyChange();
    } else {
      window.location.replace(path);
    }
  };

  return BrowserHistory;
})(_DOMHistory3['default']);

var history = new BrowserHistory();
exports.history = history;
exports['default'] = BrowserHistory;