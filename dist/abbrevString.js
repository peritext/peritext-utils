"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _unicodeByteTruncate = _interopRequireDefault(require("unicode-byte-truncate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const abbrevString = (str = '', maxLength = 30) => {
  if (str.length > maxLength) {
    return `${(0, _unicodeByteTruncate.default)(str, maxLength)}...`;
  }

  return str;
};

var _default = abbrevString;
exports.default = _default;