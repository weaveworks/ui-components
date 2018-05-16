import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { withTheme } from '../../utils/theme';

import EditableDropdown from './EditableDropdown';

describe('<EditableDropdown />', () => {
  const items = [
    {
      value: 'first-thing',
      label: 'First Thing',
    },
    {
      value: 'second-thing',
      label: 'Second Thing',
    },
    {
      value: 'third-thing',
      label: 'Super long thing, this should get truncated',
    },
  ];

  describe('snapshots', () => {
    it('renders default', () => {
      const tree = renderer.create(withTheme(<EditableDropdown items={items} />)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders a placeholder', () => {
      const tree = renderer
        .create(withTheme(<EditableDropdown placeholder="Select an item" items={items} />))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders a input field', () => {
      const tree = renderer
        .create(withTheme(<EditableDropdown placeholder="Select an item" items={items} />))
        .toJSON();
      expect(tree).toContain('input');
    });
  });

  it('is extendable', () => {
    // Make sure a styled-component gets exported
    expect(typeof Dropdown.extend).toEqual('function');
    expect(Dropdown.displayName).toEqual('Dropdown');
  });
});
