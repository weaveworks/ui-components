import React from 'react';
import { mount } from 'enzyme';
import expect, { createSpy } from 'expect';

import Menu from './Menu';
import MenuItem from './MenuItem';

describe('<Menu />', () => {
  let menu, selectSpy;

  beforeEach(() => {
    selectSpy = createSpy();
    menu = mount(
      <Menu>
        <MenuItem onClick={selectSpy} text="Item 1" />
        <MenuItem text="Sub Menu">
          <MenuItem onClick={selectSpy} text="Sub Menu Item" />
        </MenuItem>
      </Menu>
    );
  });
  it('return the menu text onClick', () => {
    menu.at(0).simulate('click');
    expect(selectSpy).toHaveBeenCalledWith('Item 1');
  });
  it('renders sub menu items', () => {
    const submenu = menu.at(1).at(0);
    submenu.simulate('click');
    expect(submenu.text()).toEqual('Sub Menu Link');
    expect(submenu.hasClass('weave-sub-menu')).toBe(true);
    expect(selectSpy).toHaveBeenCalledWith('Sub Menu Item');
  });
});
