import resourceSchema from 'peritext-schemas/resource';
import objectPath from 'object-path';

const getResourceTitle = ( resource = {} ) => {
  const { metadata = {} } = resource;
  const titlePath = objectPath.get( resourceSchema, [ 'definitions', metadata.type, 'titlePath' ] );
  const title = titlePath ? objectPath.get( resource, titlePath ) : metadata.title;
  return title || '';
};

export default getResourceTitle;
