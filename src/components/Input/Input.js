import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classnames from 'classnames';

/**
 * An input field that shows validation information.
 * Any normal `<input />` props can be used, such as `onChange`.
 *
 * The `<Input />` component itself does not do any validation.
 * Validation should be done externally.
 *
 * ```javascript
 *  <div>
 *    <Input label="Username" placeholder="your name here" />
 *    <Input label="Email" value="ron@hogwarts.edu" />
 *  </div>
 *  <div>
 *    <Input
 *      label="Email"
 *      value="invalid-email"
 *      valid={false}
 *      message="Bro, do you even email?"
 *    />
 *    <Input label="Password" type="password" />
 *  </div>
 * ```
 *
 */
class Input extends React.Component {
  render() {
    const { valid, message, label, id } = this.props;
    const inputProps = omit(this.props, ['label', 'valid', 'message']);

    return (
      <div className="weave-input">
        <label htmlFor={id}>{label}</label>
        <div className="input-wrapper">
          <input {...inputProps} className={classnames({ invalid: !valid })} />
          <i className={classnames('fa fa-times-circle input-icon', { show: !valid })} />
        </div>
        <span
          className={classnames('validation-message', { invalid: !valid, show: message && !valid })}
        >
          {message}
        </span>
      </div>
    );
  }
}

Input.propTypes = {
  /**
   * The label that will appear above the input field
   */
  label: PropTypes.string,
  /**
   * A message that will appear below the field; used to indicate validity.
   * This will not appear if `valid` is truthy.
   */
  message: PropTypes.any,
  /**
   * Whether or not the form value is valid. The icon will not appear when `valid` is truthy.
   */
  valid: PropTypes.bool,
};

Input.defaultProps = {
  valid: true,
};

export default Input;
