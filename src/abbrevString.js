import trunc from 'unicode-byte-truncate';

const abbrevString = ( str = '', maxLength = 30 ) => {
  if ( str.length > maxLength ) {
   return `${trunc( str, maxLength ) }...`;
  }
  return str;
};

export default abbrevString;
