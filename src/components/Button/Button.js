import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { noop, omit } from 'lodash';

import { borderRadius, boxShadow, fontSize } from '../../theme/selectors';
import { fromAtoms } from '../../utils/theme';

const StyledButton = styled('button')`
  /* Display & Box Model */
  height: 36px;
  min-width: 90px;
  padding: 0 12px;
  border: 0;
  outline: none;
  box-shadow: ${props =>
    props.styled.selected ? boxShadow('selected') : boxShadow('light')};

  /* Color */
  background: ${fromAtoms('Button', 'styled.type', 'background')};
  color: ${fromAtoms('Button', 'styled.type', 'color')};

  /* Text */
  font-size: ${fontSize('small')};

  /* Other */
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  border-radius: ${borderRadius('soft')};

  /* Pseudo-selectors */
  &:hover {
    transition: color 0.3s ease;
    background: ${fromAtoms('Button', 'styled.type', 'hoverBackground')};
    color: ${fromAtoms('Button', 'styled.type', 'hoverColor')};
  }
`;

/**
 * A button that will run a callback on click
 * ```javascript
 *  <Button onClick={alert} text="Submit" />
 * ```
 */
class Button extends React.PureComponent {
  handleClick = e => {
    const { onClick, disabled, text } = this.props;

    if (onClick && !disabled) {
      onClick(e, text);
    }
  };

  render() {
    const {
      children,
      text,
      primary,
      danger,
      selected,
      disabled,
      ...otherProps
    } = this.props;

    const buttonProps = omit(otherProps, ['onClick']);

    return (
      <StyledButton
        disabled={disabled}
        onClick={this.handleClick}
        styled={{
          selected,
          type:
            (disabled && 'disabled') ||
            (primary && 'primary') ||
            (danger && 'danger') ||
            'default',
        }}
        {...buttonProps}
      >
        {children || text}
      </StyledButton>
    );
  }
}

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
   * Render the button in blue700 (useful for CTAs)
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
  type: 'submit',
  disabled: false,
  primary: false,
  danger: false,
  selected: false,
  onClick: noop,
};

export default Button;
