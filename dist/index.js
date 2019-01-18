"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "buildBibliography", {
  enumerable: true,
  get: function () {
    return _buildBibliography.default;
  }
});
Object.defineProperty(exports, "buildCitations", {
  enumerable: true,
  get: function () {
    return _buildCitations.default;
  }
});
Object.defineProperty(exports, "buildContextContent", {
  enumerable: true,
  get: function () {
    return _buildContextContent.default;
  }
});
Object.defineProperty(exports, "buildGlossary", {
  enumerable: true,
  get: function () {
    return _buildGlossary.default;
  }
});
Object.defineProperty(exports, "resourceToCslJSON", {
  enumerable: true,
  get: function () {
    return _resourceToCslJSON.default;
  }
});
Object.defineProperty(exports, "StructuredCOinS", {
  enumerable: true,
  get: function () {
    return _StructuredCOinS.default;
  }
});
Object.defineProperty(exports, "chooseAppropriateAsset", {
  enumerable: true,
  get: function () {
    return _chooseAppropriateAsset.default;
  }
});
Object.defineProperty(exports, "chooseAppropriateSubAsset", {
  enumerable: true,
  get: function () {
    return _chooseAppropriateAsset.chooseAppropriateSubAsset;
  }
});
Object.defineProperty(exports, "getRelatedAssetsIds", {
  enumerable: true,
  get: function () {
    return _getRelatedAssetsIds.default;
  }
});
Object.defineProperty(exports, "getContextualizationsFromEdition", {
  enumerable: true,
  get: function () {
    return _getContextualizationsFromEdition.default;
  }
});
Object.defineProperty(exports, "loadAssetsForEdition", {
  enumerable: true,
  get: function () {
    return _loadAssetsForEdition.default;
  }
});
Object.defineProperty(exports, "buildHTMLMetadata", {
  enumerable: true,
  get: function () {
    return _buildHTMLMetadata.default;
  }
});
Object.defineProperty(exports, "abbrevString", {
  enumerable: true,
  get: function () {
    return _abbrevString.default;
  }
});
Object.defineProperty(exports, "generateOpenUrl", {
  enumerable: true,
  get: function () {
    return _microDataUtils.generateOpenUrl;
  }
});
Object.defineProperty(exports, "bibToSchema", {
  enumerable: true,
  get: function () {
    return _microDataUtils.bibToSchema;
  }
});

var _buildBibliography = _interopRequireDefault(require("./buildBibliography"));

var _buildCitations = _interopRequireDefault(require("./buildCitations"));

var _buildContextContent = _interopRequireDefault(require("./buildContextContent"));

var _buildGlossary = _interopRequireDefault(require("./buildGlossary"));

var _resourceToCslJSON = _interopRequireDefault(require("./resourceToCslJSON"));

var _StructuredCOinS = _interopRequireDefault(require("./StructuredCOinS"));

var _chooseAppropriateAsset = _interopRequireWildcard(require("./chooseAppropriateAsset"));

var _getRelatedAssetsIds = _interopRequireDefault(require("./getRelatedAssetsIds"));

var _getContextualizationsFromEdition = _interopRequireDefault(require("./getContextualizationsFromEdition"));

var _loadAssetsForEdition = _interopRequireDefault(require("./loadAssetsForEdition"));

var _buildHTMLMetadata = _interopRequireDefault(require("./buildHTMLMetadata"));

var _abbrevString = _interopRequireDefault(require("./abbrevString"));

var _microDataUtils = require("./microDataUtils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }