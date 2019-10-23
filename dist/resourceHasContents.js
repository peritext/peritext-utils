"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const resourceHasContents = resource => {
  return resource && resource.data && resource.data.contents && resource.data.contents.contents && resource.data.contents.contents.blocks && resource.data.contents.contents.blocks.length && resource.data.contents.contents.blocks[0].text.trim().length;
};

var _default = resourceHasContents;
exports.default = _default;