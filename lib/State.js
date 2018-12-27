'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var object = _propTypes2['default'].object;

/**
 * A mixin for components that need to know the path, routes, URL
 * params and query that are currently active.
 *
 * Example:
 *
 *   import { State } from 'react-router';
 *
 *   var AboutLink = createReactClass({
 *     mixins: [ State ],
 *     render() {
 *       var className = this.props.className;
 *
 *       if (this.isActive('about'))
 *         className += ' is-active';
 *
 *       return React.createElement('a', { className: className }, this.props.children);
 *     }
 *   });
 */
var State = {

  contextTypes: {
    router: object.isRequired
  }

};

var RouterStateMethods = ['isActive'];

RouterStateMethods.forEach(function (method) {
  State[method] = function () {
    var router = this.context.router;
    return router[method].apply(router, arguments);
  };
});

exports['default'] = State;
module.exports = exports['default'];