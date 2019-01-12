import resourceToCslJSON from './resourceToCslJSON';
import { constants } from 'peritext-schemas';
const {
  draftEntitiesNames: {

    INLINE_ASSET
  }
} = constants;

/**
 * Builds component-consumable data to represent
 * the citations of "bib" resources being mentionned in the production
 * @param {object} production - the production to process
 * @return {object} citationData - the citation data to input in the reference manager
 */
export default function buildCitations ( production, sectionId ) {
  const {
    contextualizations = {},
    contextualizers = {},
    resources = {}
  } = production;

  /*
   * Assets preparation
   */
  const assets = Object.keys( contextualizations )
  .filter( ( id ) => {
    if ( sectionId ) {
      return contextualizations[id].sectionId === sectionId;
    }
    return true;
  } )
  .reduce( ( ass, id ) => {
    const contextualization = contextualizations[id];
    const contextualizer = contextualizers[contextualization.contextualizerId];
    return {
      ...ass,
      [id]: {
        ...contextualization,
        resource: resources[contextualization.resourceId],
        contextualizer,
        type: contextualizer ? contextualizer.type : INLINE_ASSET
      }
    };
  }, {} );

  /*
   * Citations preparation
   */
  // isolate bib contextualizations
  const bibContextualizations = Object.keys( assets )
  .filter( ( assetKey ) =>
      assets[assetKey].type === 'bib'
    )
  .map( ( assetKey ) => assets[assetKey] );
  // build bibliography items
  const citationItems = Object.keys( assets )
    .filter( ( key ) => assets[key] && assets[key].resource && assets[key].resource.metadata.type !== 'glossary' )
    .reduce( ( finalCitations, key1 ) => {
      const asset = assets[key1];
      const citations = resourceToCslJSON( asset.resource );
      // const citations = bibCit.resource.data;
      const newCitations = citations.reduce( ( final2, citation ) => {
          return {
            ...final2,
            [citation.id]: citation
          };
        }, {} );
      return {
        ...finalCitations,
        ...newCitations,
      };
    }, {} );
  // build citations's citations data
  const citationInstances = bibContextualizations // Object.keys(bibContextualizations)
    .map( ( bibCit, index ) => {
      const key1 = bibCit.id;
      const contextualization = contextualizations[key1];

      const contextualizer = contextualizers[contextualization.contextualizerId];
      const resource = resources[contextualization.resourceId];
      return {
        citationID: key1,
        citationItems: resourceToCslJSON( resource ).map( ( ref ) => ( {
          locator: contextualizer.locator,
          prefix: contextualizer.prefix,
          suffix: contextualizer.suffix,
          // ...contextualizer,
          id: ref.id,
        } ) ),
        properties: {
          noteIndex: index + 1
        }
      };
    } );
  // map the citation instances to the clumsy formatting needed by citeProc
  const citationData = citationInstances.map( ( instance, index ) => [
    instance,
    // citations before
    citationInstances.slice( 0, ( index === 0 ? 0 : index ) )
      .map( ( oCitation ) => [
          oCitation.citationID,
          oCitation.properties.noteIndex
        ]
      ),
    []

    /*
     * citations after the current citation
     * this is claimed to be needed by citeproc.js
     * but it works without it so ¯\_(ツ)_/¯
     * citationInstances.slice(index)
     *   .map((oCitation) => [
     *       oCitation.citationID,
     *       oCitation.properties.noteIndex
     *     ]
     *   ),
     */
  ] );
  return {
    citationData,
    citationItems
  };
}
