
const buildHTMLMetadata = ( production = { metadata: {} } ) => {
  const title = production.metadata.title ? `
    <title>${production.metadata.title}</title>
    <meta name="DC.Title" content="${production.metadata.title}"/>
    <meta name="twitter:title" content="${production.metadata.title}" />
    <meta name="og:title" content="${production.metadata.title}" />
  ` : '<title>Quinoa production</title>';
  const description = production.metadata.abstract ? `
    <meta name="description" content="${production.metadata.abstract}"/>
    <meta name="DC.Description" content="${production.metadata.abstract}"/>
    <meta name="og:description" content="${production.metadata.abstract}" />
    <meta name="twitter:description" content="${production.metadata.abstract}" />
  ` : '';
  const authors = production.metadata.authors && production.metadata.authors.length
                  ?
                  production.metadata.authors.map( ( author ) => `
                    <meta name="DC.Creator" content="${`${author.given } ${ author.family}`}" />
                    <meta name="author" content="${`${author.given } ${ author.family}`}" />` )
                  : '';
  // todo: use cover image and convert it to the right base64 dimensions for the social networks
  return `
  <meta name    = "DC.Format"
          content = "text/html">
  <meta name    = "DC.Type"
          content = "data production">
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@peritext" />
  <meta property="og:url" content="http://www.peritext.github.io" />
  <meta name="og:type" content="website" />
  ${title}
  ${authors}
  ${description}
`;
};

export default buildHTMLMetadata;
