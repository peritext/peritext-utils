"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getResourceTitle = _interopRequireDefault(require("./getResourceTitle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Cleans stuff
 */
function cleanStr(str) {
  return str.toLowerCase().replace(/[ÀÁÂÃÄÅ]/g, 'A').replace(/[àáâãäå]/g, 'a').replace(/[éêëè]/g, 'e') //.... all the rest
  .replace(/[^a-z0-9]/gi, ''); // final clean up
}
/**
 * Sorts stuff
 */


const defaultSortResourceSections = ({
  resource: resourceA
}, {
  resource: resourceB
}) => {
  const titleA = cleanStr((0, _getResourceTitle.default)(resourceA));
  const titleB = cleanStr((0, _getResourceTitle.default)(resourceB));

  if (titleA > titleB) {
    return 1;
  }

  return -1;
  /*
   * if ( a.type === b.type ) {
   *   if ( a.title > b.title ) {
   *     return 1;
   *   }
   *   return -1;
   * }
   * else if ( a.type > b.type ) {
   *     return 1;
   * }
   * else return -1;
   */
};

var _default = defaultSortResourceSections;
exports.default = _default;