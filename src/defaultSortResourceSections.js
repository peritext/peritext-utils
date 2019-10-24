const defaultSortResourceSections = ( a, b ) => {
  if ( a.type === b.type ) {
    if ( a.title > b.title ) {
      return 1;
    }
    return -1;
  }
  else if ( a.type > b.type ) {
      return 1;
  }
  else return -1;
};

export default defaultSortResourceSections;
