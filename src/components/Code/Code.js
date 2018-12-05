import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { isFunction, isString, trim, noop } from 'lodash';

import { spacing } from '../../theme/selectors';

const scale = keyframes`
  0% {
    transform: scale(0)
  }
  90% {
    transform: scale(1.2)
  }
  100% {
    transform: scale(1)
  }
`;

const CopyNotice = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${spacing('xs')};
  ${props => props.isHovered && 'transition: opacity 300ms ease;'};
  border-radius: ${props => props.theme.borderRadius.soft};
  background-color: ${props => props.theme.colors.purple800};
  opacity: 0;
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.purple50};
  ${props =>
    props.isCopying &&
    `
    & > i {
        transform-origin: center;
        animation-name: ${scale};
        animation-duration: .4s;
      }
  `};
`;

const CodeWrapper = styled.div`
  position: relative;
  background-color: ${props => props.theme.colors.purple800};
  box-sizing: border-box;
  border-radius: ${props => props.theme.borderRadius.soft};
  cursor: pointer;

  &:hover ${CopyNotice} {
    opacity: 0.9;
  }
`;

const ScrollWrap = styled.div`
  overflow: auto;
`;

const Content = styled.div`
  flex-grow: 1;
  color: ${props => props.theme.colors.purple50};
  padding: ${spacing('xs')} ${spacing('base')};
`;

const Pre = styled.pre`
  margin: ${spacing('small')} 0;
  font-family: ${props => props.theme.fontFamilies.monospace};
  font-size: ${props => props.theme.fontSizes.small};
`;

const PaddedLine = styled.div`
  &:not(:last-child) {
    padding-bottom: ${spacing('xs')};
  }

  /* required to make jsx children work with adding '\n' in multiLine */
  & > * {
    display: inline;
  }
`;

const trimString = node => (isString(node) ? trim(node) : node);

const formatSingleCommand = children =>
  isFunction(children) ? children() : trimString(children);

function formatMultiString(string) {
  return trim(string)
    .split('\n')
    .map(line => (
      <PaddedLine key={line}>
        {line}
        {'\n'}
      </PaddedLine>
    ));
}

function formatMultiCommand(raw) {
  let children = raw;

  if (isFunction(children)) {
    children = children();
  }
  const count = React.Children.count(children);

  if (count === 1) {
    return isString(children) ? formatMultiString(children) : children;
  }

  return React.Children.map(children, (child, i) => (
    <PaddedLine key={i}>
      {child}
      {'\n'}
    </PaddedLine>
  ));
}

/**
 * Code allows for easy rendering of code snippets which can easliy be copied to
 * the clipboard by clicking the element or selecting a portion of the code
 */
class Code extends Component {
  static displayName = 'Code';

  state = {
    isCopying: false,
    isHovered: false,
  };

  componentDidUpdate = () => {
    // reselect text after re-render
    if (this.state.selectedRange) {
      const prevRange = this.state.selectedRange;
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(prevRange);
      // clear it for the next interaction
      this.setState({ selectedRange: null });
    }
  };

  handleCopyClick = () => {
    // Create a textarea element in which the text of the code will be copied.
    // Set the value of the textarea, select it to set it as the active element,
    // then copy the value of that element to the clipboard.
    // It's 2017 and this is still the best way to copy text on button click...
    if (isFunction(this.props.onCopy)) {
      this.props.onCopy();
    }
    const selection = document.getSelection();
    const selectionString = selection.toString();
    // if user has selected text, save that to state so it can be reselected
    if (selectionString !== '') {
      this.setState({
        selectedRange: selection.getRangeAt(0),
      });
    }

    const code =
      selectionString === '' ? this.preNode.textContent : selectionString;
    const txtArea = document.createElement('textarea');
    // Safari doesn't allow for assigning an object literal to `style`.
    txtArea.class = 'hidden-textarea';
    // Make sure the code ends in a newline to execute all the commands in multiline code.
    if (code.charAt(code.length - 1) === '\n') {
      txtArea.value = code;
    } else {
      txtArea.value = `${code}\n`;
    }
    document.body.appendChild(txtArea);

    txtArea.select();

    try {
      document.execCommand('copy');
    } catch (e) {
      throw e;
    }
    document.body.removeChild(txtArea);

    // show the Copied to clipboard notice temporarily
    this.setState({ isCopying: true });
    setTimeout(() => {
      this.setState({ isCopying: false });
    }, 3000);
  };

  onMouseEnter = () => {
    this.setState({
      isHovered: true,
    });
  };

  onMouseLeave = () => {
    this.setState({
      isHovered: false,
      isCopying: false,
    });
  };

  render() {
    const { children, multiCommand } = this.props;
    const { isCopying, isHovered } = this.state;

    const copy =
      isCopying && isHovered ? (
        <i className="fa fa-check" />
      ) : (
        'Copy to clipboard'
      );

    return (
      <CodeWrapper
        onClick={this.handleCopyClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <ScrollWrap>
          <Content>
            <Pre
              innerRef={e => {
                this.preNode = e;
              }}
            >
              {multiCommand
                ? formatMultiCommand(children)
                : formatSingleCommand(children)}
            </Pre>
          </Content>
        </ScrollWrap>

        <CopyNotice isCopying={isCopying} isHovered={isHovered}>
          {copy}
        </CopyNotice>
      </CodeWrapper>
    );
  }
}

Code.propTypes = {
  // children can be anything that React can render
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,

  // multiCommand determines if the code lines shall be padded
  multiCommand: PropTypes.bool,

  // onCopy will be called when the CodeWrapper is clicked
  onCopy: PropTypes.func,
};

Code.defaultProps = {
  multiCommand: false,
  onCopy: noop,
};

export default Code;
