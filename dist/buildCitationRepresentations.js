"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _citeproc = _interopRequireDefault(require("citeproc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const buildCitationRepresentations = ({
  locale,
  style,
  items = {},
  citations = []
}) => {
  const sys = {
    retrieveLocale: () => {
      return locale;
    },
    retrieveItem: id => {
      return items[id];
    },
    variableWrapper: (params, prePunct, str, postPunct) => {
      if (params.variableNames[0] === 'title' && params.itemData.URL && params.context === 'bibliography') {
        return `${prePunct}<a href="${params.itemData.URL}" target="blank">${str}</a>${postPunct}`;
      } else if (params.variableNames[0] === 'URL') {
        return `${prePunct}<a href="${str}" target="blank">${str}</a>${postPunct}`;
      } else {
        return prePunct + str + postPunct;
      }
    }
  };
  const processor = new _citeproc.default.Engine(sys, style);
  return citations.reduce((inputCitations, citationData) => {
    const activeCitations = _objectSpread({}, inputCitations);

    const citation = citationData[0];
    const citationsPre = citationData[1];
    const citationsPost = citationData[2];
    let citationObjects = processor.processCitationCluster(citation, citationsPre, citationsPost);
    citationObjects = citationObjects[1];
    citationObjects.forEach(cit => {
      const order = cit[0];
      const html = cit[1]; // const ThatComponent = htmlToReactParser.parse(cit[1]);

      const citationId = cit[2];
      activeCitations[citationId] = {
        order,
        html // Component: ThatComponent

      };
    });
    return activeCitations;
  }, {});
};

var _default = buildCitationRepresentations;
exports.default = _default;