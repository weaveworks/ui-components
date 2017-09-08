import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { withTheme } from '../../utils';

import Button from './Button';

describe('<Button />', () => {
  describe('snapshots', () => {
    it('renders default', () => {
      const tree = renderer.create(withTheme(<Button text="Submit" />)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders disabled', () => {
      const tree = renderer.create(withTheme(<Button disabled text="Disabled" />)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders primary', () => {
      const tree = renderer.create(withTheme(<Button primary text="Primary" />)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders selected', () => {
      const tree = renderer.create(withTheme(<Button selected text="Selected" />)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders danger', () => {
      const tree = renderer.create(withTheme(<Button danger text="Danger" />)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('runs the callback with the text prop', () => {
    const spy = jest.fn();
    const button = shallow(<Button onClick={spy} text="MyCustomText" />);
    button.simulate('click');
    expect(spy.mock.calls[0][1]).toBe('MyCustomText');
  });
  it('does not run the onClick callback when disabled', () => {
    const spy = jest.fn();
    const button = shallow(<Button onClick={spy} text="MyCustomText" disabled />);
    button.simulate('click');
    expect(spy.mock.calls.length).toEqual(0);
  });
  it('is okay when no onClick callback is provided', () => {
    const button = shallow(<Button text="MyCustomText" disabled />);
    // Should not throw
    button.simulate('click');
  });
  it('accepts a style prop', () => {
    const tree = renderer.create(withTheme(<Button style={{ color: 'blue' }} />)).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
