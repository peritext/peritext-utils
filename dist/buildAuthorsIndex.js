"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildAuthorsIndex;

var _buildContextContent = _interopRequireDefault(require("./buildContextContent"));

var _resourceToCslJSON = _interopRequireDefault(require("./resourceToCslJSON"));

var _slugify = _interopRequireDefault(require("slugify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Builds component-consumable data to represent
 * the index of authors mentionned in the production
 * @param {object} production - the production to process
 * @return {array} authorsNameMentions - all the glossary entries properly formatted for rendering
 */
function buildAuthorsIndex(production) {
  const {
    contextualizations,
    contextualizers,
    resources
  } = production;
  let authorsNameMentions = Object.keys(contextualizations)
  /*
   * .filter(contextualizationId => {
   *   const contextualizerId = contextualizations[contextualizationId].contextualizerId;
   *   const contextualizer = contextualizers[contextualizerId];
   *   return contextualizer && contextualizer.type === 'bib';
   * })
   */
  .map(contextualizationId => _objectSpread({}, contextualizations[contextualizationId], {
    contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId],
    resource: resources[contextualizations[contextualizationId].resourceId],
    contextContent: (0, _buildContextContent.default)(production, contextualizationId)
  })).reduce((entries, contextualization) => {
    const resource = contextualization.resource; // handling bib resources

    if (resource
    /*&&
    resource.metadata.type === 'bib' &&
    resource.data &&
    Array.isArray(resource.data) &&
    resource.data.length &&
    resource.data[0] &&
    resource.data[0].author*/
    ) {
        const normalized = (0, _resourceToCslJSON.default)(resource) || [];
        return normalized.filter(norm => norm.author !== undefined).reduce((authors, entr) => authors.concat(entr.author), []).reduce((finalEntries, author) => {
          if (author.given === undefined) {
            return finalEntries;
          } // todo: what about homonyms ?


          const id = (0, _slugify.default)(`${author.family} ${author.given}`.toLowerCase());

          if (finalEntries[id]) {
            return _objectSpread({}, finalEntries, {
              [id]: _objectSpread({}, finalEntries[id], {
                mentions: [...finalEntries[id].mentions, contextualization]
              })
            });
          }

          return _objectSpread({}, finalEntries, {
            [id]: _objectSpread({}, author, {
              id,
              mentions: [contextualization]
            })
          });
        }, entries);
      }

    return entries;
  }, {});
  authorsNameMentions = Object.keys(authorsNameMentions).map(id => authorsNameMentions[id]).sort((a, b) => {
    if (a.given > b.given) {
      return -1;
    } else {
      return 1;
    }
  });
  return authorsNameMentions;
}