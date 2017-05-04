/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Size is set in px
 * ```javascript
 * import React from 'react';
 * import { CircularProgress } from 'weaveworks-ui-components'
 *
 * React.render(
 *   <CircularProgress size={45} />
 * );
 * ```
 */
class CircularProgress extends React.Component {
  render() {
    const {size} = this.props;
    const styles = {
      width: size,
      height: size
    };

    return (
      <div className="weave-circular-progress-wrapper" style={styles}>
        <div className="weave-circular-progress"><div></div></div>
      </div>
    );
  }
}



CircularProgress.propTypes = {
  /**
  * Size of spinner in px
  */
  size: PropTypes.number
};

CircularProgress.defaultProps = {
  size: 30
};

export default CircularProgress;
