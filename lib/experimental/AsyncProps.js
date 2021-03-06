'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports._clearCacheForTesting = _clearCacheForTesting;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var func = _propTypes2['default'].func;
var array = _propTypes2['default'].array;
var shape = _propTypes2['default'].shape;
var object = _propTypes2['default'].object;

var contextTypes = {
  asyncProps: shape({
    reloadComponent: func,
    propsArray: array,
    componentsArray: array
  })
};

var _serverPropsArray = null;

function setServerPropsArray(array) {
  _invariant2['default'](!_serverPropsArray, 'You cannot call AsyncProps.hydrate more than once');
  _serverPropsArray = array;
}

function _clearCacheForTesting() {
  _serverPropsArray = null;
}

function hydrate(routerState, cb) {
  var components = routerState.components;
  var params = routerState.params;

  var flatComponents = filterAndFlattenComponents(components);
  _loadAsyncProps(flatComponents, params, cb);
}

function eachComponents(components, iterator) {
  for (var i = 0, l = components.length; i < l; i++) {
    if (typeof components[i] === 'object') {
      for (var key in components[i]) {
        iterator(components[i][key], i, key);
      }
    } else {
      iterator(components[i], i);
    }
  }
}

function filterAndFlattenComponents(components) {
  var flattened = [];
  eachComponents(components, function (Component) {
    if (Component.loadProps) flattened.push(Component);
  });
  return flattened;
}

function _loadAsyncProps(components, params, cb) {
  var propsArray = [];
  var componentsArray = [];
  var canceled = false;
  var needToLoadCounter = components.length;

  components.forEach(function (Component, index) {
    Component.loadProps(params, function (error, props) {
      needToLoadCounter--;
      propsArray[index] = props;
      componentsArray[index] = Component;
      maybeFinish();
    });
  });

  function maybeFinish() {
    if (canceled === false && needToLoadCounter === 0) cb(null, { propsArray: propsArray, componentsArray: componentsArray });
  }

  return {
    cancel: function cancel() {
      canceled = true;
    }
  };
}

function getPropsForComponent(Component, componentsArray, propsArray) {
  var index = componentsArray.indexOf(Component);
  return propsArray[index];
}

function mergeAsyncProps(current, changes) {
  for (var i = 0, l = changes.propsArray.length; i < l; i++) {
    var Component = changes.componentsArray[i];
    var position = current.componentsArray.indexOf(Component);
    var isNew = position === -1;

    if (isNew) {
      current.propsArray.push(changes.propsArray[i]);
      current.componentsArray.push(changes.componentsArray[i]);
    } else {
      current.propsArray[position] = changes.propsArray[i];
    }
  }
}

function arrayDiff(previous, next) {
  var diff = [];

  for (var i = 0, l = next.length; i < l; i++) if (previous.indexOf(next[i]) === -1) diff.push(next[i]);

  return diff;
}

function shallowEqual(a, b) {
  var key;
  var ka = 0;
  var kb = 0;

  for (key in a) {
    if (a.hasOwnProperty(key) && a[key] !== b[key]) return false;
    ka++;
  }

  for (key in b) if (b.hasOwnProperty(key)) kb++;

  return ka === kb;
}

var RouteComponentWrapper = _createReactClass2['default']({

  contextTypes: contextTypes,

  // this is here to meet the case of reloading the props when a component's params change,
  // the place we know that is here, but the problem is we get occasional waterfall loads
  // when clicking links quickly at the same route, AsyncProps doesn't know to load the next
  // props until the previous finishes rendering.
  //
  // if we could tell that a component needs its props reloaded in AsyncProps instead of here
  // (by the arrayDiff stuff in componentWillReceiveProps) then we wouldn't need this code at
  // all, and we coudl get rid of the terrible forceUpdate hack as well. I'm just not sure
  // right now if we can know to reload a pivot transition.
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, context) {
    var paramsChanged = !shallowEqual(this.props.routerState.routeParams, nextProps.routerState.routeParams);

    if (paramsChanged) {
      this.reloadProps(nextProps.routerState.routeParams);
    }
  },

  reloadProps: function reloadProps(params) {
    this.context.asyncProps.reloadComponent(this.props.Component, params || this.props.routerState.routeParams, this);
  },

  render: function render() {
    var _props = this.props;
    var Component = _props.Component;
    var routerState = _props.routerState;
    var _context$asyncProps = this.context.asyncProps;
    var componentsArray = _context$asyncProps.componentsArray;
    var propsArray = _context$asyncProps.propsArray;
    var loading = _context$asyncProps.loading;

    var asyncProps = getPropsForComponent(Component, componentsArray, propsArray);
    return _react2['default'].createElement(Component, _extends({}, routerState, asyncProps, { loading: loading, reloadAsyncProps: this.reloadProps }));
  }

});

var AsyncProps = _createReactClass2['default']({

  statics: {

    hydrate: hydrate,

    rehydrate: setServerPropsArray,

    createElement: function createElement(Component, state) {
      return typeof Component.loadProps === 'function' ? _react2['default'].createElement(RouteComponentWrapper, { Component: Component, routerState: state }) : _react2['default'].createElement(Component, state);
    }

  },

  childContextTypes: contextTypes,

  getChildContext: function getChildContext() {
    return {
      asyncProps: _extends({
        reloadComponent: this.reloadComponent,
        loading: this.state.previousProps !== null
      }, this.state.asyncProps)
    };
  },

  getInitialState: function getInitialState() {
    return {
      asyncProps: {
        propsArray: _serverPropsArray,
        componentsArray: _serverPropsArray ? filterAndFlattenComponents(this.props.components) : null
      },
      previousProps: null
    };
  },

  componentDidMount: function componentDidMount() {
    var _this = this;

    var initialLoad = this.state.asyncProps.propsArray === null;
    if (initialLoad) {
      hydrate(this.props, function (err, asyncProps) {
        _this.setState({ asyncProps: asyncProps });
      });
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var routerTransitioned = nextProps.location !== this.props.location;

    if (!routerTransitioned) return;

    var oldComponents = this.props.components;
    var newComponents = nextProps.components;

    var components = arrayDiff(filterAndFlattenComponents(oldComponents), filterAndFlattenComponents(newComponents));

    if (components.length === 0) return;

    this.loadAsyncProps(components, nextProps.params);
  },

  beforeLoad: function beforeLoad(cb) {
    this.setState({
      previousProps: this.props
    }, cb);
  },

  afterLoad: function afterLoad(err, asyncProps, cb) {
    this.inflightLoader = null;
    mergeAsyncProps(this.state.asyncProps, asyncProps);
    this.setState({
      previousProps: null,
      asyncProps: this.state.asyncProps
    }, cb);
  },

  loadAsyncProps: function loadAsyncProps(components, params, cb) {
    var _this2 = this;

    if (this.inflightLoader) {
      this.inflightLoader.cancel();
    }

    this.beforeLoad(function () {
      _this2.inflightLoader = _loadAsyncProps(components, params, function (err, asyncProps) {
        _this2.afterLoad(err, asyncProps, cb);
      });
    });
  },

  reloadComponent: function reloadComponent(Component, params, instance) {
    this.loadAsyncProps([Component], params, function () {
      // gotta fix this hack ... change in context doesn't cause the
      // RouteComponentWrappers to rerender (first one will because
      // of cloneElement)
      if (instance.isMounted()) instance.forceUpdate();
    });
  },

  render: function render() {
    var route = this.props.route;
    var _state = this.state;
    var asyncProps = _state.asyncProps;
    var previousProps = _state.previousProps;

    var initialLoad = asyncProps.propsArray === null;

    if (initialLoad) return route.renderInitialLoad ? route.renderInitialLoad() : null;else if (previousProps) return _react2['default'].cloneElement(previousProps.children, { loading: true });else return this.props.children;
  }

});

exports['default'] = AsyncProps;