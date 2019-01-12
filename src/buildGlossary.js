import buildContextContent from './buildContextContent';

/**
 * Builds component-consumable data to represent
 * the glossary of "entities" resources being mentionned in the production
 * @param {object} production - the production to process
 * @return {array} glossaryMentions - all the glossary entries properly formatted for rendering
 */
export default function buildGlossary(
  production,
) {
    const {
      contextualizations,
      contextualizers,
      resources
    } = production;
    let glossaryMentions = Object.keys( contextualizations )
      .filter( ( contextualizationId ) => {
        const contextualizerId = contextualizations[contextualizationId].contextualizerId;
        const contextualizer = contextualizers[contextualizerId];
        return contextualizer && contextualizer.type === 'glossary';
      } )
      .map( ( contextualizationId ) => ( {
        ...contextualizations[contextualizationId],
        contextualizer: contextualizers[contextualizations[contextualizationId].contextualizerId],
        resource: resources[contextualizations[contextualizationId].resourceId],
        contextContent: buildContextContent( production, contextualizationId )
      } ) )
      .reduce( ( entries, contextualization ) => {
        return {
          ...entries,
          [contextualization.resourceId]: {
            resource: contextualization.resource,
            mentions: entries[contextualization.resourceId] ?
                        entries[contextualization.resourceId].mentions.concat( contextualization )
                        : [ contextualization ]
          }
        };
      }, {} );

    glossaryMentions = Object.keys( glossaryMentions )
                        .map( ( id ) => glossaryMentions[id] )
                        .sort( ( a, b ) => {
                          if ( a.resource.metadata.title.toLowerCase() > b.resource.metadata.title.toLowerCase() ) {
                            return 1;
                          }
                          else {
                            return -1;
                          }
                        } );

    return glossaryMentions;
  }
