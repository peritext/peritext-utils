import { constants } from 'peritext-schemas';
const {
  draftEntitiesNames: {

    INLINE_ASSET,
    BLOCK_ASSET
  }
} = constants;

/**
 * Finds the entity related to a contextualization
 * @param {obj} contents - draft-js raw contents
 * @param {string} contextualizationId - id of the contextualization to search for
 * @return {string} id - entity key
 */
function findRelatedEntity ( contents, contextualizationId ) {
  return Object.keys( contents.entityMap || {} ).find( ( id ) => {
    const entity = contents.entityMap[id];
    if ( entity.type === BLOCK_ASSET ||
        entity.type === INLINE_ASSET &&
        entity.data.asset ) {
      const contId = entity.data.asset.id;
      if ( contId === contextualizationId ) {
        return id;
      }
    }
  } );
}

/**
 * Creates a Draft-js's raw representation of the content surrounding a given contextualization
 * @param {object} production - the production's json
 * @param {string} contextualizationId - id of the contextualization id
 * @param {number} padding - number of blocks before and after contextualization's block to integrate within the content state
 * @return {object} rawContent - a draft-js raw representation of returned content state
 */
export default function buildContextContent( production, contextualizationId, padding = 0 ) {
  const contextualization = production.contextualizations[contextualizationId];
  const section = production.resources[contextualization.targetId];
  if ( section === undefined || section.metadata === undefined ) {
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
  let targetContents;
  // search in main contents
  entityId = findRelatedEntity( contents.contents, contextualizationId );
  if ( entityId ) {
    targetContents = 'main';
  }
  // search in notes
  else {
    Object.keys( contents.notes ).some( ( noteId ) => {
      const noteContents = contents.notes[noteId].contents;
      entityId = findRelatedEntity( noteContents, contextualizationId );
      if ( entityId ) {
        targetContents = noteId;
        return true;
      }
    } );
  }
  let actualContents = targetContents === 'main' ?
    { ...contents.contents } : { ...( contents.notes[targetContents] ? contents.notes[targetContents].contents : {} ) };

  if ( entityId ) {
    let blockIndex;
    actualContents.blocks.some( ( block, index ) => {
      const entityRanges = block.entityRanges;
      const entityMatch = entityRanges.find( ( range ) => {
        if ( `${ range.key}` === `${ entityId}` ) {
          return range;
        }
      } );
      if ( entityMatch ) {
        blockIndex = index;
        return true;
      }
    } );
    const sliceFrom = blockIndex - padding >= 0 ? blockIndex - padding : 0;
    const sliceTo = blockIndex + padding + 1 <= actualContents.blocks.length - 1 ? blockIndex + padding + 1 : actualContents.blocks.length;

    actualContents = {
      ...actualContents,
      blocks: [
          ...actualContents.blocks.slice( sliceFrom, sliceTo )
        ]
    };
  }
  return {
    targetContents,
    contents: actualContents,
    sectionTitle,
    sectionId,
  };
}
