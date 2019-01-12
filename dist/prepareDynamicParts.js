"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Prepares dynamic parts of a production
 * @param {obj} production
 * @return {obj} new production
 */
function _default(production) {
  const glossary = (0, _index.buildGlossary)(production);
  const citations = (0, _index.buildCitations)(production);
  const bibliography = (0, _index.buildBibliography)(production, citations);
  const authorsIndex = (0, _index.buildAuthorsIndex)(production);
  return _objectSpread({}, production, production.sectionsOrder.reduce((result, id) => _objectSpread({}, result, {
    [id]: production.sections[id]
  }), {}), {
    glossary,
    citations,
    bibliography,
    authorsIndex
  });
}