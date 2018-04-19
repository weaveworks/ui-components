import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const GridColumnWrapper = styled.div`
  width: ${props => props.span / 0.12}%;
  display: block;
  margin: 0.5em;
  float: left;

  /* clearfix */
  &:after {
    display: table;
    clear: both;
    content: '';
  }
`;

/**
 * A child of the `<Grid />` component. Used for building layouts.
 *
 * See also [Grid](/components/Grid)
 */
const GridColumn = ({ children, span }) => (
  <GridColumnWrapper className="weave-grid-column" span={span}>
    {children}
  </GridColumnWrapper>
);

GridColumn.propTypes = {
  /**
   * The desired col-span; maximum of 12 columns
   */
  span: PropTypes.number,
};

export default GridColumn;
