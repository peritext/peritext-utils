import resourceSchema from 'peritext-schemas/resource';
import objectPath from 'object-path';

const getResourceTitle = ( resource ) => {
  const titlePath = objectPath.get( resourceSchema, [ 'definitions', resource.metadata.type, 'titlePath' ] );
  const title = titlePath ? objectPath.get( resource, titlePath ) : resource.metadata.title;
  return title || '';
};

export default getResourceTitle;
