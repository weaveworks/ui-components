import React from 'react';
import { mount } from 'enzyme';

import { withTheme } from '../../utils/theme';

import Menu from './Menu';
import MenuItem from './MenuItem';

describe('<Menu />', () => {
  it('return the menu text onClick', () => {
    const spy = jest.fn();
    const menu = mount(
      withTheme(
        <Menu>
          <MenuItem onClick={spy} text="Item 1" />
        </Menu>
      )
    );
    menu.find(MenuItem).simulate('click');
    expect(spy).toBeCalledWith('Item 1');
  });

  it('should show the active menu item', () => {
    const menu = mount(
      withTheme(
        <Menu>
          <MenuItem text="Item 1" />
          <MenuItem active text="Item 2" />
        </Menu>
      )
    );
    expect(
      menu
        .find('.weave-menu-item')
        .last()
        .hasClass('menu-item-active')
    ).toBe(true);
  });
});
