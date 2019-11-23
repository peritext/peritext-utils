"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildCitations;

var _resourceToCslJSON = _interopRequireDefault(require("./resourceToCslJSON"));

var _getContextualizationsFromEdition = _interopRequireDefault(require("./getContextualizationsFromEdition"));

var _buildCitationRepresentations = _interopRequireDefault(require("./buildCitationRepresentations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
}, buildRepresentations = false) {
  const {
    contextualizations = {},
    contextualizers = {},
    resources = {}
  } = production;
  /*
   * Assets preparation
   */

  const actualContextualizations = edition ? (0, _getContextualizationsFromEdition.default)(production, edition) : Object.keys(contextualizations).map(contextualizationId => {
    const contextualization = contextualizations[contextualizationId];
    const contextualizer = production.contextualizers[contextualization.contextualizerId];
    return {
      contextualizer,
      contextualization
    };
  });
  const assets = actualContextualizations.filter(contextualization => {
    if (sectionId) {
      return contextualization.targetId === sectionId;
    }

    return true;
  }).reduce((ass, {
    contextualization,
    contextualizer
  }) => {
    // const contextualization = contextualizations[id];
    return _objectSpread({}, ass, {
      [contextualization.id]: _objectSpread({}, contextualization, {
        resource: resources[contextualization.sourceId],
        additionalSources: contextualization.additionalSources ? contextualization.additionalSources.map(resId => resources[resId]) : [],
        contextualizer,
        type: contextualizer ? contextualizer.type : resources[contextualization.sourceId] && resources[contextualization.sourceId].metadata.type
      })
    });
  }, {});
  /*
   * Citations preparation
   */
  // isolate bib contextualizations

  const bibContextualizations = Object.keys(assets).filter(assetKey => assets[assetKey].type === 'bib' && contextualizations[assetKey]).map(assetKey => assets[assetKey]); // build bibliography items

  const citationItems = Object.keys(assets).filter(key => assets[key] && assets[key].resource && assets[key].resource.metadata.type !== 'glossary').reduce((finalCitations, key1) => {
    const asset = assets[key1];
    const citations = [...(0, _resourceToCslJSON.default)(asset.resource), ...(asset.additionalSources ? asset.additionalSources.map(res => (0, _resourceToCslJSON.default)(res)) : [])].flat(); // const citations = bibCit.resource.data;

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
    const targets = [...(0, _resourceToCslJSON.default)(bibCit.resource), ...(bibCit.additionalSources ? bibCit.additionalSources.map(res => (0, _resourceToCslJSON.default)(res)) : [])].flat();
    return {
      citationID: key1,
      citationItems: targets.map(ref => ({
        locator: contextualizer.parameters ? contextualizer.parameters.locator : contextualizer.locator,
        prefix: contextualizer.parameters ? contextualizer.parameters.prefix : contextualizer.prefix,
        suffix: contextualizer.parameters ? contextualizer.parameters.suffix : contextualizer.suffix,
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
  let citationComponents = {};

  if (buildRepresentations && edition.data.citationLocale && edition.data.citationLocale.data) {
    citationComponents = (0, _buildCitationRepresentations.default)({
      locale: edition.data.citationLocale.data,
      style: edition.data.citationStyle.data,
      items: citationItems,
      citations: citationData
    });
  }

  return {
    /*
     * citationData,
     * citationItems,
     */
    citationComponents
  };
}