import React from 'react';
import styled from 'styled-components';
import { map, filter, includes } from 'lodash';

import { Example } from '../../utils/example';

import Search from './Search';

const List = ({ items, text, terms }) => {
  const list =
    text.length > 0 || terms.length > 0
      ? filter(items, i => (text === i || includes(terms, i): true))
      : items;

  return <ul>{map(list, item => <li key={item}>{item}</li>)}</ul>;
};

const Styled = component => styled(component)`
  ${Example} {
    margin-bottom: 96px;
  }
`;

class SearchExample extends React.Component {
  state = {
    queries: {
      normal: { text: '', terms: [] },
      filters: { text: '', terms: [] },
    },
  };
  render() {
    const {
      queries: { normal, filters },
    } = this.state;
    return (
      <div className={this.props.className}>
        <Example>
          <h3>Normal</h3>
          <Search
            onChange={(text, terms) =>
              this.setState({ queries: { ...this.state.queries, normal: { text, terms } } })
            }
          />
          <List items={['red', 'green', 'blue']} terms={normal.terms} text={normal.text} />
        </Example>
        <Example>
          <h3>With filters</h3>
          <Search
            onChange={(text, terms) =>
              this.setState({ queries: { ...this.state.queries, filters: { text, terms } } })
            }
            filters={[{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }]}
          />
          <List items={['red', 'green', 'blue']} text={filters.text} terms={filters.terms} />
        </Example>
        <Example>
          <h3>With an initial query and filters</h3>
          <Search
            initialPinnedTerms={['foo:bar', 'is:automated']}
            filters={[
              { value: 'is:automated', label: 'Automated' },
              { value: 'is:locked', label: 'Locked' },
            ]}
          />
        </Example>
      </div>
    );
  }
}

export default Styled(SearchExample);
