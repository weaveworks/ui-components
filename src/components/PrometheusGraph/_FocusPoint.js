import styled from 'styled-components';


const DeploymentAnnotationPoint = styled.span.attrs({
  style: ({ top }) => ({ top }),
})`
  border: 2.5px solid ${props => props.color || props.theme.colors.accent.blue};
  opacity: ${props => (props.faded ? 0.5 : 1)};
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  cursor: default;

  ${props => !props.hoverable && `
    pointer-events: none;
  `}

  ${props => `
    margin-left: ${-props.radius}px;
    margin-top: ${-props.radius}px;
    width: ${2 * props.radius}px;
    height: ${2 * props.radius}px;
  `}
`;

export default DeploymentAnnotationPoint;
