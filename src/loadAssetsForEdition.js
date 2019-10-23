import { uniq } from 'lodash';
import getContextualizationsFromEdition from './getContextualizationsFromEdition';
import getRelatedAssetsIds from './getRelatedAssetsIds';

const loadAssetsForEdition = ( {
  production,
  edition,
  requestAssetData
} ) => new Promise( ( resolve, reject ) => {
  const items = getContextualizationsFromEdition( production, edition );
  const assetsIds = uniq( items.reduce( ( res, item ) => {
    const related = getRelatedAssetsIds( production.resources[item.contextualization.sourceId] );
    return [ ...res, ...related ];
  }, [] ) );
  const assets = {};
  assetsIds.reduce( ( cur, assetId ) =>
    cur.then( () =>
      new Promise( ( res1, rej1 ) => {
        requestAssetData( { productionId: production.id, asset: production.assets[assetId] } )
          .then( ( data ) => {
            assets[assetId] = {
              ...production.assets[assetId],
              data,
            };
            res1();
          } )
          .catch( rej1 );
      } )
    )
  , Promise.resolve() )
  .then( () => {
    resolve( assets );
  } )
  .catch( reject );
} );

export default loadAssetsForEdition;
