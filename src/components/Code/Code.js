import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isFunction, isString, trim, noop } from 'lodash';

const CopyNotice = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px 15px;
  border-radius: ${props => props.theme.borderRadius.soft};
  background-color: ${props => props.theme.colors.purple800};
  transition: opacity 300ms ease;
  opacity: 0;
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.purple50};
`;

const CodeWrapper = styled.div`
  position: relative;
  padding: 10px 15px;
  background-color: ${props => props.theme.colors.purple800};
  box-sizing: border-box;
  border-radius: ${props => props.theme.borderRadius.soft};
  cursor: pointer;

  &:hover ${CopyNotice} {
    opacity: 0.9;
  }
`;

const Content = styled.div`
  flex-grow: 1;
  overflow: auto;
  color: ${props => props.theme.colors.purple50};
`;

const Pre = styled.pre`
  margin: 10px 0;
  font-family: ${props => props.theme.fontFamilies.monospace};
  font-size: ${props => props.theme.fontSizes.small};
`;

const trimString = node => (isString(node) ? trim(node) : node);

/**
 * Code allows for easy rendering of code snippets which can easliy be copied to
 * the clipboard by clicking the element or selecting a portion of the code
 */
class Code extends Component {
  static displayName = 'Code';

  state = {
    isCopying: false,
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
    // console.dir(document.getSelection().anchorNode);
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

  render() {
    const { children } = this.props;
    const { isCopying } = this.state;

    const copyText = isCopying ? 'Copied to clipboard' : 'Copy to clipboard';
    const copyIcon = isCopying ? 'files-o' : 'check';

    return (
      <CodeWrapper onClick={this.handleCopyClick}>
        <Content>
          <Pre innerRef={e => (this.preNode = e)}>
            {isFunction(children) ? children() : trimString(children)}
          </Pre>
        </Content>

        <CopyNotice>
          <i className={`fa fa-${copyIcon}`} /> {copyText}
        </CopyNotice>
      </CodeWrapper>
    );
  }
}

Code.propTypes = {
  // Children can be anything that React can render
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,

  // onCopy will be called when the CodeWrapper is clicked
  onCopy: PropTypes.func,
};

Code.defaultProps = {
  onCopy: noop,
};

export default Code;
