import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * A button that will run a callback on click
 * ```javascript
 *  <Button onClick={alert} text="Submit" />
 * ```
 */

class Button extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ev) {
    if (this.props.onClick) {
      this.props.onClick(ev, this.props.text);
    }
  }

  render() {
    const {
      children,
      className,
      text, disabled,
      style,
      primary,
      selected,
      danger,
      type,
    } = this.props;

    const cl = classnames('weave-button', { primary, selected, danger });
    return (
      <button
        style={style}
        disabled={disabled}
        onClick={this.handleClick}
        className={className || cl}
        type={type}
      >
        {children || text}
      </button>
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
  text: 'Submit'
};

export default Button;
