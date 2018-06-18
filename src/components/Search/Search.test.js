import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { createSpy } from 'expect';

import { withTheme } from '../../utils/theme';

import Search from './Search';

describe('<Search />', () => {
  describe('snapshots', () => {
    it('renders empty', () => {
      const tree = renderer.create(withTheme(<Search />)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders a search string', () => {
      const tree = renderer.create(withTheme(<Search initialQuery="ui-server" />)).toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders a group of terms', () => {
      const tree = renderer
        .create(withTheme(<Search initialPinnedTerms={['deployments', 'default']} />))
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders filters', () => {
      const tree = renderer
        .create(
          withTheme(
            <Search
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
          onChange={spy}
          filters={[
            { value: 'automated', label: 'Automated' },
            { value: 'locked', label: 'Locked' },
          ]}
        />
      )
    );
    const $input = search.find('input');
    $input.simulate('change', { target: { value: 'myterm' } });
    const [text, terms] = spy.calls[0].arguments;
    expect(text).toEqual('myterm');
    expect(terms).toEqual([]);
    // Blur should add the text as a term
    $input.simulate('blur');
    const [newText, newTerms] = spy.calls[1].arguments;
    expect(newText).toEqual('');
    expect(newTerms).toEqual(['myterm']);
  });
  it('populates search terms from the filters dropdown', () => {
    const search = mount(
      withTheme(
        <Search
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
    expect(
      search
        .find('.search-term')
        .first()
        .text()
    ).toEqual('automated');
  });
  it('clears terms', () => {
    const search = mount(withTheme(<Search initialPinnedTerms={['a', 'b']} />));
    // Remove the 'a' search term
    search
      .find('.remove-term')
      .first()
      .simulate('click');
    expect(
      search
        .find('.search-term')
        .first()
        .text()
    ).toEqual('b');
  });
});
