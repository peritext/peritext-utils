import buildCitations from './buildCitations';
import buildBibliography from './buildBibliography';
import buildGlossary from './buildGlossary';

const preprocessEditionData = ( { production, edition } ) => {
  const citations = buildCitations( { production, edition }, true );

  const { plan: { summary = [] } } = edition.data;
  const blocks = summary.reduce( ( res, block ) => {
    const { id, data, type } = block;
    let result;
    switch ( type ) {
      case 'references':
        result = buildBibliography( {
          production,
          edition,
          citations,
          options: data
        } );
        return {
          ...res,
          [id]: {
            bibliographyData: result
          }
        };
        case 'glossary':
            result = buildGlossary( {
              production,
              edition,
              options: data
            } );
            return {
              ...res,
              [id]: {
                glossaryData: result
              }
            };
      default:
        return res;
    }
  }, {} );
  return {
    global: {
      citations
    },
    blocks
  };
};

export default preprocessEditionData;
