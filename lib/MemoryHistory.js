'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _NavigationTypes = require('./NavigationTypes');

var _NavigationTypes2 = _interopRequireDefault(_NavigationTypes);

var _History2 = require('./History');

var _History3 = _interopRequireDefault(_History2);

function createEntry(object) {
  if (typeof object === 'string') return { path: object };

  if (typeof object === 'object' && object) return object;

  throw new Error('Unable to create history entry from ' + object);
}

/**
 * A concrete History class that doesn't require a DOM. Ideal
 * for testing because it allows you to specify route history
 * entries in the constructor.
 */

var MemoryHistory = (function (_History) {
  _inherits(MemoryHistory, _History);

  function MemoryHistory(entries, current) {
    _classCallCheck(this, MemoryHistory);

    _History.call(this);

    if (entries == null) {
      entries = ['/'];
    } else if (typeof entries === 'string') {
      entries = [entries];
    } else if (!Array.isArray(entries)) {
      throw new Error('MemoryHistory needs an array of entries');
    }

    entries = entries.map(createEntry);

    if (current == null) {
      current = entries.length - 1;
    } else {
      _invariant2['default'](current >= 0 && current < entries.length, '%s current index must be >= 0 and < %s, was %s', this.constructor.name, entries.length, current);
    }

    this.entries = entries;
    this.current = current;

    var currentEntry = entries[current];

    this.location = this.createLocation(currentEntry.path, currentEntry.state);
  }

  // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-pushstate

  MemoryHistory.prototype.pushState = function pushState(state, path) {
    state = this._createState(state);

    this.current += 1;
    this.entries = this.entries.slice(0, this.current).concat([{ state: state, path: path }]);
    this.location = this.createLocation(path, state, _NavigationTypes2['default'].PUSH);

    this._notifyChange();
  };

  // http://www.w3.org/TR/2011/WD-html5-20110113/history.html#dom-history-replacestate

  MemoryHistory.prototype.replaceState = function replaceState(state, path) {
    state = this._createState(state);

    this.entries[this.current] = { state: state, path: path };
    this.location = this.createLocation(path, state, _NavigationTypes2['default'].REPLACE);

    this._notifyChange();
  };

  MemoryHistory.prototype.go = function go(n) {
    if (n === 0) return;

    _invariant2['default'](this.canGo(n), '%s cannot go(%s) because there is not enough history', this.constructor.name, n);

    this.current += n;
    var currentEntry = this.entries[this.current];

    this.location = this.createLocation(currentEntry.path, currentEntry.state, _NavigationTypes2['default'].POP);

    this._notifyChange();
  };

  MemoryHistory.prototype.canGo = function canGo(n) {
    var index = this.current + n;
    return index >= 0 && index < this.entries.length;
  };

  MemoryHistory.prototype.canGoBack = function canGoBack() {
    return this.canGo(-1);
  };

  MemoryHistory.prototype.canGoForward = function canGoForward() {
    return this.canGo(1);
  };

  return MemoryHistory;
})(_History3['default']);

exports['default'] = MemoryHistory;
module.exports = exports['default'];