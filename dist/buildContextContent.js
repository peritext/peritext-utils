"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildContextContent;

var _peritextSchemas = require("peritext-schemas");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  draftEntitiesNames: {
    INLINE_ASSET,
    BLOCK_ASSET
  }
} = _peritextSchemas.constants;
/**
 * Finds the entity related to a contextualization
 * @param {obj} contents - draft-js raw contents
 * @param {string} contextualizationId - id of the contextualization to search for
 * @return {string} id - entity key
 */

function findRelatedEntity(contents, contextualizationId) {
  return Object.keys(contents.entityMap || {}).find(id => {
    const entity = contents.entityMap[id];

    if (entity.type === BLOCK_ASSET || entity.type === INLINE_ASSET && entity.data.asset) {
      const contId = entity.data.asset.id;

      if (contId === contextualizationId) {
        return id;
      }
    }
  });
}
/**
 * Creates a Draft-js's raw representation of the content surrounding a given contextualization
 * @param {object} production - the production's json
 * @param {string} contextualizationId - id of the contextualization id
 * @param {number} padding - number of blocks before and after contextualization's block to integrate within the content state
 * @return {object} rawContent - a draft-js raw representation of returned content state
 */


function buildContextContent(production, contextualizationId, padding = 0) {
  const contextualization = production.contextualizations[contextualizationId];
  const section = production.resources[contextualization.targetId];

  if (section === undefined || section.metadata === undefined) {
    return;
  }

  const sectionTitle = section.metadata.title;
  const sectionId = section.id;
  const {
    data = {}
  } = section;
  const {
    contents = {
      contents: {},
      notes: {},
      notesOrder: []
    }
  } = data;
  /*
   * look in the entity map of the section
   * for the draft-js entity id linked to the contextualization
   */

  let entityId;
  let targetContents; // search in main contents

  entityId = findRelatedEntity(contents.contents, contextualizationId);

  if (entityId) {
    targetContents = 'main';
  } // search in notes
  else {
      Object.keys(contents.notes).some(noteId => {
        const noteContents = contents.notes[noteId].contents;
        entityId = findRelatedEntity(noteContents, contextualizationId);

        if (entityId) {
          targetContents = noteId;
          return true;
        }
      });
    }

  let actualContents = targetContents === 'main' ? _objectSpread({}, contents.contents) : _objectSpread({}, contents.notes[targetContents] ? contents.notes[targetContents].contents : {});

  if (entityId) {
    let blockIndex;
    actualContents.blocks.some((block, index) => {
      const entityRanges = block.entityRanges;
      const entityMatch = entityRanges.find(range => {
        if (`${range.key}` === `${entityId}`) {
          return range;
        }
      });

      if (entityMatch) {
        blockIndex = index;
        return true;
      }
    });
    const sliceFrom = blockIndex - padding >= 0 ? blockIndex - padding : 0;
    const sliceTo = blockIndex + padding + 1 <= actualContents.blocks.length - 1 ? blockIndex + padding + 1 : actualContents.blocks.length;
    actualContents = _objectSpread({}, actualContents, {
      blocks: [...actualContents.blocks.slice(sliceFrom, sliceTo)]
    });
  }

  return {
    targetContents,
    contents: actualContents,
    sectionTitle,
    sectionId
  };
}