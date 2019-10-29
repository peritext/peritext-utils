"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getContextualizationsFromEdition;

var _buildResourceSectionsSummary = _interopRequireDefault(require("./buildResourceSectionsSummary"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get mentioned contextualizations for the sections of a given edition
 * @return {array} elements - list of loaded contextualizations
 */
function getContextualizationsFromEdition(production = {}, edition = {}) {
  const {
    contextualizations,
    contextualizers
  } = production;
  const {
    data = {}
  } = edition;
  const {
    plan = {}
  } = data;
  const {
    summary = []
  } = plan;
  const additionalResourcesIds = [];
  const usedSectionsIds = summary.reduce((res, element) => {
    if (element.type === 'sections') {
      let newOnes = [];

      if (element.data && element.data.customSummary && element.data.customSummary.active) {
        newOnes = element.data.customSummary.summary.map(el => ({
          resourceId: el.resourceId,
          containerId: element.id
        }));
      } else {
        newOnes = production.sectionsOrder.map(({
          resourceId
        }) => ({
          resourceId,
          containerId: element.id
        }));
      }

      return [...res, ...newOnes];
    } else if (element.type === 'resourceSections') {
      const newOnes = (0, _buildResourceSectionsSummary.default)({
        production,
        options: element.data
      }).map(({
        resourceId
      }) => ({
        containerId: element.id,
        resourceId
      }));
      additionalResourcesIds.push(...newOnes.map(({
        resourceId
      }) => resourceId));
      return [...res, ...newOnes];
    }

    return res;
  }, []);
  const contextualizationsUsedBySections = usedSectionsIds.reduce((res, section) => {
    const relatedContextualizationIds = Object.keys(contextualizations).filter(contextualizationId => {
      return contextualizations[contextualizationId].targetId === section.resourceId;
    });
    return [...res, ...relatedContextualizationIds.map(contextualizationId => ({
      contextualization: contextualizations[contextualizationId],
      contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId] // ...section,

    }))];
  }, []);
  /**
   * @todo decide if resources-based contextualizations should somehow restrict the resources to parse relating to the edition summary
   */

  const contextualizationsUsedByResources = Object.keys(contextualizations).filter(contextualizationId => {
    return production.resources[contextualizations[contextualizationId].targetId] && production.resources[contextualizations[contextualizationId].targetId].metadata.type !== 'section';
  }).map(contextualizationId => ({
    contextualization: contextualizations[contextualizationId],
    contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId]
  }));
  return [...contextualizationsUsedBySections, ...contextualizationsUsedByResources, // adding additionnal resources for resources headers
  ...additionalResourcesIds.map(resourceId => {
    const resource = production.resources[resourceId];
    const contextualizerId = (0, _uuid.v4)();
    return {
      contextualization: {
        id: (0, _uuid.v4)(),
        contextualizerId,
        sourceId: resourceId,
        targetId: resourceId
      },
      contextualizer: {
        id: contextualizerId,
        type: resource.metadata.type,
        parameters: {}
      }
    };
  })];
}