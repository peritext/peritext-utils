import defaultSortResourceSections from './defaultSortResourceSections';
import resourceHasContents from './resourceHasContents';

const buildResourceSectionsSummary = ( { production, options } ) => {

  const {
    customSummary,
    resourceTypes,
    hideEmptyResources = false,
    tags
  } = options;

  let summary = [];
  if ( customSummary && customSummary.active ) {
    summary = customSummary.summary;
  }
 else {
    let base = [];
    if ( resourceTypes && resourceTypes.includes( 'section' ) ) {
      base = [ ...production.sectionsOrder ];
    }
    summary = Object.keys( production.resources )
    // filtering resource types
    .filter( ( resourceId ) => {
      const resource = production.resources[resourceId];
      if ( resource.metadata.type === 'section' ) {
        return false;
      }
      return resourceTypes ? resourceTypes.includes( resource.metadata.type ) : true;
    } )
    // filtering tags
    .filter( ( resourceId ) => {
      const resource = production.resources[resourceId];
      if ( tags && tags.length ) {
        const resourceTags = resource.metadata && resource.metadata.tags || [];
        return resourceTags.find( ( resourceTag ) => tags.includes( resourceTag ) ) !== undefined;
      }
      return true;
    } )
    .map( ( resourceId ) => ( {
      resourceId,
      level: 0
    } ) )
    .sort( defaultSortResourceSections );

    summary = [ ...base, ...summary ]
    .filter( ( { resourceId } ) => {
      if ( hideEmptyResources ) {
        return resourceHasContents( production.resources[resourceId] );
      }
      return true;
    } );
  }
  return summary;
};

export default buildResourceSectionsSummary;
