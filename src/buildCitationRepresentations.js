import CSL from 'citeproc';

const buildCitationRepresentations = ( {
  locale,
  style,

  items = {},
  citations = [],
} ) => {

  const sys = {
    retrieveLocale: () => {
      return locale;
    },
    retrieveItem: ( id ) => {
      return items[id];
    },
    variableWrapper: ( params, prePunct, str, postPunct ) => {
      if ( params.variableNames[0] === 'title'
          && params.itemData.URL
          && params.context === 'bibliography' ) {
        return `${prePunct}<a href="${params.itemData.URL}" target="blank">${str}</a>${postPunct}`;
      }
      else if ( params.variableNames[0] === 'URL' ) {
        return `${prePunct}<a href="${str}" target="blank">${str}</a>${postPunct}`;
      }
      else {
        return ( prePunct + str + postPunct );
      }
    }
  };

  const processor = new CSL.Engine( sys, style );
  return citations.reduce( ( inputCitations, citationData ) => {
    const activeCitations = { ...inputCitations };
    const citation = citationData[0];
    const citationsPre = citationData[1];
    const citationsPost = citationData[2];
    let citationObjects = processor.processCitationCluster( citation, citationsPre, citationsPost );
    citationObjects = citationObjects[1];
    citationObjects.forEach( ( cit ) => {
      const order = cit[0];
      const html = cit[1];
      // const ThatComponent = htmlToReactParser.parse(cit[1]);
      const citationId = cit[2];
      activeCitations[citationId] = {
        order,
        html,
        // Component: ThatComponent
      };
    } );
    return activeCitations;
  }, {} );

};

export default buildCitationRepresentations;
