import getResourceTitle from './getResourceTitle';

/**
 * Cleans stuff
 */
function cleanStr( str ) {
    return str
        .toLowerCase()
        .replace( /[ÀÁÂÃÄÅ]/g, 'A' )
        .replace( /[àáâãäå]/g, 'a' )
        .replace( /[éêëè]/g, 'e' )
        //.... all the rest
        .replace( /[^a-z0-9]/gi, '' ); // final clean up
}

/**
 * Sorts stuff
 */
const defaultSortResourceSections = ( { resource: resourceA }, { resource: resourceB } ) => {
  const titleA = cleanStr( getResourceTitle( resourceA ) );
  const titleB = cleanStr( getResourceTitle( resourceB ) );
  if ( titleA > titleB ) {
    return 1;
  }
  return -1;

  /*
   * if ( a.type === b.type ) {
   *   if ( a.title > b.title ) {
   *     return 1;
   *   }
   *   return -1;
   * }
   * else if ( a.type > b.type ) {
   *     return 1;
   * }
   * else return -1;
   */
};

export default defaultSortResourceSections;
