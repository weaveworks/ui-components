import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.button.attrs({
  nature: (props) => {
    if (props.disabled) return 'disabled';
    if (props.primary) return 'primary';
    if (props.danger) return 'danger';
    return 'default';
  }
})`
  /* Display & Box Model */
  height: 36px;
  min-width: 90px;
  padding: 0 12px;
  border: 0;
  outline: none;
  box-shadow: ${props => (props.selected ? props.theme.boxShadow.selected : props.theme.boxShadow.light)};

  /* Color */
  background: ${props => props.theme.atoms.Button[props.nature].background};
  color: ${props => props.theme.atoms.Button[props.nature].color};

  /* Text */
  font-size: ${props => props.theme.fontSizes.medium};
  text-transform: uppercase;

  /* Other */
  cursor: pointer;

  /* Pseudo-selectors */
  &:hover {
    transition: color .3s ease;
    background: ${props => props.theme.atoms.Button[props.nature].hoverBackground};
    color: ${props => props.theme.atoms.Button[props.nature].hoverColor};
  }
`;

/**
 * A button that will run a callback on click
 * ```javascript
 *  <Button onClick={alert} text="Submit" />
 * ```
 */

const Button = ({ children, text, onClick, ...props }) => (
  <StyledButton {...props} onClick={e => onClick(e, text)}>
    {children || text}
  </StyledButton>
);

Button.propTypes = {
  /**
 * Callback that will be run when the button is clicked.
 */
  onClick: PropTypes.func,
  /**
 * Text that will be used as the button label.
 * If this props is provided, it will be passed back to the `onClick` handler
 */
  text: PropTypes.string,
  /**
 * Disable the button.
 */
  disabled: PropTypes.bool,
  /**
   * Render the button in $turquoise (useful for CTAs)
   */
  primary: PropTypes.bool,
  /**
   * Add styling to show the button as selected
   */
  selected: PropTypes.bool,
  /**
   * Turn the button red to indicate something bad might happen
   */
  danger: PropTypes.bool,
  /**
   * The type of button, as it relates to <form> components
   */
  type: PropTypes.string,

  nature: PropTypes.string,
};

Button.defaultProps = {
  text: 'Submit',
};

export default Button;
