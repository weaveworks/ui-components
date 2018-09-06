import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import intersperse from 'intersperse';
import { transparentize } from 'polished';
import { flatMap, compact } from 'lodash';

// For chunk = { text: 'abcd', matched: false } and match = 'bc', the output will be
// [{ text: 'a', matched: false }, { text: 'bc', matched: true }, { text: 'd', matched: false }].
const splitChunk = (chunk, match) =>
  compact(intersperse(chunk.text.split(match), match)).map(text => ({
    matched: text === match,
    text,
  }));

// Splits the text into chunks by finding all occurences of all matches in the list.
const buildChunks = ({ text, matches }) => {
  let chunks = [{ text, matched: false }];
  matches.forEach(match => {
    chunks = flatMap(
      chunks,
      // Only unmatched chunks can be further split by other matches
      chunk => (chunk.matched ? [chunk] : splitChunk(chunk, match))
    );
  });
  return chunks;
};

const MatchedChunk = styled.span`
  background-color: ${props => transparentize(0.7, props.theme.colors.blue400)};
  border-radius: ${props => props.theme.borderRadius.soft};
`;

/**
 * Renders a block of text with matched sections highlighted
 *
 * `foo` is highlighted:
 *
 * ```
 * <MatchedText text="this that foo and bar" matches={['foo']} />
 * ```
 *
 */
class MatchedText extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      chunks: buildChunks(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ chunks: buildChunks(nextProps) });
  }

  render() {
    return (
      <span title={this.props.text}>
        {this.state.chunks.map((chunk, index) => {
          if (chunk.matched) {
            /* eslint-disable react/no-array-index-key */
            return (
              <MatchedChunk key={`${index}:${chunk.text}`}>
                {chunk.text}
              </MatchedChunk>
            );
            /* eslint-enable react/no-array-index-key */
          }
          return chunk.text;
        })}
      </span>
    );
  }
}

MatchedText.propTypes = {
  /**
   * The base text to display
   */
  text: PropTypes.string.isRequired,
  /**
   * The chunks to be highlighted
   */
  matches: PropTypes.arrayOf(PropTypes.string),
};

MatchedText.defaultProps = {
  matches: [],
};

export default MatchedText;
