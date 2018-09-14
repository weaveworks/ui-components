import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { createSpy } from 'expect';
import { noop } from 'lodash';

import { withTheme } from '../../utils/theme';

import Search from './Search';

describe('<Search />', () => {
  describe('snapshots', () => {
    it('renders empty', () => {
      const tree = renderer
        .create(
          withTheme(
            <Search
              query=""
              pinnedTerms={[]}
              onChange={noop}
              onFilterSelect={noop}
            />
          )
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a search string', () => {
      const tree = renderer
        .create(
          withTheme(
            <Search
              query="ui-server"
              pinnedTerms={[]}
              onChange={noop}
              onFilterSelect={noop}
            />
          )
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders a group of terms', () => {
      const tree = renderer
        .create(
          withTheme(
            <Search
              query=""
              pinnedTerms={['deployments', 'default']}
              onChange={noop}
              onFilterSelect={noop}
            />
          )
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders filters', () => {
      const tree = renderer
        .create(
          withTheme(
            <Search
              query=""
              pinnedTerms={[]}
              onChange={noop}
              onFilterSelect={noop}
              filters={[
                { value: 'automated', label: 'Automated' },
                { value: 'locked', label: 'Locked' },
              ]}
            />
          )
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  it('returns search terms', () => {
    const spy = createSpy();
    const search = mount(
      withTheme(
        <Search
          query=""
          pinnedTerms={['a']}
          onChange={spy}
          onFilterSelect={noop}
        />
      )
    );
    const $input = search.find('input');
    $input.simulate('change', { target: { value: 'myterm' } });
    expect(spy.calls[0].arguments).toEqual(['myterm', ['a']]);
  });

  it('calls the onFilterSelect prop with selected filter value', () => {
    const spy = createSpy();
    const search = mount(
      withTheme(
        <Search
          query=""
          pinnedTerms={[]}
          onChange={noop}
          onFilterSelect={spy}
          filters={[
            { value: 'automated', label: 'Automated' },
            { value: 'locked', label: 'Locked' },
          ]}
        />
      )
    );

    // Open the dialog pop up
    // TODO: make the dropdown do `display: none` instead of removing it from the dom?
    search
      .find('.dropdown-toggle')
      .first()
      .simulate('click');
    // select a filter
    search
      .find('.dropdown-item')
      .first()
      .simulate('click');
    expect(spy.calls[0].arguments).toEqual(['automated']);
  });

  it('clears terms', () => {
    const spy = createSpy();
    const search = mount(
      withTheme(
        <Search
          query=""
          pinnedTerms={['a', 'b']}
          onChange={spy}
          onFilterSelect={noop}
        />
      )
    );
    // Remove the 'a' search term
    search
      .find('.remove-term')
      .first()
      .simulate('click');
    expect(spy.calls[0].arguments).toEqual(['', ['b']]);
  });
});
