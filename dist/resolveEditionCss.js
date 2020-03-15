"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const resolveEditionCss = ({
  edition,
  contextualizerModules,
  templateStyle
}) => {
  const {
    data = {}
  } = edition;
  const {
    style: {
      css = '',
      mode = 'merge'
    } = {
      css: ''
    }
  } = data;
  const contextualizersStyles = Object.keys(contextualizerModules).map(type => contextualizerModules[type] && contextualizerModules[type].defaultCss || '').join('\n');

  if (mode === 'merge') {
    return [templateStyle, // templateStylesheet,
    contextualizersStyles, css].join('\n');
  } else {
    // styleMode === 'replace'
    return [contextualizersStyles, css].join('\n');
  }
};

var _default = resolveEditionCss;
exports.default = _default;