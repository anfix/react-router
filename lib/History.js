'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _URLUtils = require('./URLUtils');

var _Location = require('./Location');

var _Location2 = _interopRequireDefault(_Location);

var RequiredHistorySubclassMethods = ['pushState', 'replaceState', 'go'];

function createRandomKey() {
  return Math.random().toString(36).substr(2);
}

/**
 * A history interface that normalizes the differences across
 * various environments and implementations. Requires concrete
 * subclasses to implement the following methods:
 *
 * - pushState(state, path)
 * - replaceState(state, path)
 * - go(n)
 */

var History = (function () {
  function History() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, History);

    RequiredHistorySubclassMethods.forEach(function (method) {
      _invariant2['default'](typeof this[method] === 'function', '%s needs a "%s" method', this.constructor.name, method);
    }, this);

    this.parseQueryString = options.parseQueryString || _URLUtils.parseQueryString;
    this.changeListeners = [];
    this.location = null;
  }

  History.prototype._notifyChange = function _notifyChange() {
    for (var i = 0, len = this.changeListeners.length; i < len; ++i) this.changeListeners[i].call(this);
  };

  History.prototype.addChangeListener = function addChangeListener(listener) {
    this.changeListeners.push(listener);
  };

  History.prototype.removeChangeListener = function removeChangeListener(listener) {
    this.changeListeners = this.changeListeners.filter(function (li) {
      return li !== listener;
    });
  };

  History.prototype.back = function back() {
    this.go(-1);
  };

  History.prototype.forward = function forward() {
    this.go(1);
  };

  History.prototype._createState = function _createState(state) {
    state = state || {};

    if (!state.key) state.key = createRandomKey();

    return state;
  };

  History.prototype.createLocation = function createLocation(path, state, navigationType) {
    var pathname = _URLUtils.getPathname(path);
    var queryString = _URLUtils.getQueryString(path);
    var query = queryString ? this.parseQueryString(queryString) : null;
    return new _Location2['default'](pathname, query, state, navigationType);
  };

  return History;
})();

exports['default'] = History;
module.exports = exports['default'];