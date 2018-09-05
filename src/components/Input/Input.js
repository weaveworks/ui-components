import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { omit, noop } from 'lodash';
import styled, { css } from 'styled-components';

const placeholder = (property, content) => css`
  &::-webkit-input-placeholder {
    ${property}: ${content};
  }
  &::-moz-placeholder {
    ${property}: ${content};
  }
  &:-moz-placeholder {
    ${property}: ${content};
  }
  &:-ms-input-placeholder {
    ${property}: ${content};
  }
`;

const Icon = styled.i`
  position: absolute;
  right: 10px;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.orange600};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 10px;
  height: 36px;

  input {
    ${props => placeholder('color', props.theme.colors.gray600)};
    padding-right: ${props => (props.valid ? '12px' : '38px')};
    padding-left: 12px;
    width: 100%;
    line-height: 36px;
    box-shadow: none;
    border: 1px solid ${props => props.theme.colors.gray600};
    border-radius: ${props => props.theme.borderRadius.soft};
    height: 36px;
    box-sizing: border-box;

    &:disabled {
      ${placeholder('opacity', 0.5)};
      background-color: ${props => props.theme.colors.gray50};
    }
  }
`;

const StyledInput = component => styled(component)`
  padding: 8px;
`;

const ValidationMessage = styled.span`
  display: ${props => (props.remove || !props.visible ? 'none' : 'block')};
  padding-left: 8px;
  margin-top: 8px;
  font-size: ${props => props.theme.fontSizes.small};
  text-align: left;
  color: ${props => (props.valid ? 'inherit' : props.theme.colors.orange600)};
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
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
      className,
      hideValidationMessage,
      id,
      inputRef,
      label,
      message,
      textarea,
      valid,
      ...inputProps
    } = this.props;

    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <InputWrapper valid={valid}>
          {React.createElement(textarea ? 'textarea' : 'input', {
            ...omit(inputProps, 'autoSelectText', 'focus'),
            ref: elem => {
              this.input = elem;
              inputRef(elem);
            },
          })}
          <Icon visible={!valid} className="fa fa-times-circle" />
        </InputWrapper>
        <ValidationMessage
          remove={hideValidationMessage}
          valid={valid}
          visible={message && !valid}
        >
          {message}
        </ValidationMessage>
      </div>
    );
  }
}

Input.propTypes = {
  /*
   * Select the text inside the input. Requires focus attribute to be true
   */
  autoSelectText: PropTypes.bool,
  /*
   * Focus the input on render
   */
  focus: PropTypes.bool,
  /*
   * Remove the validation message from the DOM
   */
  hideValidationMessage: PropTypes.bool,
  /**
   * A callback to which the input `ref` will be passed.
   */
  inputRef: PropTypes.func,
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
   * Callback to run when the input is edited by the user
   */
  onChange: PropTypes.func,
  /**
   * Use a `textarea` element instead of an `input` element
   */
  textarea: PropTypes.bool,
  /**
   * Whether or not the form value is valid. The icon will not appear when `valid` is truthy.
   */
  valid: PropTypes.bool,
};

Input.defaultProps = {
  autoSelectText: false,
  focus: false,
  hideValidationMessage: false,
  inputRef: noop,
  label: '',
  message: '',
  onChange: noop,
  textarea: false,
  valid: true,
};

export default StyledInput(Input);
