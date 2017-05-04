import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
* A row element that will flex children and align them to the left, center or right.
*/
const GridRow = ({ alignContent, children }) => {
  const cl = classnames('weave-grid-row', {[`align-${alignContent}`]: alignContent });
  return (
    <div className={cl}>
      {children}
    </div>
  );
};

GridRow.propTypes = {
  /**
   * The direction in which to justify content. Should be 'left', 'center', or 'right';
  */
  alignContent: PropTypes.string
};

export default GridRow;
