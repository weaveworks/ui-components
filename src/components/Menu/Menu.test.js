import React from 'react';
import { mount } from 'enzyme';

import Menu from './Menu';
import MenuItem from './MenuItem';

describe('<Menu />', () => {
  let menu, spy;

  beforeEach(() => {
    spy = jest.fn();
    menu = mount(
      <Menu>
        <MenuItem onClick={spy} text="Item 1" />
      </Menu>
    );
  });
  it('return the menu text onClick', () => {
    menu.childAt(0).simulate('click');
    expect(spy).toBeCalledWith('Item 1');
  });
  it('should show the active menu item', () => {
    menu = mount(
      <Menu>
        <MenuItem text="Item 1" />
        <MenuItem active text="Item 2" />
      </Menu>
    );
    expect(menu.childAt(1).find('.weave-menu-item').hasClass('menu-item-active')).toBe(true);
  });
});
