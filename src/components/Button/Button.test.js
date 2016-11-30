import React from 'react';
import { shallow } from 'enzyme';
import expect, { createSpy } from 'expect';

import Button from './Button';

describe('<Button />', () => {
  let button, spy;

  beforeEach(() => {
    spy = createSpy();
    button = shallow(
      <Button onClick={spy} />
    );
  });
  it('runs a callback', () => {
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  });
});
