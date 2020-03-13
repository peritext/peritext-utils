"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultSortResourceSections = _interopRequireDefault(require("./defaultSortResourceSections"));

var _resourceHasContents = _interopRequireDefault(require("./resourceHasContents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const buildResourceSectionsSummary = ({
  production,
  options = {}
}) => {
  const {
    customSummary,
    resourceTypes,
    hideEmptyResources = false,
    tags
  } = options;
  let summary = [];

  if (customSummary && customSummary.active) {
    summary = customSummary.summary;
  } else {
    let base = [];

    if (resourceTypes && resourceTypes.includes('section')) {
      base = [...production.sectionsOrder].filter(({
        resourceId
      }) => {
        const resource = production.resources[resourceId];

        if (tags && tags.length) {
          const resourceTags = resource.metadata && resource.metadata.tags || [];
          return resourceTags.find(resourceTag => tags.includes(resourceTag)) !== undefined;
        }

        return true;
      });
    }

    summary = Object.keys(production.resources) // filtering resource types
    .filter(resourceId => {
      const resource = production.resources[resourceId];

      if (resource.metadata.type === 'section') {
        return false;
      }

      return resourceTypes ? resourceTypes.includes(resource.metadata.type) : true;
    }) // filtering tags
    .filter(resourceId => {
      const resource = production.resources[resourceId];

      if (tags && tags.length) {
        const resourceTags = resource.metadata && resource.metadata.tags || [];
        return resourceTags.find(resourceTag => tags.includes(resourceTag)) !== undefined;
      }

      return true;
    }).map(resourceId => ({
      resourceId,
      level: 0
    })).sort(_defaultSortResourceSections.default);
    summary = [...base, ...summary].filter(({
      resourceId
    }) => {
      if (hideEmptyResources) {
        return (0, _resourceHasContents.default)(production.resources[resourceId]);
      }

      return true;
    });
  }

  return summary;
};

var _default = buildResourceSectionsSummary;
exports.default = _default;