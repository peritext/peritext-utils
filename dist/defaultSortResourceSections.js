"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const defaultSortResourceSections = (a, b) => {
  if (a.type === b.type) {
    if (a.title > b.title) {
      return 1;
    }

    return -1;
  } else if (a.type > b.type) {
    return 1;
  } else return -1;
};

var _default = defaultSortResourceSections;
exports.default = _default;