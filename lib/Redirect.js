'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _RouteUtils = require('./RouteUtils');

var _URLUtils = require('./URLUtils');

var _PropTypes = require('./PropTypes');

var string = _propTypes2['default'].string;
var object = _propTypes2['default'].object;
var Redirect = _createReactClass2['default']({

  statics: {

    createRouteFromReactElement: function createRouteFromReactElement(element) {
      var route = _RouteUtils.createRouteFromReactElement(element);

      if (route.from) route.path = route.from;

      route.onEnter = function (nextState, transition) {
        var location = nextState.location;
        var params = nextState.params;

        var pathname = route.to ? _URLUtils.formatPattern(route.to, params) : location.pathname;

        transition.to(pathname, route.query || location.query, route.state || location.state);
      };

      return route;
    }

  },

  propTypes: {
    path: string,
    from: string, // Alias for path
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: _PropTypes.falsy,
    children: _PropTypes.falsy
  },

  render: function render() {
    _invariant2['default'](false, '<Redirect> elements are for router configuration only and should not be rendered');
  }

});

exports.Redirect = Redirect;
exports['default'] = Redirect;