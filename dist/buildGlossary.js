"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _buildContextContent = _interopRequireDefault(require("./buildContextContent"));

var _getContextualizationsFromEdition = _interopRequireDefault(require("./getContextualizationsFromEdition"));

var _getContextualizationMentions = _interopRequireDefault(require("./getContextualizationMentions"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const buildGlossary = ({
  production,
  edition,
  options
}) => {
  const {
    resources
  } = production;
  const {
    showUncited = false,
    glossaryTypes = ['person', 'place', 'event', 'notion', 'other']
  } = options; // let items;

  const usedContextualizations = (0, _getContextualizationsFromEdition.default)(production, edition);
  const citedResourcesIds = (showUncited ? Object.keys(resources).filter(resourceId => resources[resourceId].metadata.type === 'glossary') : (0, _uniq.default)(usedContextualizations.filter(c => resources[c.contextualization.sourceId].metadata.type === 'glossary').map(c => c.contextualization.sourceId))).filter(resourceId => {
    return glossaryTypes.includes(resources[resourceId].data.entryType);
  }).sort((a, b) => {
    if (resources[a].data.name.toLowerCase() > resources[b].data.name.toLowerCase()) {
      return 1;
    } else {
      return -1;
    }
  });
  const items = citedResourcesIds.map(resourceId => {
    const mentions = usedContextualizations.filter(c => c.contextualization.sourceId === resourceId).map(c => c.contextualization.id).map(contextualizationId => (0, _getContextualizationMentions.default)({
      contextualizationId,
      production,
      edition
    })).reduce((res2, contextualizationMentions) => [...res2, ...contextualizationMentions.map(({
      containerId,
      contextualizationId
    }) => ({
      id: contextualizationId,
      containerId,
      contextContent: (0, _buildContextContent.default)(production, contextualizationId)
    }))], []);
    return {
      resourceId,
      resource: production.resources[resourceId],
      mentions
    };
  });
  return items;
};

var _default = buildGlossary;
exports.default = _default;