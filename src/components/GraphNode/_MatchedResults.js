import React from 'react';
import styled from 'styled-components';
import { size, values, take, map } from 'lodash';

import MatchedText from '../MatchedText';

const SHOW_ROW_COUNT = 2;
const MAX_MATCH_LENGTH = 24;

const MatchedResultsContainer = styled.div`
  color: ${props => props.theme.colors.purple600};
  font-size: ${props => props.theme.fontSizes.small};
  pointer-events: all;
`;

const MatchedResultMatchWrapper = styled.div`
  background-color: ${props => props.theme.colors.blue50};
  display: inline-block;
  padding: 3px 5px;
  margin-top: 2px;
  text-align: center;
`;

const MatchedResultMatchLabel = styled.span`
  margin-right: 5px;
  white-space: nowrap;
`;

const MatchedResultMatchValue = styled.span`
  color: ${props => props.theme.colors.purple800};
`;

const MoreMatches = styled.div`
  color: ${props => props.theme.colors.blue700};
  font-size: ${props => props.theme.fontSizes.small};
  text-align: center;
  margin-top: 4px;
`;

const Match = match => (
  <MatchedResultMatchWrapper key={match.label}>
    <MatchedResultMatchLabel>
      {match.label}:
    </MatchedResultMatchLabel>
    <MatchedResultMatchValue>
      <MatchedText
        noBorder
        text={match.text}
        match={match}
        maxLength={MAX_MATCH_LENGTH}
        truncate={match.truncate}
      />
    </MatchedResultMatchValue>
  </MatchedResultMatchWrapper>
);

export default class MatchedResults extends React.PureComponent {
  render() {
    const { matches } = this.props;

    if (!matches) {
      return null;
    }

    let moreFieldMatches;
    let moreFieldMatchesTitle;

    if (size(matches) > SHOW_ROW_COUNT) {
      moreFieldMatches = map(values(matches).slice(SHOW_ROW_COUNT), 'label');
      moreFieldMatchesTitle = `More matches:\n${moreFieldMatches.join(',\n')}`;
    }

    return (
      <MatchedResultsContainer>
        {take(values(matches), SHOW_ROW_COUNT).map(Match)}
        {moreFieldMatches &&
          <MoreMatches title={moreFieldMatchesTitle}>
            {`${size(moreFieldMatches)} more matches`}
          </MoreMatches>
        }
      </MatchedResultsContainer>
    );
  }
}
