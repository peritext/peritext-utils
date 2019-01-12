# peritext-utils

Collection of utilities for the peritext ecosystem.

Please refer to the [peritext repositories](https://github.com/peritext) to see related modules allowing to build an publishing system.

# API overview

Here is a brief overview of the utilities exposed by this package. Refer to the source code documentation to get a better documentation about each utility API.


`buildBibliography` : builds display-related data for rendering the bibliography of an edition

`buildCitations` : builds display-related data for rendering the bibliographic citations of an edition

`buildContextContent` : builds display-related data for rendering a resource's related contextualizations

`buildGlossary` : builds display-related data for rendering the glossary of an edition

`resourceToCslJSON` : converts a peritext resource into a CSL-JSON object

`generateOpenUrl` : generates an open URL out of csl-json data

`StructuredCOinS` : provides a span encoded with the Context Objects in Span / openURL specification

`getRelatedAssetsIds` : computes related ids for a given edition

`chooseAppropriateAsset` : defines the appropriate asset for rendering a contextualization based on a contextualizer's profile and a map of available assets

`chooseAppropriateSubAsset` : defines the appropriate asset for rendering a contextualization based on a contextualizer's profile and a map of available assets

`getContextualizationsFromEdition` : compute related contextualizations for an edition

`loadAssetsForEdition` : loads related assets for an edition

`buildHTMLMetadata` : builds HTML metadata for an edition

`abbrevString` : abbreviates a string if it exceeds a given maximum

`bibToSchema` : converts bibliographic data to microformat data

