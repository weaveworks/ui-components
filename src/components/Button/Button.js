import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled('button')`
  /* Display & Box Model */
  height: 36px;
  min-width: 90px;
  padding: 0 12px;
  border: 0;
  outline: none;
  box-shadow: ${props => (props.styled.selected ? props.theme.boxShadow.selected : props.theme.boxShadow.light)};

  /* Color */
  background: ${props => props.theme.atoms.Button[props.styled.type].background};
  color: ${props => props.theme.atoms.Button[props.styled.type].color};

  /* Text */
  font-size: ${props => props.theme.fontSizes.normal};
  text-transform: uppercase;

  /* Other */
  cursor: pointer;

  /* Pseudo-selectors */
  &:hover {
    transition: color .3s ease;
    background: ${props => props.theme.atoms.Button[props.styled.type].hoverBackground};
    color: ${props => props.theme.atoms.Button[props.styled.type].hoverColor};
  }
`;

/**
 * A button that will run a callback on click
 * ```javascript
 *  <Button onClick={alert} text="Submit" />
 * ```
 */

const Button = ({ children, text, onClick, type, primary, disabled, danger, selected }) => (
  <StyledButton
    disabled={disabled}
    onClick={e => onClick(e, text)}
    type={type}
    styled={{
      selected,
      type: (disabled && 'disabled') || (primary && 'primary') || (danger && 'danger') || 'default',
    }}
  >
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
};

Button.defaultProps = {
  text: 'Submit',
};

export default Button;
