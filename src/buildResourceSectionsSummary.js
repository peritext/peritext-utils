import defaultSortResourceSections from './defaultSortResourceSections';
import resourceHasContents from './resourceHasContents';

const buildResourceSectionsSummary = ( { production, options } ) => {

  const { customSummary, resourceTypes, hideEmptyResources = false } = options;

  let summary = [];
  if ( customSummary && customSummary.active ) {
    summary = customSummary.summary;
  }
 else {
    summary = Object.keys( production.resources )
    .filter( ( resourceId ) => {
      const resource = production.resources[resourceId];
      return resourceTypes.includes( resource.metadata.type );
    } )
    .filter( ( resourceId ) => {
      if ( hideEmptyResources ) {
        return resourceHasContents( production.resources[resourceId] );
      }
      return true;
    } )
    .map( ( resourceId ) => ( {
      resourceId,
      level: 0
    } ) )
    .sort( defaultSortResourceSections );
  }
  return summary;
};

export default buildResourceSectionsSummary;
