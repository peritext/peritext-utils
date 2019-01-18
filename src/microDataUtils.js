/**
 * Utils - Collection of utils for formatting scholarly citations in html+schema+RDFa+COiNS elements
 * @module utils/microDataUtils
 */
// import resourceToCslJSON from './resourceToCslJSON';

/**
 * Translates a peritext bibType to a schema.org Type
 * @param {string} bib - the peritext bibType
 * @return {string} SchemaType - the corresponding SchemaType
 */
export const bibToSchema = ( bib ) => {
  switch ( bib ) {
  case 'book':
    return 'Book';
  case 'article':
    return 'ScholarlyArticle';
  case 'booklet':
    return 'CreativeWork';
  case 'conference':
    return 'Chapter';
  case 'incollection':
    return 'Chapter';
  case 'inherits':
    return 'Chapter';
  case 'inbook':
    return 'Chapter';
  case 'mastersthesis':
    return 'Thesis';
  case 'phdthesis':
    return 'Thesis';
  case 'proceedings':
    return 'Book';
  case 'image':
    return 'ImageObject';
  case 'online':
    return 'WebSite';
  case 'vectorsImage':
    return 'ImageObject';
  case 'tabularData':
    return 'Dataset';
  case 'video':
    return 'VideoObject';
  case 'audio':
    return 'AudioObject';
  case 'person':
    return 'Person';
  case 'place':
    return 'Place';
  case 'organization':
    return 'Organization';
  // not very accurate
  case 'artefact':
    return 'Product';
  // no schematype for these ones (too abstract)
  case 'topic':
  case 'concept':
  case 'technology':
    return 'Thing';
  default:
    return 'CreativeWork';
  }
};

/*
 * Context Objects in Spans (COiNS) related functions
 */

const addPropToCOinSData = ( key, value ) => {
  return {
    key,
    value
  };
};

const urify = ( key, value ) => {
  return `${key }=${ encodeURIComponent( value )}`;
};

const assembleUri = ( infos = [] ) => {
  const vals = [];
  infos.forEach( function( info ) {
    vals.push( urify( info.key, info.value ) );
  } );
  return vals.join( '&amp;' );
};

const baseMap = {
  // 'dc:title': 'title',
  // 'dc:btitle': 'title',
  'rft.date': 'date',
  'rft.pages': 'pages',
  'rft.issn': 'ISSN',
  'rft.isbn': 'ISBN',
  'rft_id': 'URL',
  'rft.place': 'address',
  'rft.pub': 'publisher',
  'rft.atitle': 'title',
};

const journalMap = {
  'rft.atitle': 'title',
  'rft.jtitle': 'journal',
  'rft.volume': 'volume',
  'rft.issue': 'issue',
};

const bookMap = {
  'rft.btitle': 'title',
};

const chapterMap = {
  'rft.atitle': 'title',
  'rft.btitle': 'booktitle'
};

const translate = ( data, item, map ) => {
  for ( const key in map ) {
    if ( item[map[key]] ) {
      data.push( addPropToCOinSData( key, item[map[key]] ) );
    }
  }
  return data;
};

/**
 * Generates an openUrl URI describing the resource, and aimed at being used in a ContextObjectInSpan (COinS)
 * @param {Object} resource - the resource to describe with an openUrl
 * @return {string} uri - the uri describing the resource
 */
export const generateOpenUrl = ( citations = [] ) => {

  /**
   * Docs : https://groups.niso.org/apps/group_public/download.php/14833/z39_88_2004_r2010.pdf
   * https://github.com/citation-style-language/schema/blob/master/csl-data.json
   * https://en.wikipedia.org/wiki/Module_talk:Citation/CS1/COinS
   */
  if ( !citations.length ) {
    return '';
  }
  const citation = citations[0];
  let data = [];
  data.push( addPropToCOinSData( 'ctx_ver', 'Z39.88-2004' ) );
  data.push( addPropToCOinSData( 'url_ver', 'Z39.88-2004' ) );
  // data.push( addPropToCOinSData( 'url_ctx_fmt', 'info:ofi/fmt:kev:mtx:ctx' ) );
  if (citation.issued && citation.issued['date-parts'] && citation.issued['date-parts'].length) {
    data.push( addPropToCOinSData( 'rft.date', citation.issued['date-parts'][0] ) );
  }

  if ( citation.author && citation.author.length ) {
    citation.author.forEach( function( author ) {
      const auth = `${author.given } ${ author.family}`;
      data.push( addPropToCOinSData( 'rft.au', auth ) );
      data.push( addPropToCOinSData( 'dc:creator', auth ) );
    } );
  }
  data = translate( data, citation, baseMap );
  if ( citation.type === 'article' ) {
    data = translate( data, citation, journalMap );
    data.push( addPropToCOinSData( 'rft.genre', 'article' ) );
    data.push( addPropToCOinSData( 'rft_val_fmt', 'info:ofi/fmt:kev:mtx:journal' ) );
  }
  else if ( citation.type === 'dissertation' ) {
    data = translate( data, citation, bookMap );
    // data.push( addPropToCOinSData( 'rft.genre', 'book' ) );
    data.push( addPropToCOinSData( 'rft_val_fmt', 'info:ofi/fmt:kev:mtx:dissertation' ) );
  }
  else if ( citation.type === 'book' ) {
    data = translate( data, citation, bookMap );
    data.push( addPropToCOinSData( 'rft.genre', 'book' ) );
    data.push( addPropToCOinSData( 'rft_val_fmt', 'info:ofi/fmt:kev:mtx:book' ) );
  }
  else if ( citation.type === 'proceedings' ) {
    data = translate( data, citation, journalMap );
    data.push( addPropToCOinSData( 'rft.genre', 'proceeding' ) );
    data.push( addPropToCOinSData( 'rft_val_fmt', 'info:ofi/fmt:kev:mtx:journal' ) );
  } else if ( citation.type === 'conferencePaper') {
    data = translate( data, citation, journalMap );
    data.push( addPropToCOinSData( 'rft.genre', 'conference' ) );
    data.push( addPropToCOinSData( 'rft_val_fmt', 'info:ofi/fmt:kev:mtx:journal' ) );
  }
  else if ( citation.type === 'chapter' ) {
    data = translate( data, citation, chapterMap );
    data.push( addPropToCOinSData( 'rft.genre', 'bookitem' ) );
    data.push( addPropToCOinSData( 'rft_val_fmt', 'info:ofi/fmt:kev:mtx:book' ) );
  }
  else {
    data.push( addPropToCOinSData( 'rft.genre', 'unknown' ) );
    data.push( addPropToCOinSData( 'rft_val_fmt', 'info:ofi/fmt:kev:mtx:journal' ) );
  }
  console.log(citation, assembleUri(data))
  return assembleUri( data );
};
