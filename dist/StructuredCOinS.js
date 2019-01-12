"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = require("prop-types");

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// let styles = {};

/**
 * dumb component for rendering the structured representation of a cited element in the format of openUrl/Context Object in Span
 */
class StructuredCOinS extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "shouldComponentUpdate", () => true);
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    let openUrl;

    if (this.props.resource) {
      openUrl = (0, _index.generateOpenUrl)((0, _index.resourceToCslJSON)(this.props.resource));
    } else if (this.props.cslRecord) {
      openUrl = (0, _index.generateOpenUrl)([this.props.cslRecord]);
    } else {
      return null;
    }

    return _react.default.createElement("span", {
      className: 'peritext-structured-context-object-in-span-container Z3988',
      title: openUrl
    });
  }

}

exports.default = StructuredCOinS;

_defineProperty(StructuredCOinS, "propTypes", {
  cslRecord: _propTypes.PropTypes.object,
  resource: _propTypes.PropTypes.object
});

_defineProperty(StructuredCOinS, "defaultProps", {});