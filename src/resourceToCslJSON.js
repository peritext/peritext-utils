
/**
 * Transform a resource object into csl json formatted resource
 * @param {obj} resource
 * @return {obj} csl-json object
 */
export default function resourceToCslJSON ( resource ) {
  if ( !resource || !resource.metadata ) {
    return [];
  }
  const {
    metadata = {},
    data = {}
  } = resource;
  const { type } = metadata;
  let cslType;
  if ( type === 'bib' ) {
    if ( Array.isArray( resource.data ) ) {
      return resource.data;

      /**
       * @todo I had to do that, investigate where it comes from
       * (bib data being a map instead of an array)
       */
    }
 else return [ resource.data[Object.keys( resource.data )[0]] ];
  }
  switch ( type ) {
    case 'video':
      cslType = 'broadcast';
      break;
    case 'data-presentation':
      cslType = 'dataset';
      break;
    case 'dicto':
      cslType = 'interview';
      break;
    case 'webpage':
      cslType = 'webpage';
      break;
    case 'embed':
      cslType = 'misc';
      break;
    case 'table':
      cslType = 'dataset';
      break;
    case 'image':
      cslType = 'graphic';
      break;
    default:
      cslType = 'misc';
      break;
  }
  const cslData = {
    type: cslType,
    title: metadata.title,
    id: resource.id,
    URL: metadata.URL || data.url,
    abstract: metadata.description,
    issued: metadata.date && { raw: metadata.date },
    author: (
              metadata.authors &&
              Array.isArray( metadata.authors ) &&
              metadata.authors.map( ( author ) => {
                if ( typeof author === 'string' ) {
                  return { family: author };
                }
                return author;
              } )
            ) || []
  };
  return [ cslData ];
}
