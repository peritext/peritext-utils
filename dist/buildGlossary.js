"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildGlossary;

var _buildContextContent = _interopRequireDefault(require("./buildContextContent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Builds component-consumable data to represent
 * the glossary of "entities" resources being mentionned in the production
 * @param {object} production - the production to process
 * @return {array} glossaryMentions - all the glossary entries properly formatted for rendering
 */
function buildGlossary(production) {
  const {
    contextualizations,
    contextualizers,
    resources
  } = production;
  let glossaryMentions = Object.keys(contextualizations).filter(contextualizationId => {
    const contextualizerId = contextualizations[contextualizationId].contextualizerId;
    const contextualizer = contextualizers[contextualizerId];
    return contextualizer && contextualizer.type === 'glossary';
  }).map(contextualizationId => _objectSpread({}, contextualizations[contextualizationId], {
    contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId],
    resource: resources[contextualizations[contextualizationId].sourceId],
    contextContent: (0, _buildContextContent.default)(production, contextualizationId)
  })).reduce((entries, contextualization) => {
    return _objectSpread({}, entries, {
      [contextualization.sourceId]: {
        resource: contextualization.resource,
        mentions: entries[contextualization.sourceId] ? entries[contextualization.sourceId].mentions.concat(contextualization) : [contextualization]
      }
    });
  }, {});
  glossaryMentions = Object.keys(glossaryMentions).map(id => glossaryMentions[id]).sort((a, b) => {
    if (a.resource.metadata.title.toLowerCase() > b.resource.metadata.title.toLowerCase()) {
      return 1;
    } else {
      return -1;
    }
  });
  return glossaryMentions;
}