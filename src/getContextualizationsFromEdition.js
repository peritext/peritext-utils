
/**
 * Get mentioned contextualizations for the sections of a given edition
 * @return {array} elements - list of loaded contextualizations
 */
export default function getContextualizationsFromEdition (
  production = {},
  edition = {}
) {
  const {
    contextualizations,
    contextualizers,
  } = production;

  const { data = {} } = edition;
  const { plan = {} } = data;
  const { summary = [] } = plan;
  const usedSectionsIds = summary.reduce( ( res, element ) => {
        if ( element.type === 'sections' ) {
          let newOnes = [];
          if ( element.data && element.data.customSummary && element.data.customSummary.active ) {
            newOnes = element.data.customSummary.summary.map( ( el ) => ( {
              resourceId: el.resourceId,
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
        return res;
      }, [] );

  const contextualizationsUsedBySections = usedSectionsIds.reduce( ( res, section ) => {
    const relatedContextualizationIds = Object.keys( contextualizations )
      .filter( ( contextualizationId ) => {
        return contextualizations[contextualizationId].targetId === section.resourceId;
      } );

    return [
      ...res,
      ...relatedContextualizationIds.map( ( contextualizationId ) => ( {
        contextualization: contextualizations[contextualizationId],
        contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId],
        // ...section,
      } ) )
    ];
  }, [] );

  /**
   * @todo decide if resources-based contextualizations should somehow restrict the resources to parse relating to the edition summary
   */
  const contextualizationsUsedByResources = Object.keys( contextualizations )
  .filter( ( contextualizationId ) => {
    return production.resources[contextualizations[contextualizationId].targetId]
    && production.resources[contextualizations[contextualizationId].targetId].metadata.type !== 'section';
  } )
  .map( ( contextualizationId ) => ( {
    contextualization: contextualizations[contextualizationId],
    contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId],
  } ) );

  return [ ...contextualizationsUsedBySections, ...contextualizationsUsedByResources ];
}
