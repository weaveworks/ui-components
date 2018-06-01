import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { withTheme } from '../../utils/theme';

import Alert from './Alert';

const c = renderer.create;

describe('<Alert />', () => {
  describe('snapshots', () => {
    it('should not render if visible="false"', () => {
      const tree = c(
        withTheme(<Alert visible={false}>Success</Alert>)
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders success', () => {
      const tree = c(withTheme(<Alert type="success">Success</Alert>)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders warning', () => {
      const tree = c(withTheme(<Alert type="warning">Warning</Alert>)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders error', () => {
      const tree = c(withTheme(<Alert type="error">Error</Alert>)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders default', () => {
      const tree = c(withTheme(<Alert>Default</Alert>)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
  it('closes when the "x" is clicked', () => {
    const spy = jest.fn();
    const alert = mount(withTheme(<Alert onClose={spy}>My alert</Alert>));
    alert
      .find('.fa-remove')
      .first()
      .simulate('click');
    expect(spy.mock.calls.length).toEqual(1);
  });
});
