import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import 'jest-styled-components';

import theme from '../../../theme';

import Button from './Button';

describe('<Button />', () => {
  describe('snapshots', () => {
    it('renders default', () => {
      const tree = renderer.create(<Button text="Submit" theme={theme} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders disabled', () => {
      const tree = renderer.create(<Button disabled text="Disabled" theme={theme} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders primary', () => {
      const tree = renderer.create(<Button primary text="Primary" theme={theme} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders selected', () => {
      const tree = renderer.create(<Button selected text="Selected" theme={theme} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders danger', () => {
      const tree = renderer.create(<Button danger text="Danger" theme={theme} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('runs the callback with the text prop', () => {
    const spy = jest.fn();
    const button = shallow(<Button onClick={spy} text="MyCustomText" />);
    button.simulate('click');
    expect(spy.mock.calls[0][1]).toBe('MyCustomText');
  });
});
