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
  options
}) => {
  const {
    customSummary,
    resourceTypes,
    hideEmptyResources = false
  } = options;
  let summary = [];

  if (customSummary && customSummary.active) {
    summary = customSummary.summary;
  } else {
    let base = [];

    if (resourceTypes && resourceTypes.includes('section')) {
      base = [...production.sectionsOrder];
    }

    summary = Object.keys(production.resources).filter(resourceId => {
      const resource = production.resources[resourceId];

      if (resource.metadata.type === 'section') {
        return false;
      }

      return resourceTypes ? resourceTypes.includes(resource.metadata.type) : true;
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