import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { lookupValue } from '../../utils/theme';

const StyledText = styled.span`
  font-family: ${props => props.theme.fontFamilies.regular};
  color: ${props => props.theme.textColor};
  font-size: ${props =>
    lookupValue(props, props.theme.fontSizes, props.theme.fontSizes.normal)};
  font-weight: ${props => (props.bold ? '600' : '400')};
  text-transform: ${props => (props.capitalize ? 'uppercase' : 'none')};
  font-style: ${props => (props.italic ? 'italic' : 'normal')};
`;

/**
 * Text supports all the sizes from _theme.fontSizes_.
 * ```javascript
 * import { Text } from 'weaveworks-ui-components';
 *
 * export default function TextExample() {
 *   return (
 *     <div>
 *       <Text tiny>Tiny</Text>
 *       <Text tiny italic>Tiny Italic</Text>
 *       <Text tiny bold>Tiny Bold</Text>
 *
 *       <Text small>Small</Text>
 *       <Text small italic>Small Italic</Text>
 *       <Text small bold>Small Bold</Text>
 *
 *       <Text>Normal</Text>
 *       <Text italic>Normal Italic</Text>
 *       <Text bold>Normal Bold</Text>
 *
 *       <Text large>Large</Text>
 *       <Text large italic>Large Italic</Text>
 *       <Text large bold>Large Bold</Text>
 *
 *       <Text extraLarge>Extra Large</Text>
 *       <Text extraLarge italic>Extra Large Italic</Text>
 *       <Text extraLarge bold>Extra Large Bold</Text>
 *
 *       <Text huge>Huge</Text>
 *       <Text huge italic>Huge Italic</Text>
 *       <Text huge bold>Huge Bold</Text>
 *     </div>
 *   );
 * }
 * ```
 */
// Working around https://github.com/weaveworks/ui-components/issues/38
const Text = props => <StyledText {...props} />;

Text.propTypes = {
  /**
   * Make the text bold
   */
  bold: PropTypes.bool,
  /**
   * Italicize the text
   */
  italic: PropTypes.bool,
};

Text.defaultProps = {
  bold: false,
  italic: false,
};

export default Text;
