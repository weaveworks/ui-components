import React from 'react';
import {Menu, MenuItem} from '.';

export default function MenuExample() {
  return (
    <Menu>
      <MenuItem onClick={selectSpy} text="Item 1" />
      <MenuItem text="Sub Menu">
        <MenuItem onClick={selectSpy} text="Sub Menu Item" />
      </MenuItem>
    </Menu>
  );
}
