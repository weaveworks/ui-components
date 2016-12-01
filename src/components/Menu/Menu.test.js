import React from 'react';
import { mount } from 'enzyme';
import expect, { createSpy } from 'expect';

import Menu from './Menu';
import MenuItem from './MenuItem';

describe('<Menu />', () => {
  let menu, spy;

  beforeEach(() => {
    spy = createSpy();
    menu = mount(
      <Menu>
        <MenuItem onClick={spy} text="Item 1" />
      </Menu>
    );
  });
  it('return the menu text onClick', () => {
    menu.childAt(0).simulate('click');
    expect(spy).toHaveBeenCalledWith('Item 1');
  });
});
