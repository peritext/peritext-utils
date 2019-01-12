import flatten from 'lodash/flatten';

const getRelatedAssetsIds = ( obj = {} ) => {
  if ( obj ) {
    return flatten(
      Object.keys( obj )
      .reduce( ( results, key ) => {
        const val = obj[key];
        const iterableResults = Array.isArray( results ) ? results : [];
        if ( Array.isArray( val ) ) {
          const newKeys = flatten( val.map( getRelatedAssetsIds ) );
          return [
          ...iterableResults,
          newKeys
          ];
        }
        else if ( typeof val === 'object' ) {
          const newKeys = flatten( getRelatedAssetsIds( val ) );
          return [ ...iterableResults, newKeys ];
        }
        else if ( key.includes( 'AssetId' ) ) {
          return [ ...iterableResults, val ];
        }
        return iterableResults;
      }, [] )
    );
  }
  return [];
};

export default getRelatedAssetsIds;
