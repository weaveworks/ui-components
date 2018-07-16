/* eslint-disable react/jsx-no-bind */
import React from 'react';

import { Example } from '../../utils/example';

import { Menu, MenuItem } from '.';

export default class Name extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { activeItem: null };
  }

  handleItemClick = item => {
    this.setState({ activeItem: item });
    this.props.clickHandler('onClick', item);
  };

  isActive = item => item === this.state.activeItem;

  render() {
    return (
      <div>
        <Example>
          <Menu>
            <MenuItem
              active={this.isActive('Item 1')}
              onClick={this.handleItemClick}
              text="Item 1"
            />
            <MenuItem
              active={this.isActive('Item 2')}
              onClick={this.handleItemClick}
              text="Item 2"
            />
            <MenuItem
              isSubItem
              active={this.isActive('Sub Item 1')}
              onClick={this.handleItemClick}
              text="Sub Item 1"
            />
            <MenuItem
              isSubItem
              active={this.isActive('Sub Item 2')}
              onClick={this.handleItemClick}
              text="Sub Item 2"
            />
          </Menu>
        </Example>
      </div>
    );
  }
}
