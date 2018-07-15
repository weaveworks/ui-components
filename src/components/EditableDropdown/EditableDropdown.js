import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';


const TextBox = styled.input`
  margin-top: 2px;
  padding: 6px;
  font-size: 14px;
  width: 240px;
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

  handleChange(ev, value, label) {
    if (this.props.onChange) {
      this.props.onChange(ev, value, label);
    }

    this.setState({
      currentValue: label,
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
      currentValue: event.target.label,
    });
  }

  render () {
    return (
      <div style={{position: "relative"}}>
        <TextBox type="text" onFocus={this.handleFocus} value={this.state.currentValue} onChange={this.handleInputChange} placeholder={this.props.placeholder} />
        <Dropdown className={this.props.className} innerRef={this.setDropdownRef} onChange={this.handleChange} items={this.props.items}/>
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
   * A handler function that will run when a textbox has focus.
   */
  onFocus: PropTypes.func,
  /**
   * The initial text that will be display before a user selects an item.
   */
  placeholder: PropTypes.string,
}
export default EditableDropdown;
