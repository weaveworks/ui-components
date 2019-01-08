import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { noop, omit } from 'lodash';

import {
  borderRadius,
  boxShadow,
  fontSize,
  spacing,
} from '../../theme/selectors';
import { fromAtoms } from '../../utils/theme';

const StyledButton = styled('button')`
  /* Display & Box Model */
  height: 36px;
  min-width: 80px;
  padding: 0 ${spacing('small')};
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
   * Turn the button red to indicate something bad might happen
   */
  danger: PropTypes.bool,
  /**
   * Disable the button.
   */
  disabled: PropTypes.bool,
  /**
   * Callback that will be run when the button is clicked.
   */
  onClick: PropTypes.func,
  /**
   * Render the button in blue700 (useful for CTAs)
   */
  primary: PropTypes.bool,
  /**
   * Add styling to show the button as selected
   */
  selected: PropTypes.bool,
  /**
   * Text that will be used as the button label.
   * If this props is provided, it will be passed back to the `onClick` handler
   */
  text: PropTypes.string,
  /**
   * The type of button, as it relates to <form> components
   */
  type: PropTypes.string,
};

Button.defaultProps = {
  danger: false,
  disabled: false,
  onClick: noop,
  primary: false,
  selected: false,
  text: 'Submit',
  type: 'submit',
};

export default Button;
