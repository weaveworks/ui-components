import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Styled = component => styled(component)``;

/**
 * A tab component for use within a TabSelect component.
 *  * See also:
 * [TabSelect](/components/tabselect)
 */

class Tab extends React.PureComponent {
  render() {
    const { className, children } = this.props;
    return <div className={className}>{children}</div>;
  }
}

Tab.propTypes = {
  /**
   * The label of the tab. This will appear in the TabSelect navigation section
   */
  label: PropTypes.string.isRequired,
  /**
   * A unique identifier for this tab
   */
  name: PropTypes.string.isRequired,
};

export default Styled(Tab);
