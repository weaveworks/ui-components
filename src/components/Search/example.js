import React from 'react';
import styled from 'styled-components';
import { map, filter, includes, noop } from 'lodash';

import { Example } from '../../utils/example';

import Search from './Search';

const List = ({ items, text, terms }) => {
  const list =
    text.length > 0 || terms.length > 0
      ? filter(items, i => text === i || includes(terms, i))
      : items;

  return (
    <ul>
      {map(list, item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

const Styled = component => styled(component)`
  ${Example} {
    margin-bottom: 96px;
  }
`;

const NarrowSearch = styled(Search)`
  width: 300px;
`;

class SearchExample extends React.Component {
  state = {
    pinnedTerms1: [],
    pinnedTerms2: [],
    pinnedTerms3: ['foo:bar', 'is:automated'],
    queries: {
      filters: { terms: [], text: '' },
      normal: { terms: [], text: '' },
    },
    query1: '',
    query2: '',
    query3: '',
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
                pinnedTerms1,
                queries: {
                  ...this.state.queries,
                  normal: { terms: pinnedTerms1, text: query1 },
                },
                query1,
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
                  filters: { terms: [value], text: '' },
                },
              })
            }
            onChange={(query2, pinnedTerms2) =>
              this.setState({
                pinnedTerms2,
                queries: {
                  ...this.state.queries,
                  filters: { terms: pinnedTerms2, text: query2 },
                },
                query2,
              })
            }
            filters={[
              { label: 'Red', value: 'red' },
              {
                label: 'Blublublublublublublublublublublu',
                value: 'blue',
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
              this.setState({ pinnedTerms3, query3 })
            }
            onFilterSelect={value => this.setState({ pinnedTerms3: [value] })}
            filters={[
              { label: 'Automated', value: 'is:automated' },
              { label: 'Locked', value: 'is:locked' },
            ]}
          />
        </Example>
        <Example>
          <h3>Disabled</h3>
          <Search
            disabled
            query=""
            pinnedTerms={[]}
            filters={[{ label: 'Red', value: 'red' }]}
            onChange={noop}
          />
        </Example>
        <Example>
          <h3>Disabled with a query and pinnedTerms</h3>
          <Search
            disabled
            query="prom"
            pinnedTerms={this.state.pinnedTerms3}
            onChange={noop}
          />
        </Example>
      </div>
    );
  }
}

export default Styled(SearchExample);
