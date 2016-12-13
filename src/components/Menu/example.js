/* eslint-disable react/jsx-no-bind*/
import React from 'react';
import {Menu, MenuItem} from '.';

export default function MenuExample({clickHandler}) {
  return (
    <Menu>
      <MenuItem onClick={clickHandler.bind(this, 'onClick')} text="Item 1" />
      <MenuItem onClick={clickHandler.bind(this, 'onClick')} text="Item 2" />
      <MenuItem
        onClick={clickHandler.bind(this, 'onClick')}
        className="weave-menu-sub-item" text="Sub Item 1"
      />
      <MenuItem
        onClick={clickHandler.bind(this, 'onClick')}
        className="weave-menu-sub-item" text="Sub Item 2"
      />
    </Menu>
  );
}
