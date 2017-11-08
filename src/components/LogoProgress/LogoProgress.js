/* eslint-disable */
import React from 'react';

/**
 * Intederminate spinner used for page-level loading eg. login, logout
 * ```javascript
 * import React from 'react';
 * import { LogoProgress } from 'weaveworks-ui-components'
 *
 * React.render(
 *   <LogoProgress />
 * );
 * ```
 */
class LogoProgress extends React.Component {
  render() {
    const {size = 150} = this.props;
    const styles = {
      width: size,
      height: size
    };

    return (
      <div style={styles}>
        <div className="weave-logo-progress">
        <svg>
        <g>
          <path className="st0 a" d="M43.2,54.1L1.1,91.7c1.9,7.6,4.9,14.7,8.9,21.1l33.2-29.7V54.1z"/>
          <path className="st1 b" d="M83.5,119.9L83.5,119.9l-21.7,19.4v7.9c3.6,0.5,7.3,0.8,11.1,0.8c4.4,0,8.7-0.4,12.9-1.1l58-51.8
            c2-6.7,3-13.7,3-21c0-3.4-0.3-6.8-0.7-10.1L83.5,119.9z"/>
          <path className="st2 c" d="M38.5,139.2l103.7-92.6c-2.8-6.9-6.6-13.4-11.2-19.1l-109,99.7L38.5,139.2z"/>
          <path className="st1 d" d="M83.7,147.2V0.8C80.2,0.3,76.7,0,73.1,0C69.3,0,65.6,0.3,62,0.8v146.3L83.7,147.2z"/>
          <path className="st0 e" d="M43.2,83.2l75.4-67.4c-6-4.7-12.7-8.5-20-11.2L43.2,54.1V83.2z"/>
          <path className="st2 f" d="M43.2,109.8v-4.3V6.2c-8.1,3.6-15.4,8.5-21.7,14.6v106.4c4.9,4.7,10.4,8.8,16.4,12l0,0L43.2,109.8z"/>
        </g>
        </svg>
        </div>
      </div>
    );
  }
}

export default LogoProgress;
