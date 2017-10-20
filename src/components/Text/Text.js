import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { lookupValue } from '../../utils/theme';

const StyledText = styled.span`
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.textColor};
  font-size: ${props => lookupValue(props, props.theme.fontSizes, props.theme.fontSizes.normal)};
  font-weight: ${props => (props.bold ? '600' : '400')};
  text-transform: ${props => (props.capitalize ? 'uppercase' : 'none')};
  font-style: ${props => (props.italic ? 'italic' : 'normal')}
`;


/**
 * Text! Normal, Large and Extra Large are 0.875em, 2em, and 2.827em respectively.
 * The font is proxima-nova.
 * ```javascript
 * import { Text } from 'weaveworks-ui-components';
 *
 * export default function TextExample() {
 *   return (
 *     <div>
 *       <Text>Normal</Text>
 *
 *       <Text italic>Normal Italic</Text>
 *
 *       <Text bold>Normal Bold</Text>
 *
 *       <Text large>Large</Text>
 *
 *       <Text large italic>Large Italic</Text>
 *
 *       <Text large bold>Large Bold</Text>
 *
 *       <Text xl>Extra Large</Text>
 *
 *       <Text xl italic>Extra Large Italic</Text>
 *
 *       <Text xl bold>Extra Large Bold</Text>
 *     </div>
 *   );
 * }
 * ```
 */
// Working around https://github.com/weaveworks/ui-components/issues/38
const Text = props => (
  <StyledText {...props} />
);

Text.propTypes = {
  /**
   * Italicize the text
   */
  italic: PropTypes.bool,
  /**
   * Make the text bold
   */
  bold: PropTypes.bool,
  /**
   * Default text size; 0.875em
   */
  normal: PropTypes.bool,
  /**
   * Text size will be 2em
   */
  large: PropTypes.bool,
  /**
   * Text size will be 2.827em
   */
  xl: PropTypes.bool,
};

export default Text;
