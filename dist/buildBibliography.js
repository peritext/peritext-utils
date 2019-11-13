"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildBibliography;

var _buildContextContent = _interopRequireDefault(require("./buildContextContent"));

var _resourceToCslJSON = _interopRequireDefault(require("./resourceToCslJSON"));

var _getContextualizationsFromEdition = _interopRequireDefault(require("./getContextualizationsFromEdition"));

var _getContextualizationMentions = _interopRequireDefault(require("./getContextualizationMentions"));

var _buildCitations = _interopRequireDefault(require("./buildCitations"));

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _citeproc = _interopRequireDefault(require("citeproc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *
 * @param {*} param0
 */
function processBibliography({
  items,
  style,
  locale,
  options = {}
}) {
  if (!style || !locale) {
    return;
  }

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
  processor.updateItems(Object.keys(items));
  const bibResults = processor.makeBibliography(options);
  return bibResults;
}
/**
 * Builds component-consumable data to represent
 * the citations of "bib" resources being mentionned in the production
 * @param {object} production - the production to process
 * @param {object} citations - the citation data
 * @return {object} items - reference items ready to be visualized
 */


function buildBibliography({
  production,
  edition,
  contextualizations: inputContextualizations,
  options: {
    showUncitedReferences,
    sortingKey,
    sortingAscending,
    resourceTypes = ['bib']
  }
}) {
  const {
    resources
  } = production;
  const editionContextualizations = (0, _getContextualizationsFromEdition.default)(production, edition).map(element => {
    const contextualization = element.contextualization;
    return contextualization;
  });
  const contextualizations = inputContextualizations || editionContextualizations;
  /**
   * Select relevant resources
   */
  // filter cited references only

  let citedResourcesIds = showUncitedReferences ? Object.keys(resources) : (0, _uniq.default)(editionContextualizations.map(contextualization => {
    return contextualization.sourceId;
  })); // filter by type of resource

  citedResourcesIds = citedResourcesIds.filter(resourceId => {
    const type = resources[resourceId].metadata.type;
    return resourceTypes.includes(type);
  });
  const resourcesMap = citedResourcesIds.reduce((res, resourceId) => {
    const mentions = contextualizations.filter(contextualization => contextualization.sourceId === resourceId).map(c => c.id).map(contextualizationId => (0, _getContextualizationMentions.default)({
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
    const citation = (0, _resourceToCslJSON.default)(resources[resourceId])[0];

    if (resources[resourceId].metadata.type === 'bib') {
      return _objectSpread({}, res, {
        [resources[resourceId].data.citations[0].id]: _objectSpread({}, resources[resourceId], {
          citation,
          mentions
        })
      });
    }

    return _objectSpread({}, res, {
      [resourceId]: _objectSpread({}, resources[resourceId], {
        mentions,
        citation
      })
    });
  }, {});
  const citations = (0, _buildCitations.default)({
    production,
    edition
  });
  const bibliographyData = processBibliography({
    locale: edition.data.citationLocale.data,
    style: edition.data.citationStyle.data,
    items: citations.citationItems
  });
  const ids = bibliographyData[0].entry_ids.map(group => group[0]);
  let items = ids.map((id, index) => ({
    id,
    resource: resourcesMap[id],
    citation: resourcesMap[id] && resourcesMap[id].citation,
    html: bibliographyData[1][index]
  })).filter(i => i.citation);
  items = items.sort((a, b) => {
    switch (sortingKey) {
      case 'mentions':
        if (a.resource.mentions.length > b.resource.mentions.length) {
          return -1;
        }

        return 1;

      case 'date':
        const datePartsA = a.citation.issued && a.citation.issued['date-parts'];
        const datePartsB = b.citation.issued && b.citation.issued['date-parts'];

        if (datePartsA && datePartsB && datePartsA.length && datePartsB.length) {
          if (datePartsA[0] > datePartsB[0]) {
            return 1;
          } else if (datePartsA[0] < datePartsB[0]) {
            return -1;
          } else if (datePartsA.length > 1 && datePartsB.length > 1) {
            if (datePartsA[1] > datePartsB[1]) {
              return 1;
            } else if (datePartsA[1] < datePartsB[1]) {
              return -1;
            } else return 0;
          } else {
            return 0;
          }
        } else if (!datePartsB || datePartsB && !datePartsB.length) {
          return -1;
        } else if (!datePartsA || datePartsA && !datePartsA.length) {
          return 1;
        } else {
          return 0;
        }

      case 'authors':
        if (a.citation.author && b.citation.author) {
          const authorsA = a.citation.author && a.citation.author.map(author => `${author.family}-${author.given}`.toLowerCase()).join('');
          const authorsB = b.citation.author && b.citation.author.map(author => `${author.family}-${author.given}`.toLowerCase()).join('');

          if (authorsA > authorsB) {
            return 1;
          } else return -1;
        } else if (!b.citation.author) {
          return -1;
        } else if (!a.citation.author) {
          return 1;
        } else return 0;

      case 'title':
        if (a.citation.title.toLowerCase() > b.citation.title.toLowerCase()) {
          return 1;
        }

        return -1;

      default:
        break;
    }
  });

  if (!sortingAscending) {
    items = items.reverse();
  }

  return items;
}