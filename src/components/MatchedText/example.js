import React from 'react';
import faker from 'faker';
import { compact } from 'lodash';

import { Example, Info } from '../../utils/example';
import Search from '../Search';

import MatchedText from '.';

class MatchedTextExample extends React.Component {
  state = {
    pinnedSearches: [],
    searchQuery: '',
    text: faker.lorem.paragraphs(3),
  };

  onSearch = (searchQuery, pinnedSearches) => {
    this.setState({ pinnedSearches, searchQuery });
  };

  render() {
    const { text, pinnedSearches, searchQuery } = this.state;
    const matches = compact([...pinnedSearches, searchQuery]);

    return (
      <div>
        <Search
          onChange={this.onSearch}
          pinnedTerms={pinnedSearches}
          query={searchQuery}
        />
        <Example>
          <Info>Normal text</Info>
          <MatchedText text={text} matches={matches} />
        </Example>
      </div>
    );
  }
}

export default MatchedTextExample;
