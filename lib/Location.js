'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _NavigationTypes = require('./NavigationTypes');

var _NavigationTypes2 = _interopRequireDefault(_NavigationTypes);

/**
 * A Location answers two important questions:
 *
 * 1. Where am I?
 * 2. How did I get here?
 */

var Location = (function () {
  Location.isLocation = function isLocation(object) {
    return object instanceof Location;
  };

  function Location() {
    var pathname = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
    var query = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var state = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var navigationType = arguments.length <= 3 || arguments[3] === undefined ? _NavigationTypes2['default'].POP : arguments[3];

    _classCallCheck(this, Location);

    this.pathname = pathname;
    this.query = query;
    this.state = state;
    this.navigationType = navigationType;
  }

  return Location;
})();

exports['default'] = Location;
module.exports = exports['default'];