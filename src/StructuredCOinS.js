import React from 'react';
import { PropTypes } from 'prop-types';
import { generateOpenUrl, resourceToCslJSON } from './index';

// let styles = {};

/**
 * dumb component for rendering the structured representation of a cited element in the format of openUrl/Context Object in Span
 */
export default class StructuredCOinS extends React.Component {/* eslint react/prefer-stateless-function : 0 */

  /**
   * propTypes
   */
  static propTypes = {
    cslRecord: PropTypes.object,
    resource: PropTypes.object
  };

  static defaultProps = {
  };

  shouldComponentUpdate = () => true;

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    let openUrl;
    if ( this.props.resource ) {
      openUrl = generateOpenUrl( resourceToCslJSON( this.props.resource ) );
    }
    else if ( this.props.cslRecord ) {
      openUrl = generateOpenUrl( [ this.props.cslRecord ] );
    }
    else {
      return null;
    }
    return (
      <span
        className={ 'peritext-structured-context-object-in-span-container Z3988' }
        title={ openUrl }
      />
    );
  }
}
