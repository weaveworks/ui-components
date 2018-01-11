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
 *   <div>
 *     <CircularProgress size={35} />
 *     <CircularProgress inline /> Inline
 *     <CircularProgress center />
 *   </div>
 * );
 * ```
 */
class CircularProgress extends React.Component {
  render() {
    const {size, inline, center} = this.props;
    const styles = {
      width: size,
      height: size
    };
    if (inline) {
      styles.display = 'inline-block';
      styles.verticalAlign = 'middle';
    }
    if (center) {
      styles.marginLeft = 'auto';
      styles.marginRight = 'auto';
    }

    return (
      <div className="weave-circular-progress-wrapper" style={styles}>
        <div className="weave-circular-progress"><div></div></div>
      </div>
    );
  }
}



CircularProgress.propTypes = {
  /** Size of spinner in px */
  size: PropTypes.number,
  /** Whether to display the spinner inline */
  inline: PropTypes.bool,
  /** Whether to center the spinner horizontally */
  center: PropTypes.bool,
};

CircularProgress.defaultProps = {
  size: 30,
  inline: false,
  center: false,
};

export default CircularProgress;
