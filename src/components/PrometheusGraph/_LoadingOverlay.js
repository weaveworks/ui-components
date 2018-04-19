import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CircularProgress from '../CircularProgress';

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 90px;
  box-sizing: border-box;
`;

class LoadingOverlay extends React.PureComponent {
  render() {
    if (!this.props.loading) return null;

    return (
      <LoadingContainer>
        <CircularProgress center size={30} />
      </LoadingContainer>
    );
  }
}

LoadingOverlay.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default LoadingOverlay;
