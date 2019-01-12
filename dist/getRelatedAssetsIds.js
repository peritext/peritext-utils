"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _flatten = _interopRequireDefault(require("lodash/flatten"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getRelatedAssetsIds = (obj = {}) => {
  if (obj) {
    return (0, _flatten.default)(Object.keys(obj).reduce((results, key) => {
      const val = obj[key];
      const iterableResults = Array.isArray(results) ? results : [];

      if (Array.isArray(val)) {
        const newKeys = (0, _flatten.default)(val.map(getRelatedAssetsIds));
        return [...iterableResults, newKeys];
      } else if (typeof val === 'object') {
        const newKeys = (0, _flatten.default)(getRelatedAssetsIds(val));
        return [...iterableResults, newKeys];
      } else if (key.includes('AssetId')) {
        return [...iterableResults, val];
      }

      return iterableResults;
    }, []));
  }

  return [];
};

var _default = getRelatedAssetsIds;
exports.default = _default;