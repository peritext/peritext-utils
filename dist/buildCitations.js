"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildCitations;

var _resourceToCslJSON = _interopRequireDefault(require("./resourceToCslJSON"));

var _peritextSchemas = require("peritext-schemas");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  draftEntitiesNames: {
    INLINE_ASSET
  }
} = _peritextSchemas.constants;

const getContextualizationsFromEdition = ({
  production = {},
  edition = {}
}) => {
  const {
    contextualizations = {}
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
        newOnes = element.data.customSummary.summary.map(({
          resourceId
        }) => ({
          resourceId,
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
    }

    return res;
  }, []);
  const usedContextualizations = usedSectionsIds.reduce((res, section) => {
    const relatedContextualizationIds = Object.keys(contextualizations).filter(contextualizationId => {
      return contextualizations[contextualizationId].targetId === section.resourceId;
    });
    return relatedContextualizationIds.reduce((res2, contId) => _objectSpread({}, res2, {
      [contId]: contextualizations[contId]
    }), res);
  }, {});
  return usedContextualizations;
};
/**
 * Builds component-consumable data to represent
 * the citations of "bib" resources being mentionned in the production
 * @param {object} production - the production to process
 * @return {object} citationData - the citation data to input in the reference manager
 */


function buildCitations({
  production,
  sectionId,
  edition
}) {
  const {
    contextualizations = {},
    contextualizers = {},
    resources = {}
  } = production;
  /*
   * Assets preparation
   */

  const actualContextualizations = edition ? getContextualizationsFromEdition({
    production,
    edition
  }) : contextualizations;
  const assets = Object.keys(actualContextualizations).filter(id => {
    if (sectionId) {
      return contextualizations[id].targetId === sectionId;
    }

    return true;
  }).reduce((ass, id) => {
    const contextualization = contextualizations[id];
    const contextualizer = contextualizers[contextualization.contextualizerId];
    return _objectSpread({}, ass, {
      [id]: _objectSpread({}, contextualization, {
        resource: resources[contextualization.sourceId],
        additionalResources: contextualization.additionalResources ? contextualization.additionalResources.map(resId => resources[resId]) : [],
        contextualizer,
        type: contextualizer ? contextualizer.type : INLINE_ASSET
      })
    });
  }, {});
  /*
   * Citations preparation
   */
  // isolate bib contextualizations

  const bibContextualizations = Object.keys(assets).filter(assetKey => assets[assetKey].type === 'bib').map(assetKey => assets[assetKey]); // build bibliography items

  const citationItems = Object.keys(assets).filter(key => assets[key] && assets[key].resource && assets[key].resource.metadata.type !== 'glossary').reduce((finalCitations, key1) => {
    const asset = assets[key1];
    const citations = [...(0, _resourceToCslJSON.default)(asset.resource), ...(asset.additionalResources ? asset.additionalResources.map(res => (0, _resourceToCslJSON.default)(res)) : [])].flat(); // const citations = bibCit.resource.data;

    const newCitations = citations.reduce((final2, citation) => {
      return _objectSpread({}, final2, {
        [citation.id]: citation
      });
    }, {});
    return _objectSpread({}, finalCitations, newCitations);
  }, {}); // build citations's citations data

  const citationInstances = bibContextualizations // Object.keys(bibContextualizations)
  .map((bibCit, index) => {
    const key1 = bibCit.id;
    const contextualization = contextualizations[key1];
    const contextualizer = contextualizers[contextualization.contextualizerId];
    const targets = [...(0, _resourceToCslJSON.default)(bibCit.resource), ...(bibCit.additionalResources ? bibCit.additionalResources.map(res => (0, _resourceToCslJSON.default)(res)) : [])].flat();
    return {
      citationID: key1,
      citationItems: targets.map(ref => ({
        locator: contextualizer.locator,
        prefix: contextualizer.prefix,
        suffix: contextualizer.suffix,
        // ...contextualizer,
        id: ref.id
      })),
      properties: {
        noteIndex: index + 1
      }
    };
  }); // map the citation instances to the clumsy formatting needed by citeProc

  const citationData = citationInstances.map((instance, index) => [instance, // citations before
  citationInstances.slice(0, index === 0 ? 0 : index).map(oCitation => [oCitation.citationID, oCitation.properties.noteIndex]), []
  /*
   * citations after the current citation
   * this is claimed to be needed by citeproc.js
   * but it works without it so ¯\_(ツ)_/¯
   * citationInstances.slice(index)
   *   .map((oCitation) => [
   *       oCitation.citationID,
   *       oCitation.properties.noteIndex
   *     ]
   *   ),
   */
  ]);
  return {
    citationData,
    citationItems
  };
}