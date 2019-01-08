import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  color: ${props => props.theme.colors.orange600};
  opacity: ${props => (props.loading ? 0.2 : 1)};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 95px;
  box-sizing: border-box;
  text-align: center;
`;

const ErrorText = styled.span`
  border-radius: ${props => props.theme.borderRadius.soft};
  padding: 5px 10px;
  opacity: 0.75;

  ${props =>
    props.hasData &&
    `
    background-color: ${props.theme.colors.white};
  `};
`;

class ErrorOverlay extends React.PureComponent {
  render() {
    const { loading, error, hasData } = this.props;
    if (!error) return null;

    return (
      <ErrorContainer loading={loading}>
        <ErrorText hasData={hasData}>{error}</ErrorText>
      </ErrorContainer>
    );
  }
}

ErrorOverlay.propTypes = {
  error: PropTypes.string,
  hasData: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

ErrorOverlay.defaultProps = {
  error: '',
};

export default ErrorOverlay;
