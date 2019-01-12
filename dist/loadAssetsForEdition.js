"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _getContextualizationsFromEdition = _interopRequireDefault(require("./getContextualizationsFromEdition"));

var _getRelatedAssetsIds = _interopRequireDefault(require("./getRelatedAssetsIds"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const loadAssetsForEdition = ({
  production,
  edition,
  requestAssetData
}) => new Promise((resolve, reject) => {
  const items = (0, _getContextualizationsFromEdition.default)(production, edition);
  const assetsIds = (0, _lodash.uniq)(items.reduce((res, item) => {
    const related = (0, _getRelatedAssetsIds.default)(production.resources[item.contextualization.resourceId]);
    return [...res, ...related];
  }, []));
  const assets = {};
  assetsIds.reduce((cur, assetId) => cur.then(() => new Promise((res1, rej1) => {
    requestAssetData(production.id, production.assets[assetId]).then(data => {
      assets[assetId] = _objectSpread({}, production.assets[assetId], {
        data
      });
      res1();
    }).catch(rej1);
  })), Promise.resolve()).then(() => {
    resolve(assets);
  }).catch(reject);
});

var _default = loadAssetsForEdition;
exports.default = _default;