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

const NarrowSearch = Search.extend`
  width: 300px;
`;

class SearchExample extends React.Component {
  state = {
    queries: {
      normal: { text: '', terms: [] },
      filters: { text: '', terms: [] },
    },
    query1: '',
    query2: '',
    query3: '',
    pinnedTerms1: [],
    pinnedTerms2: [],
    pinnedTerms3: ['foo:bar', 'is:automated'],
  };

  render() {
    return (
      <div className={this.props.className}>
        <Example>
          <h3>Normal</h3>
          <Search
            query={this.state.query1}
            pinnedTerms={this.state.pinnedTerms1}
            onChange={(query1, pinnedTerms1) =>
              this.setState({
                query1,
                pinnedTerms1,
                queries: {
                  ...this.state.queries,
                  normal: { text: query1, terms: pinnedTerms1 },
                },
              })
            }
          />
          <List
            items={['red', 'green', 'blue']}
            terms={this.state.queries.normal.terms}
            text={this.state.queries.normal.text}
          />
        </Example>
        <Example>
          <h3>With filters</h3>
          <NarrowSearch
            query={this.state.query2}
            pinnedTerms={this.state.pinnedTerms2}
            onFilterSelect={value =>
              this.setState({
                pinnedTerms2: [value],
                queries: {
                  ...this.state.queries,
                  filters: { text: '', terms: [value] },
                },
              })
            }
            onChange={(query2, pinnedTerms2) =>
              this.setState({
                query2,
                pinnedTerms2,
                queries: {
                  ...this.state.queries,
                  filters: { text: query2, terms: pinnedTerms2 },
                },
              })
            }
            filters={[
              { value: 'red', label: 'Red' },
              {
                value: 'blue',
                label: 'Blublublublublublublublublublublu',
              },
            ]}
          />
          <List
            items={['red', 'green', 'blue']}
            text={this.state.queries.filters.text}
            terms={this.state.queries.filters.terms}
          />
        </Example>
        <Example>
          <h3>With an initial query and filters</h3>
          <Search
            query={this.state.query3}
            pinnedTerms={this.state.pinnedTerms3}
            onChange={(query3, pinnedTerms3) =>
              this.setState({ query3, pinnedTerms3 })
            }
            onFilterSelect={value => this.setState({ pinnedTerms3: [value] })}
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
