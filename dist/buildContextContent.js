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
  return Object.keys(contents.entityMap).find(id => {
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
  /*
   * look in the entity map of the section
   * for the draft-js entity id linked to the contextualization
   */

  let entityId;
  let targetContents; // search in main contents

  entityId = findRelatedEntity(section.data.contents.contents, contextualizationId);

  if (entityId) {
    targetContents = 'main';
  } // search in notes
  else {
      Object.keys(section.data.contents.notes).some(noteId => {
        const noteContents = section.data.contents.notes[noteId].contents;
        entityId = findRelatedEntity(noteContents, contextualizationId);

        if (entityId) {
          targetContents = noteId;
          return true;
        }
      });
    }

  let contents = targetContents === 'main' ? _objectSpread({}, section.data.contents.contents) : _objectSpread({}, section.data.contents.notes[targetContents] ? section.data.contents.notes[targetContents].contents : {});

  if (entityId) {
    let blockIndex;
    contents.blocks.some((block, index) => {
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
    const sliceTo = blockIndex + padding + 1 <= contents.blocks.length - 1 ? blockIndex + padding + 1 : contents.blocks.length;
    contents = _objectSpread({}, contents, {
      blocks: [...contents.blocks.slice(sliceFrom, sliceTo)]
    });
  }

  return {
    targetContents,
    contents,
    sectionTitle,
    sectionId
  };
}