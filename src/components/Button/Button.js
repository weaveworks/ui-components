import React from 'react';
import PropTypes from 'prop-types';

/**
 * A button that will run a callback on click
 * ```javascript
 *  <Button onClick={alert} text="Submit" />
 * ```
 */
import classnames from 'classnames';

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
    const { children, className, text, disabled, style, primary } = this.props;
    const cl = classnames('weave-button', { primary });
    return (
      <button
        style={style}
        disabled={disabled}
        onClick={this.handleClick}
        className={className || cl}
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
  primary: PropTypes.bool
};

Button.defaultProps = {
  text: 'Submit'
};

export default Button;
