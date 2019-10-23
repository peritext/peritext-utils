"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildBibliography;

var _buildContextContent = _interopRequireDefault(require("./buildContextContent"));

var _resourceToCslJSON = _interopRequireDefault(require("./resourceToCslJSON"));

var _reactCiteproc = require("react-citeproc");

var _peritextSchemas = require("peritext-schemas");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  draftEntitiesNames: {
    INLINE_ASSET
  }
} = _peritextSchemas.constants;
/**
 * Builds component-consumable data to represent
 * the citations of "bib" resources being mentionned in the production
 * @param {object} production - the production to process
 * @param {object} citations - the citation data
 * @return {object} items - reference items ready to be visualized
 */

function buildBibliography(production, citations) {
  const {
    contextualizations,
    contextualizers,
    resources
  } = production;
  /*
   * Assets preparation
   */

  const assets = Object.keys(contextualizations).reduce((ass, id) => {
    const contextualization = contextualizations[id];
    const contextualizer = contextualizers[contextualization.contextualizerId];
    return _objectSpread({}, ass, {
      [id]: _objectSpread({}, contextualization, {
        resource: resources[contextualization.sourceId],
        contextualizer,
        type: contextualizer ? contextualizer.type : INLINE_ASSET
      })
    });
  }, {});
  /*
   * Citations preparation
   */
  // isolate bib contextualizations

  const bibContextualizations = Object.keys(assets).filter(assetKey => assets[assetKey].type !== 'glossary').map(assetKey => assets[assetKey]);
  /*
   * console.log('citations.citationItems', citations.citationItems);
   * console.log('bib contextualizations', bibContextualizations);
   */

  const items = Object.keys(citations.citationItems).map(citationKey => {
    const mentions = bibContextualizations.filter(contextualization => {
      if (contextualization.resource) {
        // console.log('contextualization resource', contextualization.resource);
        const cit = (0, _resourceToCslJSON.default)(contextualization.resource);
        return cit && cit[0] && cit[0].id === citationKey;
      }
    });
    const biblio = (0, _reactCiteproc.makeBibliography)(citations.citationItems, production.settings.citationStyle.data, production.settings.citationLocale.data, {
      select: [{
        field: 'id',
        value: citationKey
      }]
    });
    const title = biblio && biblio[1] && biblio[1][0];
    return {
      citationKey,
      title,
      item: citations.citationItems[citationKey],
      mentions: mentions.map(mention => _objectSpread({}, mention, {
        contextContent: (0, _buildContextContent.default)(production, mention.id)
      }))
    };
  });
  return items;
}