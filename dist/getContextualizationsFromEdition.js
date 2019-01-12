"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getContextualizationsFromEdition;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  const usedSectionsIds = summary.reduce((res, element) => {
    if (element.type === 'sections') {
      let newOnes = [];

      if (element.data && element.data.customSummary && element.data.customSummary.active) {
        newOnes = element.data.customSummary.summary.map(el => ({
          sectionId: el.id,
          containerId: element.id
        }));
      } else {
        newOnes = production.sectionsOrder.map(sectionId => ({
          sectionId,
          containerId: element.id
        }));
      }

      return [...res, ...newOnes];
    }

    return res;
  }, []);
  const usedContextualizations = usedSectionsIds.reduce((res, section) => {
    const relatedContextualizationIds = Object.keys(contextualizations).filter(contextualizationId => {
      return contextualizations[contextualizationId].sectionId === section.sectionId;
    });
    return [...res, ...relatedContextualizationIds.map(contextualizationId => _objectSpread({
      contextualization: contextualizations[contextualizationId],
      contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId]
    }, section))];
  }, []);
  return usedContextualizations;
}