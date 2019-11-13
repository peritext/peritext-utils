"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _buildCitations = _interopRequireDefault(require("./buildCitations"));

var _buildBibliography = _interopRequireDefault(require("./buildBibliography"));

var _buildGlossary = _interopRequireDefault(require("./buildGlossary"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const preprocessEditionData = ({
  production,
  edition
}) => {
  const citations = (0, _buildCitations.default)({
    production,
    edition
  }, true);
  const {
    plan: {
      summary = []
    }
  } = edition.data;
  const blocks = summary.reduce((res, block) => {
    const {
      id,
      data,
      type
    } = block;
    let result;

    switch (type) {
      case 'references':
        result = (0, _buildBibliography.default)({
          production,
          edition,
          citations,
          options: data
        });
        return _objectSpread({}, res, {
          [id]: {
            bibliographyData: result
          }
        });

      case 'glossary':
        result = (0, _buildGlossary.default)({
          production,
          edition,
          options: data
        });
        return _objectSpread({}, res, {
          [id]: {
            glossaryData: result
          }
        });

      default:
        return res;
    }
  }, {});
  return {
    global: {
      citations
    },
    blocks
  };
};

var _default = preprocessEditionData;
exports.default = _default;