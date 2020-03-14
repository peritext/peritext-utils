import buildContextContent from './buildContextContent';
import getContextualizationsFromEdition from './getContextualizationsFromEdition';
import getContextualizationMentions from './getContextualizationMentions';
import uniq from 'lodash/uniq';

const buildGlossary = ( {
  production,
  edition,
  options
} ) => {
  const {
    resources
  } = production;

  const {
      showUncited = false,
      glossaryTypes = [ 'person', 'place', 'event', 'notion', 'other' ],
      tags
    } = options;

  // let items;
  const usedContextualizations = getContextualizationsFromEdition( production, edition );
  const citedResourcesIds = (
    showUncited ?
      Object.keys( resources )
      .filter( ( resourceId ) => resources[resourceId].metadata.type === 'glossary' )
      :
      uniq( usedContextualizations.filter( ( c ) => resources[c.contextualization.sourceId].metadata.type === 'glossary' ).map( ( c ) => c.contextualization.sourceId ) )
  )
  .filter( ( resourceId ) => {
    return glossaryTypes.includes( resources[resourceId].data.entryType );
  } )
  .filter( ( resourceId ) => {
    if ( tags && tags.length ) {
      const resource = resources[resourceId];
      const resourceTags = resource.metadata && resource.metadata.tags || [];
      return resourceTags.find( ( resourceTag ) => tags.includes( resourceTag ) ) !== undefined;
    }
    return true;
  } )
  .sort( ( a, b ) => {
    if ( resources[a].data.name.toLowerCase() > resources[b].data.name.toLowerCase() ) {
      return 1;
    }
    else {
      return -1;
    }
  } );

  const items = citedResourcesIds.map( ( resourceId ) => {
    const mentions = usedContextualizations.filter( ( c ) => c.contextualization.sourceId === resourceId )
    .map( ( c ) => c.contextualization.id )
    .map( ( contextualizationId ) => getContextualizationMentions( { contextualizationId, production, edition } ) )
    .reduce( ( res2, contextualizationMentions ) => [
      ...res2,
      ...contextualizationMentions.map( ( { containerId, contextualizationId } ) => ( {
        id: contextualizationId,
        containerId,
        contextContent: buildContextContent( production, contextualizationId )
      } ) )

    ], [] );
    return {
      resourceId,
      resource: production.resources[resourceId],
      mentions
    };

  } );

  return items;
};

export default buildGlossary;
