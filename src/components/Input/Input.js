import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const placeholder = (property, content) => `
  &::-webkit-input-placeholder {${property}: ${content};}
  &:-moz-placeholder           {${property}: ${content};}
  &::-moz-placeholder          {${property}: ${content};}
  &:-ms-input-placeholder      {${property}: ${content};}
`;

const Icon = styled.i`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  display: inline-block;
  margin-left: 4px;
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.status.error};
`;

const InputWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  height: 36px;
`;

const StyledInput = component => styled(component)`
  padding: 8px;

  input {
    ${props => placeholder(props.theme.colors.gray600)};
    display: inline-block;
    padding: 0 12px;
    line-height: 36px;
    box-shadow: none;
    border: 1px solid ${props => props.theme.colors.gray600};
    border-radius: ${props => props.theme.borderRadius.soft};
    height: 36px;
    box-sizing: border-box;

    ${props => placeholder('color', props.theme.colors.dustyGray)};
  }
`;

const ValidationMessage = styled.span`
  display: ${props => (props.remove ? 'none' : 'block')};
  font-size: ${props => props.theme.fontSizes.small};
  padding-left: 8px;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  color: ${props => (props.valid ? 'inherit' : props.theme.colors.status.error)};
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
  componentDidMount() {
    const { focus, autoSelectText, value } = this.props;
    if (focus) {
      this.getInputNode().focus();
    }
    if (autoSelectText && value) {
      this.getInputNode().setSelectionRange(0, value.length);
    }
  }

  getInputNode() {
    return ReactDOM.findDOMNode(this.input); // eslint-disable-line
  }

  render() {
    const {
      valid,
      message,
      label,
      id,
      className,
      textarea,
      hideValidationMessage,
      inputRef,
      ...inputProps
    } = this.props;

    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <InputWrapper>
          {React.createElement(textarea ? 'textarea' : 'input', {
            ...inputProps,
            ref: elem => {
              this.input = elem;

              if (inputRef) {
                inputRef(elem);
              }
            },
          })}
          <Icon visible={!valid} className="fa fa-times-circle" />
        </InputWrapper>
        <ValidationMessage remove={hideValidationMessage} valid={valid} visible={message}>
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
  onChange: PropTypes.func,
  /**
   * Use a `textarea` element instead of an `input` element
   */
  textarea: PropTypes.bool,
  /**
   * A callback to which the input `ref` will be passed.
   */
  inputRef: PropTypes.func,
};

Input.defaultProps = {
  valid: true,
};

export default StyledInput(Input);
