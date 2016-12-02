import React from 'react';

/**
 * A child of the `<Grid />` component. Used for building layouts.
 *
 * See also [Grid](/components/Grid)
 */
const GridColumn = ({children, span}) => (
  <div className={`weave-grid-column col-span-${span}`}>
    {children}
  </div>
);

GridColumn.propTypes = {
  /**
   * The desired col-span; maximum of 12 columns
   */
  span: React.PropTypes.number
};

export default GridColumn;
