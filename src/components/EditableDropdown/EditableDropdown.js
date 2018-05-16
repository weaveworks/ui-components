import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';


const TextBox = styled.input`
  margin-top: 2px;
  padding: 6px;
  font-size: 14px;
  width: 88%;
  outline-color: ${props => (props.changed ? 'orange' : 'default')};
  border: none;
  z-index: 10;
  position: absolute;
  top: 0.75em;
  left: 0.75em;

  &:focus {
    outline: none; 
  }
`;

const WideDropdown = Dropdown.extend`
  &:focus {
    outline-color: ${props => (props.changed ? 'orange' : 'default')};
    outline-offset: -2px;
    outline-style: auto;
    outline-width: 5px;
  }
`;

class EditableDropdown extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.dropdown = null;

    this.state = {
      currentValue: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setDropdownRef = this.setDropdownRef.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  setDropdownRef = ref => {
    this.dropdown = ref;
  }

  handleChange(ev, value) {
    if (this.props.onChange) {
      this.props.onChange(ev, value);
    }

    this.setState({
      currentValue: value,
    });
  }

  handleFocus() {
    if (this.props.onFocus) {
        this.props.onFocus();
    }
    if (this.dropdown) {
      this.dropdown.handleClick();
    }
  }

  handleInputChange(event) {
    this.setState({
      currentValue: event.target.value,
    });
  }

  render () {
    return (
      <div style={{position: "relative"}}>
        <TextBox type="text" onFocus={this.handleFocus} value={this.state.currentValue} onChange={this.handleInputChange} />
        <WideDropdown className={this.props.className} innerRef={this.setDropdownRef} onChange={this.handleChange} items={this.props.items}/>
      </div>
    );
  }
}

const itemPropType = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
});

EditableDropdown.propTypes = {
  /**
   * Array of items (or groups of items) that will be selectable.
   * `value` should be an internal value,
   * `label` is what will be displayed to the user.
   */
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.arrayOf(itemPropType), itemPropType]))
    .isRequired,
  /**
   * A handler function that will run when a value is selected.
   */
  onChange: PropTypes.func,
  /**
   * A handler function that will run when a textbox has focus .
   */
  onFocus: PropTypes.func,
}
export default EditableDropdown;
