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
    summary = Object.keys(production.resources).filter(resourceId => {
      const resource = production.resources[resourceId];
      return resourceTypes ? resourceTypes.includes(resource.metadata.type) : true;
    }).filter(resourceId => {
      if (hideEmptyResources) {
        return (0, _resourceHasContents.default)(production.resources[resourceId]);
      }

      return true;
    }).map(resourceId => ({
      resourceId,
      level: 0
    })).sort(_defaultSortResourceSections.default);
  }

  return summary;
};

var _default = buildResourceSectionsSummary;
exports.default = _default;