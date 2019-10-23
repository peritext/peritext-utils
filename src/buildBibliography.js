import buildContextContent from './buildContextContent';
import resourceToCslJSON from './resourceToCslJSON';

import { makeBibliography } from 'react-citeproc';
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
 * @param {object} citations - the citation data
 * @return {object} items - reference items ready to be visualized
 */
export default function buildBibliography (
  production,
  citations,
) {

  const {
    contextualizations,
    contextualizers,
    resources
  } = production;

  /*
   * Assets preparation
   */
  const assets = Object.keys( contextualizations )
  .reduce( ( ass, id ) => {
    const contextualization = contextualizations[id];
    const contextualizer = contextualizers[contextualization.contextualizerId];
    return {
      ...ass,
      [id]: {
        ...contextualization,
        resource: resources[contextualization.sourceId],
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
      assets[assetKey].type !== 'glossary'
    )
  .map( ( assetKey ) => assets[assetKey] );

  /*
   * console.log('citations.citationItems', citations.citationItems);
   * console.log('bib contextualizations', bibContextualizations);
   */

  const items = Object.keys( citations.citationItems ).map( ( citationKey ) => {
    const mentions = bibContextualizations.filter( ( contextualization ) => {
      if ( contextualization.resource ) {
        // console.log('contextualization resource', contextualization.resource);
        const cit = resourceToCslJSON( contextualization.resource );
        return cit && cit[0] && cit[0].id === citationKey;
      }
    } );
    const biblio = makeBibliography(
      citations.citationItems,
      production.settings.citationStyle.data,
      production.settings.citationLocale.data,
      {
        select: [ {
          field: 'id',
          value: citationKey
        } ]
      }
    );
    const title = biblio && biblio[1] && biblio[1][0];
    return {
      citationKey,
      title,
      item: citations.citationItems[citationKey],
      mentions: mentions.map( ( mention ) => ( {
        ...mention,
        contextContent: buildContextContent( production, mention.id )
      } ) )
    };
  } );

  return items;
}

