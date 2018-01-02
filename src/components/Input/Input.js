import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import styled from 'styled-components';

const placeholder = content => `
  &::-webkit-input-placeholder {${content}}
  &:-moz-placeholder           {${content}}
  &::-moz-placeholder          {${content}}
  &:-ms-input-placeholder      {${content}}
`;

const Icon = styled.i`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  display: inline-block;
  margin-left: 4px;
  font-size: 21px;
  color: ${props => props.theme.colors.status.error};
`;

const InputWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  height: 36px;
`;

const StyledInput = component => styled(component)`
  padding: 8px;
  display: inline-block;

  input {
    ${props => placeholder(props.theme.colors.neutral.gray)};
    display: inline-block;
    padding: 0 24px;
    line-height: 36px;
    box-shadow: none;
    border: 1px solid ${props => props.theme.colors.neutral.gray};
    border-radius: ${props => props.theme.borderRadius};
  }
`;

const ValidationMessage = styled.span`
  font-size: 14px;
  padding-left: 8px;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  color: ${props => props.theme.colors.status.error};
`;

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
 *      onChange={ev => console.log(ev.target.value)}
 *    />
 *    <Input label="Password" type="password" />
 *  </div>
 * ```
 *
 */

class Input extends React.Component {
  render() {
    const { valid, message, label, id, className } = this.props;
    const inputProps = omit(this.props, ['label', 'valid', 'message', 'className']);

    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <InputWrapper>
          <input {...inputProps} />
          <Icon visible={!valid} className="fa fa-times-circle" />
        </InputWrapper>
        <ValidationMessage
          visible={message && !valid}
        >
          {message}
        </ValidationMessage>
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
  /**
   * Callback to run when the input is edited by the user
   */
  onChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
  valid: true,
};

export default StyledInput(Input);
