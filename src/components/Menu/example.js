import React from 'react';
import {Menu, MenuItem} from '.';

export default function MenuExample({clickHandler}) {
  return (
    <Menu>
      <MenuItem onClick={clickHandler} text="Item 1" />
      <MenuItem onClick={clickHandler} text="Item 2" />
    </Menu>
  );
}
