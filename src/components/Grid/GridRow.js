import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const GridRowWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;

  ${props => props.align === 'left' && 'justify-content: flex-start;'};
  ${props => props.align === 'right' && 'justify-content: flex-end;'};
  ${props => props.align === 'center' && 'justify-content: center;'};
`;

/**
* A row element that will flex children and align them to the left, center or right.
*/
const GridRow = ({ alignContent, children }) => (
  <GridRowWrapper className="weave-grid-row" align={alignContent}>
    {children}
  </GridRowWrapper>
);

GridRow.propTypes = {
  /**
   * The direction in which to justify content. Should be 'left', 'center', or 'right';
  */
  alignContent: PropTypes.string
};

export default GridRow;
