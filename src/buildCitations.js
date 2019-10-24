import resourceToCslJSON from './resourceToCslJSON';
import { constants } from 'peritext-schemas';
import resourceHasContents from './resourceHasContents';
const {
  draftEntitiesNames: {

    INLINE_ASSET
  }
} = constants;

const getContextualizationsFromEdition = ( { production = {}, edition = {} } ) => {
  const { contextualizations = {} } = production;
  const { data = {} } = edition;
  const { plan = {} } = data;
  const { summary = [] } = plan;
  const usedSectionsIds = summary.reduce( ( res, element ) => {
        if ( element.type === 'sections' ) {
          let newOnes = [];
          if ( element.data && element.data.customSummary && element.data.customSummary.active ) {
            newOnes = element.data.customSummary.summary.map( ( { resourceId } ) => ( {
              resourceId,
              containerId: element.id
            } ) );
          }
          else {
            newOnes = production.sectionsOrder.map( ( { resourceId } ) => ( {
              resourceId,
              containerId: element.id
            } ) );
          }
          return [ ...res, ...newOnes ];
        }
 else if ( element.type === 'resourceSections' ) {
          let newOnes = [];
          if ( element.data && element.data.customSummary && element.data.customSummary.active ) {
            newOnes = element.data.customSummary.summary.map( ( { resourceId } ) => ( {
              resourceId,
              containerId: element.id
            } ) );
          }
          else {
            newOnes = Object.keys( production.resources )
            .filter( ( resourceId ) => {
              const resource = production.resources[resourceId];
              return element.data.resourceTypes.includes( resource.metadata.type ) && resourceHasContents( resource );
            } )
            .map( ( resourceId ) => ( {
              resourceId,
              containerId: element.id
            } ) );
          }
          return [ ...res, ...newOnes ];
        }
        return res;
      }, [] );

  const usedContextualizations = usedSectionsIds.reduce( ( res, section ) => {
    const relatedContextualizationIds = Object.keys( contextualizations )
      .filter( ( contextualizationId ) => {
        return contextualizations[contextualizationId].targetId === section.resourceId;
      } );

    return relatedContextualizationIds.reduce( ( res2, contId ) => ( {
      ...res2,
      [contId]: contextualizations[contId]
    } ), res );
  }, {} );

  return usedContextualizations;
};

/**
 * Builds component-consumable data to represent
 * the citations of "bib" resources being mentionned in the production
 * @param {object} production - the production to process
 * @return {object} citationData - the citation data to input in the reference manager
 */
export default function buildCitations ( { production, sectionId, edition } ) {
  const {
    contextualizations = {},
    contextualizers = {},
    resources = {}
  } = production;

  /*
   * Assets preparation
   */
  const actualContextualizations = edition ?
    getContextualizationsFromEdition( { production, edition } )
    : contextualizations;
  const assets = Object.keys( actualContextualizations )
  .filter( ( id ) => {
    if ( sectionId ) {
      return contextualizations[id].targetId === sectionId;
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
        resource: resources[contextualization.sourceId],
        additionalSources: contextualization.additionalSources ?
          contextualization.additionalSources.map( ( resId ) => resources[resId] )
        : [],
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
      const citations = [
        ...resourceToCslJSON( asset.resource ),
        ...( asset.additionalSources ? asset.additionalSources.map( ( res ) => resourceToCslJSON( res ) ) : [] )
      ].flat();
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
      const targets = [
        ...resourceToCslJSON( bibCit.resource ),
        ...( bibCit.additionalSources ? bibCit.additionalSources.map( ( res ) => resourceToCslJSON( res ) ) : [] )
      ].flat();
      return {
        citationID: key1,
        citationItems: targets.map( ( ref ) => ( {
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
