import React from 'react';

/**
 * A button that will run a callback on click
 * ```javascript
 *  <Button onClick={alert('hai!')}>Submit</Button>
 * ```
 */
const Button = (props) => {
  const { children, className, onClick } = props;
  const cl = className ? `weave-button ${className}` : 'weave-button';
  return (
    <button {...props} onClick={onClick} className={cl}>
      {children}
    </button>
  );
};

Button.propTypes = {
  /**
 * Callback that will be run when the button is clicked.
 */
  onClick: React.PropTypes.func.isRequired
};

Button.defaultProps = {
  children: 'Submit'
};

export default Button;
