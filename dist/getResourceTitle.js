"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _resource = _interopRequireDefault(require("peritext-schemas/resource"));

var _objectPath = _interopRequireDefault(require("object-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getResourceTitle = (resource = {}) => {
  const {
    metadata = {}
  } = resource;

  const titlePath = _objectPath.default.get(_resource.default, ['definitions', metadata.type, 'titlePath']);

  const title = titlePath ? _objectPath.default.get(resource, titlePath) : metadata.title;
  return title || '';
};

var _default = getResourceTitle;
exports.default = _default;