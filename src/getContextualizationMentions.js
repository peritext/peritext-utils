const getContextualizationMentions = ( {
  contextualizationId,
  edition,
  production
} ) => {
  const contextualization = production.contextualizations[contextualizationId];
  const resource = production.resources[contextualization.sourceId];
  const { data = {} } = edition;
  const { plan = {} } = data;
  const { summary = [] } = plan;
  return summary.reduce( ( res, element ) => {
    if ( element.type === 'sections' || element.type === 'resourceSections' ) {
      if ( element.data && element.data.customSummary && element.data.customSummary.active ) {
        const sectionsIds = element.data.customSummary.summary.map( ( { resourceId } ) => ( resourceId ) );
        if ( sectionsIds.includes( contextualization.targetId ) ) {
          return [ ...res, {
            contextualizationId,
            containerId: element.id,
          } ];
        }
      }
      else if ( element.type === 'sections' ) {
        if ( production.sectionsOrder.map( ( { resourceId } ) => resourceId ).includes( contextualization.targetId ) ) {
          return [ ...res, {
            contextualizationId,
            containerId: element.id,
          } ];
        }
      }
 else if ( element.type === 'resourceSections' ) {
        if ( element.data.resourceTypes.includes( resource.metadata.type ) ) {
          return [ ...res, {
            contextualizationId,
            containerId: element.id,
          } ];
        }
      }
    }
    return res;
  }, [] );

};

export default getContextualizationMentions;
